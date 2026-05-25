# 基础设施

后端与 CDN 已迁移至 **Cloudflare**（Workers + D1 + R2）。

完整部署步骤见 **[cloudflare/SETUP.md](./cloudflare/SETUP.md)**。

## 快速命令

```bash
# 部署 API + CDN Worker
pnpm deploy:cloudflare

# 上传 assets/ 到 R2
pnpm upload:r2-assets

# D1 数据库迁移
pnpm db:migrate
```

## 小程序配置

部署后编辑 `src/constants/cloudflare.ts` 中的 `CLOUDFLARE_PUBLIC_BASE_URL`，并在微信公众平台配置该域名为合法域名。
