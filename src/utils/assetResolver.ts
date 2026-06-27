import { aliyunAssetUrl } from "../constants/aliyun";
import { isDev } from "../constants/env";

function normalizeAssetPath(relativePath: string): string {
  return relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
}

/** Local path under dist/assets/ (requires copy patterns in dev). */
function localAssetUrl(relativePath: string): string {
  return `/assets/${normalizeAssetPath(relativePath)}`;
}

/**
 * Resolve a path under `assets/`.
 * Dev (TARO_APP_DEV=true): local `/assets/...` paths.
 * Production: Aliyun OSS HTTPS URL.
 */
export function resolveAssetPath(relativePath: string): string {
  if (isDev()) {
    return localAssetUrl(relativePath);
  }
  return aliyunAssetUrl(normalizeAssetPath(relativePath));
}

/**
 * Font files on WeChat mini programs cannot be read from the code package
 * (loadFontFace / FileSystemManager only support HTTPS or temp/data URLs).
 * In weapp dev, keep images local but load fonts from OSS.
 */
export function resolveFontAssetPath(relativePath: string): string {
  if (isDev() && process.env.TARO_ENV === "weapp") {
    return aliyunAssetUrl(normalizeAssetPath(relativePath));
  }
  return resolveAssetPath(relativePath);
}

/**
 * WeChat getImageInfo is unreliable for package-local WebP in devtools.
 * Dev weapp: local /assets/... (copied to dist/). Production weapp: OSS.
 */
export function resolveImageAssetPath(relativePath: string): string {
  if (process.env.TARO_ENV === "weapp" && !isDev()) {
    return aliyunAssetUrl(normalizeAssetPath(relativePath));
  }
  return resolveAssetPath(relativePath);
}
