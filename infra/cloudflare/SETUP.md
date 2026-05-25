# Cloudflare 部署指南

后端与静态资源全部运行在 Cloudflare：

| 组件 | Cloudflare 服务 |
|------|----------------|
| 宾客表单 API | Workers (`POST /api/guest-form`) |
| 数据库 | D1 (`wedding-guests` 表) |
| 图片\资源 CDN | R2 + Worker 代理 (`GET /assets/*`) |
| 短信（可选） | 腾讯云 SMS（Worker secrets） |

---

## 1. 前置条件

```bash
npm i -g wrangler
wrangler login
cd infra/cloudflare && pnpm install
```

---

## 2. 创建 D1 与 R2

```bash
cd infra/cloudflare

# D1 数据库
wrangler d1 create wedding-guests
# 复制输出的 database_id 到 wrangler.toml

# R2 存储桶
wrangler r2 bucket create wedding-assets
```

编辑 `wrangler.toml`，填入 `database_id`。

运行迁移：

```bash
pnpm db:migrate
```

---

## 3. 部署 Worker

```bash
pnpm deploy
```

记下输出的 URL，例如 `https://wedding-invitation.your-subdomain.workers.dev`。

（推荐）在 Cloudflare 控制台绑定自定义域名，例如 `https://wedding.example.com`。

---

## 4. 上传静态资源到 R2

在项目根目录：

```bash
pnpm upload:r2-assets
```

脚本会把 `assets/` 下所有文件上传到 R2，路径为 `assets/images/...` 等。

验证：浏览器打开  
`https://YOUR_WORKER_URL/assets/images/homepage-niu.png`

---

## 5. 配置小程序 / H5

编辑 `src/constants/cloudflare.ts`：

```typescript
export const CLOUDFLARE_PUBLIC_BASE_URL =
  "https://wedding-invitation.your-subdomain.workers.dev";
```

重新构建：

```bash
pnpm build:weapp
```

---

## 6. 微信公众平台域名白名单

在 [微信公众平台](https://mp.weixin.qq.com) → **开发 → 开发管理 → 开发设置 → 服务器域名**，添加 Worker 域名（不含路径）：

- **request 合法域名**
- **downloadFile 合法域名**（图片、字体、音乐）

开发阶段可在开发者工具 **详情 → 本地设置** 勾选「不校验合法域名」。

---

## 7. 可选：腾讯云短信

```bash
cd infra/cloudflare
wrangler secret put SMS_SECRET_ID
wrangler secret put SMS_SECRET_KEY
wrangler secret put SMS_SDK_APP_ID
wrangler secret put SMS_SIGN_NAME
wrangler secret put SMS_TEMPLATE_ID
# wrangler secret put SMS_REGION   # 默认 ap-guangzhou
```

未配置时表单仍可提交，只是不发短信。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm deploy:cloudflare` | 部署 Worker |
| `pnpm upload:r2-assets` | 上传 assets 到 R2 |
| `pnpm db:migrate` | 远程 D1 迁移 |

---

## 故障排查

| 现象 | 处理 |
|------|------|
| 图片/字体 404 | 确认 R2 已上传且 URL 为 `/assets/...` |
| 表单提交失败 | 检查 `CLOUDFLARE_PUBLIC_BASE_URL` 与 request 合法域名 |
| D1 报错 | 运行 `pnpm db:migrate` |
| 短信未发送 | 检查 wrangler secrets 与模板 ID |
