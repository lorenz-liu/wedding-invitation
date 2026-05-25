import { cloudflareAssetUrl, isCloudflareConfigured } from "../constants/cloudflare";
import { toWeappLocalPath } from "./weappAsset";

const LOCAL_ASSETS_ROOT = "/assets";

/**
 * Resolve a path under `assets/` for the current Taro target.
 * - Production weapp / configured CDN: Cloudflare R2 via Worker HTTPS URL
 * - H5 dev fallback: local `/assets/...` copied at build time
 */
export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");

  if (isCloudflareConfigured()) {
    return cloudflareAssetUrl(normalized);
  }

  return toWeappLocalPath(`${LOCAL_ASSETS_ROOT}/${normalized}`);
}
