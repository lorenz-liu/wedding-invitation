import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageGraduate.scss";

interface PageGraduateProps {
  isActive: boolean;
}

export const PageGraduate: React.FC<PageGraduateProps> = ({ isActive }) => {
  const [photoIn, setPhotoIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setPhotoIn(true), 50);
      return () => clearTimeout(timer);
    }
    setPhotoIn(false);
  }, [isActive]);

  return (
    <View className="page page-graduate">
      <View className="content-wrapper">
        <AnimatedView animation="fadeInUp" isActive={isActive} duration={600}>
          <View className="date-box">
            <Text className="date-year">2025年</Text>
            <Text className="date-day">6月6日</Text>
          </View>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={250}
          duration={700}
        >
          <Text className="grad-headline">硕士毕业啦！</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={450}
          duration={700}
        >
          <View className="grad-body">
            <Text className="grad-body-text">拨穗礼毕 学生时代至此圆满落款</Text>
            <Text className="grad-body-text">翻开职场波澜万丈的下一章</Text>
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
};
