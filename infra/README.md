# 阿里云基础设施

婚礼请柬小程序的后端与静态资源 CDN 均部署在阿里云（Region **`cn-chengdu`**）。本目录只包含阿里云相关配置与函数代码。

```
infra/
└── aliyun/
    ├── s.yaml          # Serverless Devs 部署配置（FC 3.0）
    ├── SETUP.md        # 补充说明（详细 API / 故障排查）
    └── fc/             # 函数计算源码（宾客表单 API + 短信）
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
| 短信（可选） | 短信服务 SMS | 签名 + 模板 CODE |

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
export ALIBABA_CLOUD_PROFILE=wedding   # 每个终端执行一次，或写入 ~/.zshrc
```

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

当前身份需具备：Tablestore 读写、OSS 桶读写、FC 部署、SMS 发送（若启用短信）。

---

## 一次性初始化（首次部署）

在**项目根目录**执行，按顺序完成以下步骤。

### 1. 安装工具与项目依赖

```bash
pnpm install

npm i -g @serverless-devs/s
s config add    # 选择 Alibaba Cloud，与 OAuth 同一账号
```

### 2. 登录（本地）

```bash
export ALIBABA_CLOUD_PROFILE=wedding
aliyun sts GetCallerIdentity --profile wedding
```

### 3. 创建 Tablestore 表

```bash
pnpm db:init-tablestore
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

### 6. 配置短信（可选）

1. [短信控制台](https://dysms.console.aliyun.com/) 创建签名与模板  
2. 模板需包含变量 `${content}`（文案见 `infra/aliyun/fc/lib/sms.js` 的 `SMS_MESSAGE`）  
3. 部署 FC 前 export：

```bash
export SMS_SIGN_NAME="你的签名"
export SMS_TEMPLATE_CODE="SMS_xxxxxx"
```

### 7. 部署函数计算

```bash
pnpm deploy:aliyun
```

等价于在 `infra/aliyun` 下执行 `s deploy -y`。

部署完成后：FC 控制台 → 函数 **`wedding-invitation-api`** → **触发器** → 复制 **公网访问地址**，形如：

```
https://wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run
```

#### 绑定 RAM 角色（必须）

FC 控制台 → 函数 → **配置** → **权限** → 绑定 RAM 角色（可信实体：函数计算），策略需包含：

- Tablestore 读写（实例 `wedding`）
- SMS 发送（若启用短信）

**不要**在环境变量配置 `ALIBABA_CLOUD_ACCESS_KEY_ID` / `ALIBABA_CLOUD_ACCESS_KEY_SECRET`。

#### 函数环境变量

| 变量 | 值 |
|------|-----|
| `TABLESTORE_INSTANCE` | `wedding` |
| `TABLESTORE_ENDPOINT` | `https://wedding.cn-chengdu.ots.aliyuncs.com` |
| `TABLESTORE_TABLE` | `guests` |
| `SMS_SIGN_NAME` | 可选 |
| `SMS_TEMPLATE_CODE` | 可选 |

验证 API：

```bash
curl https://YOUR-FC-URL.cn-chengdu.fcapp.run/health
# → ok

curl -X POST https://YOUR-FC-URL.cn-chengdu.fcapp.run/api/guest-form \
  -H 'Content-Type: application/json' \
  -d '{"mainContact":"测试","guests":[]}'
```

### 8. 配置小程序

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
export ALIBABA_CLOUD_PROFILE=wedding

# path 相对于 assets/，不要带 assets/ 前缀
pnpm upload:oss-file images/homepage-niu.png
pnpm upload:oss-file fonts/thin-black.ttf
```

### 更新全部资源

适合大批量变更或首次同步后全量刷新：

```bash
export ALIBABA_CLOUD_PROFILE=wedding
pnpm upload:oss-assets
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
   export ALIBABA_CLOUD_PROFILE=wedding
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
export ALIBABA_CLOUD_PROFILE=wedding
# 若改了短信相关配置：
export SMS_SIGN_NAME="..."
export SMS_TEMPLATE_CODE="..."

pnpm deploy:aliyun
```

仅改 FC 环境变量（如 SMS）时，也可在 FC 控制台直接修改，无需重新部署代码。

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
| 脚本报凭据错误 | `export ALIBABA_CLOUD_PROFILE=wedding`；`aliyun sts GetCallerIdentity --profile wedding` |
| 图片/字体 403 或加载失败 | OSS 公共读、CORS、微信 downloadFile 合法域名 |
| 资源仍是旧版 | 是否 bump `ASSETS_CACHE_VERSION` 并重新 `build:weapp` |
| 表单提交失败 | `ALIYUN_FC_BASE_URL`、FC RAM 角色、微信 request 合法域名 |
| Tablestore 写入失败 | 表 `guests` 是否存在；FC 角色是否有 OTS 权限 |
| 短信未发送 | 签名/模板是否审核通过；FC 环境变量 `SMS_*`；RAM 是否有 SMS 权限 |

---

## 目录与代码说明

| 路径 | 说明 |
|------|------|
| `infra/aliyun/s.yaml` | FC 函数名、region、HTTP 触发器、环境变量模板 |
| `infra/aliyun/fc/index.js` | 路由：`/health`、`/api/guest-form` |
| `infra/aliyun/fc/lib/tablestore.js` | 写入宾客数据到 `guests` 表 |
| `infra/aliyun/fc/lib/sms.js` | 阿里云短信发送 |
| `src/constants/aliyun.ts` | 小程序侧 OSS / FC URL 与资源缓存版本 |
