import React from "react";
import { View, Text } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { DoodleHeart, DoodleRing } from "../../../components/DoodleElements";
import "./PageMilestone.scss";

interface PageMilestoneProps {
  isActive: boolean;
}

export const PageMilestone: React.FC<PageMilestoneProps> = ({ isActive }) => {
  return (
    <View className="page page-milestone">
      <View className="content-wrapper">
        <AnimatedView animation="fadeInUp" isActive={isActive} duration={600}>
          <Text className="year-count">七年</Text>
        </AnimatedView>

        <AnimatedView animation="fadeIn" isActive={isActive} delay={200} duration={600}>
          <Text className="context-text">在这个充满随机性的世界</Text>
          <Text className="context-text">我们的轨迹始终指向彼此</Text>
        </AnimatedView>

        <AnimatedView animation="fadeInScale" isActive={isActive} delay={400} duration={800}>
          <View className="milestone-icons">
            <DoodleHeart className="ms-heart" />
            <Text className="ms-plus">+</Text>
            <DoodleRing className="ms-ring" />
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={600} duration={600}>
          <Text className="poetry-text">
            当所有的经纬度最终重合
            {"\n"}
            便成为里程碑
          </Text>
        </AnimatedView>

        <AnimatedView animation="fadeInScale" isActive={isActive} delay={800} duration={800}>
          <View className="wedding-date-box">
            <Text className="date-highlight">2026年7月25日</Text>
            <Text className="we-text">我们共同铭刻</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
};
