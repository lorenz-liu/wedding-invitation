import Taro from "@tarojs/taro";
import { resolveAssetPath } from "./assetResolver";

const WEAPP_FONT_FILES: Record<string, string> = {
  ThinBlack: "fonts/thin-black.ttf",
  Main: "fonts/main.ttf",
  Childhood: "fonts/childhood.ttf",
  HandWritingBold: "fonts/hand-writing-bold.ttf",
  HandWritingThin: "fonts/hand-writing-thin.ttf",
};

export async function loadMiniProgramFonts(): Promise<void> {
  if (process.env.TARO_ENV !== "weapp") return;

  let delay = 0;
  for (const [family, relativePath] of Object.entries(WEAPP_FONT_FILES)) {
    const fontUrl = resolveAssetPath(relativePath);

    const currentDelay = delay;
    setTimeout(() => {
      Taro.loadFontFace({
        family,
        source: `url("${fontUrl}")`,
        global: true,
        success: () => {
          console.log(`Font loaded: ${family}`);
        },
        fail: (err) => {
          console.warn(`Font load failed: ${family}`, { fontUrl, err });
        },
      });
    }, currentDelay);

    delay += 300;
  }
}
