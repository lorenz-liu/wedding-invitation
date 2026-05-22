import Taro from '@tarojs/taro'

// Font file paths in the mini program
const FONT_PATHS = {
  'ThinBlack': '/assets/fonts/thin-black.ttf',
  'Bordered': '/assets/fonts/bordered.ttf',
  'Childhood': '/assets/fonts/childhood.ttf',
  'HandWritingBold': '/assets/fonts/hand-writing-bold.ttf',
  'HandWritingThin': '/assets/fonts/hand-writing-thin.ttf',
}

// Load font dynamically for WeChat mini program
export async function loadMiniProgramFonts(): Promise<void> {
  if (process.env.TARO_ENV !== 'weapp') return

  try {
    // Use wx.loadFontFace API
    for (const [family, path] of Object.entries(FONT_PATHS)) {
      try {
        await Taro.loadFontFace({
          family,
          source: `url(${path})`,
          success: () => {
            console.log(`Font loaded: ${family}`)
          },
          fail: (err) => {
            console.warn(`Font load failed: ${family}`, err)
          }
        })
      } catch (e) {
        console.warn(`Error loading font ${family}:`, e)
      }
    }
  } catch (error) {
    console.error('Font loading error:', error)
  }
}

// For H5, load via CSS @font-face
export function loadH5Fonts(): void {
  if (process.env.TARO_ENV !== 'h5') return

  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-family: 'ThinBlack';
      src: url('/assets/fonts/thin-black.ttf') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Bordered';
      src: url('/assets/fonts/bordered.ttf') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Childhood';
      src: url('/assets/fonts/childhood.ttf') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'HandWritingBold';
      src: url('/assets/fonts/hand-writing-bold.ttf') format('truetype');
      font-display: swap;
    }
    @font-face {
      font-family: 'HandWritingThin';
      src: url('/assets/fonts/hand-writing-thin.ttf') format('truetype');
      font-display: swap;
    }
  `
  document.head.appendChild(style)
}
