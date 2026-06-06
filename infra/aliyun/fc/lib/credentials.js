"use strict";

const Credential = require("@alicloud/credentials").default;

async function resolveAliyunCredentials() {
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
  const securityToken = process.env.ALIBABA_CLOUD_SECURITY_TOKEN;

  if (accessKeyId && accessKeySecret) {
    return { accessKeyId, accessKeySecret, securityToken };
  }

  const credential = new Credential();
  const resolved = await credential.getCredential();

  return {
    accessKeyId: resolved.accessKeyId,
    accessKeySecret: resolved.accessKeySecret,
    securityToken: resolved.securityToken,
  };
}

module.exports = { resolveAliyunCredentials };
