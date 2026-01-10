# 部署指南

## 📋 前置准备

### 1. 环境配置

#### 微信小程序
```bash
# 1. 下载并安装微信开发者工具
# 官网: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 2. 安装 uni-app CLI (可选，如果使用 HBuilderX 可跳过)
npm install -g @dcloudio/uni-cli

# 3. 构建小程序代码
cd uniapp-project
npm run build:mp-weixin
```

#### H5 部署
```bash
# 1. 构建 H5 代码
npm run build:h5

# 2. 部署到服务器
# dist/build/h5 目录下的文件可直接部署
```

#### App 打包
```bash
# 1. 使用 HBuilderX
#   - 打开项目
#   - 发行 -> 原生App-云打包
#   - 配置证书和应用信息
#   - 点击打包

# 2. 或使用 uni-app CLI
npm run build:app
```

## 🚀 各平台部署步骤

### 微信小程序

#### 方式一：使用 HBuilderX
1. 打开 HBuilderX
2. 文件 -> 打开目录 -> 选择 `uniapp-project`
3. 运行 -> 运行到小程序模拟器 -> 微信开发者工具
4. 在微信开发者工具中点击"上传"
5. 填写版本号和项目备注

#### 方式二：手动上传
```bash
# 1. 构建项目
npm run build:mp-weixin

# 2. 打开微信开发者工具
# 3. 导入项目 -> 选择 dist/build/mp-weixin
# 4. 上传代码
```

#### 微信小程序配置
在 `manifest.json` 中配置：
```json
{
  "mp-weixin": {
    "appid": "你的小程序AppID",
    "usingComponents": true,
    "requiredBackgroundModes": ["audio", "location"],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于计算运动消耗"
      },
      "scope.camera": {
        "desc": "用于拍照识别食物"
      }
    }
  }
}
```

### H5 部署

#### 开发环境
```bash
npm run dev:h5
# 访问 http://localhost:5173
```

#### 生产环境
```bash
# 1. 构建
npm run build:h5

# 2. dist/build/h5 目录即为部署文件

# 3. 部署到 Nginx
# 配置示例：
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/build/h5;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 部署到 Vercel
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
cd dist/build/h5
vercel --prod
```

#### 部署到 GitHub Pages
```bash
# 1. 构建
npm run build:h5

# 2. 初始化 git
cd dist/build/h5
git init
git add .
git commit -m "Initial commit"

# 3. 创建 gh-pages 分支并推送
git checkout -b gh-pages
git push origin gh-pages

# 4. 在 GitHub 仓库设置中启用 GitHub Pages
#    Source: gh-pages branch, / (root)
```

### App 打包

#### iOS 打包
1. **准备工作**
   - Apple 开发者账号 ($99/年)
   - 证书和描述文件
   - Xcode

2. **使用 HBuilderX**
   - 发行 -> 原生App-云打包
   - 平台: iOS
   - 打包类型: 标准打包
   - 证书配置: 上传证书文件
   - 点击"打包"

3. **上传到 App Store**
   - 使用 Transporter 应用上传 .ipa 文件
   - 在 App Store Connect 中配置应用信息
   - 提交审核

#### Android 打包
1. **准备工作**
   - Keystore 证书 (可使用 HBuilderX 生成)

2. **使用 HBuilderX**
   - 发行 -> 原生App-云打包
   - 平台: Android
   - 打包类型: 标准打包
   - 证书配置: 选择或生成 keystore
   - 点击"打包"

3. **发布到应用商店**
   - 华为应用市场
   - 小米应用商店
   - OPPO 软件商店
   - vivo 应用商店
   - 应用宝

### 其他小程序平台

#### 支付宝小程序
```bash
npm run build:mp-alipay
# 在支付宝开发者工具中打开 dist/build/mp-alipay
```

#### 百度小程序
```bash
npm run build:mp-baidu
# 在百度开发者工具中打开 dist/build/mp-baidu
```

#### 字节小程序
```bash
npm run build:mp-toutiao
# 在字节开发者工具中打开 dist/build/mp-toutiao
```

## 🔧 环境变量配置

### 开发环境 vs 生产环境

创建 `.env.development` 和 `.env.production` 文件：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

在代码中使用：
```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

## 📦 性能优化

### 1. 代码分割
```typescript
// 路由懒加载
const AddMeal = () => import('@/pages/add-meal/index.vue');
```

### 2. 图片优化
- 使用 WebP 格式
- 压缩图片资源
- 使用 CDN 加速

### 3. Tree Shaking
Vite 自动启用，确保只导入需要的内容

### 4. Gzip 压缩
```bash
# H5 部署时启用 gzip
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## 🔍 监控与错误追踪

### Sentry 集成
```typescript
import * as Sentry from '@sentry/vue';

Sentry.init({
  app,
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### 性能监控
```typescript
// 在 main.ts 中
import { usePerformance } from '@/utils/performance';

if (import.meta.env.PROD) {
  usePerformance();
}
```

## 🛡️ 安全建议

### 1. API 安全
- 使用 HTTPS
- 实现 JWT 认证
- 防止 XSS 攻击
- 防止 CSRF 攻击

### 2. 数据安全
- 敏感数据加密存储
- 定期清理本地缓存
- 实现数据备份机制

### 3. 隐私合规
- 遵守 GDPR/CCPA
- 明确隐私政策
- 用户授权管理

## 📊 发布检查清单

### 发布前检查
- [ ] 所有功能测试通过
- [ ] 性能测试达标
- [ ] 兼容性测试完成
- [ ] 错误边界处理完善
- [ ] 网络异常处理
- [ ] 离线功能正常
- [ ] 数据持久化正常
- [ ] 主题切换正常
- [ ] 国际化支持（如需要）
- [ ] 隐私政策已更新
- [ ] 用户协议已更新
- [ ] 应用图标和截图已准备

### 微信小程序额外检查
- [ ] 已配置 AppID
- [ ] 已设置服务器域名
- [ ] 已申请必要权限
- [ ] 已提交审核

### H5 额外检查
- [ ] SEO 优化
- [ ] 站点地图
- [ ] Analytics 集成
- [ ] PWA 支持（可选）

### App 额外检查
- [ ] 应用图标已准备
- [ ] 启动图已准备
- [ ] 权限说明已完善
- [ ] 隐私政策已提交审核

## 🔄 持续集成/持续部署 (CI/CD)

### GitHub Actions 示例

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build H5
      run: npm run build:h5

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🆘 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存
rm -rf node_modules
rm package-lock.json
npm install

# 或
npm run clean
npm install
```

#### 2. 小程序上传失败
- 检查 AppID 配置
- 检查服务器域名白名单
- 检查代码包大小限制 (2MB)

#### 3. H5 路由问题
- 确保服务器配置了 history 模式回退
- 检查 base URL 配置

#### 4. App 打包失败
- 检查证书是否过期
- 检查包名是否冲突
- 检查权限配置

## 📞 技术支持

如有问题，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 查看官方文档

---

**注意**: 本指南会随着项目更新而持续完善。