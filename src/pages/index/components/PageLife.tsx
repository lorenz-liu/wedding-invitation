import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import {
  PageReadyGate,
  uniqueImageUrls,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import "./PageLife.scss";

interface PageLifeProps {
  isActive: boolean;
}

const PAWS = [
  { src: images.paw1, offset: 0 },
  { src: images.paw2, offset: 5 },
  { src: images.paw1, offset: 0 },
  { src: images.paw2, offset: 5 },
  { src: images.paw1, offset: 0 },
  { src: images.paw2, offset: 5 },
] as const;

const PAGE_IMAGES = uniqueImageUrls([
  images.paw1,
  images.paw2,
  images.bawbawFullBody1,
  images.holdingBawbawNoBg,
  images.bawbawFullBody3,
]);

function PageLifeContent() {
  const animationsReady = usePageAnimationsReady();
  const [leftIn, setLeftIn] = useState(false);
  const [rightIn, setRightIn] = useState(false);
  const [heroIn, setHeroIn] = useState(false);
  const [pawsIn, setPawsIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const t0 = setTimeout(() => setPawsIn(true), 50);
      const t1 = setTimeout(() => setHeroIn(true), 50);
      const t2 = setTimeout(() => setLeftIn(true), 50);
      const t3 = setTimeout(() => setRightIn(true), 250);
      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    setPawsIn(false);
    setHeroIn(false);
    setLeftIn(false);
    setRightIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-life">
      <View className="life-content-container">
        <View className="bawbaw-hero-row">
          <View className={`paw-track ${pawsIn ? "animate" : ""}`}>
            {PAWS.map((paw, index) => (
              <View
                key={index}
                className="paw-item"
                style={{ transform: `translateY(-${paw.offset}px)` }}
              >
                <Image className="paw-img" src={paw.src} mode="heightFix" />
              </View>
            ))}
          </View>

          <View className={`bawbaw-hero ${heroIn ? "animate" : ""}`}>
            <Image
              className="bawbaw-hero-img"
              src={images.bawbawFullBody1}
              mode="widthFix"
            />
          </View>
        </View>

        <View className="life-text-block">
          <YearTitle>2023 - 2026</YearTitle>

          <AnimatedView
            animation="fadeInUp"
            isActive={animationsReady}
            delay={200}
            duration={800}
          >
            <Text className="life-text">
              远涉至这片北国的土地
              {"\n"}
              我们相濡以沫
            </Text>
          </AnimatedView>
          <AnimatedView
            animation="fadeInUp"
            isActive={animationsReady}
            delay={700}
            duration={800}
          >
            <Text className="life-text">
              家里还有一只名叫宝宝的小猫
              {"\n"}
              让我们的生活更加圆满
            </Text>
          </AnimatedView>
        </View>
      </View>

      <View
        className={`bawbaw-anchor bawbaw-anchor-left ${leftIn ? "animate" : ""}`}
      >
        <Image
          className="bawbaw-anchor-img"
          src={images.holdingBawbawNoBg}
          mode="widthFix"
        />
      </View>

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
}

export const PageLife: React.FC<PageLifeProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageLifeContent />
  </PageReadyGate>
);
