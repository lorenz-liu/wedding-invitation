# 💒 婚礼电子请柬

一个精美的婚礼电子请柬应用，使用 Taro 框架开发，支持微信小程序和 Web 端。

## ✨ 特性

- 🎨 **极简线条风格** - 手绘涂鸦风格配合极简主义设计
- 📱 **多端适配** - 微信小程序 + Web 端
- 🎵 **背景音乐** - 自动循环播放浪漫音乐
- 📖 **Scrollytelling** - 丝滑的滚动叙事体验
- 🗺️ **腾讯地图** - 内置地图导航
- 📝 **宾客表单** - 完整的 RSVP 表单系统
- ☁️ **AWS 后端** - DynamoDB + SNS 短信通知

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
│   ├── assets/           # 静态资源（字体、音乐、图片）
│   ├── components/       # 可复用组件
│   │   ├── AudioControl/    # 音乐控制按钮
│   │   └── DoodleElements/  # 手绘装饰元素
│   ├── hooks/          # 自定义 Hooks
│   │   ├── useAudio.ts      # 背景音乐管理
│   │   └── useScrollPage.ts # 页面滚动控制
│   ├── pages/          # 页面组件
│   │   └── index/
│   │       └── components/  # 12个故事页面
│   ├── styles/         # 全局样式
│   └── utils/          # 工具函数
├── aws/                # AWS CloudFormation 配置
│   └── template.yaml   # 基础设施即代码
├── fonts/              # 字体文件（已复制到 src/assets）
├── music/              # 背景音乐（已复制到 src/assets）
└── types/              # TypeScript 类型定义
```

## 🎨 字体说明

本项目使用以下自定义字体：

- **thin-black** - 主要正文和标题
- **bordered** - "我们的故事"等大标题
- **childhood** - 时间线故事文字
- **hand-writing-bold** - 强调文字和邀请语
- **hand-writing-thin** - 日程安排说明文字

## 📄 页面内容

1. **首页** - 新人姓名、日期、邀请语
2. **我们的故事** - 章节标题页
3. **2001年** - 新郎新娘出生
4. **2001-2019** - 青梅竹马时光
5. **2019年7月25日** - 确定关系
6. **2019-2023** - 跨越距离
7. **2023年10月14日** - 多伦多团聚
8. **2023-2026** - 共同生活
9. **七年里程碑** - 婚礼日期
10. **当日安排** - 时间表
11. **婚礼地点** - 地图和导航
12. **宾客表单** - RSVP 表单

## ☁️ AWS 部署

### 1. 配置 AWS CLI

确保已安装并配置 AWS CLI：

```bash
aws configure
```

### 2. 部署 CloudFormation 栈

```bash
cd aws
aws cloudformation create-stack \
  --stack-name wedding-invitation-prod \
  --template-body file://template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=prod \
  --capabilities CAPABILITY_IAM
```

### 3. 获取 API 端点

部署完成后，获取 Lambda 函数 URL：

```bash
aws cloudformation describe-stacks \
  --stack-name wedding-invitation-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

### 4. 更新前端配置

将获取的 API 端点更新到 `src/pages/index/components/PageForm.tsx` 中的 `API_ENDPOINT` 变量。

## 🎵 音乐文件说明

背景音乐文件 `our-love.mp3` 已放置在 `src/assets/music/` 目录中。

对于微信小程序，由于分包大小限制，建议：
1. 使用微信云存储托管音乐文件
2. 在 `app.tsx` 中更新为云存储 URL

## 📱 微信小程序配置

### 1. 修改 project.config.json

更新 `appid` 为你的小程序 AppID。

### 2. 配置域名白名单

在微信公众平台配置以下合法域名：
- AWS Lambda 函数 URL
- 腾讯地图 API 域名

## 🗺️ 腾讯地图配置

1. 在 [腾讯位置服务](https://lbs.qq.com/) 申请开发者密钥
2. 在 `.env` 文件中配置 `TENCENT_MAP_KEY`
3. 在微信公众平台配置地图域名白名单

## 🔧 开发注意事项

### 字体加载

首次加载时字体可能闪烁，这是正常现象。字体文件较大（总计约 50MB），在生产环境建议使用：
- 字体子集化
- CDN 托管
- 渐进式加载

### 音频自动播放

由于浏览器和微信的限制，音频需要在用户交互后才能自动播放。请确保在首次点击或触摸后音乐开始播放。

### 样式适配

项目使用 viewport 单位适配不同屏幕，关键断点：
- 移动端：< 480px
- 平板：480px - 768px
- 桌面：> 768px

## 📄 开源协议

MIT License

## 👨‍💻 开发者

为刘兆薰 & 高文珩 的婚礼精心制作

---

有任何问题或建议，欢迎提交 Issue 或 Pull Request！
