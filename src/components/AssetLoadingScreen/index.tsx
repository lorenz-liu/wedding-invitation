import React from "react";
import { View, Text, Button } from "@tarojs/components";
import type { AssetLoadProgress } from "../utils/assetPreloader";
import "./index.scss";

const PHASE_LABEL: Record<AssetLoadProgress["phase"], string> = {
  images: "图片",
  fonts: "字体",
  audio: "音乐",
};

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
  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
      : 0;

  return (
    <View className="asset-loading-screen">
      <View className="asset-loading-card">
        <Text className="asset-loading-title">婚礼请柬</Text>
        {error ? (
          <>
            <Text className="asset-loading-error">{error}</Text>
            <Button className="asset-loading-retry" onClick={onRetry}>
              重试
            </Button>
          </>
        ) : (
          <>
            <Text className="asset-loading-subtitle">
              {progress
                ? `正在加载${PHASE_LABEL[progress.phase]}… ${progress.loaded}/${progress.total}`
                : "正在准备资源…"}
            </Text>
            <View className="asset-loading-bar">
              <View
                className="asset-loading-bar-fill"
                style={{ width: `${percent}%` }}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};
