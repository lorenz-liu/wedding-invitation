import Taro from "@tarojs/taro";
import { resolveAssetPath } from "./assetResolver";
import { resolveWeappMediaPath } from "./weappMedia";

/** Load order: most-used families first on slow mobile networks. */
const WEAPP_FONT_FILES: [string, string][] = [
  ["ThinBlack", "fonts/thin-black.ttf"],
  ["Main", "fonts/main.ttf"],
  ["HandWritingBold", "fonts/hand-writing-bold.ttf"],
  ["HandWritingThin", "fonts/hand-writing-thin.ttf"],
  ["Childhood", "fonts/childhood.ttf"],
];

function fontFaceSource(localPath: string): string {
  if (localPath.startsWith("wxfile://") || localPath.startsWith("http://usr/")) {
    return localPath;
  }
  return `url("${localPath}")`;
}

function loadFontFaceAsync(family: string, localPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    Taro.loadFontFace({
      family,
      source: fontFaceSource(localPath),
      global: true,
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
      const localPath = await resolveWeappMediaPath(fontUrl);
      await loadFontFaceAsync(family, localPath);
    } catch (error) {
      console.error(`[font] Failed: ${family}`, { fontUrl, error });
    }
  }
}
