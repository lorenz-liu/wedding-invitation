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

function normalizePath(path) {
  if (!path) return "/";
  let normalized = String(path).split("?")[0];
  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    // keep raw path when not URI-encoded
  }
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function pathFromUri(uri) {
  if (!uri) return null;
  try {
    if (/^https?:\/\//i.test(uri)) {
      return normalizePath(new URL(uri).pathname);
    }
  } catch {
    // fall through to normalizePath
  }
  return normalizePath(uri);
}

function resolveMethod(event, headers = {}, fallbackMethod) {
  return (
    headers[":method"] ||
    headers["x-fc-http-method"] ||
    headers["x-http-method"] ||
    event?.requestContext?.http?.method ||
    event?.method ||
    fallbackMethod ||
    "GET"
  ).toUpperCase();
}

function resolvePath(event, headers = {}) {
  const candidates = [
    event?.rawPath,
    headers[":path"],
    headers["x-forwarded-path"],
    headers["x-original-uri"] ? pathFromUri(headers["x-original-uri"]) : null,
    headers["x-fc-request-path"],
    event?.requestContext?.http?.path,
    event?.path,
    event?.url ? pathFromUri(event.url) : null,
    event?.requestURI ? pathFromUri(event.requestURI) : null,
  ]
    .filter(Boolean)
    .map((value) => normalizePath(value));

  const unique = [...new Set(candidates)];
  unique.sort((a, b) => b.length - a.length);
  return unique[0] || "/";
}

function coerceEvent(rawEvent) {
  let event = rawEvent;

  if (Buffer.isBuffer(event)) {
    event = event.toString("utf8");
  }

  if (typeof event === "string") {
    const trimmed = event.trim();
    if (!trimmed) return {};
    try {
      event = JSON.parse(trimmed);
    } catch {
      return {};
    }
  }

  if (!event || typeof event !== "object") {
    return {};
  }

  if (typeof event.payload === "string") {
    try {
      const nested = JSON.parse(event.payload);
      if (nested && typeof nested === "object") {
        return nested;
      }
    } catch {
      // keep original event
    }
  }

  if (event.payload && typeof event.payload === "object") {
    return event.payload;
  }

  return event;
}

function extractRawBody(event) {
  const encoded = event?.isBase64Encoded ?? event?.IsBase64Encoded ?? false;
  const candidates = [event?.body, event?.Body, event?.data, event?.payload];

  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue;
    const decoded = decodeBody(candidate, encoded);
    if (decoded) return decoded;
  }

  return "";
}

/**
 * Normalize FC 3.0 HTTP trigger events and legacy console test payloads.
 */
function parseHttpEvent(rawEvent) {
  const event = coerceEvent(rawEvent);

  if (!event || typeof event !== "object") {
    return {
      method: "GET",
      path: "/",
      body: "",
      headers: {},
      origin: "*",
    };
  }

  const headers = normalizeHeaders(event.headers);
  const body = extractRawBody(event);

  if (event.requestContext?.http || event.rawPath) {
    return {
      method: resolveMethod(event, headers),
      path: resolvePath(event, headers),
      body,
      headers,
      origin: headers.origin || "*",
    };
  }

  if (
    event.method ||
    event.path ||
    event.url ||
    event.clientIP ||
    event.queries
  ) {
    return {
      method: resolveMethod(event, headers),
      path: resolvePath(event, headers),
      body,
      headers,
      origin: headers.origin || "*",
    };
  }

  return {
    method: resolveMethod(event, headers),
    path: resolvePath(event, headers),
    body,
    headers,
    origin: headers.origin || "*",
  };
}

module.exports = { parseHttpEvent };
