import { resolveAssetPath, resolveFontAssetPath } from "./assetResolver";

/**
 * Resolve a path under the project `assets/` folder.
 * Dev uses local `/assets/...`; production uses Aliyun OSS.
 */
export function assetPath(relativePath: string): string {
  return resolveAssetPath(relativePath);
}

/** Preloaded at startup — only fonts referenced in app styles. */
export const FONT_ASSETS = [
  { family: "ThinBlack", path: "fonts/thin-black.ttf", bytes: 1_899_584 },
  { family: "Main", path: "fonts/main.ttf", bytes: 7_427_360 },
  { family: "Bold", path: "fonts/bold.ttf", bytes: 6_302_244 },
  { family: "Childhood", path: "fonts/childhood.ttf", bytes: 8_006_948 },
] as const;

export const MUSIC_ASSET = "music/our-love.mp3";
export const MUSIC_PRELOAD_BYTES = 8_733_393;

/** Preloaded at startup — only images referenced in pages/components. */
export const images = {
  homepageNiu: assetPath("images/homepage-niu.png"),
  homepageGao: assetPath("images/homepage-gao.png"),
  homepageGlassesLeft: assetPath("images/homepage-glasses-left.png"),
  homepageGlassesRight: assetPath("images/homepage-glasses-right.png"),
  storyIcon: assetPath("images/story-icon.png"),
  logoNoBg: assetPath("images/logo-no-bg.png"),
  babyGaoLeft: assetPath("images/baby-gao-left.png"),
  babyNiuRight: assetPath("images/baby-niu-right.png"),
  niuKidNoBg: assetPath("images/niu-kid-no-bg.png"),
  gaoKidNoBg: assetPath("images/gao-kid-no-bg.png"),
  childhoodGif: assetPath("images/childhood.gif"),
  togetherKidsNoBg: assetPath("images/together-kids-no-bg.png"),
  togetherFlower: assetPath("images/together-flower.png"),
  seattleNoBg: assetPath("images/seattle-no-bg.png"),
  together2021NoBg: assetPath("images/together-2021-no-bg.png"),
  gaoUndergradNoBg: assetPath("images/gao-undergrad-no-bg.png"),
  niuUndergradNoBg: assetPath("images/niu-undergrad-no-bg.png"),
  band: assetPath("images/band.png"),
  torontoLandmark: assetPath("images/toronto-landmark.png"),
  torontoNoBg: assetPath("images/toronto-no-bg.png"),
  holdingBawbawNoBg: assetPath("images/holding-bawbaw-no-bg.png"),
  bawbawFullBody1: assetPath("images/bawbaw-full-body-1.png"),
  bawbawFullBody3: assetPath("images/bawbaw-full-body-3.png"),
  paw1: assetPath("images/paw-1.png"),
  paw2: assetPath("images/paw-2.png"),
  masterGraduationTogether: assetPath("images/master-graduation-together.png"),
  handHolding: assetPath("images/hand-holding.png"),
  art: assetPath("images/art.png"),
  onTheMoon: assetPath("images/onthemoon.png"),
  agendaCeremony: assetPath("images/agenda-ceremony.png"),
  agendaDinner: assetPath("images/agenda-dinner.png"),
  agendaParty: assetPath("images/agenda-party.png"),
  signatureGao: assetPath("images/signature-gao.png"),
  signatureNiu: assetPath("images/signature-niu.png"),
} as const;

/** Local file sizes — used for byte-weighted preload progress only. */
const IMAGE_PRELOAD_BYTES: Record<keyof typeof images, number> = {
  homepageNiu: 209_136,
  homepageGao: 415_410,
  homepageGlassesLeft: 263_722,
  homepageGlassesRight: 231_219,
  storyIcon: 402_600,
  logoNoBg: 146_630,
  babyGaoLeft: 397_198,
  babyNiuRight: 351_245,
  niuKidNoBg: 397_156,
  gaoKidNoBg: 108_777,
  childhoodGif: 75_684,
  togetherKidsNoBg: 151_793,
  togetherFlower: 1_787_741,
  seattleNoBg: 100_832,
  together2021NoBg: 248_531,
  gaoUndergradNoBg: 166_387,
  niuUndergradNoBg: 386_353,
  band: 1_049_103,
  torontoLandmark: 1_564_559,
  torontoNoBg: 1_187_138,
  holdingBawbawNoBg: 2_129_254,
  bawbawFullBody1: 1_414_380,
  bawbawFullBody3: 4_315_184,
  paw1: 45_536,
  paw2: 38_623,
  masterGraduationTogether: 1_888_154,
  handHolding: 17_890,
  art: 1_696_078,
  onTheMoon: 888_778,
  agendaCeremony: 28_572,
  agendaDinner: 62_402,
  agendaParty: 50_780,
  signatureGao: 26_026,
  signatureNiu: 30_975,
};

const imagePreloadByteWeightByUrl = new Map<string, number>(
  (Object.keys(images) as (keyof typeof images)[]).map((key) => [
    images[key],
    IMAGE_PRELOAD_BYTES[key],
  ]),
);

export function getImagePreloadByteWeight(url: string): number {
  return imagePreloadByteWeightByUrl.get(url) ?? 0;
}

export function getFontPreloadByteWeight(family: string): number {
  const font = FONT_ASSETS.find((entry) => entry.family === family);
  return font?.bytes ?? 0;
}

export function getPreloadTotalBytes(): number {
  const imageBytes = getAllImageUrls().reduce(
    (sum, url) => sum + getImagePreloadByteWeight(url),
    0,
  );
  const fontBytes = FONT_ASSETS.reduce((sum, { bytes }) => sum + bytes, 0);
  return imageBytes + fontBytes + MUSIC_PRELOAD_BYTES;
}

/** Unique image URLs preloaded before entering the app. */
export function getAllImageUrls(): string[] {
  return [...new Set(Object.values(images))];
}

export function getFontUrls(): { family: string; url: string }[] {
  return FONT_ASSETS.map(({ family, path }) => ({
    family,
    url: resolveFontAssetPath(path),
  }));
}

export function getMusicUrl(): string {
  return assetPath(MUSIC_ASSET);
}
