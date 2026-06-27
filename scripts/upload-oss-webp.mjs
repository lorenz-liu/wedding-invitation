#!/usr/bin/env node
/**
 * Upload preloaded WebP images (from src/utils/assets.ts) to Aliyun OSS.
 *
 * Usage:
 *   pnpm upload:oss-webp
 *   pnpm upload:oss-webp -- --profile wedding
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  aliyunAuthHelpText,
  parseAliyunArgs,
  resolveAliyunCredentials,
} from "./aliyun-credentials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const ASSETS_TS = path.join(ROOT, "src/utils/assets.ts");
const REGION = process.env.OSS_REGION || "oss-cn-chengdu";
const BUCKET = process.env.OSS_BUCKET || "wedding-asset";

const OSS_PUBLIC_READ_HEADER = { "x-oss-object-acl": "public-read" };

function listPreloadedImagePaths() {
  const src = fs.readFileSync(ASSETS_TS, "utf8");
  return [
    ...new Set(
      [...src.matchAll(/assetPath\("images\/([^"]+)"\)/g)].map((match) => match[1]),
    ),
  ];
}

async function getOssClient(profile) {
  let credentials;
  try {
    credentials = await resolveAliyunCredentials({ profile });
  } catch (error) {
    console.error(aliyunAuthHelpText(profile));
    throw error;
  }

  const { default: OSS } = await import("ali-oss");
  const options = {
    region: REGION,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    bucket: BUCKET,
    authorizationV4: true,
  };

  if (credentials.securityToken) {
    options.stsToken = credentials.securityToken;
  }

  return new OSS(options);
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

async function main() {
  const { profile, args } = parseAliyunArgs();
  if (args.length > 0) {
    console.error(`Unknown argument(s): ${args.join(" ")}`);
    console.error("Usage: pnpm upload:oss-webp [-- --profile wedding]");
    process.exit(1);
  }

  const relativePaths = listPreloadedImagePaths();
  const files = relativePaths.map((relative) => ({
    relative,
    filePath: path.join(ASSETS_DIR, relative),
    objectKey: `assets/${relative.replace(/^assets\//, "")}`,
  }));

  for (const file of files) {
    if (!fs.existsSync(file.filePath) || !fs.statSync(file.filePath).isFile()) {
      console.error(`Missing file: ${file.filePath}`);
      process.exit(1);
    }
  }

  const client = await getOssClient(profile);
  console.log(`Aliyun profile: ${profile}`);
  console.log(`Uploading ${files.length} preloaded images to oss://${BUCKET}/ ...\n`);

  let uploadedBytes = 0;

  for (const file of files) {
    const contentType = contentTypeFor(file.filePath);
    const bytes = fs.statSync(file.filePath).size;
    uploadedBytes += bytes;

    console.log(
      `→ ${file.objectKey} (${contentType}, ${(bytes / 1024).toFixed(1)} KB)`,
    );
    await client.put(file.objectKey, file.filePath, {
      headers: {
        "Content-Type": contentType,
        ...OSS_PUBLIC_READ_HEADER,
      },
    });
  }

  console.log("\nDone.");
  console.log(`Uploaded ${(uploadedBytes / 1024 / 1024).toFixed(2)} MB total.`);
  console.log("\nNext steps:");
  console.log("  1. Bump ASSETS_CACHE_VERSION in src/constants/aliyun.ts");
  console.log("  2. pnpm build:weapp");
  console.log("\nVerify example:");
  const sample = files.find((file) => file.relative.endsWith(".webp")) ?? files[0];
  if (sample) {
    console.log(`  https://${BUCKET}.${REGION}.aliyuncs.com/${sample.objectKey}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
