import Taro from "@tarojs/taro";
import {
  CLOUD_ASSETS_ROOT,
  CLOUD_ENV_ID,
  CLOUD_STORAGE_FILE_PREFIX,
  isCloudStorageConfigured,
} from "../constants/cloud";

/**
 * Build a cloud storage FileID for a path under `assets/`.
 * @example cloudAssetPath("images/homepage-niu.png")
 */
export function cloudAssetPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
  return `${CLOUD_STORAGE_FILE_PREFIX}/${CLOUD_ASSETS_ROOT}/${normalized}`;
}

let cloudInitialized = false;

/** Initialize WeChat Cloud Base (no-op when not configured). */
export function initWeappCloud(): void {
  if (process.env.TARO_ENV !== "weapp" || cloudInitialized) return;

  if (!isCloudStorageConfigured()) {
    console.warn(
      "[cloud] CLOUD_ENV_ID / CLOUD_STORAGE_FILE_PREFIX not configured. " +
        "Static assets will not load in the mini program until cloud storage is set up.",
    );
    return;
  }

  Taro.cloud.init({
    env: CLOUD_ENV_ID,
    traceUser: false,
  });
  cloudInitialized = true;
}
