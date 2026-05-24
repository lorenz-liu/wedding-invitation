import React, { useEffect, useState, useCallback } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AudioControl } from "../../components/AudioControl";
import { useBackgroundAudio } from "../../hooks/useAudio";
import { PageHome } from "./components/PageHome";
import { PageStoryTitle } from "./components/PageStoryTitle";
import { PageBirth } from "./components/PageBirth";
import { PageGrowingUp } from "./components/PageGrowingUp";
import { PageRelationship } from "./components/PageRelationship";
import { PageDistance } from "./components/PageDistance";
import { PageDistance2 } from "./components/PageDistance2";
import { PageToronto } from "./components/PageToronto";
import { PageLife } from "./components/PageLife";
import { PageMilestone } from "./components/PageMilestone";
import { PageSchedule } from "./components/PageSchedule";
import { PageLocation } from "./components/PageLocation";
import { PageForm } from "./components/PageForm";
import "./index.scss";

const TOTAL_PAGES = 13;

const Index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isPlaying, togglePlay, initAudio } = useBackgroundAudio();
  const touchStartY = React.useRef(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Auto-init audio once on component mount
  useEffect(() => {
    if (!audioInitialized) {
      const timer = setTimeout(() => {
        initAudio();
        setAudioInitialized(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [initAudio, audioInitialized]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < TOTAL_PAGES && !isAnimating) {
        setIsAnimating(true);
        setCurrentPage(pageIndex);
        setTimeout(() => setIsAnimating(false), 600);
      }
    },
    [isAnimating]
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
      } else {
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
        return <PageLife isActive={isActive} />;
      case 9:
        return <PageMilestone isActive={isActive} />;
      case 10:
        return <PageSchedule isActive={isActive} />;
      case 11:
        return <PageLocation isActive={isActive} />;
      case 12:
        return <PageForm isActive={isActive} />;
      default:
        return <PageHome isActive={isActive} />;
    }
  };

  return (
    <View className="index" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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

      {currentPage < TOTAL_PAGES - 1 && (
        <View className="scroll-hint-global" onClick={nextPage}>
          <View className="hint-arrow">↓</View>
        </View>
      )}

      <View className="page-counter">
        {currentPage + 1} / {TOTAL_PAGES}
      </View>
    </View>
  );
};

export default Index;
