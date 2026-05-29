/**
 * Cloudflare public base URL — Worker serves API + static assets from R2.
 *
 * After deploy, set to your Worker URL or custom domain, e.g.:
 *   https://wedding-invitation.your-subdomain.workers.dev
 */
export const CLOUDFLARE_PUBLIC_BASE_URL =
  "https://wedding-invitation.lorenz-uid.workers.dev";

/**
 * Bump this when you upload new images/fonts to R2 so clients fetch fresh files.
 * Example: "20260525" or "2"
 */
export const ASSETS_CACHE_VERSION = "202605282159";

export function isCloudflareConfigured(): boolean {
  return (
    Boolean(CLOUDFLARE_PUBLIC_BASE_URL) &&
    !CLOUDFLARE_PUBLIC_BASE_URL.includes("REPLACE")
  );
}

export function cloudflareAssetUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
  const base = `${CLOUDFLARE_PUBLIC_BASE_URL.replace(/\/$/, "")}/assets/${normalized}`;
  if (!ASSETS_CACHE_VERSION) return base;
  return `${base}?v=${encodeURIComponent(ASSETS_CACHE_VERSION)}`;
}

export function guestFormApiUrl(): string {
  return `${CLOUDFLARE_PUBLIC_BASE_URL.replace(/\/$/, "")}/api/guest-form`;
}
