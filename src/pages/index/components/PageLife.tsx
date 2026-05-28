import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import { images } from "../../../utils/assets";
import "./PageLife.scss";

interface PageLifeProps {
  isActive: boolean;
}

export const PageLife: React.FC<PageLifeProps> = ({ isActive }) => {
  const [leftIn, setLeftIn] = useState(false);
  const [rightIn, setRightIn] = useState(false);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t0 = setTimeout(() => setHeroIn(true), 50);
      const t1 = setTimeout(() => setLeftIn(true), 50);
      const t2 = setTimeout(() => setRightIn(true), 250);
      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setHeroIn(false);
    setLeftIn(false);
    setRightIn(false);
  }, [isActive]);

  return (
    <View className="page page-life">
      <View className="life-content-container">
        <View className={`bawbaw-hero ${heroIn ? "animate" : ""}`}>
          <Image
            className="bawbaw-hero-img"
            src={images.bawbawFullBody1}
            mode="widthFix"
          />
        </View>

        <View className="life-text-block">
          <YearTitle>2023 - 2026</YearTitle>

          <AnimatedView
            animation="fadeInUp"
            isActive={isActive}
            delay={200}
            duration={800}
          >
            <Text className="life-text">
              远涉至这片北国的土地
              {"\n"}
              我们相濡以沫
              {"\n"}
              风花雪月 细水长流
            </Text>
          </AnimatedView>
          <AnimatedView
            animation="fadeInUp"
            isActive={isActive}
            delay={700}
            duration={800}
          >
            <Text className="life-text">
              家里还有了一名新成员
              {"\n"}
              一只名叫宝宝的小猫
              {"\n"}
              猫肥家润 岁岁年年
            </Text>
          </AnimatedView>
        </View>
      </View>

      <View
        className={`bawbaw-anchor bawbaw-anchor-left ${leftIn ? "animate" : ""}`}
      >
        <Image
          className="bawbaw-anchor-img"
          src={images.holdingBawbawNoBg}
          mode="widthFix"
        />
      </View>

      <View
        className={`bawbaw-anchor bawbaw-anchor-right ${rightIn ? "animate" : ""}`}
      >
        <Image
          className="bawbaw-anchor-img"
          src={images.bawbawFullBody3}
          mode="widthFix"
        />
      </View>
    </View>
  );
};
