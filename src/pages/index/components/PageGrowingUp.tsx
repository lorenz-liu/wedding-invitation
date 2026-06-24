import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import {
  PageReadyGate,
  uniqueImageUrls,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import "./PageGrowingUp.scss";

interface PageGrowingUpProps {
  isActive: boolean;
}

const PAGE_IMAGES = uniqueImageUrls([
  images.childhoodGif,
  images.togetherKidsNoBg,
]);

function PageGrowingUpContent() {
  const animationsReady = usePageAnimationsReady();
  const [bottomIn, setBottomIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => setBottomIn(true), 50);
      return () => clearTimeout(timer);
    }
    setBottomIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-growing-up">
      <View className="top-content-container">
        <View className={`childhood-gif-wrap ${bottomIn ? "animate" : ""}`}>
          <Image
            className="childhood-gif"
            src={images.childhoodGif}
            mode="widthFix"
          />
        </View>

        <View className="text-block">
          <YearTitle>2001 - 2019</YearTitle>

          <AnimatedView
            animation="fadeInUp"
            isActive={animationsReady}
            delay={800}
            duration={800}
          >
            <Text className="story-text">
              从懵懂孩提到并肩成长
              {"\n"}
              命运的轨迹早已悄然重合
              {"\n"}
              最好的朋友
              {"\n"}
              也是彼此青春的见证者
            </Text>
          </AnimatedView>
        </View>
      </View>

      <View className={`bottom-hero ${bottomIn ? "animate" : ""}`}>
        <Image
          className="bottom-hero-img"
          src={images.togetherKidsNoBg}
          mode="widthFix"
        />
      </View>
    </View>
  );
}

export const PageGrowingUp: React.FC<PageGrowingUpProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageGrowingUpContent />
  </PageReadyGate>
);
