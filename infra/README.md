# 腾讯云 CloudBase 后端部署指南

宾客回函表单使用 **云函数 + 云数据库 + 腾讯云短信**（可选），替代原 AWS Lambda / DynamoDB / SNS 方案。

## 资源命名

| 资源 | 名称 |
|------|------|
| 云开发环境 ID | `wedding-d8gbgwafs7b3e5340` |
| 云函数 | `submitGuestForm` |
| 云数据库集合 | `wedding-guests` |

## 部署

### 1. 安装 CloudBase CLI 并登录

```bash
npm i -g @cloudbase/cli
tcb login
```

### 2. 一键部署云函数

```bash
cd infra
chmod +x deploy.sh
./deploy.sh
```

脚本会：

- 部署 `submitGuestForm` 云函数
- 提示数据库集合配置方式（CLI 3.x 需手动创建或首次写入时自动创建）

### 3. 在微信开发者工具中确认

1. 打开项目 → **云开发** → 选择环境 `wedding-d8gbgwafs7b3e5340`
2. **云函数** → 确认 `submitGuestForm` 状态为已部署
3. **数据库** → 确认存在集合 `wedding-guests`
   - 首次表单提交时云函数写入数据会自动创建该集合
   - 也可手动：**添加集合** → 名称填 `wedding-guests`，权限设为仅管理端可读写

## 小程序端调用方式

小程序通过 `Taro.cloud.callFunction` 调用，无需配置 HTTP 域名。环境 ID 已在 `src/constants/cloud.ts` 中配置。

## 查看宾客数据

微信开发者工具 → **云开发** → **数据库** → 集合 `wedding-guests`

> CloudBase CLI 3.x 已移除 `tcb db collection` 命令，数据库集合请在控制台查看，或通过首次表单提交自动创建。

## 短信通知（可选）

在云开发控制台 → **云函数** → `submitGuestForm` → **配置** → **环境变量** 中添加：

| 变量 | 说明 |
|------|------|
| `SMS_SECRET_ID` | 腾讯云 API 密钥 ID |
| `SMS_SECRET_KEY` | 腾讯云 API 密钥 Key |
| `SMS_SDK_APP_ID` | 短信应用 SDK AppID |
| `SMS_SIGN_NAME` | 已审核通过的短信签名 |
| `SMS_TEMPLATE_ID` | 已审核通过的短信模板 ID |
| `SMS_REGION` | 可选，默认 `ap-guangzhou` |

短信模板需包含 **1 个文本变量**，云函数会将完整确认内容作为该变量传入。

```
收到啦！我们已悉心记下所有细节。

何其荣幸您将出席我们的婚礼，请放心，我们会为您备好一切。若后续行程有变，或有任何需要，欢迎随时通过微信（LuvGaw）或电话（19800301620）与我们联络。

7月25日，成都·慕上，期待与您相见！

—— 刘兆薰 & 高文珩 敬上
```

未配置短信环境变量时，表单仍可正常提交，只是不会发送短信。

## H5 端提交（可选）

H5 无法直接调用 `wx.cloud.callFunction`，需为云函数开启 **HTTP 访问**：

1. 云开发控制台 → 云函数 → `submitGuestForm` → HTTP 访问 → 开启
2. 复制访问地址，填入 `src/constants/config.ts` 的 `CLOUD_HTTP_ENDPOINT`

## 更新云函数

修改 `infra/cloudfunctions/submitGuestForm/` 后重新运行：

```bash
cd infra && ./deploy.sh
```

或在微信开发者工具中右键云函数目录 → **上传并部署：云端安装依赖**。
