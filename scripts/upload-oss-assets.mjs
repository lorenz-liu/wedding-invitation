#!/usr/bin/env node
/**
 * Upload local assets/ to Aliyun OSS bucket wedding-asset.
 *
 * Auth (pick one — no long-lived AccessKey required):
 *   - CloudShell: automatic
 *   - Local: aliyun configure --mode OAuth
 *   - Optional env: ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET
 *
 * Optional:
 *   OSS_REGION (default: oss-cn-chengdu)
 *   OSS_BUCKET (default: wedding-asset)
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
const REGION = process.env.OSS_REGION || "oss-cn-chengdu";
const BUCKET = process.env.OSS_BUCKET || "wedding-asset";

/** Each object must be public-read for WeChat mini-program CDN access. */
const OSS_PUT_OPTIONS = {
  headers: { "x-oss-object-acl": "public-read" },
};

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

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile() && !entry.name.startsWith(".")) {
      files.push(fullPath);
    }
  }
  return files;
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
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

async function main() {
  const { profile, args } = parseAliyunArgs();
  if (args.length > 0) {
    console.error(`Unknown argument(s): ${args.join(" ")}`);
    console.error("Usage: pnpm upload:oss-assets [-- --profile wedding]");
    process.exit(1);
  }

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Missing assets directory: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = walkFiles(ASSETS_DIR);
  if (files.length === 0) {
    console.warn("No files found under assets/.");
    process.exit(0);
  }

  const client = await getOssClient(profile);
  console.log(`Aliyun profile: ${profile}`);
  console.log(`Uploading ${files.length} files to oss://${BUCKET}/ ...\n`);

  for (const filePath of files) {
    const relative = path.relative(ASSETS_DIR, filePath).split(path.sep).join("/");
    const objectKey = `assets/${relative}`;
    const contentType = contentTypeFor(filePath);

    console.log(`→ ${objectKey}`);
    await client.put(objectKey, filePath, {
      headers: {
        "Content-Type": contentType,
        ...OSS_PUT_OPTIONS.headers,
      },
    });
  }

  console.log("\nDone. Verify with:");
  console.log(`  https://${BUCKET}.${REGION}.aliyuncs.com/assets/images/homepage-niu.png`);
  console.log("\nThen bump ASSETS_CACHE_VERSION in src/constants/aliyun.ts");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
