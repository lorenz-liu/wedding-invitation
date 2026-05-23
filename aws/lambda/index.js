const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});

const SMS_MESSAGE = [
  "收到啦！我们已悉心记下所有细节。",
  "",
  "何其荣幸您将出席我们的婚礼，请放心，我们会为您备好一切。若后续行程有变，或有任何需要，欢迎随时通过微信（LuvGaw）或电话（19800301620）与我们联络。",
  "",
  "7月25日，成都·慕上，期待与您相见！",
  "",
  "—— 刘兆薰 & 高文珩 敬上",
].join("\n");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

exports.handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
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
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Name is required" }),
      };
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
      isDriving: isDriving || false,
      needsShuttle: needsShuttle || false,
      shuttleLocation: shuttleLocation || "",
      notes: notes || "",
      createdAt: timestamp,
    };

    if (normalizedPhone) {
      item.phone = normalizedPhone;
    }

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: item,
      })
    );

    let smsSent = false;
    if (normalizedPhone) {
      try {
        const phoneNumber = normalizedPhone.startsWith("+")
          ? normalizedPhone
          : `+86${normalizedPhone}`;
        await sns.send(
          new PublishCommand({
            Message: SMS_MESSAGE,
            PhoneNumber: phoneNumber,
            MessageAttributes: {
              "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
              },
            },
          })
        );
        smsSent = true;
      } catch (smsError) {
        console.error("SMS send failed:", smsError);
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        id,
        smsSent,
        message: smsSent ? "感谢您的回复！确认短信已发送。" : "感谢您的回复！",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
