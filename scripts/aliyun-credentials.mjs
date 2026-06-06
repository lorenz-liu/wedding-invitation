/**
 * Resolve Aliyun credentials via the default chain (no long-lived AccessKey required):
 * - CloudShell: auto-injected temporary credentials (env vars)
 * - OAuth / Cloud SSO: `aliyun configure get` (reads ~/.aliyun/config.json STS)
 * - FC RAM role / ECS: @alicloud/credentials default chain
 * - Optional env: ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET
 */
import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const require = createRequire(fileURLToPath(import.meta.url));

/** Default CLI profile for this repo (`aliyun configure --profile wedding`). */
export const DEFAULT_ALIYUN_PROFILE = "wedding";

/**
 * Parse `--profile NAME` / `--profile=NAME` from script argv.
 * Returns remaining positional args.
 */
export function parseAliyunArgs(argv = process.argv.slice(2)) {
  const args = [...argv];
  let profile;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--profile" && args[i + 1]) {
      profile = args[i + 1];
      args.splice(i, 2);
      i -= 1;
      continue;
    }
    if (arg.startsWith("--profile=")) {
      profile = arg.slice("--profile=".length);
      args.splice(i, 1);
      i -= 1;
    }
  }

  return {
    profile: profile ?? resolveProfileName(),
    args,
  };
}

export function resolveProfileName(explicitProfile) {
  if (explicitProfile) return explicitProfile;
  if (process.env.ALIBABA_CLOUD_PROFILE) {
    return process.env.ALIBABA_CLOUD_PROFILE;
  }
  return DEFAULT_ALIYUN_PROFILE;
}

async function resolveFromAliyunCli(profile) {
  const aliyunBin = process.env.ALIYUN_CLI_BIN || "aliyun";

  try {
    await execFileAsync(
      aliyunBin,
      ["sts", "GetCallerIdentity", "--profile", profile],
      { env: process.env },
    );
  } catch {
    // configure get may still succeed; GetCallerIdentity also refreshes OAuth STS
  }

  const { stdout } = await execFileAsync(
    aliyunBin,
    ["configure", "get", "--profile", profile],
    { env: process.env },
  );

  const config = JSON.parse(stdout.trim());
  if (!config.access_key_id || !config.access_key_secret) {
    throw new Error(`Profile "${profile}" has no access_key_id/access_key_secret`);
  }

  return {
    accessKeyId: config.access_key_id,
    accessKeySecret: config.access_key_secret,
    securityToken: config.sts_token || undefined,
  };
}

async function resolveViaCredentialsSdk() {
  const credentialModule = require("@alicloud/credentials");
  const Credential = credentialModule.default || credentialModule;
  const credential = new Credential();
  const resolved = await credential.getCredential();

  return {
    accessKeyId: resolved.accessKeyId,
    accessKeySecret: resolved.accessKeySecret,
    securityToken: resolved.securityToken,
  };
}

export async function resolveAliyunCredentials(options = {}) {
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
  const securityToken = process.env.ALIBABA_CLOUD_SECURITY_TOKEN;

  if (accessKeyId && accessKeySecret) {
    return { accessKeyId, accessKeySecret, securityToken };
  }

  const profile = resolveProfileName(options.profile);
  const configPath = path.join(os.homedir(), ".aliyun", "config.json");

  if (fs.existsSync(configPath)) {
    try {
      return await resolveFromAliyunCli(profile);
    } catch (cliError) {
      const cliMessage =
        cliError instanceof Error ? cliError.message : String(cliError);
      if (
        cliMessage.includes("not found") ||
        cliMessage.includes("ENOENT") ||
        cliMessage.includes("spawn aliyun")
      ) {
        // aliyun CLI missing — fall through to SDK chain
      } else {
        throw new Error(
          `Failed to load Aliyun CLI profile "${profile}": ${cliMessage}`,
        );
      }
    }
  }

  try {
    return await resolveViaCredentialsSdk();
  } catch (sdkError) {
    const sdkMessage =
      sdkError instanceof Error ? sdkError.message : String(sdkError);
    throw new Error(sdkMessage);
  }
}

export function aliyunAuthHelpText(profile = resolveProfileName()) {
  return [
    "Aliyun credentials not found. Use one of:",
    `  1. aliyun configure --mode OAuth --profile ${DEFAULT_ALIYUN_PROFILE}`,
    `  2. Pass --profile NAME (default for this repo: ${DEFAULT_ALIYUN_PROFILE})`,
    "  3. CloudShell (console) — credentials are automatic",
    "  4. Cloud SSO: aliyun configure --mode CloudSSO",
    `Resolved profile: ${profile}`,
    "See infra/README.md",
  ].join("\n");
}
