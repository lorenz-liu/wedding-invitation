import { resolveAssetPath, resolveFontAssetPath } from "./assetResolver";

/**
 * Resolve a path under the project `assets/` folder.
 * Dev uses local `/assets/...`; production uses Aliyun OSS.
 */
export function assetPath(relativePath: string): string {
  return resolveAssetPath(relativePath);
}

export const FONT_ASSETS = [
  { family: "ThinBlack", path: "fonts/thin-black.ttf" },
  { family: "Main", path: "fonts/main.ttf" },
  { family: "Bold", path: "fonts/bold.ttf" },
  { family: "Childhood", path: "fonts/childhood.ttf" },
] as const;

export const MUSIC_ASSET = "music/our-love.mp3";

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
  sanyaNoBg: assetPath("images/sanya-no-bg.png"),
  seattleNoBg: assetPath("images/seattle-no-bg.png"),
  together2021NoBg: assetPath("images/together-2021-no-bg.png"),
  gaoUndergradNoBg: assetPath("images/gao-undergrad-no-bg.png"),
  niuUndergradNoBg: assetPath("images/niu-undergrad-no-bg.png"),
  seattle4: assetPath("images/seattle-4.png"),
  sanya: assetPath("images/sanya.png"),
  beijing: assetPath("images/beijing.png"),
  shanghai: assetPath("images/shanghai.png"),
  band: assetPath("images/band.png"),
  torontoLandmark: assetPath("images/toronto-landmark.png"),
  torontoNoBg: assetPath("images/toronto-no-bg.png"),
  torontoSkyline: assetPath("images/toronto-skyline.png"),
  holdingBawbawNoBg: assetPath("images/holding-bawbaw-no-bg.png"),
  bawbawFullBody1: assetPath("images/bawbaw-full-body-1.png"),
  bawbawFullBody3: assetPath("images/bawbaw-full-body-3.png"),
  paw1: assetPath("images/paw-1.png"),
  paw2: assetPath("images/paw-2.png"),
  masterGraduationTogether: assetPath("images/master-graduation-together.png"),
  handHolding: assetPath("images/hand-holding.png"),
  art: assetPath("images/art.png"),
  onTheMoon: assetPath("images/onthemoon.png"),
  agendaWelcome: assetPath("images/agenda-welcome.png"),
  agendaCeremony: assetPath("images/agenda-ceremony.png"),
  agendaDinner: assetPath("images/agenda-dinner.png"),
  agendaParty: assetPath("images/agenda-party.png"),
  signatureGao: assetPath("images/signature-gao.png"),
  signatureNiu: assetPath("images/signature-niu.png"),
} as const;

/** Unique image URLs used across the app. */
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
