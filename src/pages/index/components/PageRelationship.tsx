import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { DoodleHeart, DoodleRing } from "../../../components/DoodleElements";
import { images } from "../../../utils/assets";
import "./PageRelationship.scss";

interface PageRelationshipProps {
  isActive: boolean;
}

export const PageRelationship: React.FC<PageRelationshipProps> = ({ isActive }) => {
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
        <AnimatedView animation="fadeInScale" isActive={isActive} duration={600}>
          <View className="special-date">
            <Text className="date-number">2019</Text>
            <Text className="date-month-day">7月25日</Text>
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={300} duration={600}>
          <View className="icons-row">
            <DoodleHeart className="rel-heart" />
            <Text className="plus-sign">+</Text>
            <DoodleRing className="rel-ring" />
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={500} duration={800}>
          <Text className="story-title">故事的转角</Text>
        </AnimatedView>

        <AnimatedView animation="fadeIn" isActive={isActive} delay={700} duration={800}>
          <Text className="story-content">
            我们正式确定了彼此的心意。
            {"\n"}
            从青梅竹马到一生伴侣，
            {"\n"}
            我们的故事，
            {"\n"}
            由此写下新的篇章。
          </Text>
        </AnimatedView>

        <AnimatedView animation="fadeInScale" isActive={isActive} delay={1000} duration={600}>
          <View className="heart-decoration">
            <DoodleHeart className="big-heart" />
          </View>
        </AnimatedView>
      </View>

      <View className={`sanya-anchor ${sanyaIn ? "animate" : ""}`}>
        <Image
          className="sanya-img"
          src={images.sanyaNoBg}
          mode="widthFix"
        />
      </View>
    </View>
  );
};
