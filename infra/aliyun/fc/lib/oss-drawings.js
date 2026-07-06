"use strict";

const OSS = require("ali-oss");
const { resolveAliyunCredentials } = require("./credentials");

async function createDrawingsClient() {
  const credentials = await resolveAliyunCredentials();
  const region = process.env.DRAWINGS_OSS_REGION || "oss-cn-chengdu";
  const bucket = process.env.DRAWINGS_OSS_BUCKET || "guest-drawings";

  const options = {
    region,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    bucket,
    authorizationV4: true,
  };

  if (credentials.securityToken) {
    options.stsToken = credentials.securityToken;
  }

  return new OSS(options);
}

async function uploadGuestDrawing(guestId, drawingId, buffer) {
  const client = await createDrawingsClient();
  const objectKey = `${guestId}/${drawingId}.png`;

  await client.put(objectKey, buffer, {
    headers: {
      "Content-Type": "image/png",
      "x-oss-object-acl": "private",
    },
  });

  return objectKey;
}

module.exports = { uploadGuestDrawing };
