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
import "./PageBirth.scss";

interface PageBirthProps {
  isActive: boolean;
}

const PAGE_IMAGES = uniqueImageUrls([
  images.babyGaoLeft,
  images.gaoKidNoBg,
  images.niuKidNoBg,
  images.babyNiuRight,
]);

function PageBirthContent() {
  const animationsReady = usePageAnimationsReady();
  const [imagesIn, setImagesIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => setImagesIn(true), 50);
      return () => clearTimeout(timer);
    }
    setImagesIn(false);
  }, [animationsReady]);

  const layerClass = `birth-images-layer ${imagesIn ? "animate" : ""}`;

  return (
    <View className="page page-birth">
      <View className={layerClass}>
        <Image
          className="birth-corner corner-tl"
          src={images.babyGaoLeft}
          mode="widthFix"
        />

        <View className="kid-cluster corner-tr gao-kid-cluster">
          <Text className="kid-label-top">未来的新娘</Text>
          <Image className="kid-photo" src={images.gaoKidNoBg} mode="widthFix" />
          <Text className="kid-label-bottom">6月19日</Text>
        </View>

        <View className="kid-cluster corner-bl niu-kid-cluster">
          <Text className="kid-label-top">未来的新郎</Text>
          <Image className="kid-photo" src={images.niuKidNoBg} mode="widthFix" />
          <Text className="kid-label-bottom">1月6日</Text>
        </View>

        <Image
          className="birth-corner corner-br"
          src={images.babyNiuRight}
          mode="widthFix"
        />
      </View>

      <View className="birth-title-center">
        <YearTitle className="birth-year-title">2001年</YearTitle>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={200}
          duration={600}
        >
          <Text className="intro-text">
            两个注定相遇的灵魂
            {'\n'}
            由同一个医生带到了这个世界
          </Text>
        </AnimatedView>
      </View>
    </View>
  );
}

export const PageBirth: React.FC<PageBirthProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageBirthContent />
  </PageReadyGate>
);
