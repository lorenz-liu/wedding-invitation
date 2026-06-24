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
import "./PageToronto.scss";

interface PageTorontoProps {
  isActive: boolean;
}

const PAGE_IMAGES = uniqueImageUrls([
  images.torontoLandmark,
  images.torontoNoBg,
]);

function PageTorontoContent() {
  const animationsReady = usePageAnimationsReady();
  const [landmarkIn, setLandmarkIn] = useState(false);
  const [torontoIn, setTorontoIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => {
        setLandmarkIn(true);
        setTorontoIn(true);
      }, 50);
      return () => clearTimeout(timer);
    }
    setLandmarkIn(false);
    setTorontoIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-toronto">
      <View className={`toronto-landmark ${landmarkIn ? "animate" : ""}`}>
        <Image
          className="toronto-landmark-img"
          src={images.torontoLandmark}
          mode="heightFix"
        />
      </View>

      <View className="content-wrapper">
        <View className="date-box">
          <YearTitle>2023年</YearTitle>
          <Text className="date-day">10月14日</Text>
        </View>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={300}
          duration={600}
        >
          <Text className="arrival-text">抵达加拿大多伦多</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          isActive={animationsReady}
          delay={500}
          duration={800}
        >
          <View className="decorations">
            <Text className="deco-text">
              我们的坐标
              {'\n'}
              从此永远重合
            </Text>
          </View>
        </AnimatedView>
      </View>

      <View className={`toronto-anchor ${torontoIn ? "animate" : ""}`}>
        <Image
          className="toronto-img"
          src={images.torontoNoBg}
          mode="widthFix"
        />
      </View>
    </View>
  );
}

export const PageToronto: React.FC<PageTorontoProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageTorontoContent />
  </PageReadyGate>
);
