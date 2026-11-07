export function $hasRole(...args) {
  const vk = uni.vk;
  const userRoles = vk.getVuex('$user.userInfo.role') || [];
  return args.some((arg) => {
    if (Array.isArray(arg)) {
      return arg.every((role) => userRoles.includes(role));
    } else {
      return userRoles.includes(arg);
    }
  });
}

export function $hasPermission(...args) {
  const vk = uni.vk;
  const userPermission = vk.getVuex('$user.permission') || [];
  return args.some((arg) => {
    if (Array.isArray(arg)) {
      return arg.every((permission) => userPermission.includes(permission));
    } else {
      return userPermission.includes(arg);
    }
  });
}

// #ifndef UNI-APP-X
export default function (Vue) {
  // #ifdef VUE2
  Vue.prototype.$hasRole = $hasRole;
  Vue.prototype.$hasPermission = $hasPermission;
  // #endif

  // #ifdef VUE3
  Vue.config.globalProperties.$hasRole = $hasRole;
  Vue.config.globalProperties.$hasPermission = $hasPermission;
  // #endif
}
// #endif

