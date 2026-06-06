/**
 * Resolve Aliyun credentials via the default chain (no long-lived AccessKey required):
 * - CloudShell: auto-injected temporary credentials
 * - `aliyun configure --mode OAuth` / Cloud SSO: ~/.aliyun/config.json
 * - FC RAM role: instance metadata
 * - Optional env: ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET
 */
import Credential from "@alicloud/credentials";

export async function resolveAliyunCredentials() {
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

export function aliyunAuthHelpText() {
  return [
    "Aliyun credentials not found. Use one of:",
    "  1. CloudShell (console) — credentials are automatic",
    "  2. Local: aliyun configure --mode OAuth",
    "  3. Cloud SSO: aliyun configure --mode CloudSSO",
    "  4. Optional: export ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET",
    "See infra/aliyun/SETUP.md",
  ].join("\n");
}
