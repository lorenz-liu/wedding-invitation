import { getFontUrls } from "./assets";

/**
 * @deprecated Fonts are preloaded in app startup via assetPreloader.
 */
export async function loadH5Fonts(): Promise<void> {
  if (process.env.TARO_ENV !== "h5") return;

  for (const { family, url } of getFontUrls()) {
    const face = new FontFace(family, `url("${url}")`);
    await face.load();
    document.fonts.add(face);
  }
}
