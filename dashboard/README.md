# Wedding Guest Dashboard

本地用的宾客 / 涂鸦查看面板，与 Taro 微信小程序**完全隔离**。

## 本地快速开始（推荐）

前提：已在本机配置过阿里云 CLI（与部署小程序后端相同）：

```bash
aliyun configure --mode OAuth --profile wedding
aliyun sts GetCallerIdentity --profile wedding   # 确认登录有效
```

然后（依赖与仓库根目录小程序**独立**，`pnpm install` 只更新 `dashboard/pnpm-lock.yaml`）：

```bash
cd dashboard
pnpm install    # 首次
pnpm dev
```

浏览器打开 **http://localhost:3000** 即可，**无需设置 `DASHBOARD_PASSWORD`**，也**无需** `.env.local`（Tablestore / OSS 地址已内置默认值）。

凭证会自动从 `aliyun configure get --profile wedding` 读取（与仓库根目录脚本相同）。

## 可选配置

复制 `.env.example` → `.env.local`，仅在需要时修改：

| 变量 | 本地是否需要 |
|------|----------------|
| `DASHBOARD_PASSWORD` | 否（不设则跳过登录） |
| `TABLESTORE_*` / `DRAWINGS_*` | 否（有默认值） |
| `ALIBABA_CLOUD_*` | 否（用 CLI profile 即可） |
| `ALIBABA_CLOUD_PROFILE` | 否（默认 `wedding`） |

## 功能

- 参加总人数（主联络人 + 随行）、涂鸦数量统计
- 按主联络人列表，展开查看随行人员、出行信息、涂鸦图片
- 搜索姓名 / 电话 / 微信 / 备注等

## 数据在哪

- 答函：**Tablestore** `guests` 表
- 涂鸦：**OSS** `guest-drawings` 桶，路径 `{guestId}/{drawingId}.png`

## 故障排查

| 现象 | 处理 |
|------|------|
| 加载失败 / credentials | 重新 `aliyun configure --mode OAuth --profile wedding` |
| OAuth 过期 | 再跑一次 `GetCallerIdentity` 刷新 STS |
| 看不到涂鸦 | 确认 RAM 账号有 `guest-drawings` 桶读权限 |

本工具仅供本机查看，请勿暴露到公网。
