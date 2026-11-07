import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 错误日志管理模块；日志只保留在内存中，每次启动重新创建。
 */
export const useErrorStore = defineStore('$error', () => {
  const logs = ref([]);

  // vk.vuex.dispatch('$error/add', log);
  const add = (log) => {
    const vk = uni.vk;
    const route = vk.pubfn.isNull(log.route) ? vk.pubfn.getCurrentPageRoute() : log.route;
    log.route = '/' + route.replace(/^\/+/, '');
    logs.value.unshift(log);
  };

  // vk.vuex.dispatch('$error/clear');
  const clear = () => {
    logs.value.splice(0);
  };

  return {
    logs,
    // action
    add,
    clear,
  };
});

export default useErrorStore;
