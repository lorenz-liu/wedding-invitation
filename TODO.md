# 📝 婚礼请柬项目待办事项

## 概述

本项目第一版本开发已完成，但在部署到生产环境之前，需要完成以下关键任务。每个TODO都包含详细的解决方案和教程链接。

---

## 1. 🔤 字体文件优化（高优先级）

### 问题
当前字体文件总计约 **50MB**，远超微信小程序的分包限制（2MB/包，总包20MB）。这会导致小程序无法上传或加载缓慢。

### 解决方案

#### 方案A：字体子集化（推荐）
使用 `font-spider` 或 `glyphhanger` 工具提取页面实际使用的字符，生成精简字体文件。

```bash
# 安装 font-spider
npm install font-spider -g

# 创建字体配置文件 font-spider-config.json
{
  "files": ["dist/**/*.html"],
  "resources": ["src/**/*.{js,jsx,ts,tsx}"]
}

# 运行字体压缩
font-spider dist/index.html
```

**预期效果**：字体文件从 50MB 减少到约 500KB-1MB（根据实际用字量）。

#### 方案B：CDN托管字体
将字体文件上传到 CDN，通过 CSS `@font-face` 的 `src: url('https://cdn...')` 引用。

```scss
@font-face {
  font-family: 'ThinBlack';
  src: url('https://your-cdn.com/fonts/thin-black-subset.woff2') format('woff2');
  font-display: swap;
}
```

**推荐CDN**：
- 阿里云OSS + CDN
- 腾讯云COS + CDN
- Cloudflare R2

### 教程链接
- [font-spider 使用教程](https://github.com/aui/font-spider)
- [glyphhanger 字体子集化](https://www.npmjs.com/package/glyphhanger)
- [Web字体优化最佳实践](https://web.dev/optimize-webfont-loading/)

---

## 2. ☁️ 部署AWS后端服务（高优先级）

### 问题
当前表单提交使用占位符API端点，需要部署真实的AWS基础设施。

### 解决方案

#### 步骤1：安装AWS CLI并配置凭证

```bash
# 安装AWS CLI (macOS)
brew install awscli

# 配置AWS凭证
aws configure
# 输入 Access Key ID、Secret Access Key、默认区域（如 us-east-1）
```

**获取AWS凭证**：
1. 登录 [AWS管理控制台](https://aws.amazon.com/)
2. 进入 IAM → 用户 → 安全凭证
3. 创建访问密钥

#### 步骤2：部署CloudFormation栈

```bash
cd aws

# 创建堆栈
aws cloudformation create-stack \
  --stack-name wedding-invitation-prod \
  --template-body file://template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=prod \
  --capabilities CAPABILITY_IAM

# 等待部署完成
aws cloudformation wait stack-create-complete \
  --stack-name wedding-invitation-prod

# 查看输出（获取API端点）
aws cloudformation describe-stacks \
  --stack-name wedding-invitation-prod \
  --query 'Stacks[0].Outputs'
```

#### 步骤3：更新前端API端点

```typescript
// src/pages/index/components/PageForm.tsx
const API_ENDPOINT = 'https://your-lambda-url.lambda-url.us-east-1.on.aws/';
```

#### 步骤4：配置SNS短信（中国用户）

由于AWS SNS对中国大陆手机短信支持有限，建议替代方案：

**方案A：腾讯云短信服务**
```typescript
// 使用腾讯云SDK发送短信
import TencentCloud from 'tencentcloud-sdk-nodejs';
```

**方案B：阿里云短信服务**
- 注册 [阿里云短信服务](https://www.aliyun.com/product/sms)
- 申请短信签名和模板
- 集成SDK到Lambda函数

### 教程链接
- [AWS CloudFormation 入门](https://docs.aws.amazon.com/cloudformation/)
- [AWS Lambda 函数URL](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html)
- [腾讯云短信Node.js SDK](https://cloud.tencent.com/document/product/382/43197)

---

## 3. 📱 配置微信小程序（高优先级）

### 问题
当前使用 `touristappid` 作为占位符，需要替换为真实的小程序AppID。

### 解决方案

#### 步骤1：注册微信小程序

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册小程序账号（需要营业执照或个人身份证）
3. 完成微信认证（企业需300元认证费）

#### 步骤2：更新AppID

```json
// project.config.json
{
  "appid": "wx1234567890abcdef",
  "projectname": "wedding-invitation",
  "description": "刘兆薰&高文珩婚礼请柬"
}
```

#### 步骤3：配置服务器域名

在微信公众平台 → 开发 → 开发设置 → 服务器域名中，添加：

```
request合法域名:
- https://your-lambda-url.lambda-url.us-east-1.on.aws (AWS API端点)
- https://apis.map.qq.com (腾讯地图API)

downloadFile合法域名:
- https://your-cdn.com (字体/音乐CDN)
- https://your-cloud-storage.com (云存储图片)
```

#### 步骤4：开通云开发（推荐用于音乐文件）

由于音乐文件较大，建议托管到微信云存储：

```bash
# 在微信开发者工具中
# 1. 点击"云开发"按钮
# 2. 创建云环境
# 3. 上传音乐文件到云存储
# 4. 获取文件ID: cloud://env-id/music/our-love.mp3
```

更新 `app.tsx`：
```typescript
if (process.env.TARO_ENV === 'weapp') {
  bgm.src = 'cloud://your-env-id.music/our-love.mp3';
}
```

### 教程链接
- [微信小程序注册流程](https://developers.weixin.qq.com/miniprogram/product/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [小程序服务器域名配置](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)

---

## 4. 🗺️ 配置腾讯地图（中优先级）

### 问题
地图组件需要腾讯位置服务的开发者密钥。

### 解决方案

#### 步骤1：申请腾讯地图Key

1. 访问 [腾讯位置服务](https://lbs.qq.com/)
2. 注册开发者账号
3. 创建应用，选择"微信小程序"平台
4. 填写小程序AppID
5. 获取Key：`xxxxxxxxxxxxxxxx`格式

#### 步骤2：配置小程序白名单

在小程序后台 → 开发 → 开发设置 → 服务器域名中添加：

```
request合法域名:
- https://apis.map.qq.com
- https://3gimg.qq.com
```

#### 步骤3：更新地图组件

```typescript
// src/pages/index/components/PageLocation.tsx
const TENCENT_MAP_KEY = 'YOUR_TENCENT_MAP_KEY';

// 在小程序中使用Map组件时添加key
<Map
  markers={[{
    id: 1,
    longitude: 104.0668,
    latitude: 30.5728,
    title: '慕上OnTheMoon',
    iconPath: '', // 使用默认图标或自定义图标
    width: 30,
    height: 30
  }]}
/>
```

### 教程链接
- [腾讯位置服务Key申请](https://lbs.qq.com/dev/console/application/mine)
- [微信小程序地图组件](https://developers.weixin.qq.com/miniprogram/dev/component/map.html)

---

## 5. 🎵 音乐文件托管优化（中优先级）

### 问题
音乐文件 `our-love.mp3` (8.33MB) 过大，会影响小程序加载速度。

### 解决方案

#### 方案A：微信云存储（推荐）

```bash
# 1. 开通微信云开发
# 2. 在微信开发者工具的云开发控制台上传音乐文件
# 3. 获取云文件ID
```

更新代码：
```typescript
// src/app.tsx
const bgm = Taro.getBackgroundAudioManager();
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序使用云存储
  bgm.src = 'cloud://wedding-env-id.music/our-love.mp3';
} else {
  // H5使用本地或CDN
  bgm.src = 'https://your-cdn.com/music/our-love.mp3';
}
```

#### 方案B：音频压缩

使用工具压缩MP3文件：

```bash
# 使用 ffmpeg 压缩音频
ffmpeg -i our-love.mp3 -b:a 64k -ar 22050 our-love-compressed.mp3
```

**建议参数**：
- 比特率：64-96 kbps（足够背景音乐质量）
- 采样率：22050 Hz
- 预期压缩后大小：1-2MB

### 教程链接
- [FFmpeg音频压缩教程](https://ffmpeg.org/ffmpeg.html)
- [微信云存储文件上传](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/storage.html)

---

## 6. 📊 添加网站分析（低优先级）

### 问题
需要跟踪访客数据，了解有多少宾客查看了请柬并提交了表单。

### 解决方案

#### 方案A：微信小程序数据分析

微信公众平台内置数据分析功能：
- 访问人数/次数
- 页面停留时间
- 用户地域分布

#### 方案B：Google Analytics (H5版本)

```typescript
// src/app.tsx
useEffect(() => {
  if (process.env.TARO_ENV === 'h5') {
    // 初始化GA
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: 'Wedding Invitation',
      page_path: '/'
    });
  }
}, []);
```

#### 方案C：自定义分析（Lambda + DynamoDB）

扩展AWS后端，添加页面访问记录：

```typescript
// Lambda函数中添加
await dynamodb.put({
  TableName: 'wedding-analytics',
  Item: {
    id: generateId(),
    page: event.pageName,
    timestamp: new Date().toISOString(),
    userAgent: event.headers['User-Agent'],
    ip: event.requestContext.http.sourceIp
  }
}).promise();
```

### 教程链接
- [微信小程序数据分析](https://developers.weixin.qq.com/miniprogram/analysis/)
- [Google Analytics 4 设置](https://support.google.com/analytics/answer/9304153)

---

## 7. 🔒 安全加固（中优先级）

### 问题
当前API端点未做限流和防护，可能遭受恶意攻击。

### 解决方案

#### 方案A：AWS WAF（Web应用防火墙）

```yaml
# 在CloudFormation模板中添加
WAFWebACL:
  Type: AWS::WAFv2::WebACL
  Properties:
    Name: wedding-api-waf
    Rules:
      - Name: RateLimit
        Statement:
          RateBasedStatement:
            Limit: 100  # 每5分钟100请求
```

#### 方案B：API请求限流（Lambda层）

```typescript
// Lambda函数中添加限流逻辑
const rateLimit = new Map<string, number[]>();

export const handler = async (event) => {
  const clientIP = event.requestContext.http.sourceIp;
  const now = Date.now();
  
  // 检查该IP最近请求次数
  const requests = rateLimit.get(clientIP) || [];
  const recentRequests = requests.filter(t => now - t < 60000); // 1分钟内
  
  if (recentRequests.length > 10) {
    return { statusCode: 429, body: 'Too Many Requests' };
  }
  
  rateLimit.set(clientIP, [...recentRequests, now]);
  // ... 继续处理请求
};
```

#### 方案C：表单数据验证

```typescript
// 在提交前验证数据
const validateForm = (data: FormData) => {
  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(data.phone)) {
    throw new Error('手机号格式不正确');
  }
  
  // 防止XSS攻击
  const sanitize = (str: string) => str.replace(/[<>]/g, '');
  data.mainContact = sanitize(data.mainContact);
  data.notes = sanitize(data.notes);
  
  return data;
};
```

### 教程链接
- [AWS WAF 文档](https://docs.aws.amazon.com/waf/)
- [OWASP输入验证速查表](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

---

## 8. 📱 小程序审核与发布（高优先级）

### 问题
完成开发后需要通过微信小程序审核才能正式发布。

### 解决方案

#### 步骤1：准备审核材料

- 小程序介绍文案
- 服务类目选择（建议选择"生活服务 > 婚庆服务"）
- 可能需要提供的资质：婚礼相关证明或说明

#### 步骤2：提交审核

在微信开发者工具中：
1. 点击"上传"按钮
2. 填写版本号（如 1.0.0）
3. 填写项目备注
4. 上传代码

在微信公众平台：
1. 进入"版本管理"
2. 找到开发版本，点击"提交审核"
3. 填写功能介绍和测试账号（如有需要）
4. 提交审核（通常1-3个工作日）

#### 步骤3：审核通过后发布

审核通过后，在"版本管理"中点击"发布"按钮即可上线。

### 注意事项
- 首次审核可能需要更长时间
- 确保小程序内容符合 [微信小程序运营规范](https://developers.weixin.qq.com/miniprogram/product/)
- 避免使用诱导分享等违规功能

### 教程链接
- [微信小程序审核规范](https://developers.weixin.qq.com/miniprogram/product/)
- [小程序版本管理](https://developers.weixin.qq.com/miniprogram/dev/framework/version/)

---

## 9. 🧪 测试清单（发布前必做）

### 功能测试

- [ ] 页面滚动切换正常
- [ ] 音乐自动播放（需用户交互后）
- [ ] 所有12个页面内容正确显示
- [ ] 表单提交成功
- [ ] 表单提交后收到确认短信
- [ ] 地图显示和导航正常
- [ ] 音频控制按钮可用

### 兼容性测试

- [ ] iPhone 各机型测试
- [ ] Android 主流机型测试
- [ ] 微信不同版本测试
- [ ] 弱网环境测试
- [ ] 离线模式测试（CDN资源）

### 性能测试

- [ ] 首屏加载时间 < 3秒
- [ ] 字体文件懒加载正常
- [ ] 音乐文件按需加载
- [ ] 内存占用不导致闪退

---

## 10. 🚀 未来优化方向（可选）

### 可能的增强功能

1. **分享功能**
   ```typescript
   // 添加分享到朋友圈/好友
   Taro.showShareMenu({ withShareTicket: true });
   ```

2. **祝福留言墙**
   - 宾客可以留下祝福语
   - 实时显示在页面上

3. **照片直播**
   - 婚礼现场照片实时上传
   - 宾客可以查看和下载

4. **座位查询**
   - 根据宾客姓名查询桌号
   - 显示座位图

5. **倒计时组件**
   - 距离婚礼还有多少天
   - 实时倒计时

---

## 📞 技术支持

如遇问题，可查阅以下资源：

- **Taro文档**: https://docs.taro.zone/
- **React文档**: https://react.dev/
- **AWS文档**: https://docs.aws.amazon.com/
- **微信开发者社区**: https://developers.weixin.qq.com/

---

*最后更新: 2026年5月22日*
