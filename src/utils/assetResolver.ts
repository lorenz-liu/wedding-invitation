import { cloudAssetPath } from "./cloudAssets";
import { toWeappLocalPath } from "./weappAsset";

const LOCAL_ASSETS_ROOT = "/assets";

/**
 * Resolve a path under `assets/` for the current Taro target.
 * - weapp: cloud storage FileID
 * - h5 / others: local `/assets/...` path (copied at build time)
 */
export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");

  if (process.env.TARO_ENV === "weapp") {
    return cloudAssetPath(normalized);
  }

  return toWeappLocalPath(`${LOCAL_ASSETS_ROOT}/${normalized}`);
}
