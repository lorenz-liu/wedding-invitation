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
  { family: "Main", path: "fonts/main.ttf", bytes: 7_427_360 },
  { family: "Bold", path: "fonts/bold.ttf", bytes: 6_302_244 },
  { family: "Childhood", path: "fonts/childhood.ttf", bytes: 8_006_948 },
] as const;

export const MUSIC_ASSET = "music/our-love.mp3";
export const MUSIC_PRELOAD_BYTES = 3_493_438;

/** Preloaded at startup — only images referenced in pages/components. */
export const images = {
  homepageNiu: assetPath("images/homepage-niu.webp"),
  homepageGao: assetPath("images/homepage-gao.webp"),
  homepageGlassesLeft: assetPath("images/homepage-glasses-left.webp"),
  homepageGlassesRight: assetPath("images/homepage-glasses-right.webp"),
  storyIcon: assetPath("images/story-icon.webp"),
  logoNoBg: assetPath("images/logo-no-bg.webp"),
  babyGaoLeft: assetPath("images/baby-gao-left.webp"),
  babyNiuRight: assetPath("images/baby-niu-right.webp"),
  niuKidNoBg: assetPath("images/niu-kid-no-bg.webp"),
  gaoKidNoBg: assetPath("images/gao-kid-no-bg.webp"),
  childhoodGif: assetPath("images/childhood.gif"),
  togetherKidsNoBg: assetPath("images/together-kids-no-bg.webp"),
  togetherFlower: assetPath("images/together-flower.webp"),
  seattleNoBg: assetPath("images/seattle-no-bg.webp"),
  together2021NoBg: assetPath("images/together-2021-no-bg.webp"),
  gaoUndergradNoBg: assetPath("images/gao-undergrad-no-bg.webp"),
  niuUndergradNoBg: assetPath("images/niu-undergrad-no-bg.webp"),
  band: assetPath("images/band.webp"),
  torontoLandmark: assetPath("images/toronto-landmark.webp"),
  torontoNoBg: assetPath("images/toronto-no-bg.webp"),
  holdingBawbawNoBg: assetPath("images/holding-bawbaw-no-bg.webp"),
  bawbawFullBody1: assetPath("images/bawbaw-full-body-1.webp"),
  bawbawFullBody3: assetPath("images/bawbaw-full-body-3.webp"),
  paw1: assetPath("images/paw-1.webp"),
  paw2: assetPath("images/paw-2.webp"),
  masterGraduationTogether: assetPath("images/master-graduation-together.webp"),
  handHolding: assetPath("images/hand-holding.webp"),
  art: assetPath("images/art.webp"),
  onTheMoon: assetPath("images/onthemoon.webp"),
  agendaCeremony: assetPath("images/agenda-ceremony.webp"),
  agendaDinner: assetPath("images/agenda-dinner.webp"),
  agendaParty: assetPath("images/agenda-party.webp"),
  signatureGao: assetPath("images/signature-gao.webp"),
  signatureNiu: assetPath("images/signature-niu.webp"),
} as const;

/** Local file sizes — used for byte-weighted preload progress only. */
const IMAGE_PRELOAD_BYTES: Record<keyof typeof images, number> = {
  homepageNiu: 218_226,
  homepageGao: 155_482,
  homepageGlassesLeft: 95_464,
  homepageGlassesRight: 79_328,
  storyIcon: 167_464,
  logoNoBg: 176_838,
  babyGaoLeft: 110_688,
  babyNiuRight: 100_532,
  niuKidNoBg: 48_220,
  gaoKidNoBg: 14_502,
  childhoodGif: 75_684,
  togetherKidsNoBg: 56_480,
  togetherFlower: 115_730,
  seattleNoBg: 23_638,
  together2021NoBg: 55_136,
  gaoUndergradNoBg: 65_016,
  niuUndergradNoBg: 160_036,
  band: 191_504,
  torontoLandmark: 458_588,
  torontoNoBg: 110_494,
  holdingBawbawNoBg: 360_962,
  bawbawFullBody1: 329_440,
  bawbawFullBody3: 743_830,
  paw1: 18_654,
  paw2: 16_310,
  masterGraduationTogether: 543_184,
  handHolding: 18_154,
  art: 576_542,
  onTheMoon: 374_572,
  agendaCeremony: 13_414,
  agendaDinner: 28_566,
  agendaParty: 22_716,
  signatureGao: 11_812,
  signatureNiu: 13_142,
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
