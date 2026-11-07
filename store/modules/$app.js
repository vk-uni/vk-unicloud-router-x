import { defineStore } from 'pinia';
import { ref } from 'vue';
import appConfig from '@/app.config.js';

/**
 * 系统状态；缓存恢复和持久化统一由 store-pinia 入口处理。
 */
export const useAppStore = defineStore('$app', () => {
  const inited = ref(false);
  const config = ref({ ...appConfig });
  const color = ref(appConfig.color);
  const originalPage = ref(null);

  return {
    /**
     * 是否已经初始化
     * js调用示例
     * vk.getVuex('$app.inited');
     * 页面上直接使用示例
     * {{ vk.getVuex('$app.inited') }}
     * js更新示例
     * vk.setVuex('$app.inited', true);
     */
    inited,
    config,
    // 动态主题色 vk.getVuex('$app.color.main') vk.setVuex('$app.color.main','#ff4444')
    color,
    /**
     * vk.getVuex('$app.originalPage');
     * vk.setVuex('$app.originalPage', originalPage);
     */
    originalPage,
  };
});

export default useAppStore;
