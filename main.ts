import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App';
import createStores from './store';
import config from './app.config';
// 引入 vk框架前端
import vk from '@/uni_modules/vk-unicloud';

export function createApp() {
  const app = createSSRApp(App);
  // 引入 pinia
  const pinia = createPinia();
  app.use(pinia);

  // 引入 vk框架前端
  app.use(vk, config, {
    createStores: () => createStores(pinia),
  });

  return { app };
}
