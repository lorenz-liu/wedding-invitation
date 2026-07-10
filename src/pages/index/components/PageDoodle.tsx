import React, { useRef, useState } from "react";
import { View, Text, Button, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AnimatedView } from "../../../components/AnimatedView";
import {
  PageReadyGate,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import {
  DoodleBoard,
  type DoodleBoardHandle,
} from "../../../components/DoodleBoard";
import { GUEST_ID_KEY } from "../../../constants/config";
import { images } from "../../../utils/assets";
import { submitGuestDrawing } from "../../../utils/submitGuestDrawing";
import "./PageDoodle.scss";

const PAGE_IMAGES = [images.iconsNext];

interface PageDoodleProps {
  isActive: boolean;
  onScrollTopChange?: (scrollTop: number) => void;
  onNextPage?: () => void;
}

function PageDoodleContent({
  onScrollTopChange,
  onNextPage,
}: Pick<PageDoodleProps, "onScrollTopChange" | "onNextPage">) {
  const animationsReady = usePageAnimationsReady();
  const boardRef = useRef<DoodleBoardHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);

  const handleClear = () => {
    boardRef.current?.clear();
  };

  const handleSubmit = async () => {
    const guestId = Taro.getStorageSync(GUEST_ID_KEY);
    if (!guestId) {
      Taro.showToast({ title: "请先提交邀请函", icon: "none" });
      return;
    }

    setSubmitting(true);
    Taro.showLoading({ title: "提交中..." });

    try {
      const imageBase64 = await boardRef.current?.exportBase64();
      if (!imageBase64) {
        throw new Error("画布尚未准备好");
      }

      const result = await submitGuestDrawing({ guestId, imageBase64 });
      if (!result.success) {
        throw new Error(result.error || result.message || "提交失败");
      }

      setSubmittedCount((count) => count + 1);
      boardRef.current?.clear();
      Taro.showToast({
        title: result.message || "提交成功",
        icon: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "提交失败，请重试";
      Taro.showToast({ title: message, icon: "none", duration: 3000 });
    } finally {
      setSubmitting(false);
      Taro.hideLoading();
    }
  };

  return (
    <ScrollView
      className="page page-doodle"
      scrollY
      showScrollbar={false}
      onScroll={(e) => onScrollTopChange?.(e.detail.scrollTop)}
    >
      <View className="doodle-scroll-inner">
        <View className="doodle-panel">
          <AnimatedView animation="fadeInUp" isActive={animationsReady} duration={700}>
            <View className="doodle-header">
              <Text className="doodle-title">涂鸦</Text>
              <Text className="doodle-subtitle">
                您可以在此画画，随意发挥{"\n"}说不定在婚礼现场会放到大屏幕上喔
              </Text>
            </View>
          </AnimatedView>

          <AnimatedView
            animation="fadeIn"
            isActive={animationsReady}
            delay={200}
            duration={700}
          >
            <DoodleBoard ref={boardRef} />
          </AnimatedView>

          <AnimatedView
            animation="fadeInUp"
            isActive={animationsReady}
            delay={350}
            duration={600}
          >
            <View className="doodle-actions">
              <Button className="doodle-btn secondary" onClick={handleClear}>
                清空
              </Button>
              <Button
                className="doodle-btn primary"
                loading={submitting}
                disabled={submitting}
                onClick={handleSubmit}
              >
                上传涂鸦
              </Button>
            </View>
            <Button className="doodle-next-btn" onClick={onNextPage}>
              <View className="doodle-next-btn-content">
                <Text className="doodle-next-btn-text">下一页</Text>
                <Image
                  className="doodle-next-btn-icon"
                  src={images.iconsNext}
                  mode="widthFix"
                />
              </View>
            </Button>
            {submittedCount > 0 && (
              <Text className="doodle-success-note">
                已提交 {submittedCount} 幅作品，欢迎继续创作
              </Text>
            )}
          </AnimatedView>
        </View>
      </View>
    </ScrollView>
  );
}

export const PageDoodle: React.FC<PageDoodleProps> = ({
  isActive,
  onScrollTopChange,
  onNextPage,
}) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageDoodleContent
      onScrollTopChange={onScrollTopChange}
      onNextPage={onNextPage}
    />
  </PageReadyGate>
);
