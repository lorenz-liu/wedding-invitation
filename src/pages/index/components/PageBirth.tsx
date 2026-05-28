import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageBirth.scss";

interface PageBirthProps {
  isActive: boolean;
}

export const PageBirth: React.FC<PageBirthProps> = ({ isActive }) => {
  const [imagesIn, setImagesIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setImagesIn(true), 50);
      return () => clearTimeout(timer);
    }
    setImagesIn(false);
  }, [isActive]);

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
        <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
          <Text className="year-badge">2001年</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={200}
          duration={600}
        >
          <Text className="intro-text">
            同一个医生，接出了两个注定相遇的灵魂
          </Text>
        </AnimatedView>
      </View>
    </View>
  );
};
