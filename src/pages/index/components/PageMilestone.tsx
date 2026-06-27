import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { Countdown } from "../../../components/Countdown";
import {
  PageReadyGate,
  uniqueImageUrls,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import "./PageMilestone.scss";

interface PageMilestoneProps {
  isActive: boolean;
}

const PAGE_IMAGES = uniqueImageUrls([images.art, images.handHolding]);

function PageMilestoneContent() {
  const animationsReady = usePageAnimationsReady();
  const [artIn, setArtIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => setArtIn(true), 50);
      return () => clearTimeout(timer);
    }
    setArtIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-milestone">
      <View className={`art-anchor ${artIn ? "animate" : ""}`}>
        <Image className="art-img" src={images.art} mode="widthFix" />
      </View>

      <AnimatedView animation="fadeIn" isActive={animationsReady} duration={800}>
        <View className="hand-holding-anchor">
          <Image
            className="hand-holding-img"
            src={images.handHolding}
            mode="widthFix"
          />
        </View>
      </AnimatedView>

      <View className="content-wrapper">
        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          duration={600}
          className="milestone-year-block"
        >
          <Text className="year-count">七年</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeIn"
          isActive={animationsReady}
          delay={200}
          duration={600}
          className="milestone-context-block"
        >
          <Text className="context-text">在这个充满随机性的世界</Text>
          <Text className="context-text">我们的轨迹始终指向彼此</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={600}
          duration={600}
          className="poetry-block"
        >
          <Text className="context-text">
            当所有的经纬度最终重合
          </Text>
          <Text className="context-text">
            便成为里程碑
          </Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInScale"
          isActive={animationsReady}
          delay={800}
          duration={800}
          className="wedding-date-box-wrap"
        >
          <View className="wedding-date-box">
            <Text className="date-highlight">2026年7月25日</Text>
            <Text className="we-text">我们共同铭刻</Text>
            <Countdown isActive={animationsReady} />
          </View>
        </AnimatedView>
      </View>
    </View>
  );
}

export const PageMilestone: React.FC<PageMilestoneProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageMilestoneContent />
  </PageReadyGate>
);
