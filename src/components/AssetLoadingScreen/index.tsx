import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import { getAllImageUrls, getFontUrls } from "../../utils/assets";
import type { AssetLoadProgress } from "../../utils/assetPreloader";
import "./index.scss";

const SEGMENT_COUNT = 22;

const IMAGE_TOTAL = getAllImageUrls().length;
const FONT_TOTAL = getFontUrls().length;
const PRELOAD_TOTAL = IMAGE_TOTAL + FONT_TOTAL + 1;

function filledSegmentCount(progress: AssetLoadProgress | null): number {
  if (!progress || progress.total <= 0) return 0;

  let loaded = 0;
  switch (progress.phase) {
    case "images":
      loaded = progress.loaded;
      break;
    case "fonts":
      loaded = IMAGE_TOTAL + progress.loaded;
      break;
    case "audio":
      loaded = IMAGE_TOTAL + FONT_TOTAL + progress.loaded;
      break;
  }

  const ratio = Math.min(1, loaded / PRELOAD_TOTAL);
  return Math.round(ratio * SEGMENT_COUNT);
}

interface AssetLoadingScreenProps {
  progress: AssetLoadProgress | null;
  error: string | null;
  onRetry: () => void;
}

export const AssetLoadingScreen: React.FC<AssetLoadingScreenProps> = ({
  progress,
  error,
  onRetry,
}) => {
  const filledCount = useMemo(
    () => (error ? 0 : filledSegmentCount(progress)),
    [progress, error],
  );

  return (
    <View
      className="asset-loading-screen"
      onClick={error ? onRetry : undefined}
    >
      <View className="asset-loading-bar-track">
        <View className="asset-loading-bar-segments">
          {Array.from({ length: SEGMENT_COUNT }).map((_, index) => (
            <View
              key={index}
              className={`asset-loading-segment${
                index < filledCount ? " asset-loading-segment--filled" : ""
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
