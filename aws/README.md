# AWS 后端部署指南

## 资源命名

| 资源 | 名称 |
|------|------|
| CloudFormation Stack | `wedding` |
| DynamoDB 表 | `wedding-guests` |
| Lambda 函数 | `handle-guest-form-submission` |

## 部署

使用 `wedding` AWS profile 一键部署（首次创建或后续更新）：

```bash
cd aws
chmod +x deploy.sh
./deploy.sh
```

脚本会自动：
- 校验 `wedding` profile 是否可用
- 判断 stack 是否存在，执行 create 或 update
- 等待 CloudFormation 完成
- 输出 `ApiEndpoint`，供填入 `src/constants/config.ts`

其他命令：

```bash
./deploy.sh status   # 查看 stack 状态与输出
./deploy.sh delete   # 删除 stack
```

## 获取 API 地址

```bash
aws cloudformation describe-stacks \
  --stack-name wedding \
  --region ca-central-1 \
  --query 'Stacks[0].Outputs'
```

将 `ApiEndpoint` 填入 `src/constants/config.ts`。

## 查看宾客数据

```bash
aws dynamodb scan \
  --table-name wedding-guests \
  --region ca-central-1
```

## 短信内容

提交成功后，宾客将收到以下确认短信：

```
收到啦！我们已悉心记下所有细节。

何其荣幸您将出席我们的婚礼，请放心，我们会为您备好一切。若后续行程有变，或有任何需要，欢迎随时通过微信（LuvGaw）或电话（19800301620）与我们联络。

7月25日，成都·慕上，期待与您相见！

—— 刘兆薰 & 高文珩 敬上
```

## 更新栈

```bash
aws cloudformation update-stack \
  --stack-name wedding \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ca-central-1
```

## 删除

```bash
aws cloudformation delete-stack \
  --stack-name wedding \
  --region ca-central-1
```
