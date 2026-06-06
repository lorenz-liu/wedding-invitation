# 阿里云部署补充说明

完整初始化与日常运维（含 OSS 桶更新）见 **[../README.md](../README.md)**。

本文档补充 API 与排查细节。

---

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查，返回 `ok` |
| POST | `/api/guest-form` | 提交宾客表单（JSON） |
| OPTIONS | `*` | CORS 预检 |

### POST `/api/guest-form` 请求体示例

```json
{
  "mainContact": "张三",
  "phone": "13800138000",
  "wechatId": "",
  "guests": [{ "name": "李四", "relation": "朋友" }],
  "isDriving": false,
  "needsShuttle": false,
  "shuttleLocation": "",
  "notes": ""
}
```

成功响应：

```json
{
  "success": true,
  "id": "1710000000000-abc123",
  "smsSent": true,
  "message": "感谢您的回复！确认短信已发送。"
}
```

---

## Tablestore 表结构

表名：`guests`，主键：`id` (STRING)

| 列 | 说明 |
|----|------|
| `main_contact` | 主联系人姓名 |
| `phone` | 手机号 |
| `wechat_id` | 微信号 |
| `guests_json` | 宾客列表 JSON |
| `dietary_restrictions` | 饮食限制 |
| `is_driving` | 是否自驾 |
| `needs_shuttle` | 是否需要 shuttle |
| `shuttle_location` | shuttle 地点 |
| `notes` | 备注 |
| `created_at` | ISO 时间戳 |

---

## 短信模板

默认模板变量为 `${content}`，正文见 `fc/lib/sms.js` 中的 `SMS_MESSAGE`。

若模板使用其他变量名，在 FC 环境变量设置 `SMS_TEMPLATE_PARAM`，例如：

```json
{"content":"自定义全文"}
```

---

## 故障排查（补充）

| 现象 | 处理 |
|------|------|
| `s deploy` 失败 | 确认已 `s config add`；OAuth profile 有效 |
| OAuth 过期 | 重新执行 `aliyun configure --mode OAuth --profile wedding` |
| FC 500 + Tablestore | 检查 RAM 角色是否绑定、策略是否含 OTS |
| 上传 OSS 慢 | 全量上传文件多属正常；日常改单文件用 `upload:oss-file` |
