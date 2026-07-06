#!/usr/bin/env node
/**
 * Deploy FC via OSS code package (bypasses Serverless Devs tempBucketToken).
 *
 * 1. Zip infra/aliyun/fc
 * 2. Upload to oss://wedding-asset/deploy/fc/wedding-invitation-api.zip
 * 3. Create/update function + HTTP trigger via FC 3.0 OpenAPI
 *
 * OAuth note: FC OpenAPI currently rejects OAuth STS credentials with
 * "missing parameter SecurityToken" (aliyun-cli#1271). Use a RAM AccessKey
 * profile for step 3, CloudShell, or the manual console steps printed on failure.
 *
 * Usage:
 *   pnpm deploy:aliyun
 *   pnpm deploy:aliyun -- --profile wedding-fc
 *   pnpm deploy:aliyun -- --upload-only
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  aliyunAuthHelpText,
  parseAliyunArgs,
  resolveAliyunCredentials,
} from "./aliyun-credentials.mjs";

const require = createRequire(import.meta.url);
const FC20230330 = require("@alicloud/fc20230330").default;
const { $OpenApiUtil } = require("@alicloud/openapi-core");
const {
  CreateFunctionRequest,
  UpdateFunctionRequest,
  CreateTriggerRequest,
  GetFunctionRequest,
} = require("@alicloud/fc20230330");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FC_DIR = path.join(ROOT, "infra/aliyun/fc");
const DEPLOY_DIR = path.join(ROOT, ".deploy");
const ZIP_PATH = path.join(DEPLOY_DIR, "wedding-invitation-api.zip");

const REGION = "cn-chengdu";
const FUNCTION_NAME = "wedding-invitation-api";
const TRIGGER_NAME = "httpTrigger";
const OSS_BUCKET = process.env.OSS_BUCKET || "wedding-asset";
const OSS_REGION = process.env.OSS_REGION || "oss-cn-chengdu";
const OSS_OBJECT = "deploy/fc/wedding-invitation-api.zip";

function parseDeployArgs(argv = process.argv.slice(2)) {
  const { profile, args } = parseAliyunArgs(argv);
  const flags = [];
  const positional = [];

  for (const arg of args) {
    if (arg === "--upload-only") {
      flags.push(arg);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length > 0) {
    console.error(`Unknown argument(s): ${positional.join(" ")}`);
    process.exit(1);
  }

  return { profile, uploadOnly: flags.includes("--upload-only") };
}

function isStsCredential(credentials) {
  return (
    Boolean(credentials.securityToken) ||
    credentials.accessKeyId?.startsWith("STS.")
  );
}

function isFcSecurityTokenError(error) {
  const message = error?.message || String(error);
  const code = error?.code || error?.data?.Code || "";
  return (
    message.includes("missing parameter SecurityToken") ||
    message.includes("MissingSecurityToken") ||
    code === "AccessDenied"
  );
}

function fcOauthHelpText(profile) {
  return [
    "",
    "FC deploy failed: OAuth / STS credentials are not supported by Function Compute OpenAPI.",
    "This is a known Aliyun CLI issue: https://github.com/aliyun/aliyun-cli/issues/1271",
    "",
    "Pick one workaround:",
    "",
    "A) RAM AccessKey profile (recommended for local deploy)",
    "   1. Create a RAM user with FC + OSS read permissions",
    "   2. aliyun configure --mode AK --profile wedding-fc",
    "   3. pnpm deploy:aliyun -- --profile wedding-fc",
    "",
    "B) CloudShell (console) — credentials work without long-lived AK",
    "   1. Open https://shell.aliyun.com/",
    "   2. git clone / cd repo && pnpm deploy:aliyun",
    "",
    "C) Manual console deploy (code zip is already on OSS)",
    `   Bucket: ${OSS_BUCKET}`,
    `   Object: ${OSS_OBJECT}`,
    `   Console: https://fcnext.console.aliyun.com/cn-chengdu/functions/create`,
    "   Runtime nodejs20, handler index.handler, memory 512, timeout 60",
    "   Code source: OSS, same bucket/object as above",
    "   Add HTTP trigger (anonymous, GET/POST/OPTIONS)",
    "",
    `Current profile: ${profile}`,
  ].join("\n");
}

function createFcClient(credentials) {
  const config = new $OpenApiUtil.Config({
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    securityToken: credentials.securityToken,
    regionId: REGION,
    endpoint: `fcv3.${REGION}.aliyuncs.com`,
  });
  return new FC20230330(config);
}

function buildZip() {
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });
  if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);

  console.log("Installing FC dependencies…");
  execFileSync("npm", ["install", "--omit=dev"], {
    cwd: FC_DIR,
    stdio: "inherit",
  });

  console.log("Creating zip…");
  execFileSync(
    "zip",
    ["-rq", ZIP_PATH, ".", "-x", "node_modules/.cache/*", "-x", ".DS_Store"],
    { cwd: FC_DIR },
  );

  const sizeMb = (fs.statSync(ZIP_PATH).size / 1024 / 1024).toFixed(2);
  console.log(`Zip ready: ${ZIP_PATH} (${sizeMb} MB)`);
}

async function uploadZip(credentials) {
  const { default: OSS } = await import("ali-oss");
  const options = {
    region: OSS_REGION,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    bucket: OSS_BUCKET,
    authorizationV4: true,
  };
  if (credentials.securityToken) {
    options.stsToken = credentials.securityToken;
  }

  const client = new OSS(options);
  console.log(`Uploading to oss://${OSS_BUCKET}/${OSS_OBJECT} …`);
  await client.put(OSS_OBJECT, ZIP_PATH, {
    headers: { "Content-Type": "application/zip" },
  });
  console.log("Upload complete.");
}

function isNotFound(error) {
  const message = error?.message || String(error);
  const code = error?.code || error?.data?.Code || "";
  return (
    message.includes("NotFound") ||
    message.includes("does not exist") ||
    code.includes("NotFound")
  );
}

function functionBody() {
  return {
    functionName: FUNCTION_NAME,
    description: "Wedding invitation guest form API",
    runtime: "nodejs20",
    handler: "index.handler",
    memorySize: 512,
    timeout: 60,
    internetAccess: true,
    environmentVariables: {
      TABLESTORE_INSTANCE: "wedding",
      TABLESTORE_ENDPOINT: "https://wedding.cn-chengdu.ots.aliyuncs.com",
      TABLESTORE_TABLE: "guests",
      DRAWINGS_OSS_BUCKET: "guest-drawings",
      DRAWINGS_OSS_REGION: "oss-cn-chengdu",
    },
    code: {
      ossBucketName: OSS_BUCKET,
      ossObjectName: OSS_OBJECT,
    },
  };
}

async function functionExists(client) {
  try {
    await client.getFunction(
      FUNCTION_NAME,
      new GetFunctionRequest({ qualifier: "LATEST" }),
    );
    return true;
  } catch (error) {
    if (isNotFound(error)) return false;
    throw error;
  }
}

async function deployFunction(client) {
  const body = functionBody();
  const exists = await functionExists(client);

  if (exists) {
    console.log(`Updating function ${FUNCTION_NAME}…`);
    await client.updateFunction(
      FUNCTION_NAME,
      new UpdateFunctionRequest({ body }),
    );
  } else {
    console.log(`Creating function ${FUNCTION_NAME}…`);
    await client.createFunction(new CreateFunctionRequest({ body }));
  }
}

async function getHttpTriggerUrl(client) {
  try {
    const response = await client.getTrigger(FUNCTION_NAME, TRIGGER_NAME);
    return response?.body?.httpTrigger?.urlInternet || null;
  } catch (error) {
    if (!isNotFound(error)) throw error;
    return null;
  }
}

async function ensureHttpTrigger(client) {
  let url = await getHttpTriggerUrl(client);
  if (url) return url;

  console.log("Creating HTTP trigger…");
  await client.createTrigger(
    FUNCTION_NAME,
    new CreateTriggerRequest({
      body: {
        triggerName: TRIGGER_NAME,
        triggerType: "http",
        triggerConfig: JSON.stringify({
          authType: "anonymous",
          methods: ["GET", "POST", "OPTIONS"],
        }),
      },
    }),
  );

  return getHttpTriggerUrl(client);
}

async function main() {
  const { profile, uploadOnly } = parseDeployArgs();

  let credentials;
  try {
    credentials = await resolveAliyunCredentials({ profile });
  } catch (error) {
    console.error(aliyunAuthHelpText(profile));
    throw error;
  }

  console.log(`Aliyun profile: ${profile}\n`);
  buildZip();
  await uploadZip(credentials);

  if (uploadOnly) {
    console.log("\nUpload-only complete. Finish FC deploy via AK profile or console.");
    console.log(fcOauthHelpText(profile));
    return;
  }

  if (isStsCredential(credentials)) {
    console.warn(
      "Warning: profile uses STS (OAuth). FC OpenAPI may fail — see infra/README.md if deploy errors.\n",
    );
  }

  const client = createFcClient(credentials);

  try {
    await deployFunction(client);
    const triggerUrl = await ensureHttpTrigger(client);

    console.log("\nDeploy complete.");
    if (triggerUrl) {
      console.log(
        `\nFC URL (paste into src/constants/aliyun.ts):\n${triggerUrl}`,
      );
      console.log(`\nHealth check:\n  curl ${triggerUrl}/health`);
    } else {
      console.log(
        "\nHTTP trigger URL not returned automatically. Check FC console → Triggers.",
      );
    }
    console.log(
      "\nRemember to bind a RAM role (Tablestore read/write) on the function in FC console.",
    );
  } catch (error) {
    if (isStsCredential(credentials) && isFcSecurityTokenError(error)) {
      console.error(fcOauthHelpText(profile));
      process.exit(2);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
