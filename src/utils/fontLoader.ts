import { getFontUrls } from "./assets";

/**
 * @deprecated Fonts are preloaded in app startup via assetPreloader.
 */
export async function loadMiniProgramFonts(): Promise<void> {
  if (process.env.TARO_ENV !== "weapp") return;

  const { default: Taro } = await import("@tarojs/taro");
  for (const { family, url } of getFontUrls()) {
    await new Promise<void>((resolve, reject) => {
      Taro.loadFontFace({
        family,
        source: `url("${url}")`,
        global: true,
        scopes: ["webview", "native"],
        success: () => resolve(),
        fail: (err) => reject(err),
      });
    });
  }
}
