import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import {
  PageReadyGate,
  uniqueImageUrls,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import "./PageStoryTitle.scss";

interface PageStoryTitleProps {
  isActive: boolean;
}

const PAGE_IMAGES = uniqueImageUrls([images.storyIcon]);

function PageStoryTitleContent() {
  const animationsReady = usePageAnimationsReady();
  const [logoIn, setLogoIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => setLogoIn(true), 50);
      return () => clearTimeout(timer);
    }
    setLogoIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-story-title">
      <View className="content-wrapper">
        <View className={`story-logo ${logoIn ? "animate" : ""}`}>
          <Image
            className="story-logo-img"
            src={images.storyIcon}
            mode="widthFix"
          />
        </View>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={300}
          duration={800}
        >
          <Text className="story-title">我们的故事</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          isActive={animationsReady}
          delay={800}
          duration={800}
        >
          <View className="subtitle-section">
            <Text className="subtitle-desc">从稚子并肩，到终生相伴</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
}

export const PageStoryTitle: React.FC<PageStoryTitleProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageStoryTitleContent />
  </PageReadyGate>
);
