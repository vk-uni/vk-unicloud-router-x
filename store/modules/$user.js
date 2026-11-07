import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 用户状态管理模块；缓存恢复和持久化统一由 store-pinia 入口处理。
 */
export const useUserStore = defineStore('$user', () => {
  const userInfo = ref({});
  const permission = ref([]);
  const inviteCode = ref('');

  return {
    /**
     * 登录用户信息
     * js调用示例
     * (推荐) vk.getVuex('$user.userInfo');
     * 或 vk.vuex.get('$user.userInfo');
     * 页面上直接使用示例
     * {{ vk.getVuex('$user.userInfo') }}
     * js更新示例
     * vk.setVuex('$user.userInfo.avatar', avatar);
     */
    userInfo,
    permission,
    inviteCode,
  };
});

export default useUserStore;
