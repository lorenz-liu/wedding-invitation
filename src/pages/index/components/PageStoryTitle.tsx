import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { DoodleRing, DoodleLine } from "../../../components/DoodleElements";
import { images } from "../../../utils/assets";
import "./PageStoryTitle.scss";

interface PageStoryTitleProps {
  isActive: boolean;
}

export const PageStoryTitle: React.FC<PageStoryTitleProps> = ({ isActive }) => {
  const [logoIn, setLogoIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setLogoIn(true), 50);
      return () => clearTimeout(timer);
    }
    setLogoIn(false);
  }, [isActive]);

  return (
    <View className="page page-story-title">
      <View className="content-wrapper">
        <View className={`story-logo ${logoIn ? "animate" : ""}`}>
          <Image
            className="story-logo-img"
            src={images.logoNoBg}
            mode="widthFix"
          />
        </View>

        <AnimatedView
          animation="fadeInScale"
          isActive={isActive}
          duration={800}
        >
          <DoodleRing className="title-ring" />
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={300}
          duration={800}
        >
          <Text className="story-title">我们的故事</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          isActive={isActive}
          delay={600}
          duration={600}
        >
          <DoodleLine className="title-line" />
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          isActive={isActive}
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
};
