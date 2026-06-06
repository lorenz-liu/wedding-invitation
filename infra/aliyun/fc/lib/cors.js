"use strict";

function corsHeaders(originHeader) {
  return {
    "Access-Control-Allow-Origin": originHeader || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function sendJson(resp, status, body, originHeader) {
  resp.setStatusCode(status);
  resp.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(corsHeaders(originHeader))) {
    resp.setHeader(key, value);
  }
  resp.send(JSON.stringify(body));
}

function sendText(resp, status, text, originHeader) {
  resp.setStatusCode(status);
  resp.setHeader("Content-Type", "text/plain; charset=utf-8");
  for (const [key, value] of Object.entries(corsHeaders(originHeader))) {
    resp.setHeader(key, value);
  }
  resp.send(text);
}

function sendOptions(resp, originHeader) {
  resp.setStatusCode(204);
  for (const [key, value] of Object.entries(corsHeaders(originHeader))) {
    resp.setHeader(key, value);
  }
  resp.send("");
}

module.exports = { corsHeaders, sendJson, sendText, sendOptions };
