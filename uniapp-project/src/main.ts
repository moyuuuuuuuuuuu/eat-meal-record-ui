import { createSSRApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

// 导入自定义样式
import './styles/index.scss';

// Wot Design Uni 配置
// Uniapp 会自动处理组件注册，通过 uni_modules 机制
// 组件会在使用时自动加载

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  app.use(pinia);

  return {
    app,
    pinia
  };
}
