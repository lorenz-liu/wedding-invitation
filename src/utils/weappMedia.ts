import Taro from "@tarojs/taro";

const DOWNLOAD_TIMEOUT_MS = 120_000;

/**
 * Download remote HTTPS assets to a local temp path for loadFontFace / InnerAudioContext.
 * Required on real devices — direct HTTPS URLs often fail for fonts.
 */
export async function resolveWeappMediaPath(url: string): Promise<string> {
  if (!url || process.env.TARO_ENV !== "weapp") return url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  const cached = mediaPathCache.get(url);
  if (cached) return cached;

  const response = await Taro.downloadFile({
    url,
    timeout: DOWNLOAD_TIMEOUT_MS,
  });

  if (response.statusCode >= 400 || !response.tempFilePath) {
    throw new Error(`Failed to download ${url}: HTTP ${response.statusCode}`);
  }

  mediaPathCache.set(url, response.tempFilePath);
  return response.tempFilePath;
}

const mediaPathCache = new Map<string, string>();

function weappPackagePathCandidates(url: string): string[] {
  const trimmed = url.replace(/^\//, "");
  return [...new Set([trimmed, `/${trimmed}`, url])];
}

/**
 * Verify a code-package asset exists (dev local /assets/... paths).
 * Used when getImageInfo rejects WebP in WeChat devtools.
 */
export async function assertWeappPackageAsset(url: string): Promise<void> {
  if (!url || process.env.TARO_ENV !== "weapp") return;
  if (url.startsWith("http://") || url.startsWith("https://")) return;

  const fs = Taro.getFileSystemManager();

  for (const path of weappPackagePathCandidates(url)) {
    const exists = await new Promise<boolean>((resolve) => {
      fs.access({
        path,
        success: () => resolve(true),
        fail: () => resolve(false),
      });
    });
    if (exists) return;
  }

  throw new Error(`Package asset not found: ${url}`);
}

export { weappPackagePathCandidates };
