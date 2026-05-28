import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import { images } from "../../../utils/assets";
import "./PageToronto.scss";

interface PageTorontoProps {
  isActive: boolean;
}

export const PageToronto: React.FC<PageTorontoProps> = ({ isActive }) => {
  const [torontoIn, setTorontoIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setTorontoIn(true), 50);
      return () => clearTimeout(timer);
    }
    setTorontoIn(false);
  }, [isActive]);

  return (
    <View className="page page-toronto">
      <View className="content-wrapper">
        <View className="date-box">
          <YearTitle>2023年</YearTitle>
          <Text className="date-day">10月14日</Text>
        </View>

        <AnimatedView
          animation="fadeIn"
          isActive={isActive}
          delay={300}
          duration={1000}
        >
          <View className="toronto-skyline-wrap">
            <Image
              className="toronto-skyline-img"
              src={images.torontoSkyline}
              mode="widthFix"
            />
          </View>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={500}
          duration={600}
        >
          <Text className="arrival-text">抵达加拿大多伦多</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          isActive={isActive}
          delay={700}
          duration={800}
        >
          <View className="decorations">
            <Text className="deco-text">我们的坐标 从此永远重合</Text>
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
};
