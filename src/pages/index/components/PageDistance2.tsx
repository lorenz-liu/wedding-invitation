import React from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageDistance.scss";

interface PageDistance2Props {
  isActive: boolean;
}

interface DistanceEvent {
  year: string;
  location: string;
  caption: string;
  image: string;
  framed: boolean;
  tilt: number;
  side: "left" | "right";
}

const EVENTS: DistanceEvent[] = [
  {
    year: "2022",
    location: "北京",
    caption: "陪读期末考试",
    image: images.beijing,
    framed: true,
    tilt: 3,
    side: "right",
  },
  {
    year: "2023",
    location: "北京",
    caption: "新郎本科毕业啦！",
    image: images.niuUndergradNoBg,
    framed: false,
    tilt: -2,
    side: "left",
  },
  {
    year: "2023",
    location: "上海",
    caption: "等待研究生录取结果",
    image: images.shanghai,
    framed: true,
    tilt: 4,
    side: "right",
  },
];

export const PageDistance2: React.FC<PageDistance2Props> = ({ isActive }) => {
  return (
    <View className="page page-distance">
      <View className="distance-header">
        <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
          <Text className="header-years">2022 — 2023</Text>
        </AnimatedView>

        <AnimatedView animation="fadeInUp" isActive={isActive} delay={200} duration={600}>
          <Text className="header-subtitle">归来重逢，并肩同行</Text>
        </AnimatedView>

        <AnimatedView animation="fadeIn" isActive={isActive} delay={400} duration={600}>
          <Text className="header-intro">
            短暂的相聚、漫长的等待，每一次靠近都让心更笃定。
          </Text>
        </AnimatedView>
      </View>

      <View className="timeline-board">
        <View className="timeline-line" />

        {EVENTS.map((evt, idx) => (
          <AnimatedView
            key={`${evt.year}-${evt.location}-${idx}`}
            animation={evt.side === "left" ? "fadeInLeft" : "fadeInRight"}
            isActive={isActive}
            delay={600 + idx * 220}
            duration={800}
            className="event-row-wrapper"
          >
            <View className={`event-row side-${evt.side}`}>
              <View className="event-marker">
                <View className="event-dot" />
              </View>

              <View
                className="event-content"
                style={{ transform: `rotate(${evt.tilt}deg)` }}
              >
                <View className="event-tag">
                  <Text className="tag-year">{evt.year}</Text>
                  <Text className="tag-sep">·</Text>
                  <Text className="tag-location">{evt.location}</Text>
                </View>

                <View className="event-image-wrap">
                  {evt.framed ? (
                    <View className="polaroid-wrap">
                      <View className="polaroid-photo">
                        <Image
                          className="event-img"
                          src={evt.image}
                          mode="aspectFill"
                        />
                      </View>
                    </View>
                  ) : (
                    <Image
                      className="event-img no-bg"
                      src={evt.image}
                      mode="widthFix"
                    />
                  )}
                </View>

                <Text className="event-caption">{evt.caption}</Text>
              </View>
            </View>
          </AnimatedView>
        ))}
      </View>

      <AnimatedView
        animation="fadeIn"
        isActive={isActive}
        delay={600 + EVENTS.length * 220 + 300}
        duration={600}
      >
        <View className="distance-footer">
          <Text className="footer-text">每一次重逢，都让我们更确信彼此</Text>
        </View>
      </AnimatedView>
    </View>
  );
};
