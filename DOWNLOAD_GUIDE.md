# 食刻轻卡 - 项目下载指南

## 📦 方法一：自动下载（推荐）

### 在 Figma Make 界面操作：

1. **查找下载按钮**
   - 位置：界面右上角
   - 按钮名称：**"Export"** 或 **"Download Code"** 或 **"下载"**

2. **点击下载**
   - 自动打包所有文件
   - 下载为 `.zip` 格式

3. **解压并运行**
   ```bash
   # 解压文件
   unzip 食刻轻卡.zip
   cd 食刻轻卡
   
   # 安装依赖
   npm install
   
   # 启动开发服务器
   npm run dev
   ```

---

## 📋 方法二：手动复制文件

如果无法直接下载，请按以下清单手动复制所有文件：

### 1️⃣ 配置文件（项目根目录）

```
✅ package.json                 # 依赖配置
✅ vite.config.ts               # Vite配置
✅ postcss.config.mjs           # PostCSS配置
✅ tsconfig.json                # TypeScript配置（如果有）
✅ UNIAPP_MIGRATION_GUIDE.md    # Uniapp迁移指南
```

### 2️⃣ 源代码文件

#### `/src/app/` 目录
```
✅ App.tsx                      # 主应用组件
```

#### `/src/app/components/` 目录（核心页面）
```
✅ HomePage.tsx                 # 首页
✅ FeedPage.tsx                 # 动态广场
✅ ProfilePage.tsx              # 个人中心
✅ AddMealPage.tsx              # 添加餐食
✅ MealHistoryPage.tsx          # 餐食记录
✅ CreatePostPage.tsx           # 发布动态
✅ GoalSettingsPage.tsx         # 目标设置
✅ PersonalInfoPage.tsx         # 个人信息
✅ ThemeSettingsPage.tsx        # 主题设置
✅ FoodSelectorPage.tsx         # 食物选择器
```

#### `/src/app/components/` 目录（子组件）
```
✅ CircularProgress.tsx         # 环形进度条
✅ NutrientBar.tsx              # 营养素进度条
✅ MealRecord.tsx               # 餐食记录卡片
✅ FoodSuggestion.tsx           # 今日吃什么
✅ FloatingActionButton.tsx     # 悬浮按钮
```

#### `/src/app/components/figma/` 目录
```
✅ ImageWithFallback.tsx        # 图片组件（受保护）
```

#### `/src/app/components/ui/` 目录（UI组件库）
```
✅ accordion.tsx
✅ alert-dialog.tsx
✅ alert.tsx
✅ aspect-ratio.tsx
✅ avatar.tsx
✅ badge.tsx
✅ breadcrumb.tsx
✅ button.tsx
✅ calendar.tsx
✅ card.tsx
✅ carousel.tsx
✅ chart.tsx
✅ checkbox.tsx
✅ collapsible.tsx
✅ command.tsx
✅ context-menu.tsx
✅ dialog.tsx
✅ drawer.tsx
✅ dropdown-menu.tsx
✅ form.tsx
✅ hover-card.tsx
✅ input-otp.tsx
✅ input.tsx
✅ label.tsx
✅ menubar.tsx
✅ navigation-menu.tsx
✅ pagination.tsx
✅ popover.tsx
✅ progress.tsx
✅ radio-group.tsx
✅ resizable.tsx
✅ scroll-area.tsx
✅ select.tsx
✅ separator.tsx
✅ sheet.tsx
✅ sidebar.tsx
✅ skeleton.tsx
✅ slider.tsx
✅ sonner.tsx
✅ switch.tsx
✅ table.tsx
✅ tabs.tsx
✅ textarea.tsx
✅ toggle-group.tsx
✅ toggle.tsx
✅ tooltip.tsx
✅ use-mobile.ts
✅ utils.ts
```

#### `/src/app/context/` 目录
```
✅ ThemeContext.tsx             # 主题上下文
```

#### `/src/styles/` 目录
```
✅ fonts.css                    # 字体样式
✅ index.css                    # 入口样式
✅ tailwind.css                 # Tailwind配置
✅ theme.css                    # 主题变量
```

### 3️⃣ 入口文件

```
✅ /src/index.html              # HTML入口（如果存在）
✅ /src/main.tsx                # 主入口文件（如果存在）
```

---

## 🛠️ 本地环境搭建

### 前置要求

```bash
Node.js >= 16.0.0
npm >= 8.0.0
# 或
yarn >= 1.22.0
```

### 完整步骤

#### 1. 创建项目文件夹
```bash
mkdir 食刻轻卡-react
cd 食刻轻卡-react
```

#### 2. 复制所有文件
按照上面的文件清单，将所有文件复制到项目文件夹中，保持原有的目录结构。

#### 3. 安装依赖
```bash
npm install
```

**依赖列表（来自 package.json）：**
- react
- react-dom
- lucide-react（图标库）
- sonner（提示组件）
- 其他UI组件库依赖

#### 4. 启动开发服务器
```bash
npm run dev
```

#### 5. 访问应用
浏览器自动打开 `http://localhost:5173`

---

## 📱 查看项目结构

正确的目录结构应该是：

```
食刻轻卡-react/
├── package.json
├── vite.config.ts
├── postcss.config.mjs
├── UNIAPP_MIGRATION_GUIDE.md
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── HomePage.tsx
│   │   │   ├── FeedPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── AddMealPage.tsx
│   │   │   ├── MealHistoryPage.tsx
│   │   │   ├── CreatePostPage.tsx
│   │   │   ├── GoalSettingsPage.tsx
│   │   │   ├── PersonalInfoPage.tsx
│   │   │   ├── ThemeSettingsPage.tsx
│   │   │   ├── FoodSelectorPage.tsx
│   │   │   ├── CircularProgress.tsx
│   │   │   ├── NutrientBar.tsx
│   │   │   ├── MealRecord.tsx
│   │   │   ├── FoodSuggestion.tsx
│   │   │   ├── FloatingActionButton.tsx
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   └── ui/
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── ... (其他UI组件)
│   │   └── context/
│   │       └── ThemeContext.tsx
│   └── styles/
│       ├── fonts.css
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
└── node_modules/ (运行 npm install 后自动生成)
```

---

## ⚙️ package.json 示例

如果您需要手动创建 package.json，这里是完整的配置：

```json
{
  "name": "食刻轻卡",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.300.0",
    "sonner": "^1.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 🚀 运行后效果

启动成功后，您应该能看到：

✅ 首页 - 环形进度条显示卡路里
✅ 营养素进度条（蛋白质/碳水/脂肪）
✅ "今日吃什么"推荐卡片
✅ 餐食记录列表（早/中/晚/加餐）
✅ 右下角悬浮添加按钮
✅ 底部导航栏（首页/动态/我的）
✅ 深色模式支持

---

## 🔧 常见问题

### Q1: 运行 npm install 报错？
**解决：**
```bash
# 清除缓存
npm cache clean --force

# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 或使用 yarn
npm install -g yarn
yarn install
```

### Q2: 页面空白无法显示？
**检查：**
1. 浏览器控制台是否有报错
2. 确认所有文件都已复制
3. 检查 `/src/app/App.tsx` 是否有 `export default`

### Q3: Tailwind 样式不生效？
**检查：**
1. `/src/styles/tailwind.css` 文件是否存在
2. `vite.config.ts` 中是否配置了 PostCSS
3. 清除缓存重新运行：`npm run dev`

### Q4: 深色模式不工作？
**检查：**
1. `/src/app/context/ThemeContext.tsx` 是否正确
2. localStorage 是否有权限
3. 浏览器是否支持 `window.matchMedia`

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. ✅ Node.js 版本是否 >= 16
2. ✅ 所有文件是否完整复制
3. ✅ 目录结构是否正确
4. ✅ 依赖是否安装成功

---

## 🎯 下一步

下载完成后，您可以：

### 选项 A：继续使用 React 版本
- 在本地继续开发优化
- 部署到 Vercel/Netlify

### 选项 B：迁移到 Uniapp
- 参考 `UNIAPP_MIGRATION_GUIDE.md`
- 按照文档逐步迁移到 Wot UI

---

**祝您使用愉快！** 🎉
