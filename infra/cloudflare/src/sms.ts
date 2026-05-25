export interface SmsEnv {
  SMS_SECRET_ID?: string;
  SMS_SECRET_KEY?: string;
  SMS_SDK_APP_ID?: string;
  SMS_SIGN_NAME?: string;
  SMS_TEMPLATE_ID?: string;
  SMS_REGION?: string;
}

const SMS_MESSAGE = [
  "收到啦！我们已悉心记下所有细节。",
  "",
  "何其荣幸您将出席我们的婚礼，请放心，我们会为您备好一切。若后续行程有变，或有任何需要，欢迎随时通过微信（LuvGaw）或电话（19800301620）与我们联络。",
  "",
  "7月25日，成都·慕上，期待与您相见！",
  "",
  "—— 刘兆薰 & 高文珩 敬上",
].join("\n");

function isSmsConfigured(env: SmsEnv): boolean {
  return Boolean(
    env.SMS_SECRET_ID &&
      env.SMS_SECRET_KEY &&
      env.SMS_SDK_APP_ID &&
      env.SMS_SIGN_NAME &&
      env.SMS_TEMPLATE_ID,
  );
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256(key: ArrayBuffer | string, value: string): Promise<ArrayBuffer> {
  const keyData =
    typeof key === "string" ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(value));
}

function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function tencentCloudFetch(
  service: string,
  action: string,
  payload: Record<string, unknown>,
  env: SmsEnv,
): Promise<Response> {
  const secretId = env.SMS_SECRET_ID!;
  const secretKey = env.SMS_SECRET_KEY!;
  const region = env.SMS_REGION || "ap-guangzhou";
  const host = `${service}.tencentcloudapi.com`;
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const body = JSON.stringify(payload);

  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\n`;
  const signedHeaders = "content-type;host";
  const hashedPayload = await sha256Hex(body);
  const canonicalRequest = [
    "POST",
    "/",
    "",
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
  ].join("\n");

  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign = [
    "TC3-HMAC-SHA256",
    String(timestamp),
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const secretDate = await hmacSha256(`TC3${secretKey}`, date);
  const secretService = await hmacSha256(secretDate, service);
  const secretSigning = await hmacSha256(secretService, "tc3_request");
  const signature = bufferToHex(await hmacSha256(secretSigning, stringToSign));

  const authorization = [
    "TC3-HMAC-SHA256",
    `Credential=${secretId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ");

  return fetch(`https://${host}`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json; charset=utf-8",
      Host: host,
      "X-TC-Action": action,
      "X-TC-Timestamp": String(timestamp),
      "X-TC-Version": "2021-01-11",
      "X-TC-Region": region,
    },
    body,
  });
}

export async function sendSms(phone: string, env: SmsEnv): Promise<boolean> {
  if (!isSmsConfigured(env)) {
    console.warn("SMS env vars not configured, skipping SMS");
    return false;
  }

  const phoneNumber = phone.startsWith("+") ? phone : `+86${phone}`;

  try {
    const response = await tencentCloudFetch(
      "sms",
      "SendSms",
      {
        PhoneNumberSet: [phoneNumber],
        SmsSdkAppId: env.SMS_SDK_APP_ID,
        SignName: env.SMS_SIGN_NAME,
        TemplateId: env.SMS_TEMPLATE_ID,
        TemplateParamSet: [SMS_MESSAGE],
      },
      env,
    );

    if (!response.ok) {
      console.error("SMS HTTP error:", response.status, await response.text());
      return false;
    }

    const result = (await response.json()) as {
      Response?: { Error?: { Message?: string } };
    };

    if (result.Response?.Error) {
      console.error("SMS API error:", result.Response.Error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("SMS send failed:", error);
    return false;
  }
}
