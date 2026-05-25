import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageBirth.scss";

interface PageBirthProps {
  isActive: boolean;
}

export const PageBirth: React.FC<PageBirthProps> = ({ isActive }) => {
  const [groomIn, setGroomIn] = useState(false);
  const [brideIn, setBrideIn] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t1 = setTimeout(() => setGroomIn(true), 350);
      const t2 = setTimeout(() => setBrideIn(true), 750);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setGroomIn(false);
    setBrideIn(false);
  }, [isActive]);

  return (
    <View className="page page-birth">
      <View className="content-wrapper">
        <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
          <Text className="year-badge">2001年</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={200}
          duration={600}
        >
          <Text className="intro-text">
            同一个医生，接出了两个注定相遇的灵魂
          </Text>
        </AnimatedView>

        <View className="birth-portraits">
          <View
            className={`portrait portrait-groom ${groomIn ? "animate" : ""}`}
          >
            <View className="portrait-frame">
              <Image
                className="portrait-img"
                src={images.niuKidNoBg}
                mode="widthFix"
              />
            </View>
            <View className="portrait-info">
              <Text className="portrait-role">未来的新郎</Text>
              <View className="portrait-divider" />
              <Text className="portrait-date">1月6日</Text>
            </View>
          </View>

          <View
            className={`portrait portrait-bride ${brideIn ? "animate" : ""}`}
          >
            <View className="portrait-frame">
              <Image
                className="portrait-img"
                src={images.gaoKidNoBg}
                mode="widthFix"
              />
            </View>
            <View className="portrait-info">
              <Text className="portrait-role">未来的新娘</Text>
              <View className="portrait-divider" />
              <Text className="portrait-date">6月19日</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
