import TableStore from "tablestore";
import type { GuestRecord } from "./types";
import { resolveAliyunCredentials } from "./credentials";

function getConfig() {
  const endpoint =
    process.env.TABLESTORE_ENDPOINT ||
    "https://wedding.cn-chengdu.ots.aliyuncs.com";
  const instancename = process.env.TABLESTORE_INSTANCE || "wedding";
  const tableName = process.env.TABLESTORE_TABLE || "guests";

  return { endpoint, instancename, tableName };
}

async function createClient() {
  const { endpoint, instancename } = getConfig();
  const { accessKeyId, accessKeySecret, securityToken } =
    await resolveAliyunCredentials();

  const options: Record<string, string> = {
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

type TableStoreAttributeColumn = {
  columnName?: string;
  columnValue?: unknown;
  timestamp?: number;
};

function normalizeCellValue(value: unknown): unknown {
  if (value == null) return value;
  if (
    typeof value === "object" &&
    "toNumber" in value &&
    typeof (value as { toNumber: () => number }).toNumber === "function"
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return value.toString("utf8");
  }
  return value;
}

function parseAttributeMap(row: {
  attributes?: Array<
    TableStoreAttributeColumn | [string, unknown] | Record<string, unknown>
  >;
  attribute_columns?: Array<
    TableStoreAttributeColumn | [string, unknown] | Record<string, unknown>
  >;
}) {
  const map: Record<string, unknown> = {};
  const columns = row?.attributes || row?.attribute_columns || [];

  for (const column of columns) {
    if (Array.isArray(column)) {
      map[column[0]] = normalizeCellValue(column[1]);
      continue;
    }
    if (!column || typeof column !== "object") continue;

    // Tablestore JS SDK readRow/getRange format
    if ("columnName" in column && column.columnName != null) {
      map[column.columnName] = normalizeCellValue(column.columnValue);
      continue;
    }

    // Write format: { main_contact: "..." }
    for (const [key, value] of Object.entries(column)) {
      if (key === "timestamp") continue;
      map[key] = normalizeCellValue(value);
    }
  }

  return map;
}

function parseCompanions(raw: unknown) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        return {
          name: String(record.name ?? "").trim(),
          relation: String(record.relation ?? "").trim(),
        };
      })
      .filter(
        (item): item is { name: string; relation: string } =>
          item !== null && (item.name !== "" || item.relation !== ""),
      );
  } catch {
    return [];
  }
}

function parseDrawingIds(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((id) => String(id)).filter(Boolean);
  } catch {
    return [];
  }
}

function rowToGuest(
  row: {
    primaryKey?: Array<{ name?: string; value?: unknown }>;
    attributes?: Array<TableStoreAttributeColumn | [string, unknown]>;
  },
  idOverride?: string,
): GuestRecord | null {
  const pk = row.primaryKey?.[0];
  const id =
    idOverride ??
    (pk?.value != null && pk.value !== "" ? String(normalizeCellValue(pk.value)) : "");
  if (!id) return null;

  const attrs = parseAttributeMap(row);

  return {
    id,
    mainContact: String(attrs.main_contact ?? "").trim(),
    phone: String(attrs.phone ?? "").trim(),
    wechatId: String(attrs.wechat_id ?? "").trim(),
    companions: parseCompanions(attrs.guests_json),
    dietaryRestrictions: String(attrs.dietary_restrictions ?? "").trim(),
    isDriving: Number(attrs.is_driving) === 1,
    needsShuttle: Number(attrs.needs_shuttle) === 1,
    shuttleLocation: String(attrs.shuttle_location ?? "").trim(),
    notes: String(attrs.notes ?? "").trim(),
    drawingIds: parseDrawingIds(attrs.drawing_ids),
    drawings: [],
    createdAt: String(attrs.created_at ?? "").trim(),
  };
}

function getRange(
  client: InstanceType<typeof TableStore.Client>,
  params: Record<string, unknown>,
): Promise<{ rows?: unknown[]; next_start_primary_key?: unknown; nextStartPrimaryKey?: unknown }> {
  return new Promise((resolve, reject) => {
    client.getRange(params, (err: Error | null, data: unknown) => {
      if (err) reject(err);
      else resolve(data as { rows?: unknown[]; next_start_primary_key?: unknown; nextStartPrimaryKey?: unknown });
    });
  });
}

function primaryKeyForRange(
  pk: Array<{ name?: string; value?: unknown }> | null | undefined,
): Array<Record<string, unknown>> | null {
  if (!pk?.length) return null;
  return pk.map((column) => ({ [column.name ?? ""]: column.value }));
}

export async function fetchAllGuests(): Promise<GuestRecord[]> {
  const client = await createClient();
  const { tableName } = getConfig();
  const guests: GuestRecord[] = [];
  let startPrimaryKey: unknown = [{ id: TableStore.INF_MIN }];

  while (startPrimaryKey) {
    const data = await getRange(client, {
      tableName,
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: startPrimaryKey,
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MAX }],
      maxVersions: 1,
      limit: 200,
    });

    for (const row of data.rows ?? []) {
      const guest = rowToGuest(row as Parameters<typeof rowToGuest>[0]);
      if (guest) guests.push(guest);
    }

    startPrimaryKey =
      primaryKeyForRange(
        data.nextStartPrimaryKey as Array<{ name?: string; value?: unknown }> | null,
      ) ??
      primaryKeyForRange(
        data.next_start_primary_key as Array<{ name?: string; value?: unknown }> | null,
      );
    if (!data.rows?.length) break;
  }

  guests.sort((a, b) => {
    const aTime = Date.parse(a.createdAt) || 0;
    const bTime = Date.parse(b.createdAt) || 0;
    return bTime - aTime;
  });

  return guests;
}
