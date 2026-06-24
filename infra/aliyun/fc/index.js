"use strict";

const { jsonResponse, textResponse, optionsResponse } = require("./lib/cors");
const { parseHttpEvent } = require("./lib/http-event");
const { insertGuest } = require("./lib/tablestore");

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

exports.handler = async (event) => {
  const { method, path, body, origin } = parseHttpEvent(event);
  console.log("FC route:", method, path, {
    rawPath: event?.rawPath,
    httpPath: event?.requestContext?.http?.path,
    headerPath: event?.headers?.[":path"] || event?.headers?.[":Path"],
    eventKeys: event && typeof event === "object" ? Object.keys(event) : [],
  });

  if (method === "OPTIONS") {
    return optionsResponse(origin);
  }

  // FC gateway may report POST as GET with path "/"; trust JSON body first.
  if (isGuestFormBody(body)) {
    return handleGuestForm(body, origin);
  }

  if (method === "GET" && path === "/health") {
    return textResponse(200, "ok", origin);
  }

  if (
    method === "POST" &&
    (path === "/api/guest-form" || path === "/")
  ) {
    return handleGuestForm(body, origin);
  }

  console.warn("FC route not found:", method, path);
  return jsonResponse(404, { success: false, error: "Not Found" }, origin);
};
