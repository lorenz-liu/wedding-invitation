import { useCallback, useState } from "react";
import { useLaunch } from "@tarojs/taro";
import "./app.scss";
import { AssetLoadingScreen } from "./components/AssetLoadingScreen";
import {
  preloadAllAssets,
  type AssetLoadProgress,
} from "./utils/assetPreloader";

function App({ children }) {
  const [assetsReady, setAssetsReady] = useState(false);
  const [progress, setProgress] = useState<AssetLoadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startPreload = useCallback(async () => {
    setError(null);
    setProgress(null);
    setAssetsReady(false);

    try {
      await preloadAllAssets((next) => setProgress(next));
      setAssetsReady(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "资源加载失败，请检查网络后重试";
      console.error("[assets] Preload failed:", err);
      setError(message);
    }
  }, []);

  useLaunch(() => {
    void startPreload();
  });

  if (!assetsReady) {
    return (
      <AssetLoadingScreen
        progress={progress}
        error={error}
        onRetry={() => {
          void startPreload();
        }}
      />
    );
  }

  return children;
}

export default App;
