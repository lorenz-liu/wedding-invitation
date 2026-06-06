#!/usr/bin/env node
/**
 * Upload a single file under assets/ to Aliyun OSS.
 *
 * Usage:
 *   pnpm upload:oss-file images/toronto-landmark.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  aliyunAuthHelpText,
  resolveAliyunCredentials,
} from "./aliyun-credentials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const REGION = process.env.OSS_REGION || "oss-cn-chengdu";
const BUCKET = process.env.OSS_BUCKET || "wedding-asset";

const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
};

function usage() {
  console.error("Usage: pnpm upload:oss-file <path-under-assets/>");
  console.error("Example: pnpm upload:oss-file images/toronto-landmark.png");
  process.exit(1);
}

async function main() {
  const relativeArg = process.argv[2];
  if (!relativeArg) usage();

  let credentials;
  try {
    credentials = await resolveAliyunCredentials();
  } catch (error) {
    console.error(aliyunAuthHelpText());
    throw error;
  }

  const relative = relativeArg.replace(/^assets\//, "").split(path.sep).join("/");
  const filePath = path.join(ASSETS_DIR, relative);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const objectKey = `assets/${relative}`;

  const { default: OSS } = await import("ali-oss");
  const ossOptions = {
    region: REGION,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    bucket: BUCKET,
    authorizationV4: true,
  };

  if (credentials.securityToken) {
    ossOptions.stsToken = credentials.securityToken;
  }

  const client = new OSS(ossOptions);

  console.log(`Uploading ${filePath}`);
  console.log(`→ oss://${BUCKET}/${objectKey} (${contentType})\n`);

  await client.put(objectKey, filePath, {
    headers: { "Content-Type": contentType },
  });

  console.log("\nDone. Bump ASSETS_CACHE_VERSION in src/constants/aliyun.ts if needed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
