import { aliyunAssetUrl } from "../constants/aliyun";

/**
 * Resolve a path under `assets/` to Aliyun OSS HTTPS URL.
 */
export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
  return aliyunAssetUrl(normalized);
}
