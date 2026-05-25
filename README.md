# 💒 婚礼电子请柬

一个精美的婚礼电子请柬应用，使用 Taro 框架开发，支持微信小程序和 Web 端。

## ✨ 特性

- 🎨 **极简线条风格** - 手绘涂鸦风格配合极简主义设计
- 📱 **多端适配** - 微信小程序 + Web 端
- 🎵 **背景音乐** - 自动循环播放浪漫音乐
- 📖 **Scrollytelling** - 丝滑的滚动叙事体验
- 🗺️ **腾讯地图** - 内置地图导航
- 📝 **宾客表单** - 完整的 RSVP 表单系统
- ☁️ **Cloudflare 后端** - Workers API + D1 数据库 + R2 CDN（可选腾讯云短信）

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev:weapp

# H5/Web
pnpm dev:h5
```

### 构建生产版本

```bash
# 微信小程序
pnpm build:weapp

# H5/Web
pnpm build:h5
```

## 📁 项目结构

```
wedding-invitation/
├── src/
│   ├── components/       # 可复用组件
│   ├── hooks/            # 自定义 Hooks
│   ├── pages/            # 页面组件
│   ├── constants/        # Cloudflare 等配置
│   └── utils/            # 工具函数
├── infra/cloudflare/     # Cloudflare Worker + D1 + R2
├── assets/               # 静态资源（上传至 R2）
└── scripts/              # R2 上传脚本等
```

## ☁️ Cloudflare 部署

宾客回函、静态资源 CDN 均运行在 Cloudflare。详见 [infra/cloudflare/SETUP.md](infra/cloudflare/SETUP.md)。

```bash
# 1. 部署 Worker（API + CDN 代理）
pnpm deploy:cloudflare

# 2. 上传 assets/ 到 R2
pnpm upload:r2-assets

# 3. 配置 src/constants/cloudflare.ts 中的 CLOUDFLARE_PUBLIC_BASE_URL
pnpm build:weapp
```

## 📱 微信小程序配置

### 1. 修改 project.config.json

更新 `appid` 为你的小程序 AppID。

### 2. 配置域名白名单

在微信公众平台配置 Cloudflare Worker 域名（request + downloadFile 合法域名），以及腾讯地图 API 域名。

## 🗺️ 腾讯地图配置

1. 在 [腾讯位置服务](https://lbs.qq.com/) 申请开发者密钥
2. 在 `.env` 文件中配置 `TENCENT_MAP_KEY`
3. 在微信公众平台配置地图域名白名单

## 📄 开源协议

MIT License

## 👨‍💻 开发者

为刘兆薰 & 高文珩 的婚礼精心制作
