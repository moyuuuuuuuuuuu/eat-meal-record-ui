# 快速开始指南

## 🎯 5分钟上手

### 1️⃣ 安装依赖

```bash
cd E:\dnmp\www\eat-meal-record\uniapp-project
npm install
```

### 2️⃣ 启动开发

#### 微信小程序（推荐）
```bash
npm run dev:mp-weixin
```
然后打开微信开发者工具，导入 `dist/dev/mp-weixin` 目录

#### H5 浏览器
```bash
npm run dev:h5
```
访问 http://localhost:5173

#### App 模拟器
```bash
npm run dev:app
```
使用 HBuilderX 运行到模拟器

### 3️⃣ 查看效果

应用默认包含：
- ✅ 首页仪表板（营养进度、快速操作）
- ✅ 食物选择器（分类、搜索、拍照识别）
- ✅ 餐食记录管理
- ✅ 动态广场
- ✅ 个人信息与目标设置
- ✅ 主题切换（深色/浅色）

## 📱 主要功能演示

### 添加第一餐
1. 打开应用 → 点击首页"添加餐食"按钮
2. 选择餐食类型（早餐/午餐/晚餐）
3. 点击"选择食物" → 浏览分类或搜索
4. 选择食物 → 调整数量 → 确认添加
5. 查看首页营养进度更新

### 拍照识别（模拟）
1. 在食物选择器点击"拍照识别食物"
2. 等待2秒模拟识别
3. 查看识别结果列表
4. 点击结果直接添加到餐食

### 切换主题
1. 进入"我的"页面
2. 点击"主题设置"
3. 选择深色/浅色/跟随系统
4. 实时查看效果

## 🛠️ 项目结构速览

```
uniapp-project/
├── src/
│   ├── pages/          # 10个页面
│   ├── components/     # 6个自定义组件
│   ├── stores/         # 3个状态管理
│   ├── types/          # TypeScript类型
│   ├── utils/          # 工具函数
│   └── styles/         # 样式系统
├── static/             # 静态资源
├── pages.json          # 路由配置
├── manifest.json       # 平台配置
└── package.json        # 依赖配置
```

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev:mp-weixin` | 微信小程序开发 |
| `npm run dev:h5` | H5 开发 |
| `npm run dev:app` | App 开发 |
| `npm run build:mp-weixin` | 构建微信小程序 |
| `npm run build:h5` | 构建 H5 |
| `npm run build:app` | 构建 App |

## 💡 快速修改

### 修改主题色
编辑 `src/styles/variables.scss`:
```scss
:root {
  --color-primary: #10b981; // 改为你喜欢的颜色
}
```

### 添加新页面
1. 在 `src/pages/` 创建新页面目录
2. 在 `pages.json` 添加路由配置
3. 如需 Tab 页，在 `tabBar.list` 添加

### 修改首页内容
编辑 `src/pages/index/index.vue`

## 📚 学习资源

- **Uniapp 文档**: https://uniapp.dcloud.io/
- **Wot UI 文档**: https://wot-design-uni.cn/
- **Vue 3 文档**: https://vuejs.org/
- **Pinia 文档**: https://pinia.vuejs.org/

## 🚀 下一步

1. **阅读完整文档**: 查看 `README.md`
2. **部署指南**: 查看 `DEPLOYMENT.md`
3. **项目详情**: 查看 `PROJECT_SUMMARY.md`
4. **开始开发**: 修改代码，立即看到效果！

## ❓ 遇到问题？

1. 检查 Node.js 版本 (>= 16)
2. 清理缓存: `rm -rf node_modules && npm install`
3. 查看控制台错误信息
4. 阅读各平台官方文档

---

**祝你开发愉快！** 🎉