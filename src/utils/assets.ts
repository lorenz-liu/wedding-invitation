import { resolveAssetPath } from "./assetResolver";

/**
 * Resolve a path under the project `assets/` folder.
 * weapp → Cloudflare CDN URL; h5 → local `/assets/...` when CDN not configured.
 */
export function assetPath(relativePath: string): string {
  return resolveAssetPath(relativePath);
}

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
  masterGraduationTogether: assetPath("images/master-graduation-together.png"),
  handHolding: assetPath("images/hand-holding.png"),
  onTheMoon: assetPath("images/onthemoon.png"),
  signatureGao: assetPath("images/signature-gao.png"),
  signatureNiu: assetPath("images/signature-niu.png"),
} as const;
