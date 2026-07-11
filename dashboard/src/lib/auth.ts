import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "wedding-dashboard-auth";

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function getExpectedAuthToken(): string | null {
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!password) return null;
  return hashToken(password);
}

export function verifyPassword(password: string): boolean {
  const expected = getExpectedAuthToken();
  if (!expected) return true;
  const actual = hashToken(password);
  try {
    return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAuthorizedRequest(request: NextRequest): boolean {
  const expected = getExpectedAuthToken();
  if (!expected) return true;

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) return false;

  try {
    return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createAuthCookieValue(): string {
  const expected = getExpectedAuthToken();
  if (!expected) return "";
  return expected;
}
