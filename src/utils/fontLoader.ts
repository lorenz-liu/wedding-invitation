import Taro from "@tarojs/taro";
import { toWeappFontSource } from "./weappAsset";

const FONT_PATHS = {
  ThinBlack: require("@assets/fonts/thin-black.ttf"),
  Bordered: require("@assets/fonts/bordered.ttf"),
  Childhood: require("@assets/fonts/childhood.ttf"),
  HandWritingBold: require("@assets/fonts/hand-writing-bold.ttf"),
  HandWritingThin: require("@assets/fonts/hand-writing-thin.ttf"),
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
  for (const [family, path] of Object.entries(FONT_PATHS)) {
    loadFont(family, path, delay);
    delay += 300;
  }
}

export function loadH5Fonts(): void {
  if (process.env.TARO_ENV !== "h5") return;

  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'ThinBlack';
      src: url('${FONT_PATHS.ThinBlack}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Bordered';
      src: url('${FONT_PATHS.Bordered}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Childhood';
      src: url('${FONT_PATHS.Childhood}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'HandWritingBold';
      src: url('${FONT_PATHS.HandWritingBold}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'HandWritingThin';
      src: url('${FONT_PATHS.HandWritingThin}') format('truetype');
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}
