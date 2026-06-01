import Taro from "@tarojs/taro";
import { resolveAssetPath } from "./assetResolver";

/** Load order: most-used families first. */
const WEAPP_FONT_FILES: [string, string][] = [
  ["ThinBlack", "fonts/thin-black.ttf"],
  ["Main", "fonts/main.ttf"],
  ["Childhood", "fonts/childhood.ttf"],
];

/**
 * WeChat loadFontFace only accepts HTTPS URLs (or Data URL), not wxfile:// temp paths.
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html
 */
function loadFontFaceAsync(family: string, httpsUrl: string): Promise<void> {
  if (!httpsUrl.startsWith("https://")) {
    return Promise.reject(new Error(`Font must use HTTPS URL, got: ${httpsUrl}`));
  }

  return new Promise((resolve, reject) => {
    Taro.loadFontFace({
      family,
      source: `url("${httpsUrl}")`,
      global: true,
      scopes: ["webview", "native"],
      success: () => {
        console.log(`[font] Loaded: ${family}`);
        resolve();
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

export async function loadMiniProgramFonts(): Promise<void> {
  if (process.env.TARO_ENV !== "weapp") return;

  for (const [family, relativePath] of WEAPP_FONT_FILES) {
    const fontUrl = resolveAssetPath(relativePath);

    try {
      await loadFontFaceAsync(family, fontUrl);
    } catch (error) {
      console.error(`[font] Failed: ${family}`, { fontUrl, error });
    }
  }
}
