import React from "react";
import { View, Text, Button } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import {
  PageReadyGate,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import "./PageFinal.scss";

interface PageFinalProps {
  isActive: boolean;
  onGoHome: () => void;
  onGoLocation: () => void;
  onGoSchedule: () => void;
}

const PAGE_IMAGES: string[] = [];

function PageFinalContent({
  onGoHome,
  onGoLocation,
  onGoSchedule,
}: Pick<PageFinalProps, "onGoHome" | "onGoLocation" | "onGoSchedule">) {
  const animationsReady = usePageAnimationsReady();

  return (
    <View className="page page-final">
      <View className="final-container">
        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          duration={700}
        >
          <Text className="final-message">诚挚感谢您的光临</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={250}
          duration={600}
        >
          <View className="final-actions">
            <Button className="final-btn" onClick={onGoHome}>
              <Text className="final-btn-text">访问首页</Text>
            </Button>
            <Button className="final-btn" onClick={onGoLocation}>
              <Text className="final-btn-text">查看地点</Text>
            </Button>
            <Button className="final-btn" onClick={onGoSchedule}>
              <Text className="final-btn-text">当日安排</Text>
            </Button>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
}

export const PageFinal: React.FC<PageFinalProps> = ({
  isActive,
  onGoHome,
  onGoLocation,
  onGoSchedule,
}) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageFinalContent
      onGoHome={onGoHome}
      onGoLocation={onGoLocation}
      onGoSchedule={onGoSchedule}
    />
  </PageReadyGate>
);
