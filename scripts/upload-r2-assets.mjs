#!/usr/bin/env node
/**
 * Upload local assets/ to Cloudflare R2 via wrangler CLI.
 *
 * Prerequisites:
 *   npm i -g wrangler
 *   wrangler login
 *   wrangler r2 bucket create wedding-assets
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const BUCKET = process.env.R2_BUCKET || "wedding-assets";

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

function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Missing assets directory: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = walkFiles(ASSETS_DIR);
  if (files.length === 0) {
    console.warn("No files found under assets/. Add images/fonts/music first.");
    process.exit(0);
  }

  console.log(`Uploading ${files.length} files to R2 bucket "${BUCKET}"...\n`);

  for (const filePath of files) {
    const relative = path.relative(ASSETS_DIR, filePath).split(path.sep).join("/");
    const objectKey = `assets/${relative}`;
    const contentType = contentTypeFor(filePath);

    console.log(`→ ${objectKey}`);

    execSync(
      `wrangler r2 object put "${BUCKET}/${objectKey}" --file="${filePath}" --content-type="${contentType}"`,
      { stdio: "inherit", cwd: ROOT },
    );
  }

  console.log("\nDone. Verify with:");
  console.log("  https://YOUR_WORKER_URL/assets/images/homepage-niu.png");
  console.log("\nThen set CLOUDFLARE_PUBLIC_BASE_URL in src/constants/cloudflare.ts");
}

main();
