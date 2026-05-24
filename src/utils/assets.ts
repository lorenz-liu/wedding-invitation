import { toWeappLocalPath } from "./weappAsset";

/** Root assets directory is copied to `dist/assets/` at build time. */
const ASSETS_ROOT = "/assets";

/**
 * Resolve a path under the project `assets/` folder for WeChat / static files.
 * @example assetPath("images/homepage-niu.png") -> "/assets/images/homepage-niu.png"
 */
export function assetPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "").replace(/^assets\//, "");
  return toWeappLocalPath(`${ASSETS_ROOT}/${normalized}`);
}

export const images = {
  homepageNiu: assetPath("images/homepage-niu.png"),
  homepageGao: assetPath("images/homepage-gao.png"),
  logoNoBg: assetPath("images/logo-no-bg.png"),
  niuKidNoBg: assetPath("images/niu-kid-no-bg.png"),
  gaoKidNoBg: assetPath("images/gao-kid-no-bg.png"),
  togetherKidsNoBg: assetPath("images/together-kids-no-bg.png"),
  sanyaNoBg: assetPath("images/sanya-no-bg.PNG"),
  seattle4: assetPath("images/seattle-4.jpg"),
  sanya: assetPath("images/sanya.jpg"),
  beijing: assetPath("images/beijing.jpg"),
  shanghai: assetPath("images/shanghai.jpg"),
} as const;
