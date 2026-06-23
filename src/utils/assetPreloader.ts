import Taro from "@tarojs/taro";
import {
  getAllImageUrls,
  getFontUrls,
  getMusicUrl,
} from "./assets";
import { resolveWeappMediaPath } from "./weappMedia";
import { toWeappFontSource } from "./weappAsset";

export type AssetLoadPhase = "images" | "fonts" | "audio";

export interface AssetLoadProgress {
  phase: AssetLoadPhase;
  loaded: number;
  total: number;
}

type ProgressCallback = (progress: AssetLoadProgress) => void;

const IMAGE_CONCURRENCY = 6;

function loadWeappFont(family: string, url: string): Promise<void> {
  const isRemote = url.startsWith("http://") || url.startsWith("https://");
  if (isRemote && !url.startsWith("https://")) {
    return Promise.reject(new Error(`Font must use HTTPS URL, got: ${url}`));
  }

  const source = isRemote ? `url("${url}")` : toWeappFontSource(url);

  return new Promise((resolve, reject) => {
    Taro.loadFontFace({
      family,
      source,
      global: true,
      scopes: ["webview", "native"],
      success: () => resolve(),
      fail: (err) => reject(err),
    });
  });
}

function preloadWeappImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    Taro.getImageInfo({
      src: url,
      success: () => resolve(),
      fail: (err) => reject(new Error(`Image preload failed: ${url} — ${JSON.stringify(err)}`)),
    });
  });
}

async function preloadWeappImages(
  urls: string[],
  onProgress?: ProgressCallback,
): Promise<void> {
  const total = urls.length;
  let loaded = 0;

  const report = () => {
    onProgress?.({ phase: "images", loaded, total });
  };

  report();

  for (let i = 0; i < urls.length; i += IMAGE_CONCURRENCY) {
    const batch = urls.slice(i, i + IMAGE_CONCURRENCY);
    await Promise.all(
      batch.map(async (url) => {
        await preloadWeappImage(url);
        loaded += 1;
        report();
      }),
    );
  }
}

async function preloadWeappFonts(onProgress?: ProgressCallback): Promise<void> {
  const fonts = getFontUrls();
  const total = fonts.length;
  let loaded = 0;

  const report = () => {
    onProgress?.({ phase: "fonts", loaded, total });
  };

  report();

  for (const { family, url } of fonts) {
    await loadWeappFont(family, url);
    loaded += 1;
    report();
  }
}

async function preloadWeappAudio(onProgress?: ProgressCallback): Promise<void> {
  onProgress?.({ phase: "audio", loaded: 0, total: 1 });
  const musicUrl = getMusicUrl();
  await resolveWeappMediaPath(musicUrl);
  onProgress?.({ phase: "audio", loaded: 1, total: 1 });
}

async function preloadWeappAssets(onProgress?: ProgressCallback): Promise<void> {
  const imageUrls = getAllImageUrls();
  await preloadWeappImages(imageUrls, onProgress);
  await preloadWeappFonts(onProgress);
  await preloadWeappAudio(onProgress);
}

function preloadH5Image(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Image preload failed: ${url}`));
    img.src = url;
  });
}

async function preloadH5Images(
  urls: string[],
  onProgress?: ProgressCallback,
): Promise<void> {
  const total = urls.length;
  let loaded = 0;

  const report = () => {
    onProgress?.({ phase: "images", loaded, total });
  };

  report();

  for (let i = 0; i < urls.length; i += IMAGE_CONCURRENCY) {
    const batch = urls.slice(i, i + IMAGE_CONCURRENCY);
    await Promise.all(
      batch.map(async (url) => {
        await preloadH5Image(url);
        loaded += 1;
        report();
      }),
    );
  }
}

async function preloadH5Fonts(onProgress?: ProgressCallback): Promise<void> {
  const fonts = getFontUrls();
  const total = fonts.length;
  let loaded = 0;

  const report = () => {
    onProgress?.({ phase: "fonts", loaded, total });
  };

  report();

  for (const { family, url } of fonts) {
    const face = new FontFace(family, `url("${url}")`);
    await face.load();
    document.fonts.add(face);
    loaded += 1;
    report();
  }
}

async function preloadH5Audio(onProgress?: ProgressCallback): Promise<void> {
  onProgress?.({ phase: "audio", loaded: 0, total: 1 });
  const musicUrl = getMusicUrl();
  const response = await fetch(musicUrl);
  if (!response.ok) {
    throw new Error(`Audio preload failed: ${musicUrl} — HTTP ${response.status}`);
  }
  await response.blob();
  onProgress?.({ phase: "audio", loaded: 1, total: 1 });
}

async function preloadH5Assets(onProgress?: ProgressCallback): Promise<void> {
  const imageUrls = getAllImageUrls();
  await preloadH5Images(imageUrls, onProgress);
  await preloadH5Fonts(onProgress);
  await preloadH5Audio(onProgress);
}

/**
 * Preload all static assets (images, fonts, music).
 * Rejects if any asset fails — the app must not start until this succeeds.
 */
export async function preloadAllAssets(
  onProgress?: ProgressCallback,
): Promise<void> {
  if (process.env.TARO_ENV === "weapp") {
    await preloadWeappAssets(onProgress);
    return;
  }

  if (process.env.TARO_ENV === "h5") {
    await preloadH5Assets(onProgress);
    return;
  }

  throw new Error(`Asset preload is not implemented for ${process.env.TARO_ENV}`);
}
