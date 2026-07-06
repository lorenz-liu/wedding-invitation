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

function getRow(client, params) {
  return new Promise((resolve, reject) => {
    client.getRow(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function updateRow(client, params) {
  return new Promise((resolve, reject) => {
    client.updateRow(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getTableName() {
  return process.env.TABLESTORE_TABLE || "guests";
}

function parseAttributeMap(row) {
  const map = {};
  const columns = row?.attributes || row?.attribute_columns || [];

  for (const column of columns) {
    if (Array.isArray(column)) {
      map[column[0]] = column[1];
      continue;
    }
    if (column && typeof column === "object") {
      for (const [key, value] of Object.entries(column)) {
        map[key] = value;
      }
    }
  }

  return map;
}

async function insertGuest(record) {
  const client = await createClient();
  const tableName = getTableName();

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
      { drawing_ids: "[]" },
      { created_at: record.createdAt },
    ],
  };

  await putRow(client, params);
}

async function appendGuestDrawingId(guestId, drawingId) {
  const client = await createClient();
  const tableName = getTableName();

  const data = await getRow(client, {
    tableName,
    primaryKey: [{ id: guestId }],
    maxVersions: 1,
  });

  if (!data?.row?.primaryKey?.length) {
    throw new Error("Guest not found");
  }

  const attrs = parseAttributeMap(data.row);
  let drawingIds = [];

  try {
    drawingIds = JSON.parse(attrs.drawing_ids || "[]");
    if (!Array.isArray(drawingIds)) drawingIds = [];
  } catch {
    drawingIds = [];
  }

  drawingIds.push(drawingId);

  await updateRow(client, {
    tableName,
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.EXPECT_EXIST,
      null,
    ),
    primaryKey: [{ id: guestId }],
    updateOfAttributeColumns: [
      {
        PUT: [{ drawing_ids: JSON.stringify(drawingIds) }],
      },
    ],
  });
}

module.exports = { insertGuest, appendGuestDrawingId };
