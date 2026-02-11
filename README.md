<p align="center">
  <img alt="logo" src="https://starter.wot-ui.cn/logo.svg" width="200">
</p>

<!-- The above logo can be updated when a specific logo for this app is available -->

<h1 align="center">
  Eat Clear (Eat Meal Record UI)
</h1>

<p align="center">基于 <a href="https://github.com/uni-helper/vitesse-uni-app">vitesse-uni-app</a> 与 Wot Design Uni 构建的现代化饮食记录与社交应用。</p>

<p align="center">
  <a href="https://uniapp.dcloud.io/">📱 UniApp</a> ·
  <a href="https://vuejs.org/">💚 Vue 3</a> ·
  <a href="https://wot-design-uni.cn/">🎨 Wot Design Uni</a>
</p>

## ✨ 特性

- **📝 饮食记录**: 轻松记录每日三餐，支持食物选择与添加。
- **📊 数据可视化**: 清晰展示饮食历史与营养摄入情况。
- **🎯 目标设定**: 设定并追踪你的饮食与健康目标。
- **🌐 动态分享**: 发布饮食动态，与其他用户互动。
- **🎨 个性化主题**: 支持深色模式与多种主题定制。
- **📱 多端适配**: 基于 UniApp 开发，支持 iOS、Android、H5 及小程序等多端运行。

## 🛠️ 技术栈

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/) - 极速的开发体验
-  [Wot Design Uni](https://wot-design-uni.cn/) - 基于 Vue3 的 UniApp 组件库，提供高质量的交互体验
- 🍍 [Pinia](https://pinia.vuejs.org/) - 简单、强大的 Vue 状态管理
- 🌐 [Alova](https://alova.js.org/zh-CN/) - 轻量级且强大的请求策略库
- 🎨 [UnoCSS](https://unocss.dev/) - 即时原子化 CSS 引擎
- � [ECharts](https://echarts.apache.org/) - 强大的数据可视化图表库
- 🌍 [Vue I18n](https://vue-i18n.intlify.dev/) - 国际化支持

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
# H5 端开发
pnpm dev:h5

# 小程序端 (例如微信)
pnpm dev:mp-weixin

# APP 端
pnpm dev:app
```

### 构建生产版本

```bash
# H5 端构建
pnpm build:h5

# 小程序端构建
pnpm build:mp-weixin
```

## 📂 项目结构

- `src/pages` - 页面文件 (基于文件路由)
- `src/components` - 公共组件 (自动引入)
- `src/layouts` - 页面布局
- `src/stores` - 全局状态管理 (Pinia)
- `src/utils` - 工具函数
- `src/api` - 接口请求 (Alova)

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。
