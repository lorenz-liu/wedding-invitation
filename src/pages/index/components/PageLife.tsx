import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageLife.scss";

interface PageLifeProps {
  isActive: boolean;
}

export const PageLife: React.FC<PageLifeProps> = ({ isActive }) => {
  const [leftIn, setLeftIn] = useState(false);
  const [rightIn, setRightIn] = useState(false);
  const [stickerIn, setStickerIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t1 = setTimeout(() => setLeftIn(true), 50);
      const t2 = setTimeout(() => setRightIn(true), 250);
      const t3 = setTimeout(() => setStickerIn(true), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    setLeftIn(false);
    setRightIn(false);
    setStickerIn(false);
  }, [isActive]);

  return (
    <View className="page page-life">
      <View className="content-wrapper">
        <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
          <Text className="years-text">2023 - 2026</Text>
        </AnimatedView>

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

      {/* Sticker — casually slapped onto the page */}
      <View className={`bawbaw-sticker ${stickerIn ? "animate" : ""}`}>
        <Image
          className="bawbaw-sticker-img"
          src={images.bawbawFullBody1}
          mode="widthFix"
        />
      </View>

      {/* Bottom-left: holding bawbaw */}
      <View
        className={`bawbaw-anchor bawbaw-anchor-left ${leftIn ? "animate" : ""}`}
      >
        <Image
          className="bawbaw-anchor-img"
          src={images.holdingBawbawNoBg}
          mode="widthFix"
        />
      </View>

      {/* Bottom-right: bawbaw full body */}
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
