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
import "./PageGraduate.scss";

interface PageGraduateProps {
  isActive: boolean;
}

const PAGE_IMAGES = uniqueImageUrls([images.masterGraduationTogether]);

function PageGraduateContent() {
  const animationsReady = usePageAnimationsReady();
  const [photoIn, setPhotoIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => setPhotoIn(true), 50);
      return () => clearTimeout(timer);
    }
    setPhotoIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-graduate">
      <View className="content-wrapper">
        <View className="date-box">
          <YearTitle>2025年</YearTitle>
          <Text className="date-day">6月6日</Text>
        </View>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={250}
          duration={700}
        >
          <Text className="grad-headline">硕士毕业！</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={450}
          duration={700}
        >
          <View className="grad-body">
            <Text className="grad-body-text">
              学生时代至此圆满落款
              {'\n'}
              正式进入职场
              {'\n'}
              一路走来
              {'\n'}
              有风有雨有繁花
            </Text>
          </View>
        </AnimatedView>
      </View>

      <View className={`graduation-anchor ${photoIn ? "animate" : ""}`}>
        <Image
          className="graduation-img"
          src={images.masterGraduationTogether}
          mode="widthFix"
        />
      </View>
    </View>
  );
}

export const PageGraduate: React.FC<PageGraduateProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageGraduateContent />
  </PageReadyGate>
);
