/**
 * vk-unicloud框架客户端（前端）
 * author VK
 * ##### 如果你热爱编程，想快速入门云开发，欢迎使用vk-unicloud系列开发框架
 * ##### 无需转变开发习惯，0成本上手云开发。
 * ##### 框架内置了众多API、工具包，为你的业务扫平障碍。使你的项目刚起步进度就是50%（微信登录、短信、验证码、缓存、生成小程序码等等）
 * ##### 从此你又get一个新技能，只需用js，轻松搞定前后台整体业务。
 * ##### client端 框架地址：https://ext.dcloud.net.cn/plugin?id=2204
 * ##### admin端 框架地址：https://ext.dcloud.net.cn/plugin?id=5043
 * ##### client端 框架文档：https://vkdoc.fsq.pub/client/
 * ##### admin端 框架文档：https://vkdoc.fsq.pub/admin/
 * ##### 框架学习Q群：22466457 欢迎萌新和大佬来使用和共同改进框架
 */

import userCenter from './libs/vk-unicloud/vk-unicloud-user-center';
import callFunctionUtil from './libs/vk-unicloud/vk-unicloud-callFunctionUtil';
import pubfn from './libs/function/index';
import modal from './libs/function/modal';
import navigate from './libs/function/vk.navigate';
import localStorage from './libs/function/vk.localStorage';
import sessionStorage from './libs/function/vk.sessionStorage';
import openapi from './libs/openapi/index';
import requestUtil from './libs/function/vk.request';
import importObject from './libs/function/vk.importObject';
import filters from './libs/function/vk.filters';
import eventManager from './libs/function/vk.eventManager';
import mixin from './libs/mixin/mixin.js';

// #ifdef UNI-APP-X
import initPinia from './libs/store/pinia';
// #endif

// #ifndef UNI-APP-X
import initPermission from './libs/function/permission';
import storeMixin from './libs/store/mixin/mixin';
// #endif

import { $hasRole, $hasPermission } from './libs/function/permission';

import initGlobalError from './libs/store/libs/error';
import consoleLog from './libs/install/console.log';
import updateManager from './libs/function/updateManager';
import crypto from './libs/function/vk.crypto';
import connectWebSocket from './libs/function/vk.connectWebSocket';
import setCustomClientInfo from './libs/function/vk.setCustomClientInfo';

// #ifdef WEB
import h5 from './libs/function/vk.h5';
// #endif

const vk = {
  userCenter,
  callFunctionUtil,

  /**
   * 发起一个云函数请求
   */
  callFunction: callFunctionUtil.callFunction,
  getToken: callFunctionUtil.getToken,
  saveToken: callFunctionUtil.saveToken,
  checkToken: callFunctionUtil.checkToken,
  deleteToken: callFunctionUtil.deleteToken,
  uploadFile: callFunctionUtil.uploadFile,
  chooseAndUploadFile: callFunctionUtil.chooseAndUploadFile,
  getConfig: callFunctionUtil.getConfig,
  emitRefreshToken: callFunctionUtil.emitRefreshToken,
  onRefreshToken: callFunctionUtil.onRefreshToken,
  offRefreshToken: callFunctionUtil.offRefreshToken,
  handleAutoLoginToken: callFunctionUtil.handleAutoLoginToken,

  pubfn,

  // #ifdef WEB
  h5,
  // #endif

  alert: modal.alert,
  toast: modal.toast,
  confirm: modal.confirm,
  prompt: modal.prompt,
  showActionSheet: modal.showActionSheet,
  showLoading: modal.showLoading,
  hideLoading: modal.hideLoading,
  setLoading: modal.setLoading,

  navigate,

  // 保留当前页面,并进行页面跳转
  navigateTo: navigate.navigateTo,
  // 关闭当前页面,并进行页面跳转
  redirectTo: navigate.redirectTo,
  // 并关闭所有页面,并进行页面跳转
  reLaunch: navigate.reLaunch,
  // 并关闭所有非tab页面,并进行tab面跳转
  switchTab: navigate.switchTab,
  // 页面返回
  navigateBack: navigate.navigateBack,
  // 跳转到首页
  navigateToHome: navigate.navigateToHome,
  // 跳转到登录页
  navigateToLogin: navigate.navigateToLogin,
  // 跳转到403页面
  navigateTo403: navigate.navigateTo403,
  // 跳转到404页面
  navigateTo404: navigate.navigateTo404,
  // 跳转到小程序
  navigateToMiniProgram: navigate.navigateToMiniProgram,
  // 跳转到抽奖小程序
  navigateToLuckyDraw: navigate.navigateToLuckyDraw,
  // 检查当前页面是否有菜单权限（处理直接 URL 访问场景，仅给admin端使用）
  checkCurrentPagePermission: navigate.checkCurrentPagePermission,

  // 触发全局的自定义事件，附加参数都会传给监听器回调函数。
  $emit: navigate.$emit,
  // 监听全局的自定义事件，事件由 uni.$emit 触发，回调函数会接收事件触发函数的传入参数。
  $on: navigate.$on,
  // 触发全局的自定义事件，事件由 uni.$emit 触发，回调函数会接收事件触发函数的传入参数。
  $once: navigate.$once,
  // 移除全局自定义事件监听器。
  $off: navigate.$off,

  // 本地持久
  localStorage,
  // 本地会话缓存
  sessionStorage,

  // 获取应用语言列表
  getLocaleList: pubfn.getLocaleList,
  // 获取应用当前语言
  getLocale: pubfn.getLocale,
  // 获取应用当前语言对象
  getLocaleObject: pubfn.getLocaleObject,
  // 设置应用语言
  setLocale: pubfn.setLocale,

  // 设置系统剪贴板的内容
  setClipboardData: pubfn.setClipboardData,
  // 获取系统剪贴板内容
  getClipboardData: pubfn.getClipboardData,

  // 本地持久缓存
  ...localStorage,
  // 本地会话缓存
  ...sessionStorage,

  // 更新管理器
  updateManager,
  // 开放API
  openapi,
  // 请求库
  requestUtil,
  // 发起URL请求
  request: requestUtil.request,
  // 导出云对象
  importObject,
  // 事件管理
  ...eventManager,
  // 客户端加密函数
  crypto,
  // webSocket
  connectWebSocket,
  // 设置自定义客户端信息
  setCustomClientInfo,

  $hasRole,
  $hasPermission,
};

// 获取全局对象
vk.getGlobalObject = function () {
  if (typeof globalThis === 'object') return globalThis;
  if (typeof self === 'object') return self;
  if (typeof window === 'object') return window;
  if (typeof global === 'object') return global;
};

// 加载拓展功能
vk.use = function (obj, util) {
  for (let name in obj) {
    if (obj[name] && typeof obj[name].init === 'function') {
      obj[name].init(util);
    }
    vk[name] = obj[name];
  }
};

/**
 * vk核心初始化
 * 不依赖Vue，普通uni-app和uni-app x均可使用
 */
vk.initCore = function (config) {
  // 将vk挂载到uni对象
  if (typeof uni == 'object') uni.vk = vk;

  // 将vk挂载到全局对象
  let vkGlobalThis = vk.getGlobalObject();
  if (typeof vkGlobalThis == 'object') {
    vkGlobalThis.vk = vk;
  }

  // 加载插件
  let util = { vk };
  vk.use(
    {
      callFunctionUtil: vk.callFunctionUtil,
      openapi: vk.openapi,
    },
    util
  );

  // 加载vk配置
  if (config) {
    // 自定义云函数路由配置
    vk.callFunctionUtil.setConfig(config);
  }

  // 重写console.log
  consoleLog(vk);
};

// #ifdef UNI-APP-X
/**
 * uni-app x插件初始化，通过 app.use(vk, config, options) 安装
 * @param {Object} app Vue应用实例
 * @param {Object} config 框架配置
 * @param {Object} options 初始化选项
 * @param {Function} options.createStores 无参同步函数，返回模块名到 Pinia store 实例的映射
 */
vk.install = function (app, config = {}, options = {}) {
  vk.initCore(config);
  const { createStores } = options;
  if (typeof createStores !== 'undefined') {
    if (typeof createStores !== 'function') throw new Error('[vk] createStores 必须是同步工厂函数');
    const stores = createStores();
    initPinia(vk, stores);
  }
  // 路由成功后复用页面检查逻辑，执行时机在页面 onShow 之后。
  uni.onAppRoute(mixin.onLoad);
};
// #endif

// #ifndef UNI-APP-X
/**
 * vk的Vue插件初始化
 * 普通uni-app使用
 */
vk.install = (Vue, config) => {
  // 全局混入
  Vue.mixin(mixin);

  // #ifdef VUE2
  // 加载全局过滤器
  for (let i in filters) {
    Vue.filter(i, filters[i]);
  }

  // 将vk挂载到Vue实例
  Vue.prototype.vk = vk;
  Vue.prototype.$fn = vk.pubfn;
  // #endif

  // #ifdef VUE3
  // 将vk挂载到Vue实例
  Vue.config.globalProperties.vk = vk;
  Vue.config.globalProperties.$fn = vk.pubfn; // $fn 仅为兼容旧版，已不建议使用，应直接用 vk.pubfn
  // #endif

  // 核心初始化
  vk.initCore(config);

  // 混入Vuex
  Vue.mixin(storeMixin);

  // 初始化权限
  initPermission(Vue);

  // Vue相关配置
  if (config) {
    if (config.globalError) {
      // 加载全局错误
      Vue.use(initGlobalError);
    }
  }
};

// vk旧版实例初始化（为了兼容旧版，此函数还需要保留，此函数不再进行后续改动）
vk.init = function (obj = {}) {
  let {
    Vue, // Vue实例
    config, // 配置
    store, // 兼容更旧的版本
  } = obj;

  if (typeof store !== 'undefined') {
    // 兼容更旧的版本
    Vue.use(store);
  } else {
    // 无需传store
    Vue.mixin(storeMixin);

    if (config.globalError) {
      Vue.use(initGlobalError);
    }
  }

  // 自定义云函数路由配置
  vk.callFunctionUtil.setConfig(config);

  // 重写console.log
  consoleLog(vk);
};
// #endif

export default vk;
