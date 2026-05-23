import React from "react";
import { View, Text } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { AnimatedImage } from "../../../components/AnimatedImage";
import { DoodleLine } from "../../../components/DoodleElements";
import "./PageDistance.scss";

interface PageDistanceProps {
  isActive: boolean;
}

export const PageDistance: React.FC<PageDistanceProps> = ({ isActive }) => {
  return (
    <View className="page page-distance">
      {/* Header Section */}
      <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
        <View className="page-header">
          <Text className="years-badge">2019 - 2023</Text>
          <DoodleLine className="header-line" />
        </View>
      </AnimatedView>

      {/* Main Content - Horizontal Layout */}
      <View className="distance-content">
        {/* Intro Text */}
        <AnimatedView animation="fadeInUp" isActive={isActive} delay={200} duration={600}>
          <View className="intro-section">
            <Text className="intro-text">我们跨越了时差与国界。</Text>
          </View>
        </AnimatedView>

        {/* Timeline Cards - Horizontal */}
        <View className="timeline-cards">
          {/* Seattle 2020 */}
          <AnimatedView animation="fadeInScale" isActive={isActive} delay={300} duration={800}>
            <View className="timeline-card">
              <View className="card-year">2020</View>
              <View className="card-image">
                <AnimatedImage
                  src={require("../../../assets/images/seattle-4.jpg")}
                  animation="fadeInScale"
                  delay={400}
                  isActive={isActive}
                  frameStyle="polaroid"
                  aspectRatio="square"
                />
              </View>
              <View className="card-text">
                <Text className="card-title">西雅图的第一场雪</Text>
              </View>
            </View>
          </AnimatedView>

          {/* Connection */}
          <AnimatedView animation="fadeIn" isActive={isActive} delay={500} duration={400}>
            <View className="connection-arrow">→</View>
          </AnimatedView>

          {/* Sanya 2021 */}
          <AnimatedView animation="fadeInScale" isActive={isActive} delay={600} duration={800}>
            <View className="timeline-card">
              <View className="card-year">2021</View>
              <View className="card-image">
                <AnimatedImage
                  src={require("../../../assets/images/sanya.jpg")}
                  animation="fadeInScale"
                  delay={700}
                  isActive={isActive}
                  frameStyle="polaroid"
                  aspectRatio="square"
                />
              </View>
              <View className="card-text">
                <Text className="card-title">短暂团聚</Text>
              </View>
            </View>
          </AnimatedView>

          {/* Connection */}
          <AnimatedView animation="fadeIn" isActive={isActive} delay={800} duration={400}>
            <View className="connection-arrow">→</View>
          </AnimatedView>

          {/* 2022 Dual Cities */}
          <AnimatedView animation="fadeInScale" isActive={isActive} delay={900} duration={800}>
            <View className="timeline-card wide">
              <View className="card-year">2022</View>
              <View className="dual-images">
                <AnimatedImage
                  src={require("../../../assets/images/beijing.jpg")}
                  animation="slideInLeft"
                  delay={1000}
                  isActive={isActive}
                  frameStyle="polaroid"
                  aspectRatio="portrait"
                  className="tilt-left"
                />
                <AnimatedImage
                  src={require("../../../assets/images/shanghai.jpg")}
                  animation="slideInRight"
                  delay={1100}
                  isActive={isActive}
                  frameStyle="polaroid"
                  aspectRatio="portrait"
                  className="tilt-right"
                />
              </View>
              <View className="card-text">
                <Text className="card-title">久别重逢</Text>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Conclusion */}
        <AnimatedView animation="fadeInUp" isActive={isActive} delay={1300} duration={600}>
          <View className="conclusion-section">
            <Text className="conclusion-text">
              这些跨越距离的时光，让我们更确信，并肩前行才是最好的选择。
            </Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
};
