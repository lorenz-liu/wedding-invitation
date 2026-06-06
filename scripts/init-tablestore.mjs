#!/usr/bin/env node
/**
 * Create the `guests` table in Tablestore (idempotent — skips if exists).
 *
 * Auth (pick one — no long-lived AccessKey required):
 *   - CloudShell: automatic
 *   - Local: aliyun configure --mode OAuth
 *   - Optional env: ALIBABA_CLOUD_ACCESS_KEY_ID / ALIBABA_CLOUD_ACCESS_KEY_SECRET
 *
 * Optional:
 *   TABLESTORE_ENDPOINT (default: https://wedding.cn-chengdu.ots.aliyuncs.com)
 *   TABLESTORE_INSTANCE (default: wedding)
 *   TABLESTORE_TABLE (default: guests)
 */
import TableStore from "tablestore";
import {
  aliyunAuthHelpText,
  parseAliyunArgs,
  resolveAliyunCredentials,
} from "./aliyun-credentials.mjs";

const { profile, args } = parseAliyunArgs();
if (args.length > 0) {
  console.error(`Unknown argument(s): ${args.join(" ")}`);
  console.error("Usage: pnpm db:init-tablestore [-- --profile wedding]");
  process.exit(1);
}

const endpoint =
  process.env.TABLESTORE_ENDPOINT || "https://wedding.cn-chengdu.ots.aliyuncs.com";
const instancename = process.env.TABLESTORE_INSTANCE || "wedding";
const tableName = process.env.TABLESTORE_TABLE || "guests";

function listTables(client) {
  return new Promise((resolve, reject) => {
    client.listTable({}, (err, data) => {
      if (err) reject(err);
      else resolve(data.table_names || data.tableNames || []);
    });
  });
}

function createTable(client) {
  return new Promise((resolve, reject) => {
    client.createTable(
      {
        tableMeta: {
          tableName,
          primaryKey: [{ name: "id", type: "STRING" }],
        },
        reservedThroughput: {
          capacityUnit: { read: 0, write: 0 },
        },
        tableOptions: {
          timeToLive: -1,
          maxVersions: 1,
        },
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      },
    );
  });
}

async function main() {
  console.log(`Tablestore instance: ${instancename}`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Table: ${tableName}`);
  console.log(`Aliyun profile: ${profile}\n`);

  let credentials;
  try {
    credentials = await resolveAliyunCredentials({ profile });
  } catch (error) {
    console.error(aliyunAuthHelpText(profile));
    throw error;
  }

  const clientOptions = {
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    endpoint,
    instancename,
  };

  if (credentials.securityToken) {
    clientOptions.stsToken = credentials.securityToken;
  }

  const client = new TableStore.Client(clientOptions);

  const tables = await listTables(client);
  if (tables.includes(tableName)) {
    console.log(`Table "${tableName}" already exists. Nothing to do.`);
    return;
  }

  await createTable(client);
  console.log(`Created table "${tableName}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
