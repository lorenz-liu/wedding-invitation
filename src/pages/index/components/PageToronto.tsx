import React from "react";
import { View, Text } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { DoodleHeart, DoodleRing } from "../../../components/DoodleElements";
import "./PageToronto.scss";

interface PageTorontoProps {
  isActive: boolean;
}

export const PageToronto: React.FC<PageTorontoProps> = ({ isActive }) => {
  return (
    <View className="page page-toronto">
      <View className="content-wrapper">
        <AnimatedView animation="fadeInUp" isActive={isActive} duration={600}>
          <View className="date-box">
            <Text className="date-year">2023年</Text>
            <Text className="date-day">10月14日</Text>
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeInScale" isActive={isActive} delay={300} duration={800}>
          <View className="plane-icon">✈️</View>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={500} duration={600}>
          <Text className="arrival-text">抵达多伦多</Text>
        </AnimatedView>

        <AnimatedView animation="fadeIn" isActive={isActive} delay={700} duration={800}>
          <View className="decorations">
            <DoodleHeart className="deco-heart" />
            <Text className="deco-text">我们的坐标</Text>
            <DoodleRing className="deco-ring" />
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={900} duration={800}>
          <Text className="forever-text">从此永远重合</Text>
        </AnimatedView>

        <AnimatedView animation="fadeIn" isActive={isActive} delay={1100} duration={600}>
          <View className="location-badge">
            <Text className="pin-icon">📍</Text>
            <Text className="city-name">Toronto, Canada</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
};
