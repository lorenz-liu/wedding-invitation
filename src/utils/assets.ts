import { resolveAssetPath, resolveFontAssetPath, resolveImageAssetPath } from "./assetResolver";

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
  homepageNiu: resolveImageAssetPath("images/homepage-niu.webp"),
  homepageGao: resolveImageAssetPath("images/homepage-gao.webp"),
  homepageGlassesLeft: resolveImageAssetPath("images/homepage-glasses-left.webp"),
  homepageGlassesRight: resolveImageAssetPath("images/homepage-glasses-right.webp"),
  storyIcon: resolveImageAssetPath("images/story-icon.webp"),
  logoNoBg: resolveImageAssetPath("images/logo-no-bg.webp"),
  babyGaoLeft: resolveImageAssetPath("images/baby-gao-left.webp"),
  babyNiuRight: resolveImageAssetPath("images/baby-niu-right.webp"),
  niuKidNoBg: resolveImageAssetPath("images/niu-kid-no-bg.webp"),
  gaoKidNoBg: resolveImageAssetPath("images/gao-kid-no-bg.webp"),
  childhoodGif: resolveImageAssetPath("images/childhood.gif"),
  togetherKidsNoBg: resolveImageAssetPath("images/together-kids-no-bg.webp"),
  elementarySchool: resolveImageAssetPath("images/elementary-school.webp"),
  middleSchool: resolveImageAssetPath("images/middle-school.webp"),
  highSchool: resolveImageAssetPath("images/high-school.webp"),
  togetherFlower: resolveImageAssetPath("images/together-flower.webp"),
  seattleNoBg: resolveImageAssetPath("images/seattle-no-bg.webp"),
  together2021NoBg: resolveImageAssetPath("images/together-2021-no-bg.webp"),
  gaoUndergradNoBg: resolveImageAssetPath("images/gao-undergrad-no-bg.webp"),
  niuUndergradNoBg: resolveImageAssetPath("images/niu-undergrad-no-bg.webp"),
  band: resolveImageAssetPath("images/band.webp"),
  torontoLandmark: resolveImageAssetPath("images/toronto-landmark.webp"),
  torontoNoBg: resolveImageAssetPath("images/toronto-no-bg.webp"),
  holdingBawbawNoBg: resolveImageAssetPath("images/holding-bawbaw-no-bg.webp"),
  bawbawFullBody1: resolveImageAssetPath("images/bawbaw-full-body-1.webp"),
  bawbawFullBody3: resolveImageAssetPath("images/bawbaw-full-body-3.webp"),
  paw1: resolveImageAssetPath("images/paw-1.webp"),
  paw2: resolveImageAssetPath("images/paw-2.webp"),
  masterGraduationTogether: resolveImageAssetPath("images/master-graduation-together.webp"),
  handHolding: resolveImageAssetPath("images/hand-holding.webp"),
  art: resolveImageAssetPath("images/art.webp"),
  onTheMoon: resolveImageAssetPath("images/onthemoon.webp"),
  agendaCeremony: resolveImageAssetPath("images/agenda-ceremony.webp"),
  agendaDinner: resolveImageAssetPath("images/agenda-dinner.webp"),
  agendaParty: resolveImageAssetPath("images/agenda-party.webp"),
  signatureGao: resolveImageAssetPath("images/signature-gao.webp"),
  signatureNiu: resolveImageAssetPath("images/signature-niu.webp"),
  gown: resolveImageAssetPath("images/gown.webp"),
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
  elementarySchool: 121_280,
  middleSchool: 106_444,
  highSchool: 91_048,
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
  gown: 311_742,
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
