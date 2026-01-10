# 食刻轻卡 - Uniapp 重构版

基于 Uniapp + Vue 3 + TypeScript + Wot Design Uni 的多平台饮食记录与健康管理应用。

## 🚀 项目特性

### 核心功能
- ✅ **饮食记录** - 智能记录每日饮食，支持拍照识别
- ✅ **营养计算** - 自动计算 BMI、BMR、TDEE 等健康指标
- ✅ **目标管理** - 个性化目标设置与进度追踪
- ✅ **社交分享** - 动态广场分享健康生活
- ✅ **主题切换** - 深色/浅色模式，跟随系统
- ✅ **多平台支持** - 一次开发，多端发布

### 技术栈
- **框架**: Uniapp (Vue 3)
- **UI 库**: Wot Design Uni
- **状态管理**: Pinia
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: SCSS

## 📱 支持平台

| 平台 | 状态 | 备注 |
|------|------|------|
| 微信小程序 | ✅ | 主要目标平台 |
| H5 | ✅ | 响应式设计 |
| App (iOS/Android) | ✅ | 原生能力支持 |
| 支付宝小程序 | ✅ | 兼容 |
| 百度小程序 | ✅ | 兼容 |
| 字节小程序 | ✅ | 兼容 |

## 📁 项目结构

```
uniapp-project/
├── src/
│   ├── components/           # 自定义组件
│   │   ├── CircularProgress/ # 环形进度条
│   │   ├── FloatingActionButton/ # 悬浮按钮
│   │   ├── FoodSuggestion/  # 食物建议
│   │   ├── MealRecord/      # 餐食记录
│   │   ├── NutrientBar/     # 营养条
│   │   └── PostCard/        # 动态卡片
│   ├── pages/               # 页面组件
│   │   ├── index/           # 首页仪表板
│   │   ├── feed/            # 动态广场
│   │   ├── profile/         # 个人中心
│   │   ├── add-meal/        # 添加餐食
│   │   ├── food-selector/   # 食物选择器
│   │   ├── meal-history/    # 餐食历史
│   │   ├── create-post/     # 发布动态
│   │   ├── goal-settings/   # 目标设置
│   │   ├── personal-info/   # 个人信息
│   │   └── theme-settings/  # 主题设置
│   ├── stores/              # Pinia 状态管理
│   │   ├── meal.ts          # 餐食状态
│   │   ├── theme.ts         # 主题状态
│   │   └── user.ts          # 用户状态
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   └── index.ts
│   ├── styles/              # 样式文件
│   │   ├── base.scss        # 基础样式
│   │   ├── variables.scss   # CSS 变量
│   │   ├── utils.scss       # 工具类
│   │   └── index.scss       # 样式入口
│   ├── App.vue              # 应用根组件
│   ├── main.ts              # 应用入口
│   └── manifest.json        # 应用配置
├── static/                  # 静态资源
│   └── icons/               # 图标
├── pages.json               # 页面路由配置
├── package.json             # 依赖配置
├── vite.config.ts           # Vite 配置
├── uni.scss                 # 全局样式
└── README.md                # 项目说明
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 16
- npm 或 pnpm
- HBuilderX (推荐) 或 uni-app CLI

### 安装依赖

```bash
cd uniapp-project
npm install
# 或
pnpm install
```

### 开发调试

```bash
# 微信小程序开发
npm run dev:mp-weixin

# H5 开发
npm run dev:h5

# App 开发
npm run dev:app

# 所有平台开发
npm run dev
```

### 构建发布

```bash
# 构建微信小程序
npm run build:mp-weixin

# 构建 H5
npm run build:h5

# 构建 App
npm run build:app

# 构建所有平台
npm run build
```

### 使用 HBuilderX

1. 打开 HBuilderX
2. 文件 -> 打开目录 -> 选择 `uniapp-project`
3. 运行 -> 运行到小程序模拟器 -> 微信开发者工具
4. 或 运行 -> 运行到浏览器 -> H5

## 🔧 配置说明

### Wot Design Uni 配置

组件库已全局引入，可直接使用：

```vue
<template>
  <wd-button type="primary" @click="handleClick">按钮</wd-button>
  <wd-input v-model="value" placeholder="请输入" />
  <wd-tabs v-model="active">
    <wd-tab title="标签1">内容1</wd-tab>
    <wd-tab title="标签2">内容2</wd-tab>
  </wd-tabs>
</template>
```

### Pinia 状态管理

应用包含三个核心 Store：

```typescript
// 用户信息
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
userStore.updateUserInfo({ name: '张三', age: 25 });

// 餐食记录
import { useMealStore } from '@/stores/meal';
const mealStore = useMealStore();
mealStore.addMeal(mealRecord);

// 主题设置
import { useThemeStore } from '@/stores/theme';
const themeStore = useThemeStore();
themeStore.setTheme('dark');
```

### TypeScript 类型

所有数据结构都有完整的类型定义：

```typescript
import type { UserInfo, MealRecord, Post } from '@/types';

const userInfo: UserInfo = {
  name: '张三',
  age: 25,
  gender: '男',
  height: 170,
  weight: 65
};
```

## 📊 核心功能详解

### 1. 首页仪表板
- 显示今日营养摄入进度
- 快速添加餐食
- 查看健康指标（BMI、BMR、TDEE）
- 今日餐食列表

### 2. 食物选择器
- 分类浏览食物
- 搜索功能
- 拍照识别（模拟）
- 数量选择与营养预览

### 3. 营养计算
```typescript
// BMI 计算
const bmi = weight / (height/100)²

// BMR 计算 (Mifflin-St Jeor 方程)
男: 88.362 + 13.397×weight + 4.799×height - 5.677×age
女: 447.593 + 9.247×weight + 3.098×height - 4.330×age

// TDEE 计算
TDEE = BMR × 活动系数 (1.375 轻度活动)
```

### 4. 动态广场
- 查看他人分享
- 点赞、评论、分享
- 发布自己的动态
- 营养信息展示

### 5. 主题系统
- 浅色/深色模式
- 跟随系统设置
- 实时切换
- 持久化存储

## 🎨 设计系统

### 颜色系统
```scss
--color-primary: #10b981;    // 主色调
--color-success: #10b981;    // 成功
--color-warning: #f59e0b;    // 警告
--color-danger: #ef4444;     // 危险
--color-info: #3b82f6;       // 信息
```

### 间距系统
```scss
--spacing-xs: 4rpx;
--spacing-sm: 8rpx;
--spacing-md: 12rpx;
--spacing-lg: 16rpx;
--spacing-xl: 20rpx;
--spacing-2xl: 24rpx;
```

### 字体系统
```scss
--text-xs: 20rpx;
--text-sm: 24rpx;
--text-base: 28rpx;
--text-lg: 32rpx;
--text-xl: 36rpx;
--text-2xl: 40rpx;
```

## 🔍 常见问题

### Q: 如何添加新页面？
A: 1. 在 `pages/` 目录创建页面文件
   2. 在 `pages.json` 中注册路由
   3. 如需 Tab 页，在 `tabBar.list` 中添加

### Q: 如何自定义主题？
A: 修改 `src/styles/variables.scss` 中的 CSS 变量，或在 `stores/theme.ts` 中添加新主题

### Q: 如何适配新平台？
A: Uniapp 会自动适配，如需平台特定代码，使用条件编译：
```vue
<!-- #ifdef MP-WEIXIN -->
<view>微信小程序特有内容</view>
<!-- #endif -->
```

### Q: 数据如何持久化？
A: 使用 `uni.setStorageSync` 和 `uni.getStorageSync`，Store 中已实现自动持久化

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目仅供学习和参考使用。

## 🙏 致谢

- [Uniapp](https://uniapp.dcloud.io/) - 多端统一框架
- [Wot Design Uni](https://wot-design-uni.cn/) - 优秀的组件库
- [Pinia](https://pinia.vuejs.org/) - 状态管理
- [Vue 3](https://vuejs.org/) - 渐进式框架

---

**开发愉快！** 🎉

如有问题，欢迎提交 Issue 或 PR。