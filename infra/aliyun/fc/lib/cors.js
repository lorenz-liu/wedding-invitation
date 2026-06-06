"use strict";

function corsHeaders(originHeader) {
  return {
    "Access-Control-Allow-Origin": originHeader || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildResponse(status, headers, body) {
  return {
    statusCode: status,
    headers,
    isBase64Encoded: false,
    body,
  };
}

function jsonResponse(status, payload, originHeader) {
  return buildResponse(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(originHeader),
  }, JSON.stringify(payload));
}

function textResponse(status, text, originHeader) {
  return buildResponse(status, {
    "Content-Type": "text/plain; charset=utf-8",
    ...corsHeaders(originHeader),
  }, text);
}

function optionsResponse(originHeader) {
  return buildResponse(204, corsHeaders(originHeader), "");
}

module.exports = {
  corsHeaders,
  jsonResponse,
  textResponse,
  optionsResponse,
};
