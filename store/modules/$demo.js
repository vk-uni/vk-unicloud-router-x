import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * 演示专用状态，不操作真实用户资料。
 * store/index.js 自动注册本模块，并负责缓存恢复与持久化。
 */
export const useDemoStore = defineStore('$demo', () => {
  const count = ref(0);
  const profile = ref({ nickname: '体验者', city: '杭州' });
  const items = ref([
    { id: 1, title: '理解共享状态', done: true },
    { id: 2, title: '试试跨页同步', done: false },
  ]);

  // Setup Store 中的 computed 就是 Pinia getter。
  const doubleCount = computed(() => count.value * 2);
  const completedCount = computed(() => items.value.filter((item) => item.done).length);

  function increment(step = 1) {
    count.value += step;
  }

  async function incrementLater() {
    await uni.vk.pubfn.sleep(600);
    increment();
  }

  function addItem(title) {
    const value = title.trim();
    if (uni.vk.pubfn.isNull(value)) return;
    const id = items.value.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
    items.value.push({ id, title: value, done: false });
  }

  function toggleItem(id) {
    const item = items.value.find((entry) => entry.id === id);
    if (uni.vk.pubfn.isNotNull(item)) item.done = !item.done;
  }

  // Setup Store 显式提供重置 action，重置后会自动写入已有持久化缓存。
  function resetDemo() {
    count.value = 0;
    profile.value = { nickname: '体验者', city: '杭州' };
    items.value = [
      { id: 1, title: '理解共享状态', done: true },
      { id: 2, title: '试试跨页同步', done: false },
    ];
  }

  return {
    // 数据
    count,
    profile,
    items,
    // 计算属性
    doubleCount,
    completedCount,
    // 函数
    increment,
    incrementLater,
    addItem,
    toggleItem,
    resetDemo,
  };
});

export default useDemoStore;
