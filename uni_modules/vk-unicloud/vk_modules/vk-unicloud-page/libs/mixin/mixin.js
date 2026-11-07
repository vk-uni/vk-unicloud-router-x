let isOnLaunch = true;
export default {
  data() {
    return {};
  },
  onLoad() {
    const vk = uni.vk;
    // #ifndef UNI-APP-X
    // 将vk实例挂载到app.globalData上，方便在非Vue页面自身函数中调用vk实例（因为获取不到this）
    let app = getApp({ allowDefault: true });
    if (app && app.globalData && !app.globalData.vk) {
      app.globalData.vk = vk;
    }
    // #endif
    if (vk) {
      const url = vk.pubfn.getCurrentPageRoute();
      // 检测是否可以分享(小程序专属)
      vk.navigate.checkAllowShare({ url });
      // 检测是否需要登录，只有首次启动的页面才需要检测，其他页面通过 vk.navigateTo 跳转前会自动判断。
      if (isOnLaunch) {
        isOnLaunch = false; // 重新标记为非首次页面
        if (vk.checkToken()) {
          // 检测页面是否有权限访问
          if (!vk.checkCurrentPagePermission()) {
            // 跳403页面
            vk.navigateTo403();
            return;
          }
        } else {
          if (getCurrentPages().length == 1) {
            const currentPage = vk.pubfn.getCurrentPage() || {};
            let pagePath = currentPage.pagePath || `/${currentPage.route}` || url;
            let fullPath = currentPage.fullPath;
            let options = currentPage.options;
            vk.pubfn.checkLogin({ url: pagePath, fullPath, options, isOnLaunch: true }); // 检测是否需要登录
          }
        }
      }
    }
  },
  // #ifndef UNI-APP-X
  created() {
    // 将vk实例挂载到app.globalData上，方便在非Vue页面自身函数中调用vk实例（因为获取不到this）
    let app = getApp({ allowDefault: true });
    if (app && app.globalData && !app.globalData.vk) {
      app.globalData.vk = uni.vk;
    }
  },
  methods: {
    $getData(data, key, defaultValue) {
      const vk = uni.vk;
      return vk.pubfn.getData(data, key, defaultValue);
    },
  },
  // #endif
};
