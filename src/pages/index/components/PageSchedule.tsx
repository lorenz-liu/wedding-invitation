import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import {
  PageReadyGate,
  uniqueImageUrls,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import "./PageSchedule.scss";

interface PageScheduleProps {
  isActive: boolean;
}

interface ScheduleItem {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageOffset: "left" | "right";
}

const scheduleData: ScheduleItem[] = [
  {
    time: "17:25",
    title: "典礼开始",
    subtitle: "花门轻启，盟誓此夕",
    description:
      "婚礼仪式将于麓月礼堂内开始。我们没有着装要求，请您以舒适度为主安排服饰。",
    image: images.agendaCeremony,
    imageOffset: "right",
  },
  {
    time: "18:08",
    title: "喜宴开始",
    subtitle: "佳肴盈席，共叙情谊",
    description:
      "请您在该电子请柬最后一页告知我们您的特殊饮食需求，比如食物过敏等。",
    image: images.agendaDinner,
    imageOffset: "left",
  },
  {
    time: "21:00",
    title: "欢聚时光",
    subtitle: "欢聚尽兴，杯盏余音",
    description:
      "在晚宴结束后，我们准备了餐后甜点和酒水供您消遣，让这一天在轻松愉悦中画上完美的句号。",
    image: images.agendaParty,
    imageOffset: "right",
  },
];

const PAGE_IMAGES = uniqueImageUrls([
  ...scheduleData.map((item) => item.image),
  images.onTheMoon,
]);

function PageScheduleContent() {
  const animationsReady = usePageAnimationsReady();
  const [moonIn, setMoonIn] = useState(false);

  useEffect(() => {
    if (animationsReady) {
      const timer = setTimeout(() => setMoonIn(true), 50);
      return () => clearTimeout(timer);
    }
    setMoonIn(false);
  }, [animationsReady]);

  return (
    <View className="page page-schedule">
      <View className="content-wrapper">
        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          duration={600}
          className="schedule-title-wrap"
        >
          <Text className="page-title">当日安排</Text>
        </AnimatedView>

        <View className="schedule-list">
          {scheduleData.map((item, index) => (
            <AnimatedView
              key={item.time}
              animation={index % 2 === 0 ? "fadeInLeft" : "fadeInRight"}
              isActive={animationsReady}
              delay={100 + index * 100}
              duration={600}
              className="schedule-item"
            >
              <View className="time-column">
                <View
                  className={`time-badge ${index % 2 === 0 ? "left" : "right"}`}
                >
                  <Text className="time-text">{item.time}</Text>
                </View>
                <View
                  className={`agenda-img-wrap offset-${item.imageOffset}`}
                >
                  <Image
                    className="agenda-img"
                    src={item.image}
                    mode="widthFix"
                  />
                </View>
              </View>
              <View className="schedule-card">
                <Text className="event-title">{item.title}</Text>
                <Text className="event-subtitle">{item.subtitle}</Text>
                <Text className="event-desc">{item.description}</Text>
              </View>
            </AnimatedView>
          ))}
        </View>
      </View>

      <View className={`moon-anchor ${moonIn ? "animate" : ""}`}>
        <Image className="moon-img" src={images.onTheMoon} mode="widthFix" />
      </View>
    </View>
  );
}

export const PageSchedule: React.FC<PageScheduleProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageScheduleContent />
  </PageReadyGate>
);
