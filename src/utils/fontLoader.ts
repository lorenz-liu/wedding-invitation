import Taro from "@tarojs/taro";
import { resolveAssetPath } from "./assetResolver";
import { toWeappFontSource } from "./weappAsset";

const WEAPP_FONT_FILES: Record<string, string> = {
  ThinBlack: "fonts/thin-black.ttf",
  Main: "fonts/main.ttf",
  Childhood: "fonts/childhood.ttf",
  HandWritingBold: "fonts/hand-writing-bold.ttf",
  HandWritingThin: "fonts/hand-writing-thin.ttf",
};

export function loadMiniProgramFonts(): void {
  if (process.env.TARO_ENV !== "weapp") return;

  const loadFont = (family: string, path: string, delay: number) => {
    setTimeout(() => {
      const source = toWeappFontSource(path);

      Taro.loadFontFace({
        family,
        source,
        global: true,
        success: () => {
          console.log(`Font loaded: ${family}`);
        },
        fail: (err) => {
          console.warn(`Font load failed: ${family}`, { source, path, err });
        },
      });
    }, delay);
  };

  let delay = 0;
  for (const [family, relativePath] of Object.entries(WEAPP_FONT_FILES)) {
    loadFont(family, resolveAssetPath(relativePath), delay);
    delay += 300;
  }
}
