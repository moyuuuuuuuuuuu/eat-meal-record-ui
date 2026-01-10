# 食刻轻卡 - Uniapp + Wot UI 迁移指南

## 📋 目录
1. [项目概览](#项目概览)
2. [技术架构](#技术架构)
3. [页面结构](#页面结构)
4. [数据结构](#数据结构)
5. [UI设计规范](#ui设计规范)
6. [组件映射表](#组件映射表)
7. [页面功能详解](#页面功能详解)
8. [交互动效](#交互动效)
9. [路由配置](#路由配置)
10. [Uniapp环境搭建](#uniapp环境搭建)

---

## 项目概览

### 应用名称
**食刻轻卡** - 卡路里与营养素记录小程序

### 核心功能
- 📊 卡路里与营养素追踪（首页）
- 📝 餐食记录管理（早/中/晚/加餐）
- 🌍 动态广场（社交功能）
- 👤 个人中心与设置
- 📸 食物拍照识别
- 🎨 深色模式支持

### 目标平台
- 微信小程序
- 支付宝小程序
- H5
- Android/iOS App

---

## 技术架构

### 推荐技术栈

```json
{
  "framework": "Uniapp",
  "vue": "Vue 3 + TypeScript",
  "ui": "Wot Design Uni",
  "状态管理": "Pinia",
  "路由": "uni-simple-router（可选）",
  "存储": "uni.setStorageSync",
  "动画": "Wot UI 内置 + Vue transition"
}
```

### 项目结构建议

```
├── pages/
│   ├── index/              # 首页（底部导航页面）
│   │   └── index.vue
│   ├── feed/               # 动态广场
│   │   └── index.vue
│   ├── profile/            # 个人中心
│   │   └── index.vue
│   ├── add-meal/           # 添加餐食
│   │   └── index.vue
│   ├── meal-history/       # 餐食记录
│   │   └── index.vue
│   ├── create-post/        # 发布动态
│   │   └── index.vue
│   ├── goal-settings/      # 目标设置
│   │   └── index.vue
│   ├── personal-info/      # 个人信息
│   │   └── index.vue
│   └── theme-settings/     # 主题设置
│       └── index.vue
├── components/
│   ├── CircularProgress/   # 环形进度条
│   ├── NutrientBar/        # 营养素进度条
│   ├── MealRecord/         # 餐食记录卡片
│   ├── FoodSuggestion/     # 今日吃什么
│   ├── FloatingButton/     # 悬浮按钮
│   └── PostCard/           # 动态卡片
├── stores/
│   ├── meal.ts             # 餐食数据
│   ├── user.ts             # 用户数据
│   └── theme.ts            # 主题数据
├── types/
│   └── index.ts            # TypeScript 类型定义
├── utils/
│   └── index.ts            # 工具函数
└── App.vue
```

---

## 页面结构

### 底部导航（TabBar）

**3个主页面：**

| 页面 | 路径 | 图标 | 说明 |
|------|------|------|------|
| 首页 | `/pages/index/index` | House | 卡路里追踪 |
| 动态 | `/pages/feed/index` | List | 社交广场 |
| 我的 | `/pages/profile/index` | User | 个人中心 |

### 子页面

| 页面 | 路径 | 父页面 | 说明 |
|------|------|--------|------|
| 添加餐食 | `/pages/add-meal/index` | 首页 | 记录餐食 |
| 餐食记录 | `/pages/meal-history/index` | 我的 | 历史记录 |
| 发布动态 | `/pages/create-post/index` | 动态 | 发帖 |
| 目标设置 | `/pages/goal-settings/index` | 我的 | 设置目标 |
| 个人信息 | `/pages/personal-info/index` | 我的 | 编辑资料 |
| 主题设置 | `/pages/theme-settings/index` | 我的 | 切换主题 |

---

## 数据结构

### 1. 用户信息 (UserInfo)

```typescript
interface UserInfo {
  name: string;           // 用户名
  age: number;            // 年龄
  gender: '男' | '女';    // 性别
  height: number;         // 身高(cm)
  weight: number;         // 体重(kg)
  avatar?: string;        // 头像URL
}

// 默认数据
const defaultUser: UserInfo = {
  name: '食刻用户',
  age: 25,
  gender: '男',
  height: 170,
  weight: 65
}
```

### 2. 目标设置 (GoalSettings)

```typescript
interface GoalSettings {
  dailyCalories: number;     // 每日目标卡路里
  protein: number;           // 蛋白质目标(g)
  carbs: number;             // 碳水化合物目标(g)
  fat: number;               // 脂肪目标(g)
  targetWeight: number;      // 目标体重(kg)
  goal: 'lose' | 'maintain' | 'gain';  // 目标类型
}

// 默认数据
const defaultGoal: GoalSettings = {
  dailyCalories: 1800,
  protein: 90,
  carbs: 200,
  fat: 60,
  targetWeight: 60,
  goal: 'lose'
}
```

### 3. 食物项 (FoodItem)

```typescript
interface FoodItem {
  id: string;
  name: string;              // 食物名称
  amount: string;            // 数量（如：100g, 1个）
  calories: number;          // 卡路里
  protein: number;           // 蛋白质(g)
  carbs: number;             // 碳水(g)
  fat: number;               // 脂肪(g)
}
```

### 4. 餐食记录 (MealRecord)

```typescript
interface MealRecord {
  id: string;
  date: string;              // YYYY-MM-DD
  time: string;              // HH:mm
  mealType: '早餐' | '午餐' | '晚餐' | '加餐';
  items: FoodItem[];         // 食物列表
  totalCalories: number;     // 总卡路里
  totalProtein: number;      // 总蛋白质
  totalCarbs: number;        // 总碳水
  totalFat: number;          // 总脂肪
  note?: string;             // 备注
}
```

### 5. 动态帖子 (Post)

```typescript
interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;           // 文字内容
  images?: string[];         // 图片URL数组
  topics: string[];          // 话题标签（如：#健康饮食）
  mealReference?: {          // 关联的餐食
    mealType: string[];
    items: string[][];
    totalCalories: number;
  };
  location?: {               // 位置信息
    latitude: number;
    longitude: number;
  };
  likes: number;             // 点赞数
  comments: number;          // 评论数
  isLiked: boolean;          // 当前用户是否点赞
  createdAt: string;         // 发布时间
}
```

### 6. 主题设置 (ThemeSettings)

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;              // 用户选择的主题
  effectiveTheme: 'light' | 'dark';  // 实际应用的主题
}
```

### 7. 每日营养汇总 (DailyNutrition)

```typescript
interface DailyNutrition {
  date: string;              // YYYY-MM-DD
  totalCalories: number;     // 已摄入卡路里
  totalProtein: number;      // 已摄入蛋白质
  totalCarbs: number;        // 已摄入碳水
  totalFat: number;          // 已摄入脂肪
  meals: MealRecord[];       // 今日餐食列表
}
```

---

## UI设计规范

### 配色方案

#### 主题色 (Emerald Green)
```css
/* 浅色模式 */
--primary-color: #10b981;        /* emerald-500 */
--primary-hover: #059669;        /* emerald-600 */
--primary-light: #d1fae5;        /* emerald-100 */
--primary-lighter: #ecfdf5;      /* emerald-50 */

/* 深色模式 */
--primary-color-dark: #34d399;   /* emerald-400 */
--primary-hover-dark: #10b981;   /* emerald-500 */
--primary-light-dark: rgba(16, 185, 129, 0.3);
```

#### 背景色
```css
/* 浅色模式 */
--bg-primary: #ffffff;           /* 卡片背景 */
--bg-secondary: #f9fafb;         /* 页面背景 gray-50 */
--bg-tertiary: #f3f4f6;          /* 输入框背景 gray-100 */

/* 深色模式 */
--bg-primary-dark: #1f2937;      /* gray-800 */
--bg-secondary-dark: #111827;    /* gray-900 */
--bg-tertiary-dark: #374151;     /* gray-700 */
```

#### 文字颜色
```css
/* 浅色模式 */
--text-primary: #111827;         /* gray-900 */
--text-secondary: #6b7280;       /* gray-500 */
--text-tertiary: #9ca3af;        /* gray-400 */

/* 深色模式 */
--text-primary-dark: #f9fafb;    /* gray-50 */
--text-secondary-dark: #9ca3af;  /* gray-400 */
--text-tertiary-dark: #6b7280;   /* gray-500 */
```

#### 边框颜色
```css
/* 浅色模式 */
--border-color: #e5e7eb;         /* gray-200 */

/* 深色模式 */
--border-color-dark: #374151;    /* gray-700 */
```

#### 其他功能色
```css
/* 早餐 - 橙色 */
--breakfast: #f97316;            /* orange-500 */
--breakfast-dark: #fb923c;       /* orange-400 */

/* 午餐 - 黄色 */
--lunch: #eab308;                /* yellow-500 */
--lunch-dark: #facc15;           /* yellow-400 */

/* 晚餐 - 靛蓝 */
--dinner: #6366f1;               /* indigo-500 */
--dinner-dark: #818cf8;          /* indigo-400 */

/* 加餐 - 琥珀色 */
--snack: #d97706;                /* amber-600 */
--snack-dark: #f59e0b;           /* amber-500 */

/* 危险/删除 - 红色 */
--danger: #ef4444;               /* red-500 */
--danger-dark: #f87171;          /* red-400 */
```

### 间距规范

```css
/* 页面边距 */
--page-padding: 16px;            /* px-4 */

/* 卡片间距 */
--card-gap: 8px;                 /* gap-2 */
--card-padding: 16px;            /* p-4 */
--card-radius: 12px;             /* rounded-xl */

/* 组件间距 */
--component-gap-sm: 8px;         /* gap-2 */
--component-gap-md: 12px;        /* gap-3 */
--component-gap-lg: 16px;        /* gap-4 */

/* 底部导航高度 */
--tabbar-height: 64px;           /* h-16 */
```

### 字体规范

```css
/* 标题 */
--font-size-title: 24px;         /* text-2xl */
--font-size-subtitle: 18px;      /* text-lg */

/* 正文 */
--font-size-base: 14px;          /* text-sm */
--font-size-body: 16px;          /* text-base */

/* 辅助文字 */
--font-size-caption: 12px;       /* text-xs */

/* 行高 */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
```

### 圆角规范

```css
--radius-sm: 8px;                /* rounded-lg */
--radius-md: 12px;               /* rounded-xl */
--radius-lg: 16px;               /* rounded-2xl */
--radius-full: 9999px;           /* rounded-full */
```

### 阴影规范

```css
/* 卡片阴影 */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

/* 悬浮按钮阴影 */
--shadow-float: 0 10px 25px rgba(16, 185, 129, 0.3);
```

---

## 组件映射表

### React 组件 → Wot UI 组件

| 功能 | 当前实现 | Wot UI 组件 | 说明 |
|------|----------|-------------|------|
| 按钮 | `<button>` + Tailwind | `<wd-button>` | type="primary" |
| 进度条 | 自定义SVG | `<wd-progress>` | type="circle" |
| 输入框 | `<input>` + Tailwind | `<wd-input>` | - |
| 文本域 | `<textarea>` + Tailwind | `<wd-textarea>` | maxlength="500" |
| 开关 | 自定义checkbox | `<wd-switch>` | - |
| 标签 | `<span>` + Tailwind | `<wd-tag>` | - |
| 弹窗 | 自定义modal | `<wd-popup>` | - |
| 消息提示 | 自定义toast | `useToast()` | - |
| 加载中 | 自定义spinner | `<wd-loading>` | - |
| 单元格 | 自定义div | `<wd-cell>` | 用于个人中心 |
| 单元格组 | 自定义div | `<wd-cell-group>` | - |
| 导航栏 | 自定义header | `<wd-navbar>` | - |
| 标签页 | 自定义tabs | `<wd-tabs>` | - |
| 图片上传 | `<input type="file">` | `<wd-upload>` | - |
| 动作面板 | 自定义modal | `<wd-action-sheet>` | 餐次选择 |
| 步进器 | `<input type="number">` | `<wd-input-number>` | 数字输入 |
| 空状态 | 自定义div | `<wd-empty>` | - |
| 分割线 | `<div>` + border | `<wd-divider>` | - |

### 图标

| 当前 | Wot UI 方案 |
|------|-------------|
| Lucide React | 使用 Wot UI 内置图标 或 iconfont |

**图标映射：**
- `House` → `wot-icon-home-outlined`
- `List` → `wot-icon-list`
- `User` → `wot-icon-user`
- `Plus` → `wot-icon-add`
- `ChevronLeft` → `wot-icon-arrow-left`
- `Settings` → `wot-icon-setting`
- `Heart` → `wot-icon-like`
- `MessageCircle` → `wot-icon-comment`

---

## 页面功能详解

### 1. 首页 (HomePage)

**路径：** `/pages/index/index.vue`

#### 功能模块

##### 1.1 头部区域
- 显示今日日期（格式：1月10日 星期六）
- 右侧显示目标设置按钮（可选）

##### 1.2 环形进度条
- 显示今日卡路里摄入情况
- 中心显示：剩余卡路里 / 目标卡路里
- 外环进度：已摄入/目标
- 颜色：emerald绿色
- 超出目标时显示红色警告

**Wot UI实现：**
```vue
<wd-progress 
  type="circle" 
  :percentage="percentage"
  :stroke-width="8"
  color="#10b981"
/>
```

##### 1.3 营养素进度条
- 蛋白质进度条（橙色 #fb923c）
- 碳水化合物进度条（蓝色 #60a5fa）
- 脂肪进度条（紫色 #c084fc）
- 每个显示：已摄入/目标

**Wot UI实现：**
```vue
<wd-progress 
  :percentage="proteinPercentage"
  :stroke-width="8"
  color="#fb923c"
/>
```

##### 1.4 今日吃什么（食物建议）
- 渐变背景卡片（emerald到teal）
- 显示推荐食物名称
- 显示卡路里估算
- 显示标签（如：高蛋白、低卡）
- 点击刷新按钮切换建议

**推荐数据：**
```typescript
const suggestions = [
  { name: '水煮鸡胸肉配西兰花', calories: 280, tag: '高蛋白' },
  { name: '糙米饭配鲑鱼', calories: 420, tag: '健康脂肪' },
  { name: '希腊酸奶配蓝莓', calories: 180, tag: '低卡' },
  { name: '燕麦粥配香蕉', calories: 320, tag: '碳水能量' },
  { name: '蔬菜沙拉配鸡蛋', calories: 220, tag: '低脂' },
];
```

##### 1.5 餐食记录列表
- 按餐次分组（早餐/午餐/晚餐/加餐）
- 每个餐次卡片显示：
  - 餐次图标 + 名称
  - 时间
  - 总卡路里
  - 食物列表（可展开/收起）
- 点击食物项可查看详情
- 无记录时显示"暂无记录"

**餐次图标颜色：**
```typescript
const mealColors = {
  '早餐': { icon: 'sunrise', color: '#f97316' },
  '午餐': { icon: 'sun', color: '#eab308' },
  '晚餐': { icon: 'moon', color: '#6366f1' },
  '加餐': { icon: 'coffee', color: '#d97706' }
}
```

##### 1.6 悬浮添加按钮
- 右下角悬浮按钮（emerald绿色）
- 支持拖拽定位
- 点击展开4个餐次选项
- 选择后跳转到"添加餐食"页面

**Wot UI实现：**
```vue
<wd-action-sheet 
  v-model="showMealOptions"
  :actions="mealActions"
  @select="handleMealSelect"
/>
```

---

### 2. 动态广场 (FeedPage)

**路径：** `/pages/feed/index.vue`

#### 功能模块

##### 2.1 顶部导航
- 左侧：页面标题"动态广场"
- 右侧：发布按钮（+ 图标）

##### 2.2 动态列表
- 无限滚动加载
- 每个动态卡片包含：
  - 用户头像
  - 用户名
  - 发布时间（相对时间，如：2小时前）
  - 文字内容
  - 话题标签（emerald绿色可点击）
  - 关联的餐食信息（渐变卡片显示）
  - 图片（九宫格布局）
  - 位置信息（可选）
  - 点赞/评论按钮

##### 2.3 交互功能
- 点赞动画（心跳效果）
- 评论（占位功能）
- 点击话题标签筛选（占位功能）
- 点击用户头像查看主页（占位功能）

**模拟数据：**
```typescript
const mockPosts = [
  {
    id: '1',
    userName: '健康达人',
    userAvatar: 'https://...',
    content: '今天的减脂餐超级满意！',
    topics: ['#减脂餐', '#健康饮食'],
    mealReference: {
      mealType: ['午餐'],
      items: [['鸡胸肉 120g', '西兰花 100g']],
      totalCalories: 335
    },
    likes: 128,
    comments: 23,
    isLiked: false,
    createdAt: '2026-01-10T12:30:00'
  }
];
```

---

### 3. 个人中心 (ProfilePage)

**路径：** `/pages/profile/index.vue`

#### 功能模块

##### 3.1 头部信息卡
- 渐变背景（emerald到teal）
- 用户头像（圆形）
- 用户名
- 身高/体重/年龄
- 右上角：主题设置按钮、个人信息设置按钮

##### 3.2 菜单列表

**Wot UI实现：**
```vue
<wd-cell-group>
  <wd-cell 
    title="餐食记录" 
    icon="list"
    is-link
    @click="navigateTo('/pages/meal-history/index')"
  />
  <wd-cell 
    title="目标设置" 
    icon="setting"
    is-link
    @click="navigateTo('/pages/goal-settings/index')"
  />
  <!-- 其他菜单项 -->
</wd-cell-group>
```

**菜单项：**
1. 📋 餐食记录 → `/pages/meal-history/index`
2. 🎯 目标设置 → `/pages/goal-settings/index`
3. ℹ️ 关于（占位）
4. 📞 联系我们（占位）

---

### 4. 添加餐食 (AddMealPage)

**路径：** `/pages/add-meal/index.vue`

#### 功能模块

##### 4.1 顶部导航
- 左侧：返回按钮
- 中间：显示餐次名称（如：添加早餐）
- 右侧：保存按钮（disabled状态）

##### 4.2 餐次选择器
- 4个标签页：早餐/午餐/晚餐/加餐
- 初始选中由首页传入的mealType决定

**Wot UI实现：**
```vue
<wd-tabs v-model="mealType">
  <wd-tab title="早餐" name="早餐" />
  <wd-tab title="午餐" name="午餐" />
  <wd-tab title="晚餐" name="晚餐" />
  <wd-tab title="加餐" name="加餐" />
</wd-tabs>
```

##### 4.3 食物选择器
- 点击"添加食物"按钮
- 弹出底部动作面板或跳转到食物选择页面
- 支持：
  - 手动搜索添加
  - 拍照识别（调用FoodSelectorPage）
  - 语音输入（占位）

##### 4.4 已选食物列表
- 显示所有已选食物
- 每项显示：名称、数量、卡路里
- 支持左滑删除或点击删除按钮
- 底部显示总计信息

**Wot UI实现：**
```vue
<wd-cell-group>
  <wd-cell 
    v-for="item in selectedFoods"
    :key="item.id"
  >
    <template #title>
      <view>{{ item.name }}</view>
      <view class="food-amount">{{ item.amount }}</view>
    </template>
    <template #right>
      <view>{{ item.calories }} kcal</view>
      <wd-button 
        type="danger" 
        size="small"
        @click="removeFood(item.id)"
      >
        删除
      </wd-button>
    </template>
  </wd-cell>
</wd-cell-group>
```

##### 4.5 备注输入
- 可选的备注文本框
- 最多140字

##### 4.6 保存逻辑
- 至少选择1个食物才能保存
- 保存后返回首页
- 更新今日营养数据

---

### 5. 餐食记录 (MealHistoryPage)

**路径：** `/pages/meal-history/index.vue`

#### 功能模块

##### 5.1 顶部导航
- 左侧：返回按钮
- 中间：标题"餐食记录"

##### 5.2 日期筛选
- 显示当前选中日期
- 点击可选择日期（日期选择器）
- 左右箭头切换日期

**Wot UI实现：**
```vue
<wd-datetime-picker 
  v-model="selectedDate"
  type="date"
  @confirm="handleDateChange"
/>
```

##### 5.3 统计卡片
- 显示当日总计：
  - 总卡路里
  - 总蛋白质
  - 总碳水
  - 总脂肪

##### 5.4 餐食列表
- 按时间倒序排列
- 分组显示（早/中/晚/加餐）
- 每条记录可点击展开查看详情
- 支持左滑删除

##### 5.5 空状态
- 无记录时显示空状态插图
- 提示"暂无餐食记录"

**Wot UI实现：**
```vue
<wd-empty description="暂无餐食记录" />
```

---

### 6. 发布动态 (CreatePostPage)

**路径：** `/pages/create-post/index.vue`

#### 功能模块

##### 6.1 顶部导航
- 左侧：取消按钮
- 中间：标题"发布动态"
- 右侧：发布按钮

##### 6.2 内容输入
- 多行文本框
- placeholder: "分享你的饮食心得..."
- 最多500字
- 右下角显示字数统计

**Wot UI实现：**
```vue
<wd-textarea 
  v-model="content"
  placeholder="分享你的饮食心得..."
  maxlength="500"
  show-word-limit
/>
```

##### 6.3 图片/视频上传
- 支持上传最多9张图片
- 显示网格预览
- 支持删除已上传图片

**Wot UI实现：**
```vue
<wd-upload 
  v-model="images"
  :max-count="9"
  multiple
/>
```

##### 6.4 话题标签
- 显示已选话题（可删除）
- 点击"添加话题"展开热门话题列表
- 支持自定义话题输入

**热门话题：**
```typescript
const popularTopics = [
  '#健康饮食', '#减脂餐', '#增肌', '#低卡',
  '#高蛋白', '#营养搭配', '#早餐', '#午餐',
  '#晚餐', '#轻食', '#健身餐', '#打卡'
];
```

##### 6.5 关联餐食
- 点击"关联餐食记录"展开近7天餐食列表
- 支持多选
- 显示已选餐食预览卡片

##### 6.6 位置信息
- 开关控制是否添加位置
- 开启时自动获取当前位置
- 显示经纬度（可选显示地址）

**Uniapp API：**
```javascript
uni.getLocation({
  type: 'gcj02',
  success: (res) => {
    this.location = {
      latitude: res.latitude,
      longitude: res.longitude
    }
  }
})
```

##### 6.7 发布逻辑
- 至少输入1个字才能发布
- 发布成功后返回动态广场
- 新动态显示在列表顶部

---

### 7. 目标设置 (GoalSettingsPage)

**路径：** `/pages/goal-settings/index.vue`

#### 功能模块

##### 7.1 顶部导航
- 左侧：返回按钮
- 中间：标题"目标设置"
- 右侧：保存按钮

##### 7.2 目标类型选择
- 3个选项：减脂、保持、增肌
- 单选按钮组
- 选择后影响推荐的卡路里目标

**Wot UI实现：**
```vue
<wd-radio-group v-model="goalType">
  <wd-radio value="lose">减脂</wd-radio>
  <wd-radio value="maintain">保持</wd-radio>
  <wd-radio value="gain">增肌</wd-radio>
</wd-radio-group>
```

##### 7.3 数值输入
- 每日目标卡路里（步进器）
- 蛋白质目标（g）
- 碳水化合物目标（g）
- 脂肪目标（g）
- 目标体重（kg）

**Wot UI实现：**
```vue
<wd-input-number 
  v-model="dailyCalories"
  :min="1000"
  :max="5000"
  :step="50"
/>
```

##### 7.4 智能推荐
- 根据身高、体重、年龄、目标类型
- 自动计算推荐值
- 显示"使用推荐值"按钮

**计算公式（基础代谢率 BMR）：**
```typescript
// 男性：BMR = 88.362 + (13.397 × 体重kg) + (4.799 × 身高cm) - (5.677 × 年龄)
// 女性：BMR = 447.593 + (9.247 × 体重kg) + (3.098 × 身高cm) - (4.330 × 年龄)

// TDEE（每日总能量消耗）= BMR × 活动系数
// 减脂：TDEE - 300~500 kcal
// 保持：TDEE
// 增肌：TDEE + 300~500 kcal
```

##### 7.5 保存逻辑
- 保存到本地存储
- 更新首页进度条目标值

---

### 8. 个人信息 (PersonalInfoPage)

**路径：** `/pages/personal-info/index.vue`

#### 功能模块

##### 8.1 顶部导航
- 左侧：返回按钮
- 中间：标题"个人信息"
- 右侧：保存按钮

##### 8.2 信息输入

**Wot UI实现：**
```vue
<wd-cell-group>
  <wd-cell title="用户名">
    <wd-input v-model="name" placeholder="请输入用户名" />
  </wd-cell>
  
  <wd-cell title="性别" is-link @click="showGenderPicker = true">
    {{ gender }}
  </wd-cell>
  
  <wd-cell title="年龄">
    <wd-input-number v-model="age" :min="1" :max="120" />
  </wd-cell>
  
  <wd-cell title="身高(cm)">
    <wd-input-number v-model="height" :min="100" :max="250" />
  </wd-cell>
  
  <wd-cell title="体重(kg)">
    <wd-input-number v-model="weight" :min="30" :max="200" :step="0.1" />
  </wd-cell>
</wd-cell-group>

<!-- 性别选择器 -->
<wd-action-sheet 
  v-model="showGenderPicker"
  :actions="[{ name: '男' }, { name: '女' }]"
  @select="handleGenderSelect"
/>
```

##### 8.3 头像上传（可选功能）
- 点击头像上传图片
- 支持相机拍照/相册选择

**Uniapp API：**
```javascript
uni.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    this.avatar = res.tempFilePaths[0]
  }
})
```

##### 8.4 BMI计算
- 根据身高体重自动计算BMI
- 显示BMI值和健康状态

```typescript
const bmi = weight / ((height / 100) ** 2);
// < 18.5: 偏瘦
// 18.5 - 23.9: 正常
// 24 - 27.9: 偏胖
// >= 28: 肥胖
```

---

### 9. 主题设置 (ThemeSettingsPage)

**路径：** `/pages/theme-settings/index.vue`

#### 功能模块

##### 9.1 顶部导航
- 左侧：返回按钮
- 中间：标题"主题设置"

##### 9.2 主题选择
- 3个选项卡片：
  - ☀️ 浅色模式
  - 🌙 深色模式
  - 🔄 跟随系统

**Wot UI实现：**
```vue
<wd-radio-group v-model="theme" direction="horizontal">
  <wd-radio value="light">
    <view class="theme-card">
      <view class="theme-preview light"></view>
      <text>浅色模式</text>
    </view>
  </wd-radio>
  
  <wd-radio value="dark">
    <view class="theme-card">
      <view class="theme-preview dark"></view>
      <text>深色模式</text>
    </view>
  </wd-radio>
  
  <wd-radio value="system">
    <view class="theme-card">
      <view class="theme-preview system"></view>
      <text>跟随系统</text>
    </view>
  </wd-radio>
</wd-radio-group>
```

##### 9.3 实时预览
- 切换主题立即生效
- 显示当前应用的主题

##### 9.4 存储逻辑
```javascript
// 保存到本地
uni.setStorageSync('theme', theme);

// 应用主题
if (theme === 'system') {
  // 检测系统主题
  const systemTheme = uni.getSystemInfoSync().theme || 'light';
  applyTheme(systemTheme);
} else {
  applyTheme(theme);
}
```

---

### 10. 食物选择器 (FoodSelectorPage)

**路径：** `/pages/food-selector/index.vue`

#### 功能模块

##### 10.1 顶部导航
- 左侧：返回按钮
- 中间：标题"选择食物"

##### 10.2 搜索功能
- 搜索框（实时搜索）
- 历史搜索记录
- 热门搜索推荐

**Wot UI实现：**
```vue
<wd-search 
  v-model="keyword"
  placeholder="搜索食物"
  @search="handleSearch"
/>
```

##### 10.3 拍照识别
- 大按钮：📸 拍照识别食物
- 点击调用相机
- 上传图片到识别API（模拟）
- 显示识别结果列表

**流程：**
1. 点击拍照按钮
2. 调用 `uni.chooseImage` 或 `uni.chooseMedia`
3. 显示loading："识别中..."
4. 模拟识别（延迟2秒）
5. 返回识别结果（3-5个食物选项）
6. 用户确认选择

**模拟识别数据：**
```typescript
const mockRecognitionResult = [
  { name: '米饭', amount: '150g', calories: 171, protein: 3, carbs: 37, fat: 0.3, confidence: 0.95 },
  { name: '鸡胸肉', amount: '120g', calories: 130, protein: 28, carbs: 0, fat: 1.5, confidence: 0.88 },
  { name: '西兰花', amount: '100g', calories: 34, protein: 3, carbs: 7, fat: 0.4, confidence: 0.82 }
];
```

##### 10.4 食物数据库
- 分类展示：
  - 主食
  - 肉类
  - 蔬菜
  - 水果
  - 零食
  - 饮料

**示例数据：**
```typescript
const foodDatabase = {
  '主食': [
    { name: '米饭', unit: 'g', defaultAmount: 150, calories_per_100g: 116 },
    { name: '面条', unit: 'g', defaultAmount: 200, calories_per_100g: 138 },
    // ...
  ],
  '肉类': [
    { name: '鸡胸肉', unit: 'g', defaultAmount: 100, calories_per_100g: 133 },
    { name: '牛肉', unit: 'g', defaultAmount: 100, calories_per_100g: 125 },
    // ...
  ]
};
```

##### 10.5 选择逻辑
- 点击食物后弹出数量输入框
- 输入数量后确认
- 返回到"添加餐食"页面

---

## 交互动效

### 1. 页面过渡动画

**Uniapp配置 (pages.json):**
```json
{
  "globalStyle": {
    "navigationStyle": "custom",
    "animationType": "pop-in",
    "animationDuration": 300
  }
}
```

### 2. 组件动画

#### 2.1 悬浮按钮展开
- 主按钮旋转45度
- 子按钮从下往上依次弹出
- 使用CSS transition或Vue transition

```vue
<transition-group name="fab">
  <view 
    v-for="(option, index) in mealOptions"
    :key="option.type"
    :style="{ transitionDelay: `${index * 50}ms` }"
  >
    <!-- 按钮内容 -->
  </view>
</transition-group>

<style>
.fab-enter-active, .fab-leave-active {
  transition: all 0.3s ease;
}
.fab-enter-from {
  transform: scale(0) translateY(20px);
  opacity: 0;
}
</style>
```

#### 2.2 点赞动画
- 心形图标放大缩小
- 颜色从灰色变为红色

```vue
<view 
  class="like-btn"
  :class="{ 'is-liked': isLiked }"
  @tap="handleLike"
>
  <wd-icon name="like-filled" />
</view>

<style>
.like-btn.is-liked {
  animation: heartbeat 0.6s ease;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
}
</style>
```

#### 2.3 进度条动画
- 数字滚动效果（可选）
- 进度条填充动画

```vue
<wd-progress 
  :percentage="percentage"
  :duration="800"
  :ease="'ease-out'"
/>
```

#### 2.4 列表展开/收起
- 食物详情列表
- 使用Vue transition

```vue
<transition name="expand">
  <view v-if="expanded" class="food-details">
    <!-- 详情内容 -->
  </view>
</transition>

<style>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>
```

### 3. 加载状态

#### 3.1 页面加载
```vue
<wd-loading v-if="loading" type="circular" />
```

#### 3.2 上拉加载更多
```vue
<scroll-view 
  @scrolltolower="loadMore"
  lower-threshold="50"
>
  <!-- 列表内容 -->
  <view v-if="loadingMore" class="loading-more">
    <wd-loading size="small" />
    <text>加载中...</text>
  </view>
</scroll-view>
```

#### 3.3 下拉刷新
```vue
<scroll-view 
  refresher-enabled
  :refresher-triggered="refreshing"
  @refresherrefresh="onRefresh"
>
  <!-- 列表内容 -->
</scroll-view>
```

---

## 路由配置

### pages.json 配置

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "食刻轻卡",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/feed/index",
      "style": {
        "navigationBarTitleText": "动态广场",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/profile/index",
      "style": {
        "navigationBarTitleText": "我的",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/add-meal/index",
      "style": {
        "navigationBarTitleText": "添加餐食",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/meal-history/index",
      "style": {
        "navigationBarTitleText": "餐食记录",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/create-post/index",
      "style": {
        "navigationBarTitleText": "发布动态",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/goal-settings/index",
      "style": {
        "navigationBarTitleText": "目标设置",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/personal-info/index",
      "style": {
        "navigationBarTitleText": "个人信息",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/theme-settings/index",
      "style": {
        "navigationBarTitleText": "主题设置",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/food-selector/index",
      "style": {
        "navigationBarTitleText": "选择食物",
        "navigationStyle": "custom"
      }
    }
  ],
  "tabBar": {
    "color": "#6b7280",
    "selectedColor": "#10b981",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/icons/home.png",
        "selectedIconPath": "static/icons/home-active.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/feed/index",
        "iconPath": "static/icons/feed.png",
        "selectedIconPath": "static/icons/feed-active.png",
        "text": "动态"
      },
      {
        "pagePath": "pages/profile/index",
        "iconPath": "static/icons/profile.png",
        "selectedIconPath": "static/icons/profile-active.png",
        "text": "我的"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "食刻轻卡",
    "navigationBarBackgroundColor": "#ffffff",
    "backgroundColor": "#f9fafb"
  }
}
```

---

## Uniapp环境搭建

### 1. 创建项目

```bash
# 使用 HBuilderX 创建项目
# 或使用 Vue CLI 创建
npx degit dcloudio/uni-preset-vue#vite-ts my-project
cd my-project
npm install
```

### 2. 安装 Wot UI

```bash
npm install wot-design-uni
```

### 3. 配置 Wot UI

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [
    uni(),
  ],
  transpileDependencies: ['wot-design-uni']
});
```

**main.ts:**
```typescript
import { createSSRApp } from 'vue';
import App from './App.vue';
import WotUI from 'wot-design-uni';
import 'wot-design-uni/dist/style.css';

export function createApp() {
  const app = createSSRApp(App);
  app.use(WotUI);
  return {
    app
  };
}
```

### 4. 安装 Pinia（状态管理）

```bash
npm install pinia
```

**main.ts 添加：**
```typescript
import { createPinia } from 'pinia';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  
  app.use(WotUI);
  app.use(pinia);
  
  return {
    app,
    pinia
  };
}
```

### 5. TypeScript 类型定义

**types/index.ts:**
```typescript
// 复制前面"数据结构"部分的所有接口定义
```

### 6. Pinia Store 示例

**stores/meal.ts:**
```typescript
import { defineStore } from 'pinia';
import type { MealRecord, DailyNutrition } from '@/types';

export const useMealStore = defineStore('meal', {
  state: () => ({
    meals: [] as MealRecord[],
    todayNutrition: {
      date: '',
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: []
    } as DailyNutrition
  }),
  
  getters: {
    todayMeals: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.meals.filter(meal => meal.date === today);
    }
  },
  
  actions: {
    addMeal(meal: MealRecord) {
      this.meals.push(meal);
      this.updateTodayNutrition();
      uni.setStorageSync('meals', this.meals);
    },
    
    deleteMeal(id: string) {
      this.meals = this.meals.filter(meal => meal.id !== id);
      this.updateTodayNutrition();
      uni.setStorageSync('meals', this.meals);
    },
    
    updateTodayNutrition() {
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = this.todayMeals;
      
      this.todayNutrition = {
        date: today,
        totalCalories: todayMeals.reduce((sum, m) => sum + m.totalCalories, 0),
        totalProtein: todayMeals.reduce((sum, m) => sum + m.totalProtein, 0),
        totalCarbs: todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0),
        totalFat: todayMeals.reduce((sum, m) => sum + m.totalFat, 0),
        meals: todayMeals
      };
    },
    
    loadFromStorage() {
      const meals = uni.getStorageSync('meals');
      if (meals) {
        this.meals = meals;
        this.updateTodayNutrition();
      }
    }
  }
});
```

**stores/theme.ts:**
```typescript
import { defineStore } from 'pinia';
import type { Theme } from '@/types';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'system' as Theme,
    effectiveTheme: 'light' as 'light' | 'dark'
  }),
  
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme;
      this.applyTheme();
      uni.setStorageSync('theme', theme);
    },
    
    applyTheme() {
      let applied: 'light' | 'dark' = 'light';
      
      if (this.theme === 'system') {
        const systemInfo = uni.getSystemInfoSync();
        applied = systemInfo.theme === 'dark' ? 'dark' : 'light';
      } else {
        applied = this.theme;
      }
      
      this.effectiveTheme = applied;
      
      // 应用到页面
      // Wot UI 深色模式：在根元素添加 class="dark"
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      // 根据UI库文档设置深色模式
    },
    
    loadFromStorage() {
      const theme = uni.getStorageSync('theme');
      if (theme) {
        this.theme = theme;
        this.applyTheme();
      }
    }
  }
});
```

---

## 开发建议

### 1. 分阶段开发

**Phase 1: 基础架构（1-2天）**
- ✅ 创建Uniapp项目
- ✅ 配置Wot UI
- ✅ 搭建Pinia Store
- ✅ 配置路由和TabBar
- ✅ 实现主题切换

**Phase 2: 核心页面（3-5天）**
- ✅ 首页（进度条、餐食列表）
- ✅ 添加餐食页面
- ✅ 个人中心页面
- ✅ 餐食记录页面

**Phase 3: 社交功能（2-3天）**
- ✅ 动态广场页面
- ✅ 发布动态页面

**Phase 4: 设置页面（1-2天）**
- ✅ 目标设置
- ✅ 个人信息
- ✅ 主题设置

**Phase 5: 高级功能（2-3天）**
- ✅ 食物拍照识别
- ✅ 数据统计图表
- ✅ 动画优化

**Phase 6: 测试打包（1-2天）**
- ✅ 多平台测试
- ✅ 性能优化
- ✅ 打包发布

### 2. 注意事项

#### 2.1 跨平台兼容
- 使用Uniapp的条件编译处理平台差异
```vue
<!-- #ifdef MP-WEIXIN -->
<view>微信小程序专用</view>
<!-- #endif -->

<!-- #ifdef H5 -->
<view>H5专用</view>
<!-- #endif -->
```

#### 2.2 单位适配
- 使用rpx作为单位（750rpx = 屏幕宽度）
- 1px (Tailwind) ≈ 2rpx (Uniapp)

#### 2.3 API差异
- 使用`uni.xxx`替代浏览器API
- localStorage → `uni.setStorageSync`
- fetch → `uni.request`

#### 2.4 性能优化
- 长列表使用虚拟滚动
- 图片懒加载
- 分页加载数据

### 3. 测试清单

- [ ] 微信小程序真机测试
- [ ] H5浏览器测试
- [ ] Android App测试
- [ ] iOS App测试
- [ ] 深色模式测试
- [ ] 网络异常测试
- [ ] 数据持久化测试

---

## 附录

### A. 快速参考

**Wot UI 常用组件：**
- Button: `<wd-button type="primary">`
- Input: `<wd-input v-model="value">`
- Cell: `<wd-cell title="标题" is-link>`
- Tabs: `<wd-tabs v-model="active">`
- Popup: `<wd-popup v-model="show">`
- Toast: `useToast().show('提示')`

**Uniapp 常用API：**
- 导航: `uni.navigateTo({ url: '/pages/xxx' })`
- 返回: `uni.navigateBack()`
- 存储: `uni.setStorageSync('key', value)`
- 请求: `uni.request({ url, method, data })`
- 选择图片: `uni.chooseImage({})`
- 获取位置: `uni.getLocation({})`

### B. 资源链接

- **Wot UI 文档：** https://wot-ui.cn/
- **Uniapp 文档：** https://uniapp.dcloud.net.cn/
- **Pinia 文档：** https://pinia.vuejs.org/
- **Vue 3 文档：** https://cn.vuejs.org/

### C. 联系支持

如有问题，请参考：
1. 本迁移指南
2. Wot UI官方文档
3. Uniapp社区论坛

---

**文档版本：** v1.0  
**更新日期：** 2026-01-10  
**适用项目：** 食刻轻卡 Uniapp版

---

## 🎉 祝开发顺利！

这份指南涵盖了从React迁移到Uniapp + Wot UI所需的所有信息。按照文档逐步实现，您将能够完整复现"食刻轻卡"的所有功能，并支持多平台发布。
