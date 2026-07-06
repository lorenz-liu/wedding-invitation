"use strict";

const { jsonResponse, textResponse, optionsResponse } = require("./lib/cors");
const { parseHttpEvent } = require("./lib/http-event");
const { uploadGuestDrawing } = require("./lib/oss-drawings");
const { insertGuest, appendGuestDrawingId } = require("./lib/tablestore");

function readJsonBody(rawBody) {
  if (!rawBody) return null;
  return JSON.parse(rawBody);
}

function isGuestFormBody(rawBody) {
  if (!rawBody || typeof rawBody !== "string") return false;
  const trimmed = rawBody.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = readJsonBody(trimmed);
    return (
      parsed &&
      typeof parsed === "object" &&
      Object.prototype.hasOwnProperty.call(parsed, "mainContact")
    );
  } catch {
    return false;
  }
}

function isGuestDrawingBody(rawBody) {
  if (!rawBody || typeof rawBody !== "string") return false;
  const trimmed = rawBody.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = readJsonBody(trimmed);
    return (
      parsed &&
      typeof parsed === "object" &&
      Object.prototype.hasOwnProperty.call(parsed, "guestId") &&
      Object.prototype.hasOwnProperty.call(parsed, "imageBase64")
    );
  } catch {
    return false;
  }
}

async function handleGuestForm(rawBody, originHeader) {
  let body;
  try {
    body = readJsonBody(rawBody);
  } catch {
    return jsonResponse(400, { success: false, error: "Invalid JSON body" }, originHeader);
  }

  const mainContact = body?.mainContact ? String(body.mainContact).trim() : "";
  if (!mainContact) {
    return jsonResponse(400, { success: false, error: "Name is required" }, originHeader);
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const createdAt = new Date().toISOString();
  const normalizedPhone = body.phone ? String(body.phone).trim() : "";
  const guests = Array.isArray(body.guests) ? body.guests : [];

  try {
    await insertGuest({
      id,
      mainContact,
      phone: normalizedPhone,
      wechatId: body.wechatId ? String(body.wechatId).trim() : "",
      guestsJson: JSON.stringify(guests),
      dietaryRestrictions: body.dietaryRestrictions || "",
      isDriving: Boolean(body.isDriving),
      needsShuttle: Boolean(body.needsShuttle),
      shuttleLocation: body.shuttleLocation || "",
      notes: body.notes || "",
      createdAt,
    });
  } catch (error) {
    console.error("insertGuest error:", error);
    return jsonResponse(
      500,
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      originHeader,
    );
  }

  return jsonResponse(
    200,
    {
      success: true,
      id,
      message: "感谢您的回复！",
    },
    originHeader,
  );
}

async function handleGuestDrawing(rawBody, originHeader) {
  let body;
  try {
    body = readJsonBody(rawBody);
  } catch {
    return jsonResponse(400, { success: false, error: "Invalid JSON body" }, originHeader);
  }

  const guestId = body?.guestId ? String(body.guestId).trim() : "";
  const imageBase64 = body?.imageBase64 ? String(body.imageBase64).trim() : "";

  if (!guestId) {
    return jsonResponse(400, { success: false, error: "guestId is required" }, originHeader);
  }

  if (!imageBase64) {
    return jsonResponse(400, { success: false, error: "imageBase64 is required" }, originHeader);
  }

  const normalizedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  let buffer;
  try {
    buffer = Buffer.from(normalizedBase64, "base64");
  } catch {
    return jsonResponse(400, { success: false, error: "Invalid image data" }, originHeader);
  }

  if (!buffer.length) {
    return jsonResponse(400, { success: false, error: "Empty image data" }, originHeader);
  }

  const drawingId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

  try {
    await uploadGuestDrawing(guestId, drawingId, buffer);
    await appendGuestDrawingId(guestId, drawingId);
  } catch (error) {
    console.error("handleGuestDrawing error:", error);
    return jsonResponse(
      500,
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      originHeader,
    );
  }

  return jsonResponse(
    200,
    {
      success: true,
      drawingId,
      message: "涂鸦已提交，感谢您的创作！",
    },
    originHeader,
  );
}

function isGuestFormRoute(method, path) {
  return (
    method === "POST" &&
    (path === "/api/guest-form" ||
      path === "/" ||
      path.endsWith("/api/guest-form"))
  );
}

function isGuestDrawingRoute(method, path) {
  return method === "POST" && path.endsWith("/api/guest-drawing");
}

function isHealthRoute(method, path) {
  return method === "GET" && (path === "/health" || path.endsWith("/health"));
}

exports.handler = async (event) => {
  const { method, path, body, origin, headers } = parseHttpEvent(event);
  console.log("FC route:", method, path, {
    rawPath: event?.rawPath,
    httpPath: event?.requestContext?.http?.path,
    headerPath: event?.headers?.[":path"] || event?.headers?.[":Path"],
    bodyLength: body?.length || 0,
    eventKeys: event && typeof event === "object" ? Object.keys(event) : [],
  });

  if (method === "OPTIONS") {
    return optionsResponse(origin);
  }

  if (isGuestDrawingBody(body)) {
    return handleGuestDrawing(body, origin);
  }

  if (isGuestFormBody(body)) {
    return handleGuestForm(body, origin);
  }

  if (isHealthRoute(method, path)) {
    return textResponse(200, "ok", origin);
  }

  const contentType = String(headers["content-type"] || "").toLowerCase();
  if (
    method === "POST" &&
    contentType.includes("application/json") &&
    body
  ) {
    if (isGuestDrawingRoute(method, path)) {
      return handleGuestDrawing(body, origin);
    }
    return handleGuestForm(body, origin);
  }

  if (isGuestDrawingRoute(method, path)) {
    return handleGuestDrawing(body, origin);
  }

  if (isGuestFormRoute(method, path)) {
    return handleGuestForm(body, origin);
  }

  console.warn("FC route not found:", method, path);
  return jsonResponse(
    404,
    {
      success: false,
      error: "Not Found",
      method,
      path,
      bodyLength: body?.length || 0,
    },
    origin,
  );
};
