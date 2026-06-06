import React, { useEffect, useState, useCallback, useRef } from "react";
import { View } from "@tarojs/components";
import Taro, { useReady } from "@tarojs/taro";
import { AssetLoadingScreen } from "../../components/AssetLoadingScreen";
import { AudioControl } from "../../components/AudioControl";
import { useBackgroundAudio } from "../../hooks/useAudio";
import {
  preloadAllAssets,
  type AssetLoadProgress,
} from "../../utils/assetPreloader";
import { PageHome } from "./components/PageHome";
import { PageStoryTitle } from "./components/PageStoryTitle";
import { PageBirth } from "./components/PageBirth";
import { PageGrowingUp } from "./components/PageGrowingUp";
import { PageRelationship } from "./components/PageRelationship";
import { PageDistance } from "./components/PageDistance";
import { PageDistance2 } from "./components/PageDistance2";
import { PageToronto } from "./components/PageToronto";
import { PageLife } from "./components/PageLife";
import { PageGraduate } from "./components/PageGraduate";
import { PageMilestone } from "./components/PageMilestone";
import { PageSchedule } from "./components/PageSchedule";
import { PageLocation } from "./components/PageLocation";
import { PageForm } from "./components/PageForm";
import { RESUME_LAST_PAGE_ENABLED, RESUME_LAST_PAGE_KEY } from "../../constants/config";
import "./index.scss";

const TOTAL_PAGES = 14;
const FORM_PAGE_INDEX = 13;
const FORM_SCROLL_TOP_THRESHOLD = 8;

function readSavedPageIndex(): number {
  if (!RESUME_LAST_PAGE_ENABLED) return 0;
  try {
    const saved = Taro.getStorageSync(RESUME_LAST_PAGE_KEY);
    const index = Number(saved);
    if (Number.isInteger(index) && index >= 0 && index < TOTAL_PAGES) {
      return index;
    }
  } catch {
    // ignore
  }
  return 0;
}

function persistPageIndex(pageIndex: number): void {
  if (!RESUME_LAST_PAGE_ENABLED) return;
  try {
    Taro.setStorageSync(RESUME_LAST_PAGE_KEY, pageIndex);
  } catch {
    // ignore
  }
}

const Index: React.FC = () => {
  const [assetsReady, setAssetsReady] = useState(false);
  const [progress, setProgress] = useState<AssetLoadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const preloadStartedRef = useRef(false);

  const [currentPage, setCurrentPage] = useState(readSavedPageIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isPlaying, togglePlay, initAudio } = useBackgroundAudio();
  const touchStartY = React.useRef(0);
  const formScrollTopRef = React.useRef(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

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

  useReady(() => {
    if (preloadStartedRef.current) return;
    preloadStartedRef.current = true;
    void startPreload();
  });

  useEffect(() => {
    if (currentPage !== FORM_PAGE_INDEX) {
      formScrollTopRef.current = 0;
    }
  }, [currentPage]);

  // Auto-init audio after assets are preloaded
  useEffect(() => {
    if (!assetsReady || audioInitialized) return;

    const timer = setTimeout(() => {
      initAudio();
      setAudioInitialized(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [assetsReady, initAudio, audioInitialized]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < TOTAL_PAGES && !isAnimating) {
        setIsAnimating(true);
        setCurrentPage(pageIndex);
        persistPageIndex(pageIndex);
        setTimeout(() => setIsAnimating(false), 600);
      }
    },
    [isAnimating],
  );

  const nextPage = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Touch handling for swipe
  const handleTouchStart = (e: any) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: any) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        nextPage();
      } else if (
        currentPage !== FORM_PAGE_INDEX ||
        formScrollTopRef.current <= FORM_SCROLL_TOP_THRESHOLD
      ) {
        prevPage();
      }
    }
  };

  // Render current page only (simpler, more reliable)
  const renderCurrentPage = () => {
    const isActive = true; // Always active for current page

    switch (currentPage) {
      case 0:
        return <PageHome isActive={isActive} />;
      case 1:
        return <PageStoryTitle isActive={isActive} />;
      case 2:
        return <PageBirth isActive={isActive} />;
      case 3:
        return <PageGrowingUp isActive={isActive} />;
      case 4:
        return <PageRelationship isActive={isActive} />;
      case 5:
        return <PageDistance isActive={isActive} />;
      case 6:
        return <PageDistance2 isActive={isActive} />;
      case 7:
        return <PageToronto isActive={isActive} />;
      case 8:
        return <PageGraduate isActive={isActive} />;
      case 9:
        return <PageLife isActive={isActive} />;
      case 10:
        return <PageMilestone isActive={isActive} />;
      case 11:
        return <PageSchedule isActive={isActive} />;
      case 12:
        return <PageLocation isActive={isActive} />;
      case 13:
        return (
          <PageForm
            isActive={isActive}
            onScrollTopChange={(scrollTop) => {
              formScrollTopRef.current = scrollTop;
            }}
          />
        );
      default:
        return <PageHome isActive={isActive} />;
    }
  };

  const handleTouchMove = (e: any) => {
    // Block page rubber-band; form page scrolls inside its own ScrollView.
    if (currentPage !== FORM_PAGE_INDEX) {
      e.stopPropagation?.();
    }
  };

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

  return (
    <View
      className="index"
      catchMove
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AudioControl isPlaying={isPlaying} onToggle={togglePlay} />

      <View className="page-indicator">
        {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
          <View
            key={index}
            className={`indicator-dot ${currentPage === index ? "active" : ""}`}
            onClick={() => goToPage(index)}
          />
        ))}
      </View>

      <View className="page-container">{renderCurrentPage()}</View>
    </View>
  );
};

export default Index;
