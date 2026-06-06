#!/usr/bin/env node
/**
 * Sync Serverless Devs `default` access from Aliyun CLI OAuth profile.
 * Run before `pnpm deploy:aliyun` if you see "Not found access: default".
 *
 * Usage:
 *   pnpm s:config
 *   pnpm s:config -- --profile wedding
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseAliyunArgs } from "./aliyun-credentials.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ACCOUNT_ID = "1750002506010471";

function main() {
  const { profile, args } = parseAliyunArgs();
  if (args.length > 0) {
    console.error(`Unknown argument(s): ${args.join(" ")}`);
    console.error("Usage: pnpm s:config [-- --profile wedding]");
    process.exit(1);
  }

  const aliyunBin = process.env.ALIYUN_CLI_BIN || "aliyun";
  const stdout = execFileSync(
    aliyunBin,
    ["configure", "get", "--profile", profile],
    { encoding: "utf8" },
  );
  const cfg = JSON.parse(stdout.trim());

  if (!cfg.access_key_id || !cfg.access_key_secret) {
    console.error(`Profile "${profile}" has no credentials. Run:`);
    console.error(`  aliyun configure --mode OAuth --profile ${profile}`);
    process.exit(1);
  }

  const sArgs = [
    "config",
    "add",
    "--AccountID",
    ACCOUNT_ID,
    "--AccessKeyID",
    cfg.access_key_id,
    "--AccessKeySecret",
    cfg.access_key_secret,
    "-a",
    "default",
    "-f",
  ];

  if (cfg.sts_token) {
    sArgs.push("--SecurityToken", cfg.sts_token);
  }

  execFileSync("pnpm", ["exec", "s", ...sArgs], {
    stdio: "inherit",
    cwd: ROOT,
  });

  console.log(`\nServerless Devs access "default" synced from profile "${profile}".`);
}

main();
