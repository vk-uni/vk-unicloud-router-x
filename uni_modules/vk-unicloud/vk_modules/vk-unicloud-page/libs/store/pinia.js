import { isReactive, isRef, toRaw } from 'vue';

/**
 * 将已创建的 Pinia store 绑定到 vk，保留原状态管理 API。
 * stores 的键为旧模块名，例如 { $user: useUserStore(pinia) }。
 */
export default function initPinia(vk, stores) {
  if (!vk.pubfn.isObject(stores)) throw new Error('[vk] createStores 必须同步返回 store 实例映射');
  const state = Object.create(null);
  for (const moduleName of Object.keys(stores)) {
    Object.defineProperty(state, moduleName, {
      enumerable: true,
      get: () => stores[moduleName].$state,
    });
  }

  const getMember = (name) => {
    const index = name.lastIndexOf('/');
    const moduleName = name.slice(0, index);
    const store = index > 0 && Object.prototype.hasOwnProperty.call(stores, moduleName) ? stores[moduleName] : undefined;
    return { store, key: name.slice(index + 1) };
  };

  // getter 按访问时的值读取，保留计算属性和函数型 getter。
  const getters = new Proxy(Object.create(null), {
    get(target, name) {
      if (typeof name !== 'string') return undefined;
      const { store, key } = getMember(name);
      return typeof store === 'undefined' ? undefined : store[key];
    },
  });

  const get = (name, defaultValue) => {
    const value = vk.pubfn.getData(state, name);
    if (typeof value === 'undefined') return typeof defaultValue !== 'undefined' ? defaultValue : '';
    return JSON.parse(JSON.stringify(value));
  };

  const createFieldUpdate = (store, key, value) => {
    const target = toRaw(store)[key];
    if (isRef(target) || !isReactive(target)) {
      return (moduleState) => {
        moduleState[key] = value;
      };
    }

    // Setup Store 的 reactive 字段被 store 和闭包共同引用，必须原位替换内容。
    const isArray = Array.isArray(target);
    const data = typeof value === 'undefined' ? (isArray ? [] : {}) : value;
    if (isArray ? !Array.isArray(data) : !vk.pubfn.isObject(data)) {
      throw new Error(`[vk] reactive 状态 ${store.$id}.${key} 需要${isArray ? '数组' : '对象'}；需要替换类型时请使用 ref`);
    }
    if (Object.prototype.hasOwnProperty.call(data, '__proto__')) throw new Error('禁止修改对象原型');
    return () => {
      if (isArray) {
        for (let index = 0; index < data.length; index++) target[index] = data[index];
        target.length = data.length;
      } else {
        for (const name of Object.keys(target)) {
          if (!Object.prototype.hasOwnProperty.call(data, name)) delete target[name];
        }
        for (const name of Object.keys(data)) target[name] = data[name];
      }
    };
  };

  const set = (name, value) => {
    const keys = name.match(/[^.[\]\s'"]+/g);
    if (vk.pubfn.isNull(keys)) throw new Error(`[vk] 无效的状态路径：${name}`);
    if (keys.includes('__proto__')) throw new Error('禁止修改对象原型');
    const moduleName = keys[0];
    if (!Object.prototype.hasOwnProperty.call(stores, moduleName)) throw new Error(`[vk] 未绑定 Pinia store：${moduleName}`);
    const store = stores[moduleName];
    const data = JSON.parse(JSON.stringify(typeof value === 'undefined' ? '' : value));
    if (keys.length === 1 && (data === null || typeof data !== 'object' || Array.isArray(data))) {
      throw new Error(`[vk] 整模块写入需要对象：${moduleName}`);
    }
    // 先验证全部字段，避免整模块写入在中途报错后留下部分更新。
    const updates =
      keys.length === 1
        ? Object.keys(store.$state).map((key) => createFieldUpdate(store, key, Object.prototype.hasOwnProperty.call(data, key) ? data[key] : undefined))
        : keys.length === 2
        ? [createFieldUpdate(store, keys[1], data)]
        : [];
    store.$patch((moduleState) => {
      if (keys.length > 2) {
        vk.pubfn.setData(moduleState, keys.slice(1).join('.'), data);
      } else {
        // 遗漏的普通字段设为 undefined；reactive 容器清空内容并保留引用。
        for (const update of updates) update(moduleState);
      }
    });
  };

  const callAction = (name, payload) => {
    const { store, key } = getMember(name);
    if (typeof store === 'undefined' || typeof store[key] !== 'function') throw new Error(`[vk] 未找到 Pinia action：${name}`);
    return store[key](payload);
  };

  const commit = (name, payload) => {
    if (name === 'updateStore') {
      set(payload.name, payload.value);
    } else {
      callAction(name, payload);
    }
  };
  const dispatch = async (name, payload) => callAction(name, payload);
  const store = { state, getters, commit, dispatch };

  vk.vuex = set;
  vk.vuex.set = set;
  vk.vuex.get = get;
  vk.vuex.getters = (name, ...args) => {
    const value = getters[name];
    return typeof value === 'function' ? value(...args) : value;
  };
  vk.vuex.commit = commit;
  vk.vuex.dispatch = dispatch;
  vk.setVuex = set;
  vk.getVuex = get;
  vk.state = get;
  vk.getVuexStore = () => store;

  if (typeof stores.$user !== 'undefined' && !vk.checkToken()) {
    vk.callFunctionUtil.deleteUserInfo({ log: false });
  }
}
