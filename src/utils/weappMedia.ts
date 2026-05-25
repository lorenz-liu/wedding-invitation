import Taro from "@tarojs/taro";

/**
 * WeChat mini program fonts/audio work best from a local temp path.
 * Download remote HTTPS assets before passing to loadFontFace / InnerAudioContext.
 */
export async function resolveWeappMediaPath(url: string): Promise<string> {
  if (!url || process.env.TARO_ENV !== "weapp") return url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  const cached = mediaPathCache.get(url);
  if (cached) return cached;

  const response = await Taro.downloadFile({ url });
  if (response.statusCode >= 400) {
    throw new Error(`Failed to download ${url}: HTTP ${response.statusCode}`);
  }

  mediaPathCache.set(url, response.tempFilePath);
  return response.tempFilePath;
}

const mediaPathCache = new Map<string, string>();
