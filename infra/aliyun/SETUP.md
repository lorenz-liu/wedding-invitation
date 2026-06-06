# 阿里云部署指南

后端与静态资源运行在阿里云（中国内地 **cn-chengdu**）：

| 组件 | 阿里云服务 |
|------|-----------|
| 宾客表单 API | 函数计算 FC 3.0 HTTP 函数 |
| 数据库 | 表格存储 Tablestore 实例 `wedding`，表 `guests` |
| 图片/字体/音乐 CDN | 对象存储 OSS 桶 `wedding-asset`（公共读） |
| 短信（可选） | 阿里云短信服务 SMS |

---

## 1. 前置条件

- 阿里云账号 UID：`1750002506010471`
- Region：`cn-chengdu`
- 已创建：
  - Tablestore 实例 `wedding` → `https://wedding.cn-chengdu.ots.aliyuncs.com`
  - OSS 桶 `wedding-asset`（公共读）

### 1.1 身份认证（推荐：无需长期 AccessKey）

阿里云不建议创建 RAM 长期 AccessKey。本项目脚本与 FC 均支持**临时凭证**或**默认凭据链**。

| 场景 | 推荐方式 |
|------|----------|
| 一键部署（最简单） | [CloudShell 云命令行](https://help.aliyun.com/zh/cloud-shell/)：用控制台登录身份，凭证自动注入，直接运行下方 `pnpm` 命令 |
| 本地开发 | 安装 [阿里云 CLI](https://help.aliyun.com/zh/cli/) 后执行 `aliyun configure --mode OAuth`，浏览器登录授权（[OAuth 凭证文档](https://help.aliyun.com/zh/cli/oauth-credentials)） |
| 企业多账号 | [云 SSO CLI 登录](https://help.aliyun.com/zh/cli/configure-credentials)：`aliyun configure --mode CloudSSO` |
| FC 函数运行时 | 为函数绑定 **RAM 角色**（见 §7.1），**不要**在环境变量写入 AccessKey |

本地 OAuth 若使用非 `default` 配置名，可指定：

```bash
export ALIBABA_CLOUD_PROFILE=wedding
```

当前登录身份需具备（或等价自定义策略）：
- Tablestore 读写（实例 `wedding`）
- OSS 桶 `wedding-asset` 读写
- SMS 发送（若启用短信）
- FC 部署权限

---

## 2. 安装工具

```bash
# Serverless Devs（部署 FC）
npm i -g @serverless-devs/s

# 本地 CLI 登录（OAuth，无需 AccessKey）
npm i -g @alicloud/cli
aliyun configure --mode OAuth --profile wedding

# Serverless Devs 使用同一套 CLI 凭证（按提示选择 Alibaba Cloud）
s config add
```

在 **CloudShell** 中可跳过 `aliyun configure`，直接 clone 仓库后执行后续命令。

---

## 3. 初始化 Tablestore 表

```bash
pnpm db:init-tablestore
```

创建宽表 `guests`，主键 `id` (STRING)。

---

## 4. 配置 OSS CORS（微信小程序 loadFontFace 需要）

在 OSS 控制台 → `wedding-asset` → **数据安全** → **跨域设置**，添加：

| 项 | 值 |
|----|-----|
| 来源 | `*` |
| Methods | GET, HEAD |
| Allow-Headers | `*` |

---

## 5. 上传静态资源

```bash
pnpm upload:oss-assets
```

单文件：

```bash
pnpm upload:oss-file images/homepage-niu.png
```

验证：`https://wedding-asset.oss-cn-chengdu.aliyuncs.com/assets/images/homepage-niu.png`

上传后 bump `src/constants/aliyun.ts` 中的 `ASSETS_CACHE_VERSION`。

---

## 6. 配置短信（可选）

1. 在 [短信控制台](https://dysms.console.aliyun.com/) 创建**签名**和**模板**
2. 模板需包含变量 `${content}`（或与代码中 `SMS_TEMPLATE_PARAM` 一致）
3. 部署前导出：

```bash
export SMS_SIGN_NAME="你的签名"
export SMS_TEMPLATE_CODE="SMS_xxxxxx"
# 若模板变量不是 content，可自定义整段 JSON：
# export SMS_TEMPLATE_PARAM='{"name":"张三"}'
```

默认发送文案见 `infra/aliyun/fc/lib/sms.js` 中的 `SMS_MESSAGE`。

---

## 7. 部署函数计算

```bash
cd infra/aliyun/fc && npm install && cd ..
pnpm deploy:aliyun
```

或在 `infra/aliyun` 目录：

```bash
s deploy -y
```

部署完成后，在控制台 **函数 → wedding-invitation-api → 触发器** 复制 **公网访问地址**，形如：

`https://wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run`

### 7.1 为函数绑定 RAM 角色（推荐）

**不要**在 FC 环境变量中配置 `ALIBABA_CLOUD_ACCESS_KEY_ID` / `ALIBABA_CLOUD_ACCESS_KEY_SECRET`。

1. 创建 RAM 角色（可信实体：**函数计算**），授予策略例如：
   - Tablestore：`AliyunOTSFullAccess`（或实例级读写）
   - SMS：`AliyunDysmsFullAccess`（若启用短信）
2. FC 控制台 → 函数 `wedding-invitation-api` → **配置** → **权限** → 绑定该角色  
   函数运行时会通过元数据服务自动获取临时 STS 凭证。

### 7.2 函数环境变量

在 FC 控制台 → 函数配置 → 环境变量，添加：

| 变量 | 值 |
|------|-----|
| `TABLESTORE_INSTANCE` | `wedding` |
| `TABLESTORE_ENDPOINT` | `https://wedding.cn-chengdu.ots.aliyuncs.com` |
| `TABLESTORE_TABLE` | `guests` |
| `SMS_SIGN_NAME` | 短信签名（可选） |
| `SMS_TEMPLATE_CODE` | 短信模板 CODE（可选） |

`s.yaml` 已包含 Tablestore / SMS 相关变量；部署时可通过 shell 导出 `SMS_SIGN_NAME`、`SMS_TEMPLATE_CODE`。

验证：

```bash
curl https://YOUR-FC-URL.cn-chengdu.fcapp.run/health
# → ok

curl -X POST https://YOUR-FC-URL.cn-chengdu.fcapp.run/api/guest-form \
  -H 'Content-Type: application/json' \
  -d '{"mainContact":"测试","guests":[]}'
```

---

## 8. 配置小程序

编辑 `src/constants/aliyun.ts`：

```typescript
export const ALIYUN_FC_BASE_URL = "https://wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run";
```

重新构建：

```bash
pnpm build:weapp
```

### 微信公众平台 → 服务器域名

| 类型 | 域名 |
|------|------|
| request 合法域名 | `wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run`（你的 FC 域名，不含 `https://`） |
| downloadFile 合法域名 | `wedding-asset.oss-cn-chengdu.aliyuncs.com` |

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm db:init-tablestore` | 创建 `guests` 表 |
| `pnpm upload:oss-assets` | 上传全部 assets |
| `pnpm upload:oss-file <path>` | 上传单个文件 |
| `pnpm deploy:aliyun` | 部署 FC 函数 |

---

## 故障排查

| 现象 | 处理 |
|------|------|
| 图片/字体加载失败 | 检查 OSS 公共读、CORS、downloadFile 合法域名 |
| 表单提交失败 | 检查 `ALIYUN_FC_BASE_URL`、FC 环境变量、request 合法域名 |
| Tablestore 报错 | 确认表 `guests` 已创建、当前身份/RAM 角色有 OTS 权限 |
| 短信未发送 | 检查签名/模板审核通过、`SMS_*` 环境变量 |

---

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| POST | `/api/guest-form` | 提交宾客表单（JSON，与原先 Worker 接口一致） |
| OPTIONS | `*` | CORS 预检 |
