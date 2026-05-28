#!/usr/bin/env node
/**
 * Upload a single file under assets/ to Cloudflare R2.
 *
 * Usage:
 *   pnpm upload:r2-file images/toronto-landmark.png
 *   node scripts/upload-r2-file.mjs fonts/Childhood.ttf
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const BUCKET = process.env.R2_BUCKET || "wedding-assets";
const WRANGLER_CWD = path.join(ROOT, "infra/cloudflare");

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
  console.error("Usage: pnpm upload:r2-file <path-under-assets/>");
  console.error("Example: pnpm upload:r2-file images/toronto-landmark.png");
  process.exit(1);
}

function main() {
  const relativeArg = process.argv[2];
  if (!relativeArg) usage();

  const relative = relativeArg.replace(/^assets\//, "").split(path.sep).join("/");
  const filePath = path.join(ASSETS_DIR, relative);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const objectKey = `assets/${relative}`;

  console.log(`Uploading ${filePath}`);
  console.log(`→ ${BUCKET}/${objectKey} (${contentType})\n`);

  execSync(
    `wrangler r2 object put "${BUCKET}/${objectKey}" --file="${filePath}" --content-type="${contentType}" --remote`,
    { stdio: "inherit", cwd: WRANGLER_CWD },
  );

  console.log("\nDone. Bump ASSETS_CACHE_VERSION in src/constants/cloudflare.ts if clients should bypass cache.");
}

main();
