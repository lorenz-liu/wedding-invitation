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
