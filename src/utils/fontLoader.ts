import Taro from "@tarojs/taro";

// Font file paths - use require to get the actual path
const FONT_PATHS = {
  ThinBlack: require("../assets/fonts/thin-black.ttf"),
  Bordered: require("../assets/fonts/bordered.ttf"),
  Childhood: require("../assets/fonts/childhood.ttf"),
  HandWritingBold: require("../assets/fonts/hand-writing-bold.ttf"),
  HandWritingThin: require("../assets/fonts/hand-writing-thin.ttf"),
};

// Load font dynamically for WeChat mini program
export function loadMiniProgramFonts(): void {
  if (process.env.TARO_ENV !== "weapp") return;

  // Load fonts one by one with delay to avoid overwhelming
  const loadFont = (family: string, path: string, delay: number) => {
    setTimeout(() => {
      Taro.loadFontFace({
        family,
        source: `url(${path})`,
        success: () => {
          console.log(`Font loaded: ${family}`);
        },
        fail: (err) => {
          console.warn(`Font load failed: ${family}`, err);
          // Try alternative loading method
          wx.loadFontFace({
            family,
            source: `url(${path})`,
            success: () => console.log(`Font loaded (wx): ${family}`),
            fail: (err: any) => console.warn(`Font load failed (wx): ${family}`, err),
          });
        },
      });
    }, delay);
  };

  // Stagger font loading
  let delay = 0;
  for (const [family, path] of Object.entries(FONT_PATHS)) {
    loadFont(family, path, delay);
    delay += 200; // 200ms delay between each font
  }
}

// For H5, load via CSS @font-face
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
