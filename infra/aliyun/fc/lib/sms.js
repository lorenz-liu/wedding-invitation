"use strict";

const RPCClient = require("@alicloud/pop-core").RPCClient;
const { resolveAliyunCredentials } = require("./credentials");

const SMS_MESSAGE = [
  "收到啦！我们已悉心记下所有细节。",
  "",
  "何其荣幸您将出席我们的婚礼，请放心，我们会为您备好一切。若后续行程有变，或有任何需要，欢迎随时通过微信（LuvGaw）或电话（19800301620）与我们联络。",
  "",
  "7月25日，成都·慕上，期待与您相见！",
  "",
  "—— 刘兆薰 & 高文珩 敬上",
].join("\n");

function isSmsConfigured() {
  return Boolean(process.env.SMS_SIGN_NAME && process.env.SMS_TEMPLATE_CODE);
}

async function createSmsClient() {
  const { accessKeyId, accessKeySecret, securityToken } =
    await resolveAliyunCredentials();

  const options = {
    accessKeyId,
    accessKeySecret,
    endpoint: "https://dysmsapi.aliyuncs.com",
    apiVersion: "2017-05-25",
  };

  if (securityToken) {
    options.securityToken = securityToken;
  }

  return new RPCClient(options);
}

async function sendSms(phone) {
  if (!isSmsConfigured()) {
    console.warn("SMS env vars not configured, skipping SMS");
    return false;
  }

  const phoneNumber = phone.startsWith("+") ? phone : phone.replace(/^\+86/, "");

  try {
    const client = await createSmsClient();
    const templateParam = process.env.SMS_TEMPLATE_PARAM
      ? process.env.SMS_TEMPLATE_PARAM
      : JSON.stringify({ content: SMS_MESSAGE });

    const result = await client.request(
      "SendSms",
      {
        PhoneNumbers: phoneNumber,
        SignName: process.env.SMS_SIGN_NAME,
        TemplateCode: process.env.SMS_TEMPLATE_CODE,
        TemplateParam: templateParam,
      },
      { method: "POST" },
    );

    if (result.Code !== "OK") {
      console.error("SMS API error:", result);
      return false;
    }

    return true;
  } catch (error) {
    console.error("SMS send failed:", error);
    return false;
  }
}

module.exports = { sendSms, SMS_MESSAGE };
