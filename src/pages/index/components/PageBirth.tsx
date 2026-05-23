import React from "react";
import { View, Text } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { DoodleHeart } from "../../../components/DoodleElements";
import "./PageBirth.scss";

interface PageBirthProps {
  isActive: boolean;
}

export const PageBirth: React.FC<PageBirthProps> = ({ isActive }) => {
  return (
    <View className="page page-birth">
      <View className="content-wrapper">
        <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
          <Text className="year-badge">2001年</Text>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={200} duration={600}>
          <Text className="intro-text">同一个医生，接生了两个注定相遇的灵魂。</Text>
        </AnimatedView>

        <View className="birth-cards">
          <AnimatedView
            animation="fadeInLeft"
            isActive={isActive}
            delay={400}
            duration={600}
            className="birth-card groom"
          >
            <View className="card-decoration">
              <DoodleHeart className="card-heart" />
            </View>
            <Text className="date-text">01月06日</Text>
            <Text className="label-text">新郎降临</Text>
          </AnimatedView>

          <AnimatedView
            animation="fadeInRight"
            isActive={isActive}
            delay={600}
            duration={600}
            className="birth-card bride"
          >
            <View className="card-decoration">
              <DoodleHeart className="card-heart" />
            </View>
            <Text className="date-text">06月19日</Text>
            <Text className="label-text">新娘出生</Text>
          </AnimatedView>
        </View>

        <AnimatedView animation="fadeIn" isActive={isActive} delay={800} duration={600}>
          <Text className="doctor-text">命运的安排，从此开始</Text>
        </AnimatedView>
      </View>
    </View>
  );
};
