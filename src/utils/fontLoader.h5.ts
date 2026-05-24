export function loadH5Fonts(): void {
  if (process.env.TARO_ENV !== "h5") return;

  const fontPaths = {
    ThinBlack: require("@assets/fonts/thin-black.ttf"),
    Main: require("@assets/fonts/main.ttf"),
    Childhood: require("@assets/fonts/childhood.ttf"),
    HandWritingBold: require("@assets/fonts/hand-writing-bold.ttf"),
    HandWritingThin: require("@assets/fonts/hand-writing-thin.ttf"),
  };

  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'ThinBlack';
      src: url('${fontPaths.ThinBlack}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Main';
      src: url('${fontPaths.Main}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Childhood';
      src: url('${fontPaths.Childhood}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'HandWritingBold';
      src: url('${fontPaths.HandWritingBold}') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'HandWritingThin';
      src: url('${fontPaths.HandWritingThin}') format('truetype');
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}
