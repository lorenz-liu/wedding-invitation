import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import Credential from "@alicloud/credentials";

const execFileAsync = promisify(execFile);

export const DEFAULT_ALIYUN_PROFILE = "wedding";

export interface AliyunCredentials {
  accessKeyId: string;
  accessKeySecret: string;
  securityToken?: string;
}

function resolveProfileName(): string {
  return process.env.ALIBABA_CLOUD_PROFILE?.trim() || DEFAULT_ALIYUN_PROFILE;
}

async function resolveFromAliyunCli(profile: string): Promise<AliyunCredentials> {
  const aliyunBin = process.env.ALIYUN_CLI_BIN || "aliyun";

  try {
    await execFileAsync(
      aliyunBin,
      ["sts", "GetCallerIdentity", "--profile", profile],
      { env: process.env },
    );
  } catch {
    // OAuth STS refresh may still succeed via configure get
  }

  const { stdout } = await execFileAsync(
    aliyunBin,
    ["configure", "get", "--profile", profile],
    { env: process.env },
  );

  const config = JSON.parse(stdout.trim()) as {
    access_key_id?: string;
    access_key_secret?: string;
    sts_token?: string;
  };

  if (!config.access_key_id || !config.access_key_secret) {
    throw new Error(`Profile "${profile}" has no access_key_id/access_key_secret`);
  }

  return {
    accessKeyId: config.access_key_id,
    accessKeySecret: config.access_key_secret,
    securityToken: config.sts_token || undefined,
  };
}

async function resolveViaCredentialsSdk(): Promise<AliyunCredentials> {
  const credential = new Credential();
  const resolved = await credential.getCredential();

  if (!resolved.accessKeyId || !resolved.accessKeySecret) {
    throw new Error("Failed to resolve Aliyun credentials");
  }

  return {
    accessKeyId: resolved.accessKeyId,
    accessKeySecret: resolved.accessKeySecret,
    securityToken: resolved.securityToken,
  };
}

export async function resolveAliyunCredentials(): Promise<AliyunCredentials> {
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
  const securityToken = process.env.ALIBABA_CLOUD_SECURITY_TOKEN;

  if (accessKeyId && accessKeySecret) {
    return { accessKeyId, accessKeySecret, securityToken };
  }

  const profile = resolveProfileName();
  const configPath = path.join(os.homedir(), ".aliyun", "config.json");

  if (fs.existsSync(configPath)) {
    try {
      return await resolveFromAliyunCli(profile);
    } catch (cliError) {
      const message =
        cliError instanceof Error ? cliError.message : String(cliError);
      if (
        message.includes("not found") ||
        message.includes("ENOENT") ||
        message.includes("spawn aliyun")
      ) {
        // fall through to SDK chain
      } else {
        throw new Error(`Failed to load Aliyun CLI profile "${profile}": ${message}`);
      }
    }
  }

  return resolveViaCredentialsSdk();
}

export function aliyunAuthHelpText(profile = resolveProfileName()): string {
  return [
    "Aliyun credentials not found. For local use, run:",
    `  aliyun configure --mode OAuth --profile ${DEFAULT_ALIYUN_PROFILE}`,
    `Then verify: aliyun sts GetCallerIdentity --profile ${profile}`,
    "Or set ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET in .env.local",
  ].join("\n");
}
