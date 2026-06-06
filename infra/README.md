# 阿里云基础设施

婚礼请柬小程序的后端与静态资源 CDN 均部署在阿里云（Region **`cn-chengdu`**）。本目录只包含阿里云相关配置与函数代码。

```
infra/
└── aliyun/
    ├── s.yaml          # Serverless Devs 部署配置（FC 3.0）
    ├── SETUP.md        # 补充说明（详细 API / 故障排查）
    └── fc/             # 函数计算源码（宾客表单 API）
```

项目根目录的脚本负责 Tablestore 建表与 OSS 上传：

| 脚本 | 命令 |
|------|------|
| `scripts/init-tablestore.mjs` | `pnpm db:init-tablestore` |
| `scripts/upload-oss-assets.mjs` | `pnpm upload:oss-assets` |
| `scripts/upload-oss-file.mjs` | `pnpm upload:oss-file <path>` |
| `scripts/aliyun-credentials.mjs` | 凭据解析（OAuth / CloudShell / RAM 角色） |

小程序侧配置在 `src/constants/aliyun.ts`。

---

## 资源清单

| 组件 | 阿里云服务 | 名称 / 地址 |
|------|-----------|-------------|
| 宾客表单 API | 函数计算 FC 3.0 | 函数名 `wedding-invitation-api` |
| 数据库 | 表格存储 Tablestore | 实例 `wedding`，表 `guests` |
| 静态资源 CDN | 对象存储 OSS | 桶 `wedding-asset`（公共读） |

固定 endpoint / URL：

| 用途 | 值 |
|------|-----|
| Tablestore endpoint | `https://wedding.cn-chengdu.ots.aliyuncs.com` |
| OSS 公共访问前缀 | `https://wedding-asset.oss-cn-chengdu.aliyuncs.com/assets/` |
| FC 公网地址 | 部署后在控制台复制，写入 `src/constants/aliyun.ts` |

账号 UID：`1750002506010471`

---

## 身份认证（无需长期 AccessKey）

阿里云不建议创建 RAM 长期 AccessKey。本项目通过 **默认凭据链** 自动读取凭证。

### 本地开发（推荐）

```bash
npm i -g @alicloud/cli
aliyun configure --mode OAuth --profile wedding
```

脚本**默认使用 profile `wedding`**，无需 `export ALIBABA_CLOUD_PROFILE`。  
也可显式指定：`pnpm db:init-tablestore -- --profile wedding`（pnpm 需在 `--` 后传参）。

本地脚本通过 `aliyun configure get` 读取 OAuth 临时 STS 凭证（需已安装 `aliyun` CLI）。

验证：

```bash
aliyun sts GetCallerIdentity --profile wedding
```

### 其他方式

| 方式 | 说明 |
|------|------|
| [CloudShell](https://shell.aliyun.com/) | 控制台登录即可，无需 `aliyun configure` |
| 云 SSO | `aliyun configure --mode CloudSSO` |
| FC 运行时 | 为函数绑定 **RAM 角色**，不在环境变量写 AccessKey |

当前身份需具备：Tablestore 读写、OSS 桶读写、FC 部署权限。

### `--profile` 参数

| 优先级 | 方式 |
|--------|------|
| 1 | 命令行 `--profile NAME` |
| 2 | 环境变量 `ALIBABA_CLOUD_PROFILE`（可选） |
| 3 | 本项目默认 **`wedding`** |

示例（pnpm 需在 `--` 后传脚本参数）：

```bash
pnpm db:init-tablestore
pnpm upload:oss-assets -- --profile wedding
pnpm upload:oss-file -- --profile wedding images/foo.png
```

---

## 一次性初始化（首次部署）

在**项目根目录**执行，按顺序完成以下步骤。

### 1. 安装工具与项目依赖

```bash
pnpm install

npm i -g @alicloud/cli   # 可选，也可只用 brew 等方式安装 aliyun
aliyun configure --mode OAuth --profile wedding

# 首次部署前：同步 OAuth → Serverless Devs
pnpm s:config
s config add    # 若不用 OAuth，也可交互式配置 AccessKey
```

### 2. 验证登录（本地）

```bash
aliyun sts GetCallerIdentity --profile wedding
```

### 3. 创建 Tablestore 表

```bash
pnpm db:init-tablestore
# 或显式：pnpm db:init-tablestore -- --profile wedding
```

创建宽表 `guests`，主键 `id` (STRING)。表已存在时会跳过。

### 4. 配置 OSS 跨域（控制台，一次性）

OSS 控制台 → 桶 **`wedding-asset`** → **数据安全** → **跨域设置**：

| 项 | 值 |
|----|-----|
| 来源 | `*` |
| Methods | `GET`, `HEAD` |
| Allow-Headers | `*` |

微信小程序 `loadFontFace` 加载字体依赖此项。

### 4.1 开启桶公共读（必做，否则浏览器 / 小程序会 AccessDenied）

OSS 控制台 → 桶 **`wedding-asset`** → **权限控制**：

1. **阻止公共访问**：若已开启，需**关闭**（否则无法公共读）
2. **读写权限（Bucket ACL）**：设为 **公共读**（或「公共读，私有写」）

若 ACL 仍无法匿名访问，在 **Bucket 授权策略** 添加（允许匿名 `GetObject`）：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": ["*"],
      "Action": ["oss:GetObject"],
      "Resource": ["acs:oss:*:*:wedding-asset/*"]
    }
  ]
}
```

保存后，用浏览器无痕窗口访问验证（应直接看到图片，而不是 XML 报错）：

```
https://wedding-asset.oss-cn-chengdu.aliyuncs.com/assets/images/homepage-niu.png
```

若之前已上传过文件，控制台改 ACL 后需**重新上传**（脚本会为每个对象设置 `public-read`）：

```bash
pnpm upload:oss-assets
```

### 5. 上传全部静态资源

```bash
pnpm upload:oss-assets
```

文件会上传到 `oss://wedding-asset/assets/...`，与本地 `assets/` 目录结构一致。

验证浏览器可访问：

```
https://wedding-asset.oss-cn-chengdu.aliyuncs.com/assets/images/homepage-niu.png
```

上传完成后，将 `src/constants/aliyun.ts` 中的 `ASSETS_CACHE_VERSION` 加 1（例如 `"1"` → `"2"`），再重新构建小程序。

### 6. 部署函数计算

```bash
pnpm install
pnpm deploy:aliyun
```

`deploy:aliyun` 会：

1. 打包 `infra/aliyun/fc` 为 zip
2. 上传到 `oss://wedding-asset/deploy/fc/wedding-invitation-api.zip`
3. 通过 FC OpenAPI 创建/更新函数与 HTTP 触发器

仅上传代码包（不调用 FC API）：

```bash
pnpm deploy:aliyun -- --upload-only
```

#### OAuth 与 FC 的已知限制（重要）

`aliyun configure --mode OAuth` 对 **OSS、Tablestore** 正常，但 **Function Compute OpenAPI 目前不支持 OAuth STS**，会报错：

```
AccessDenied: missing parameter SecurityToken
```

这是阿里云已知问题：[aliyun-cli#1271](https://github.com/aliyun/aliyun-cli/issues/1271)。  
因此 **`pnpm deploy:aliyun:s`（Serverless Devs）在 OAuth 下也会失败**（常见为 `GET /tempBucketToken failed with 500`，根因同样是 FC + OAuth）。

任选一种方式完成 FC 部署：

| 方式 | 说明 |
|------|------|
| **RAM AccessKey profile** | 创建仅有 FC/OSS 部署权限的 RAM 用户，`aliyun configure --mode AK --profile wedding-fc`，然后 `pnpm deploy:aliyun -- --profile wedding-fc` |
| **CloudShell** | 在 [CloudShell](https://shell.aliyun.com/) 中 clone 项目并执行 `pnpm deploy:aliyun` |
| **控制台手动** | 先 `pnpm deploy:aliyun -- --upload-only`，再在 FC 控制台创建函数，代码来源选 OSS：`wedding-asset` / `deploy/fc/wedding-invitation-api.zip` |

旧版 Serverless Devs 路径（需 AK，OAuth 不可用）：

```bash
pnpm s:config
pnpm deploy:aliyun:s
```

部署完成后：FC 控制台 → 函数 **`wedding-invitation-api`** → **触发器** → 复制 **公网访问地址**，形如：

```
https://wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run
```

#### 绑定 RAM 角色（必须）

FC 控制台 → 函数 → **配置** → **权限** → 绑定 RAM 角色（可信实体：函数计算），策略需包含：

- Tablestore 读写（实例 `wedding`）

**不要**在环境变量配置 `ALIBABA_CLOUD_ACCESS_KEY_ID` / `ALIBABA_CLOUD_ACCESS_KEY_SECRET`。

#### 函数环境变量

| 变量 | 值 |
|------|-----|
| `TABLESTORE_INSTANCE` | `wedding` |
| `TABLESTORE_ENDPOINT` | `https://wedding.cn-chengdu.ots.aliyuncs.com` |
| `TABLESTORE_TABLE` | `guests` |

验证 API：

```bash
curl https://YOUR-FC-URL.cn-chengdu.fcapp.run/health
# → ok

curl -X POST https://YOUR-FC-URL.cn-chengdu.fcapp.run/api/guest-form \
  -H 'Content-Type: application/json' \
  -d '{"mainContact":"测试","guests":[]}'
```

### 7. 配置小程序

编辑 `src/constants/aliyun.ts`：

```typescript
export const ALIYUN_FC_BASE_URL = "https://wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run";
```

```bash
pnpm build:weapp
```

#### 微信公众平台 → 服务器域名

| 类型 | 域名（不含 `https://`） |
|------|-------------------------|
| request 合法域名 | `wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run` |
| downloadFile 合法域名 | `wedding-asset.oss-cn-chengdu.aliyuncs.com` |

---

## 日常运维：更新 OSS 桶（静态资源）

本地 `assets/` 是**源文件**；OSS 桶 `wedding-asset` 是**线上 CDN**。改图片、字体、音乐后需要重新上传。

### 更新单个文件

适合改一两张图、替换某个字体：

```bash
# path 相对于 assets/，不要带 assets/ 前缀（默认 profile: wedding）
pnpm upload:oss-file images/homepage-niu.png
pnpm upload:oss-file -- --profile wedding fonts/thin-black.ttf
```

### 更新全部资源

适合大批量变更或首次同步后全量刷新：

```bash
pnpm upload:oss-assets
# 或：pnpm upload:oss-assets -- --profile wedding
```

脚本会遍历 `assets/` 下所有文件，上传到 `oss://wedding-asset/assets/<相对路径>`。  
**不会**删除 OSS 上已有但本地已删的文件；若需清理孤儿对象，请在 OSS 控制台手动删除。

### 刷新小程序缓存（必做）

OSS 路径不变时，微信可能缓存旧文件。每次上传后：

1. 打开 `src/constants/aliyun.ts`
2. 将 `ASSETS_CACHE_VERSION` 递增（如 `"2"` → `"3"`）
3. 重新构建并上传小程序：

```bash
pnpm build:weapp
```

`ASSETS_CACHE_VERSION` 会作为 query 参数拼到资源 URL（`?v=3`），强制客户端拉取新版本。

### 验证上传结果

```bash
# 替换为实际上传的文件路径
open "https://wedding-asset.oss-cn-chengdu.aliyuncs.com/assets/images/homepage-niu.png"
```

或在 OSS 控制台 → `wedding-asset` → **文件管理** → 前缀 `assets/` 查看对象与 **最后修改时间**。

### 环境变量覆盖（一般不需要）

上传脚本支持通过环境变量覆盖默认值：

| 变量 | 默认值 |
|------|--------|
| `OSS_REGION` | `oss-cn-chengdu` |
| `OSS_BUCKET` | `wedding-asset` |

示例：

```bash
OSS_BUCKET=wedding-asset pnpm upload:oss-file images/foo.png
```

---

## 更换 OSS 桶名（迁移 bucket）

若将来需要换桶（例如新建 `wedding-asset-v2`），按以下顺序操作：

1. **控制台**创建新桶（同 region `cn-chengdu`），开启**公共读**，配置与现桶相同的 **CORS**  
2. 上传资源到新桶：

   ```bash
   OSS_BUCKET=wedding-asset-v2 pnpm upload:oss-assets
   ```

3. 更新代码中的桶名与 URL（`src/constants/aliyun.ts`）：

   ```typescript
   export const ALIYUN_OSS_BUCKET = "wedding-asset-v2";
   export const ALIYUN_OSS_BASE_URL =
     "https://wedding-asset-v2.oss-cn-chengdu.aliyuncs.com";
   export const ASSETS_CACHE_VERSION = "1"; // 重置或递增
   ```

4. **微信公众平台** → 服务器域名 → 更新 **downloadFile 合法域名** 为新桶域名  
5. `pnpm build:weapp` 并发布新版本  
6. 确认线上正常后，可在控制台删除旧桶（可选）

如需永久修改默认桶名，还可编辑 `scripts/upload-oss-assets.mjs` / `upload-oss-file.mjs` 中的默认值，或在本机 `.env` 里固定 `OSS_BUCKET`（参见根目录 `.env.example`）。

---

## 更新后端（函数计算）

修改 `infra/aliyun/fc/` 下代码后：

```bash
pnpm deploy:aliyun
```

仅改 FC 环境变量时，也可在 FC 控制台直接修改，无需重新部署代码。

API 说明与故障排查见 [aliyun/SETUP.md](./aliyun/SETUP.md)。

---

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `pnpm db:init-tablestore` | 创建 Tablestore 表 `guests`（幂等） |
| `pnpm upload:oss-assets` | 全量上传 `assets/` → OSS |
| `pnpm upload:oss-file <path>` | 上传单个文件 |
| `pnpm deploy:aliyun` | 部署 FC 函数 |
| `pnpm build:weapp` | 构建微信小程序（改配置或资源版本后） |

---

## 故障排查

| 现象 | 检查项 |
|------|--------|
| 浏览器打开 OSS URL 出现 XML `AccessDenied` / bucket acl | 桶 ACL 设为公共读；关闭「阻止公共访问」；必要时加 Bucket 策略；重新 `pnpm upload:oss-assets` |
| 脚本报凭据错误 | 是否已 `aliyun configure --mode OAuth --profile wedding`；`aliyun sts GetCallerIdentity --profile wedding` |
| FC 部署 `missing parameter SecurityToken` | OAuth 不支持 FC API；改用 RAM AK profile、CloudShell 或控制台手动部署（见上文 §6） |
| FC 部署 `tempBucketToken 500` | Serverless Devs + OAuth 的同一问题；改用 `pnpm deploy:aliyun` + AK profile |
| 图片/字体 403 或加载失败 | OSS 公共读、CORS、微信 downloadFile 合法域名 |
| 资源仍是旧版 | 是否 bump `ASSETS_CACHE_VERSION` 并重新 `build:weapp` |
| 表单提交失败 | `ALIYUN_FC_BASE_URL`、FC RAM 角色、微信 request 合法域名 |
| Tablestore 写入失败 | 表 `guests` 是否存在；FC 角色是否有 OTS 权限 |

---

## 目录与代码说明

| 路径 | 说明 |
|------|------|
| `infra/aliyun/s.yaml` | FC 函数名、region、HTTP 触发器、环境变量模板 |
| `infra/aliyun/fc/index.js` | 路由：`/health`、`/api/guest-form` |
| `infra/aliyun/fc/lib/tablestore.js` | 写入宾客数据到 `guests` 表 |
| `src/constants/aliyun.ts` | 小程序侧 OSS / FC URL 与资源缓存版本 |
