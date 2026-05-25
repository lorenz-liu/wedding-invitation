/**
 * Cloudflare public base URL — Worker serves API + static assets from R2.
 *
 * After deploy, set to your Worker URL or custom domain, e.g.:
 *   https://wedding-invitation.your-subdomain.workers.dev
 */
export const CLOUDFLARE_PUBLIC_BASE_URL =
  "https://wedding-invitation.lorenz-uid.workers.dev";

export function isCloudflareConfigured(): boolean {
  return (
    Boolean(CLOUDFLARE_PUBLIC_BASE_URL) &&
    !CLOUDFLARE_PUBLIC_BASE_URL.includes("REPLACE")
  );
}

export function cloudflareAssetUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
  return `${CLOUDFLARE_PUBLIC_BASE_URL.replace(/\/$/, "")}/assets/${normalized}`;
}

export function guestFormApiUrl(): string {
  return `${CLOUDFLARE_PUBLIC_BASE_URL.replace(/\/$/, "")}/api/guest-form`;
}
