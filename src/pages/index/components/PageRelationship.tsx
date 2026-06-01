import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import { images } from "../../../utils/assets";
import "./PageRelationship.scss";

interface PageRelationshipProps {
  isActive: boolean;
}

export const PageRelationship: React.FC<PageRelationshipProps> = ({
  isActive,
}) => {
  const [sanyaIn, setSanyaIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setSanyaIn(true), 600);
      return () => clearTimeout(timer);
    }
    setSanyaIn(false);
  }, [isActive]);

  return (
    <View className="page page-relationship">
      <View className="content-wrapper">
        <View className="special-date">
          <YearTitle>2019</YearTitle>
          <Text className="date-month-day">7月25日</Text>
        </View>

        <AnimatedView
          className="story-title-wrap"
          animation="fadeInUp"
          isActive={isActive}
          delay={500}
          duration={800}
        >
          <Text className="story-title">故事的转角</Text>
        </AnimatedView>

        <AnimatedView
          className="story-content-wrap"
          animation="fadeIn"
          isActive={isActive}
          delay={700}
          duration={800}
        >
          <Text className="story-content">
            我们正式确定了彼此的心意
            {"\n"}
            从青梅竹马到一生伴侣
            {"\n"}
            我们的故事
            {"\n"}
            由此写下新的篇章
          </Text>
        </AnimatedView>
      </View>

      <View className={`sanya-anchor ${sanyaIn ? "animate" : ""}`}>
        <Image className="sanya-img" src={images.togetherFlower} mode="widthFix" />
      </View>
    </View>
  );
};
