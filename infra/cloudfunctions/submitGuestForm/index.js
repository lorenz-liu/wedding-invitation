const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTION = "wedding-guests";

const SMS_MESSAGE = [
  "收到啦！我们已悉心记下所有细节。",
  "",
  "何其荣幸您将出席我们的婚礼，请放心，我们会为您备好一切。若后续行程有变，或有任何需要，欢迎随时通过微信（LuvGaw）或电话（19800301620）与我们联络。",
  "",
  "7月25日，成都·慕上，期待与您相见！",
  "",
  "—— 刘兆薰 & 高文珩 敬上",
].join("\n");

function parseInput(event) {
  if (event?.mainContact !== undefined) {
    return event;
  }

  if (event?.body !== undefined) {
    const raw = event.body;
    return typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {};
  }

  return event || {};
}

async function sendSms(phone) {
  const secretId = process.env.SMS_SECRET_ID;
  const secretKey = process.env.SMS_SECRET_KEY;
  const sdkAppId = process.env.SMS_SDK_APP_ID;
  const signName = process.env.SMS_SIGN_NAME;
  const templateId = process.env.SMS_TEMPLATE_ID;

  if (!secretId || !secretKey || !sdkAppId || !signName || !templateId) {
    console.warn("SMS env vars not configured, skipping SMS");
    return false;
  }

  try {
    const tencentcloud = require("tencentcloud-sdk-nodejs");
    const SmsClient = tencentcloud.sms.v20210111.Client;

    const client = new SmsClient({
      credential: { secretId, secretKey },
      region: process.env.SMS_REGION || "ap-guangzhou",
      profile: { httpProfile: { endpoint: "sms.tencentcloudapi.com" } },
    });

    const phoneNumber = phone.startsWith("+") ? phone : `+86${phone}`;

    await client.SendSms({
      PhoneNumberSet: [phoneNumber],
      SmsSdkAppId: sdkAppId,
      SignName: signName,
      TemplateId: templateId,
      TemplateParamSet: [SMS_MESSAGE],
    });

    return true;
  } catch (error) {
    console.error("SMS send failed:", error);
    return false;
  }
}

exports.main = async (event) => {
  try {
    const body = parseInput(event);
    const {
      mainContact,
      phone,
      wechatId,
      guests,
      dietaryRestrictions,
      isDriving,
      needsShuttle,
      shuttleLocation,
      notes,
    } = body;

    if (!mainContact || !String(mainContact).trim()) {
      return { success: false, error: "Name is required" };
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const timestamp = new Date().toISOString();
    const normalizedPhone = phone ? String(phone).trim() : "";

    const item = {
      id,
      mainContact: String(mainContact).trim(),
      wechatId: wechatId ? String(wechatId).trim() : "",
      guests: guests || [],
      dietaryRestrictions: dietaryRestrictions || "",
      isDriving: Boolean(isDriving),
      needsShuttle: Boolean(needsShuttle),
      shuttleLocation: shuttleLocation || "",
      notes: notes || "",
      createdAt: timestamp,
    };

    if (normalizedPhone) {
      item.phone = normalizedPhone;
    }

    await db.collection(COLLECTION).add({ data: item });

    let smsSent = false;
    if (normalizedPhone) {
      smsSent = await sendSms(normalizedPhone);
    }

    return {
      success: true,
      id,
      smsSent,
      message: smsSent ? "感谢您的回复！确认短信已发送。" : "感谢您的回复！",
    };
  } catch (error) {
    console.error("submitGuestForm error:", error);
    return {
      success: false,
      error: "Internal server error",
      message: error.message,
    };
  }
};
