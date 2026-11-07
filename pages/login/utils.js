import vk from '@/uni_modules/vk-unicloud';
import { computed, ref } from 'vue';

const loginRoot = '/pages/login/';

// App 在 onReady 后读取当前窗口尺寸；小屏与横屏时由 scroll-view 承接滚动。
export function useAuthLayout() {
  const contentHeight = ref(0);
  const bottomInset = ref(0);
  function updateLayout() {
    const windowInfo = uni.getWindowInfo();
    // 原生导航栏已由框架扣除，直接使用页面可用窗口高度。
    contentHeight.value = Math.max(0, windowInfo.windowHeight);
    bottomInset.value = windowInfo.safeAreaInsets?.bottom ?? 0;
  }
  onReady(updateLayout);
  onResize(updateLayout);
  const contentStyle = computed(() => ({ minHeight: contentHeight.value + 'px', paddingBottom: bottomInset.value + 24 + 'px' }));
  return { contentStyle };
}

function getRedirectUrl(value) {
  if (typeof value !== 'string' || vk.pubfn.isNull(value)) return '';
  let url = value;
  // onLoad 在部分平台已解码参数；完整路径中的查询值不应再被解码。
  if (!url.startsWith('/')) {
    try {
      url = decodeURIComponent(url);
    } catch (error) {
      return '';
    }
  }
  if (!url.startsWith('/') || url.startsWith('//') || url.startsWith(loginRoot)) return '';
  return url;
}

// vk.navigateTo 进入免登录页面时会清空 originalPage，因此在 onLoad 时保存目标。
export function captureLoginOptions(options = {}) {
  const originalPage = vk.navigate.getOriginalPage();
  const explicitUrl = getRedirectUrl(options.uniIdRedirectUrl);
  const redirectUrl = vk.pubfn.isNotNull(explicitUrl) ? explicitUrl : getRedirectUrl(typeof originalPage === 'string' ? originalPage : originalPage?.url);
  return { ...options, uniIdRedirectUrl: redirectUrl };
}

// 保留登录前目标，供注册、找回密码与登录页之间传递。
export function getLoginQuery(options = {}) {
  const redirectUrl = getRedirectUrl(options.uniIdRedirectUrl);
  return vk.pubfn.isNotNull(redirectUrl) ? `?uniIdRedirectUrl=${encodeURIComponent(redirectUrl)}` : '';
}

export function getRequestMessage(error, fallback) {
  const message = error?.msg ?? error?.errMsg ?? error?.message;
  return vk.pubfn.isNotNull(message) ? String(message) : fallback;
}

// 与框架登录拦截器共用返回目标。注册成功也走这里，避免返回已登录的登录页。
export function finishLogin(options = {}, pageInstance = null) {
  const redirectUrl = getRedirectUrl(options.uniIdRedirectUrl);
  if (vk.pubfn.isNotNull(redirectUrl)) {
    vk.navigate.setOriginalPage(null);
    vk.redirectTo(redirectUrl);
    return;
  }

  const originalPage = vk.navigate.getOriginalPage();
  if (vk.pubfn.isNotNull(originalPage)) {
    vk.navigate.originalTo();
    return;
  }

  if (typeof pageInstance?.getOpenerEventChannel === 'function') {
    const eventChannel = pageInstance.getOpenerEventChannel();
    if (typeof eventChannel?.emit === 'function') eventChannel.emit('loginSuccess', {});
  }

  const pages = getCurrentPages();
  for (let index = pages.length - 2; index >= 0; index--) {
    const route = '/' + String(pages[index].route ?? '').replace(/^\//, '');
    if (route !== '/' && !route.startsWith(loginRoot)) {
      vk.navigateBack({ delta: pages.length - 1 - index });
      return;
    }
  }
  vk.navigateToHome();
}

export function validateMobilePassword(form) {
  if (!vk.pubfn.test(form.mobile.trim(), 'mobile')) {
    vk.toast('请输入正确的手机号码', 'none');
    return false;
  }
  if (!vk.pubfn.test(form.code.trim(), 'mobileCode')) {
    vk.toast('请输入6位短信验证码', 'none');
    return false;
  }
  // 延续参考模板的注册和新密码规则；已有账号登录不套用此规则。
  if (!vk.pubfn.test(form.password, 'pwd')) {
    vk.toast('密码为6至18位，支持字母、数字、下划线和@', 'none');
    return false;
  }
  if (form.password !== form.password2) {
    vk.toast('两次输入的密码不一致', 'none');
    return false;
  }
  return true;
}
