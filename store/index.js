import { isReactive, isRef, toRaw } from 'vue';
import useAppStore from './modules/$app.js';
import useDemoStore from './modules/$demo.js';
import useErrorStore from './modules/$error.js';
import useUserStore from './modules/$user.js';

// 新增模块时，在上方显式导入，并在这里注册模块名。
const storeDefinitions = {
  $app: useAppStore,
  $demo: useDemoStore,
  $error: useErrorStore,
  $user: useUserStore,
};

// 定义不需要永久存储的目录，即下次APP启动数据会自动清空，值为在modules目录下的文件名
let notSaveStateKeys = ['$error'];

// 这些字段每次启动使用模块默认值，不从旧缓存恢复。
const notRestoreStateKeys = { $app: ['config'] };

/* 以下代码请勿改动，除非你知道改动带来的效果 */

const storesCache = new WeakMap();

function getLifeData() {
  const vk = uni.vk;
  const lifeData = uni.getStorageSync('lifeData');
  return vk.pubfn.isObject(lifeData) ? lifeData : {};
}

function getStateSnapshot(state) {
  return JSON.parse(JSON.stringify(state));
}

function restoreStateField(store, state, key, value) {
  const target = toRaw(store)[key];
  if (isRef(target) || !isReactive(target)) {
    state[key] = value;
    return;
  }

  // Setup Store 的 reactive 状态与 getter、action 共享引用，恢复时只替换内容。
  // 类型不匹配的旧缓存保留模块默认值，避免破坏容器引用。
  if (Array.isArray(target)) {
    if (!Array.isArray(value)) return;
    for (let index = 0; index < value.length; index++) target[index] = value[index];
    target.length = value.length;
  } else {
    if (!uni.vk.pubfn.isObject(value)) return;
    for (const name of Object.keys(target)) {
      if (!Object.prototype.hasOwnProperty.call(value, name)) delete target[name];
    }
    for (const name of Object.keys(value)) target[name] = value[name];
  }
}

/**
 * 使用应用已创建的 Pinia，通过 app.use(vk, config, { createStores: () => createStores(pinia) }) 延迟创建模块。
 * vk.install 完成核心初始化后调用此函数，模块内可直接使用 uni.vk。
 * 同一个 Pinia 只恢复缓存、注册持久化订阅一次。
 */
export function createStores(pinia) {
  const vk = uni.vk;
  if (!vk.pubfn.isObject(pinia)) throw new Error('[store-pinia] createStores 需要传入 Pinia 实例');
  if (storesCache.has(pinia)) return storesCache.get(pinia);

  const stores = Object.create(null);
  for (const moduleName of Object.keys(storeDefinitions)) {
    stores[moduleName] = storeDefinitions[moduleName](pinia);
  }

  const saveStateKeys = Object.keys(stores).filter((moduleName) => !notSaveStateKeys.includes(moduleName));
  const lifeData = getLifeData();
  for (const moduleName of saveStateKeys) {
    const savedState = lifeData[moduleName];
    if (!vk.pubfn.isObject(savedState)) continue;
    // 仅使用自有配置，避免 constructor 等模块名命中原型属性。
    const excludedKeys = Object.prototype.hasOwnProperty.call(notRestoreStateKeys, moduleName) ? notRestoreStateKeys[moduleName] ?? [] : [];
    const store = stores[moduleName];
    store.$patch((state) => {
      for (const key of Object.keys(state)) {
        if (!excludedKeys.includes(key) && Object.prototype.hasOwnProperty.call(savedState, key)) {
          // 保留空对象、空数组、false、0 等缓存值，并保持 reactive 容器引用。
          restoreStateField(store, state, key, vk.pubfn.deepClone(savedState[key]));
        }
      }
    });
  }

  // 恢复完成后统一保存初始状态，保留当前模块以外的缓存。
  for (const moduleName of saveStateKeys) {
    lifeData[moduleName] = getStateSnapshot(stores[moduleName].$state);
  }
  uni.setStorageSync('lifeData', lifeData);

  for (const moduleName of saveStateKeys) {
    stores[moduleName].$subscribe(
      (mutation, state) => {
        const currentLifeData = getLifeData();
        currentLifeData[moduleName] = getStateSnapshot(state);
        uni.setStorageSync('lifeData', currentLifeData);
      },
      { flush: 'sync', detached: true }
    );
  }

  storesCache.set(pinia, stores);
  return stores;
}

export default createStores;
