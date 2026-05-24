#!/usr/bin/env node
/**
 * Upload local `assets/` to WeChat Cloud Storage.
 *
 * Prerequisites:
 *   1. Enable 云开发 for the mini program in WeChat DevTools.
 *   2. Install CloudBase CLI:  npm i -g @cloudbase/cli
 *   3. Login once:            tcb login
 *
 * Usage:
 *   CLOUD_ENV_ID=your-env-id node scripts/upload-cloud-assets.mjs
 *
 * Or upload manually in DevTools:
 *   云开发 → 存储 → 上传文件/文件夹 → select repo `assets/` → cloud path `assets`
 *   Then copy any FileID prefix into src/constants/cloud.ts
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const CLOUD_ENV_ID = process.env.CLOUD_ENV_ID;

async function walkFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath, base)));
    } else {
      files.push(path.relative(base, fullPath));
    }
  }

  return files.sort();
}

async function main() {
  const files = await walkFiles(ASSETS_DIR);
  let totalBytes = 0;

  for (const file of files) {
    const fullPath = path.join(ASSETS_DIR, file);
    const info = await stat(fullPath);
    totalBytes += info.size;
  }

  console.log(`Found ${files.length} asset files (${(totalBytes / 1024 / 1024).toFixed(1)} MB)`);
  console.log("Cloud path prefix: assets/<same relative path>\n");

  if (!CLOUD_ENV_ID) {
    console.log("CLOUD_ENV_ID is not set.\n");
    console.log("Manual upload:");
    console.log("  1. Open WeChat DevTools → 云开发 → 存储");
    console.log("  2. Upload the local folder: assets/");
    console.log("  3. Keep the same structure under cloud path `assets/`");
    console.log("  4. Copy any file FileID prefix to src/constants/cloud.ts\n");
    console.log("Automated upload (requires @cloudbase/cli):");
    console.log("  npm i -g @cloudbase/cli && tcb login");
    console.log("  CLOUD_ENV_ID=your-env-id node scripts/upload-cloud-assets.mjs\n");
    console.log("Files to upload:");
    for (const file of files) {
      console.log(`  assets/${file}`);
    }
    process.exit(0);
  }

  console.log(`Uploading to env: ${CLOUD_ENV_ID}\n`);

  for (const file of files) {
    const localPath = path.join(ASSETS_DIR, file);
    const cloudPath = `assets/${file}`.replace(/\\/g, "/");
    const result = spawnSync(
      "tcb",
      ["storage", "upload", localPath, cloudPath, "-e", CLOUD_ENV_ID],
      { stdio: "inherit" },
    );

    if (result.status !== 0) {
      console.error(`Failed to upload ${cloudPath}`);
      process.exit(result.status ?? 1);
    }
  }

  console.log("\nUpload complete.");
  console.log("Next steps:");
  console.log("  1. Open any uploaded file in DevTools → copy FileID");
  console.log("  2. Set CLOUD_ENV_ID and CLOUD_STORAGE_FILE_PREFIX in src/constants/cloud.ts");
  console.log("  3. Run: pnpm build:weapp");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
