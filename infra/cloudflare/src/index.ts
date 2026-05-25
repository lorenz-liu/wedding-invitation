import { sendSms, type SmsEnv } from "./sms";

export interface Env extends SmsEnv {
  DB: D1Database;
  ASSETS: R2Bucket;
  CORS_ORIGIN?: string;
}

interface GuestFormPayload {
  mainContact?: string;
  phone?: string;
  wechatId?: string;
  guests?: Array<{ name: string; relation: string }>;
  dietaryRestrictions?: string;
  isDriving?: boolean;
  needsShuttle?: boolean;
  shuttleLocation?: string;
  notes?: string;
}

interface GuestFormResult {
  success: boolean;
  id?: string;
  smsSent?: boolean;
  message?: string;
  error?: string;
}

const MIME_TYPES: Record<string, string> = {
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

function corsHeaders(env: Env, request: Request): HeadersInit {
  const origin = env.CORS_ORIGIN || "*";
  const requestOrigin = request.headers.get("Origin");
  const allowOrigin =
    origin === "*" ? "*" : requestOrigin && origin.split(",").includes(requestOrigin) ? requestOrigin : origin;

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(body: GuestFormResult, status: number, env: Env, request: Request): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(env, request),
    },
  });
}

function guessContentType(key: string): string {
  const ext = key.slice(key.lastIndexOf(".")).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

async function handleGuestForm(request: Request, env: Env): Promise<Response> {
  let body: GuestFormPayload;

  try {
    body = (await request.json()) as GuestFormPayload;
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON body" }, 400, env, request);
  }

  const mainContact = body.mainContact ? String(body.mainContact).trim() : "";
  if (!mainContact) {
    return jsonResponse({ success: false, error: "Name is required" }, 400, env, request);
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const createdAt = new Date().toISOString();
  const normalizedPhone = body.phone ? String(body.phone).trim() : "";
  const guests = Array.isArray(body.guests) ? body.guests : [];

  await env.DB.prepare(
    `INSERT INTO wedding_guests (
      id, main_contact, phone, wechat_id, guests_json,
      dietary_restrictions, is_driving, needs_shuttle, shuttle_location, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      mainContact,
      normalizedPhone || null,
      body.wechatId ? String(body.wechatId).trim() : "",
      JSON.stringify(guests),
      body.dietaryRestrictions || "",
      body.isDriving ? 1 : 0,
      body.needsShuttle ? 1 : 0,
      body.shuttleLocation || "",
      body.notes || "",
      createdAt,
    )
    .run();

  let smsSent = false;
  if (normalizedPhone) {
    smsSent = await sendSms(normalizedPhone, env);
  }

  return jsonResponse(
    {
      success: true,
      id,
      smsSent,
      message: smsSent ? "感谢您的回复！确认短信已发送。" : "感谢您的回复！",
    },
    200,
    env,
    request,
  );
}

async function handleAssetRequest(
  pathname: string,
  env: Env,
  request: Request,
): Promise<Response> {
  const key = pathname.replace(/^\/+/, "");
  if (!key.startsWith("assets/")) {
    return new Response("Not Found", { status: 404, headers: corsHeaders(env, request) });
  }

  const object = await env.ASSETS.get(key);
  if (!object) {
    return new Response("Not Found", { status: 404, headers: corsHeaders(env, request) });
  }

  const headers = new Headers(corsHeaders(env, request));
  const contentType = object.httpMetadata?.contentType || guessContentType(key);
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

  // WeChat loadFontFace requires downloadable font resources with correct CORS.
  if (contentType.startsWith("font/")) {
    headers.set("Content-Disposition", `attachment; filename="${key.split("/").pop()}"`);
  }
  if (object.etag) {
    headers.set("ETag", object.etag);
  }
  if (object.size) {
    headers.set("Content-Length", String(object.size));
  }

  if (request.method === "HEAD") {
    return new Response(null, { headers });
  }

  return new Response(object.body, { headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, request) });
    }

    if (request.method === "POST" && url.pathname === "/api/guest-form") {
      try {
        return await handleGuestForm(request, env);
      } catch (error) {
        console.error("submitGuestForm error:", error);
        return jsonResponse(
          {
            success: false,
            error: "Internal server error",
            message: error instanceof Error ? error.message : String(error),
          },
          500,
          env,
          request,
        );
      }
    }

    if (
      (request.method === "GET" || request.method === "HEAD") &&
      url.pathname.startsWith("/assets/")
    ) {
      return handleAssetRequest(url.pathname, env, request);
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return new Response("ok", {
        headers: {
          "Content-Type": "text/plain",
          ...corsHeaders(env, request),
        },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders(env, request) });
  },
};
