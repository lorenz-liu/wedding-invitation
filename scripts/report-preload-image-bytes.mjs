#!/usr/bin/env node
/**
 * Print IMAGE_PRELOAD_BYTES block from src/utils/assets.ts paths + local file sizes.
 *
 * Usage:
 *   node scripts/report-preload-image-bytes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_TS = path.join(ROOT, "src/utils/assets.ts");
const IMAGES_DIR = path.join(ROOT, "assets/images");

const src = fs.readFileSync(ASSETS_TS, "utf8");
const entries = [...src.matchAll(/(\w+):\s*assetPath\("images\/([^"]+)"\)/g)];

if (entries.length === 0) {
  console.error("No image entries found in assets.ts");
  process.exit(1);
}

let total = 0;
const lines = [];

for (const [, key, relativePath] of entries) {
  const filePath = path.join(IMAGES_DIR, relativePath);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    process.exit(1);
  }
  const bytes = fs.statSync(filePath).size;
  total += bytes;
  lines.push(`  ${key}: ${String(bytes).replace(/\B(?=(\d{3})+(?!\d))/g, "_")},`);
}

console.log("const IMAGE_PRELOAD_BYTES: Record<keyof typeof images, number> = {");
console.log(lines.join("\n"));
console.log("};");
console.error(`\nTotal image bytes: ${(total / 1024 / 1024).toFixed(2)} MB`);
