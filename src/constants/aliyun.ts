/**
 * Aliyun backend configuration (FC + OSS + Tablestore).
 *
 * After deploying FC, paste the HTTP trigger URL into ALIYUN_FC_BASE_URL.
 * Example: https://wedding-invitation-api-xxxxx.cn-chengdu.fcapp.run
 */
export const ALIYUN_REGION = "cn-chengdu";

/** Public-read OSS bucket for static assets */
export const ALIYUN_OSS_BUCKET = "wedding-asset";
export const ALIYUN_OSS_BASE_URL =
  "https://wedding-asset.oss-cn-chengdu.aliyuncs.com";

/** Private OSS bucket for guest doodle submissions */
export const ALIYUN_DRAWINGS_OSS_BUCKET = "guest-drawings";
export const ALIYUN_DRAWINGS_OSS_BASE_URL =
  "https://guest-drawings.oss-cn-chengdu.aliyuncs.com";

/**
 * Function Compute HTTP trigger base URL (no trailing slash).
 * Replace after `pnpm deploy:aliyun`.
 */
export const ALIYUN_FC_BASE_URL = "https://weddingtion-api-psnzcgebbh.cn-chengdu.fcapp.run";

/**
 * Bump when you upload new images/fonts to OSS so clients fetch fresh files.
 */
export const ASSETS_CACHE_VERSION = "202607102020";

export function isAliyunConfigured(): boolean {
  return (
    Boolean(ALIYUN_FC_BASE_URL) &&
    !ALIYUN_FC_BASE_URL.includes("REPLACE")
  );
}

/** OSS bucket is always configured for this project. */
export function isOssConfigured(): boolean {
  return Boolean(ALIYUN_OSS_BASE_URL);
}

export function aliyunAssetUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
  const base = `${ALIYUN_OSS_BASE_URL}/assets/${normalized}`;
  if (!ASSETS_CACHE_VERSION) return base;
  return `${base}?v=${encodeURIComponent(ASSETS_CACHE_VERSION)}`;
}

export function guestFormApiUrl(): string {
  return `${ALIYUN_FC_BASE_URL.replace(/\/$/, "")}/api/guest-form`;
}

export function guestDrawingApiUrl(): string {
  return `${ALIYUN_FC_BASE_URL.replace(/\/$/, "")}/api/guest-drawing`;
}
