"use strict";

const TableStore = require("tablestore");
const { resolveAliyunCredentials } = require("./credentials");

async function createClient() {
  const endpoint = process.env.TABLESTORE_ENDPOINT;
  const instancename = process.env.TABLESTORE_INSTANCE;

  if (!endpoint || !instancename) {
    throw new Error("Missing TABLESTORE_ENDPOINT or TABLESTORE_INSTANCE");
  }

  const { accessKeyId, accessKeySecret, securityToken } =
    await resolveAliyunCredentials();

  const options = {
    accessKeyId,
    accessKeySecret,
    endpoint,
    instancename,
  };

  if (securityToken) {
    options.stsToken = securityToken;
  }

  return new TableStore.Client(options);
}

function putRow(client, params) {
  return new Promise((resolve, reject) => {
    client.putRow(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function insertGuest(record) {
  const client = await createClient();
  const tableName = process.env.TABLESTORE_TABLE || "guests";

  const params = {
    tableName,
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.IGNORE,
      null,
    ),
    primaryKey: [{ id: record.id }],
    attributeColumns: [
      { main_contact: record.mainContact },
      { phone: record.phone || "" },
      { wechat_id: record.wechatId || "" },
      { guests_json: record.guestsJson },
      { dietary_restrictions: record.dietaryRestrictions || "" },
      { is_driving: record.isDriving ? 1 : 0 },
      { needs_shuttle: record.needsShuttle ? 1 : 0 },
      { shuttle_location: record.shuttleLocation || "" },
      { notes: record.notes || "" },
      { created_at: record.createdAt },
    ],
  };

  await putRow(client, params);
}

module.exports = { insertGuest };
