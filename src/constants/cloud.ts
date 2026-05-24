/**
 * WeChat Cloud Base settings.
 *
 * 1. Open WeChat DevTools → 云开发 → create / select an environment.
 * 2. Copy the env ID into CLOUD_ENV_ID.
 * 3. Upload the local `assets/` folder to cloud storage (see scripts/upload-cloud-assets.mjs).
 * 4. Open any uploaded file → copy its FileID, e.g.
 *    cloud://cloud1-abc123.636c-envname/assets/images/homepage-niu.png
 * 5. Set CLOUD_STORAGE_FILE_PREFIX to the prefix WITHOUT the file path:
 *    cloud://cloud1-abc123.636c-envname
 */
export const CLOUD_ENV_ID = "wedding-d8gbgwafs7b3e5340";

/** Prefix shared by every cloud storage FileID in this environment. */
export const CLOUD_STORAGE_FILE_PREFIX =
  "cloud://wedding-d8gbgwafs7b3e5340.7765-wedding-d8gbgwafs7b3e5340-1306230692";

/** Root folder inside cloud storage that mirrors the local `assets/` directory. */
export const CLOUD_ASSETS_ROOT = "assets";

export function isCloudStorageConfigured(): boolean {
  return (
    !CLOUD_ENV_ID.includes("REPLACE") &&
    !CLOUD_STORAGE_FILE_PREFIX.includes("REPLACE")
  );
}

export function isCloudEnvConfigured(): boolean {
  return !CLOUD_ENV_ID.includes("REPLACE");
}
