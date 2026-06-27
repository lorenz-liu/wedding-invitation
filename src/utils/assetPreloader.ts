import Taro from "@tarojs/taro";
import {
  getAllImageUrls,
  getFontPreloadByteWeight,
  getFontUrls,
  getImagePreloadByteWeight,
  getMusicUrl,
  getPreloadTotalBytes,
  MUSIC_PRELOAD_BYTES,
} from "./assets";
import { resolveWeappMediaPath } from "./weappMedia";
import { toWeappFontSourceAsync } from "./weappAsset";

export interface AssetLoadProgress {
  loadedBytes: number;
  totalBytes: number;
}

type ProgressCallback = (progress: AssetLoadProgress) => void;

const IMAGE_CONCURRENCY = 10;

class ByteProgressTracker {
  private loadedBytes = 0;

  constructor(
    private readonly totalBytes: number,
    private readonly onProgress?: ProgressCallback,
  ) {}

  reportInitial(): void {
    this.onProgress?.({ loadedBytes: 0, totalBytes: this.totalBytes });
  }

  report(bytes: number): void {
    this.loadedBytes = Math.min(this.totalBytes, this.loadedBytes + bytes);
    this.onProgress?.({
      loadedBytes: this.loadedBytes,
      totalBytes: this.totalBytes,
    });
  }
}

async function loadWeappFont(family: string, url: string): Promise<void> {
  const source = await toWeappFontSourceAsync(url);

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

async function preloadWeappImage(url: string): Promise<void> {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      `WeChat image preload requires HTTPS URL, got: ${url}. Check resolveImageAssetPath().`,
    );
  }

  const localPath = await resolveWeappMediaPath(url);

  return new Promise((resolve, reject) => {
    Taro.getImageInfo({
      src: localPath,
      success: () => resolve(),
      fail: (err) =>
        reject(new Error(`Image preload failed: ${url} — ${JSON.stringify(err)}`)),
    });
  });
}

async function preloadWeappImages(
  urls: string[],
  tracker: ByteProgressTracker,
): Promise<void> {
  for (let i = 0; i < urls.length; i += IMAGE_CONCURRENCY) {
    const batch = urls.slice(i, i + IMAGE_CONCURRENCY);
    await Promise.all(
      batch.map(async (url) => {
        await preloadWeappImage(url);
        tracker.report(getImagePreloadByteWeight(url));
      }),
    );
  }
}

async function preloadWeappFonts(tracker: ByteProgressTracker): Promise<void> {
  const fonts = getFontUrls();
  await Promise.all(
    fonts.map(async ({ family, url }) => {
      await loadWeappFont(family, url);
      tracker.report(getFontPreloadByteWeight(family));
    }),
  );
}

async function preloadWeappAudio(tracker: ByteProgressTracker): Promise<void> {
  const musicUrl = getMusicUrl();
  await resolveWeappMediaPath(musicUrl);
  tracker.report(MUSIC_PRELOAD_BYTES);
}

async function preloadWeappAssets(onProgress?: ProgressCallback): Promise<void> {
  const tracker = new ByteProgressTracker(getPreloadTotalBytes(), onProgress);
  tracker.reportInitial();

  const imageUrls = getAllImageUrls();
  await Promise.all([
    preloadWeappImages(imageUrls, tracker),
    preloadWeappFonts(tracker),
    preloadWeappAudio(tracker),
  ]);
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
  tracker: ByteProgressTracker,
): Promise<void> {
  for (let i = 0; i < urls.length; i += IMAGE_CONCURRENCY) {
    const batch = urls.slice(i, i + IMAGE_CONCURRENCY);
    await Promise.all(
      batch.map(async (url) => {
        await preloadH5Image(url);
        tracker.report(getImagePreloadByteWeight(url));
      }),
    );
  }
}

async function preloadH5Fonts(tracker: ByteProgressTracker): Promise<void> {
  const fonts = getFontUrls();
  await Promise.all(
    fonts.map(async ({ family, url }) => {
      const face = new FontFace(family, `url("${url}")`);
      await face.load();
      document.fonts.add(face);
      tracker.report(getFontPreloadByteWeight(family));
    }),
  );
}

async function preloadH5Audio(tracker: ByteProgressTracker): Promise<void> {
  const musicUrl = getMusicUrl();
  const response = await fetch(musicUrl);
  if (!response.ok) {
    throw new Error(`Audio preload failed: ${musicUrl} — HTTP ${response.status}`);
  }
  await response.blob();
  tracker.report(MUSIC_PRELOAD_BYTES);
}

async function preloadH5Assets(onProgress?: ProgressCallback): Promise<void> {
  const tracker = new ByteProgressTracker(getPreloadTotalBytes(), onProgress);
  tracker.reportInitial();

  const imageUrls = getAllImageUrls();
  await Promise.all([
    preloadH5Images(imageUrls, tracker),
    preloadH5Fonts(tracker),
    preloadH5Audio(tracker),
  ]);
}

/**
 * Preload all static assets (images, fonts, music) in parallel.
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
