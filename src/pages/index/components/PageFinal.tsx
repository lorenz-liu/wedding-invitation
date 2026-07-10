import React from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import {
  PageReadyGate,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import "./PageFinal.scss";

interface PageFinalProps {
  isActive: boolean;
  onGoHome: () => void;
  onGoLocation: () => void;
  onGoSchedule: () => void;
}

const PAGE_IMAGES: string[] = [
  images.gown,
  images.signatureNiuGold,
  images.signatureGaoGold,
];

function PageFinalContent({
  onGoHome,
  onGoLocation,
  onGoSchedule,
}: Pick<PageFinalProps, "onGoHome" | "onGoLocation" | "onGoSchedule">) {
  const animationsReady = usePageAnimationsReady();
  const signatureRevealClass = animationsReady
    ? "final-signature-wrap final-signature-wrap--reveal"
    : "final-signature-wrap";

  return (
    <View className="page page-final">
      <View
        className="final-bg"
        style={{ backgroundImage: `url(${images.gown})` }}
      />
      <View className="final-signature final-signature--niu">
        <View className="final-signature-rotate">
          <View className={signatureRevealClass}>
            <Image
              className="final-signature-img final-signature-img--niu"
              src={images.signatureNiuGold}
              mode="widthFix"
            />
          </View>
        </View>
      </View>
      <View className="final-signature final-signature--gao">
        <View className="final-signature-rotate">
          <View
            className={signatureRevealClass}
            style={{ animationDelay: "280ms" }}
          >
            <Image
              className="final-signature-img final-signature-img--gao"
              src={images.signatureGaoGold}
              mode="widthFix"
            />
          </View>
        </View>
      </View>
      <View className="final-container">
        <View className="final-content">
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
