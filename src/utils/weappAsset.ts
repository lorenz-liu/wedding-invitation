import Taro from "@tarojs/taro";
import { resolveWeappMediaPath } from "./weappMedia";

function readWeappLocalFileBase64(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      filePath,
      encoding: "base64",
      success: (res) => resolve(res.data as string),
      fail: (err) =>
        reject(
          new Error(
            `Failed to read local file ${filePath}: ${JSON.stringify(err)}`,
          ),
        ),
    });
  });
}

/**
 * WeChat loadFontFace accepts HTTPS URLs or data URLs only.
 * Download remote fonts to a temp file, then pass as base64 (works on device + devtools).
 */
export async function toWeappFontSourceAsync(url: string): Promise<string> {
  if (!url.startsWith("https://")) {
    return Promise.reject(
      new Error(
        `WeChat mini program fonts must use HTTPS URLs, got: ${url}`,
      ),
    );
  }

  const localPath = await resolveWeappMediaPath(url);
  const base64 = await readWeappLocalFileBase64(localPath);
  return `url("data:font/ttf;charset=utf-8;base64,${base64}")`;
}
