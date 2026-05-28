import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageGrowingUp.scss";

interface PageGrowingUpProps {
  isActive: boolean;
}

export const PageGrowingUp: React.FC<PageGrowingUpProps> = ({ isActive }) => {
  const [bottomIn, setBottomIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setBottomIn(true), 50);
      return () => clearTimeout(timer);
    }
    setBottomIn(false);
  }, [isActive]);

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
          <Text className="years-text">2001 - 2019</Text>

          <AnimatedView
            animation="fadeInUp"
            isActive={isActive}
            delay={800}
            duration={800}
          >
            <Text className="story-text">
              从懵懂孩提到并肩成长，
              {"\n"}
              命运的轨迹早已悄然重合，
              {"\n"}
              最好的朋友，
              {"\n"}
              也是彼此青春的见证者。
            </Text>
          </AnimatedView>

          <AnimatedView
            animation="fadeIn"
            isActive={isActive}
            delay={1300}
            duration={600}
          >
            <Text className="quote-text">{`总角之宴 言笑晏晏 信誓旦旦 不思其反`}</Text>
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
};
