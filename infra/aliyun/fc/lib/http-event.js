"use strict";

function normalizeHeaders(headers = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(headers)) {
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
}

function decodeBody(body, isBase64Encoded) {
  if (!body) return "";
  if (isBase64Encoded) {
    return Buffer.from(String(body), "base64").toString("utf8");
  }
  return Buffer.isBuffer(body) ? body.toString("utf8") : String(body);
}

/**
 * Normalize FC 3.0 HTTP trigger events and legacy console test payloads.
 */
function parseHttpEvent(event) {
  if (event?.requestContext?.http) {
    const headers = normalizeHeaders(event.headers);
    return {
      method: (event.requestContext.http.method || "GET").toUpperCase(),
      path: event.requestContext.http.path || event.rawPath || "/",
      body: decodeBody(event.body, event.isBase64Encoded),
      headers,
      origin: headers.origin || "*",
    };
  }

  if (event?.method || event?.path) {
    const headers = normalizeHeaders(event.headers);
    return {
      method: (event.method || "GET").toUpperCase(),
      path: event.path || "/",
      body: decodeBody(event.body, event.isBase64Encoded),
      headers,
      origin: headers.origin || "*",
    };
  }

  return {
    method: "GET",
    path: "/",
    body: "",
    headers: {},
    origin: "*",
  };
}

module.exports = { parseHttpEvent };
