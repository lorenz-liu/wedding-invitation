# Lorenz & Giselle 婚礼请柬

使用 Taro 框架开发，支持微信小程序和 Web 端。

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
│   ├── constants/        # 阿里云等配置
│   └── utils/            # 工具函数
├── infra/                # 阿里云部署文档与 FC 代码
├── assets/               # 静态资源（上传至 OSS）
└── scripts/              # OSS 上传脚本等
```

## ☁️ 阿里云部署

宾客回函、静态资源 CDN 均运行在阿里云（cn-chengdu）。详见 [infra/README.md](infra/README.md)。

```bash
# 1. 创建 Tablestore 表
pnpm db:init-tablestore

# 2. 上传 assets/ 到 OSS
pnpm upload:oss-assets

# 3. 部署函数计算
pnpm deploy:aliyun

# 4. 配置 src/constants/aliyun.ts 中的 ALIYUN_FC_BASE_URL
pnpm build:weapp
```

## 📱 微信小程序配置

### 1. 修改 project.config.json

更新 `appid` 为你的小程序 AppID。

### 2. 配置域名白名单

在微信公众平台配置函数计算域名（request）与 OSS 域名（downloadFile 合法域名），以及腾讯地图 API 域名。

## 🗺️ 腾讯地图配置

1. 在 [腾讯位置服务](https://lbs.qq.com/) 申请开发者密钥
2. 在 `.env` 文件中配置 `TENCENT_MAP_KEY`
3. 在微信公众平台配置地图域名白名单
