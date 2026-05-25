import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageGrowingUp.scss";

interface PageGrowingUpProps {
  isActive: boolean;
}

export const PageGrowingUp: React.FC<PageGrowingUpProps> = ({ isActive }) => {
  const [kidsIn, setKidsIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setKidsIn(true), 50);
      return () => clearTimeout(timer);
    }
    setKidsIn(false);
  }, [isActive]);

  return (
    <View className="page page-growing-up">
      <View className="content-wrapper">
        <View className={`kids-hero ${kidsIn ? "animate" : ""}`}>
          <Image
            className="kids-hero-img"
            src={images.togetherKidsNoBg}
            mode="widthFix"
          />
        </View>

        <AnimatedView
          animation="fadeIn"
          isActive={isActive}
          delay={400}
          duration={600}
        >
          <Text className="years-text">2001 - 2019</Text>
        </AnimatedView>

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
  );
};
