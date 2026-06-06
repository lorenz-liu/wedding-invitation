"use strict";

const { sendJson, sendText, sendOptions } = require("./lib/cors");
const { insertGuest } = require("./lib/tablestore");

function readJsonBody(req) {
  if (!req.body) return null;
  const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
  if (!raw) return null;
  return JSON.parse(raw);
}

async function handleGuestForm(req, resp, originHeader) {
  let body;
  try {
    body = readJsonBody(req);
  } catch {
    sendJson(resp, 400, { success: false, error: "Invalid JSON body" }, originHeader);
    return;
  }

  const mainContact = body?.mainContact ? String(body.mainContact).trim() : "";
  if (!mainContact) {
    sendJson(resp, 400, { success: false, error: "Name is required" }, originHeader);
    return;
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
    sendJson(
      resp,
      500,
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      originHeader,
    );
    return;
  }

  sendJson(
    resp,
    200,
    {
      success: true,
      id,
      message: "感谢您的回复！",
    },
    originHeader,
  );
}

exports.handler = (req, resp, context) => {
  const originHeader = req.headers?.origin || req.headers?.Origin || "*";
  const method = (req.method || "GET").toUpperCase();
  const path = req.path || "/";

  if (method === "OPTIONS") {
    sendOptions(resp, originHeader);
    return;
  }

  if (method === "GET" && path === "/health") {
    sendText(resp, 200, "ok", originHeader);
    return;
  }

  if (method === "POST" && path === "/api/guest-form") {
    handleGuestForm(req, resp, originHeader).catch((error) => {
      console.error("handleGuestForm error:", error);
      sendJson(
        resp,
        500,
        {
          success: false,
          error: "Internal server error",
          message: error instanceof Error ? error.message : String(error),
        },
        originHeader,
      );
    });
    return;
  }

  sendJson(resp, 404, { success: false, error: "Not Found" }, originHeader);
};
