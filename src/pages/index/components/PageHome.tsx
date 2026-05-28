import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageHome.scss";

interface PageHomeProps {
  isActive: boolean;
}

export const PageHome: React.FC<PageHomeProps> = ({ isActive }) => {
  const [figuresIn, setFiguresIn] = useState(false);
  const [contentTop, setContentTop] = useState<number | null>(null);

  const updateContentTop = useCallback(() => {
    Taro.createSelectorQuery()
      .select(".homepage-glasses-left")
      .boundingClientRect()
      .exec((res) => {
        const rect = res?.[0];
        if (!rect || !("height" in rect) || !rect.height) return;

        const topOffsetVh = Taro.getSystemInfoSync().windowHeight * 0.1;
        setContentTop(topOffsetVh + rect.height * 0.32);
      });
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setFiguresIn(true), 50);
      const measureTimer = setTimeout(updateContentTop, 120);
      return () => {
        clearTimeout(timer);
        clearTimeout(measureTimer);
      };
    }
    setFiguresIn(false);
  }, [isActive, updateContentTop]);

  const imageLayerClass = `homepage-images-layer ${figuresIn ? "animate" : ""}`;

  return (
    <View className="page page-home">
      <View className={imageLayerClass}>
        <View className="homepage-glasses homepage-glasses-left">
          <Image
            className="homepage-glasses-img"
            src={images.homepageGlassesLeft}
            mode="widthFix"
            onLoad={updateContentTop}
          />
        </View>

        <View className="homepage-glasses homepage-glasses-right">
          <Image
            className="homepage-glasses-img"
            src={images.homepageGlassesRight}
            mode="widthFix"
          />
        </View>

        <View className="homepage-figure homepage-figure-niu">
          <Image
            className="homepage-figure-img"
            src={images.homepageNiu}
            mode="widthFix"
          />
        </View>

        <View className="homepage-figure homepage-figure-gao">
          <Image
            className="homepage-figure-img"
            src={images.homepageGao}
            mode="widthFix"
          />
        </View>
      </View>

      <View
        className="content-wrapper"
        style={contentTop != null ? { top: `${contentTop}px` } : undefined}
      >
        <AnimatedView
          animation="fadeInUp"
          delay={0}
          duration={800}
          isActive={isActive}
        >
          <Text className="names-text">刘兆薰 & 高文珩</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          delay={500}
          duration={600}
          isActive={isActive}
        >
          <View className="date-info">
            <Text className="date-text">2026年7月25日 · 礼拜六 · 成都</Text>
          </View>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          delay={700}
          duration={600}
          isActive={isActive}
        >
          <Text className="invite-title">诚挚邀请您见证我们的婚礼</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          delay={900}
          duration={800}
          isActive={isActive}
        >
          <View className="poem-section">
            <Text className="poem-line">我们期待</Text>
            <Text className="poem-line">于我们意义非凡的您</Text>
            <Text className="poem-line">能够莅临现场</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
};
