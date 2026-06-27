import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import type { AssetLoadProgress } from "../../utils/assetPreloader";
import "./index.scss";

const SEGMENT_COUNT = 22;

function filledSegmentCount(progress: AssetLoadProgress | null): number {
  if (!progress || progress.totalBytes <= 0) return 0;

  const ratio = Math.min(1, progress.loadedBytes / progress.totalBytes);
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
