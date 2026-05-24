import React from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { images } from "../../../utils/assets";
import "./PageDistance.scss";

interface PageDistanceProps {
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
  /** Any valid CSS width value, e.g. "200px" or "min(220px, 30vw)". */
  imageWidth: string;
  /** How far the image visually crosses the central timeline (px). */
  offset: number;
}

const EVENTS: DistanceEvent[] = [
  {
    year: "2020",
    location: "西雅图",
    caption: "20年的第一场雪",
    image: images.seattleNoBg,
    framed: false,
    tilt: -2,
    side: "left",
    imageWidth: "min(200px, 50vw)",
    offset: 70,
  },
  {
    year: "2021",
    location: "成都",
    caption: "霍乱时期的爱情",
    image: images.together2021NoBg,
    framed: false,
    tilt: 2,
    side: "right",
    imageWidth: "min(200px, 50vw)",
    offset: 70,
  },
  {
    year: "2022",
    location: "旧金山",
    caption: "新娘本科毕业啦！",
    image: images.gaoUndergradNoBg,
    framed: false,
    tilt: -3,
    side: "left",
    imageWidth: "min(100px, 30vw)",
    offset: 30,
  },
];

export const PageDistance: React.FC<PageDistanceProps> = ({ isActive }) => {
  return (
    <View className="page page-distance">
      <View className="distance-header">
        <AnimatedView animation="fadeIn" isActive={isActive} duration={600}>
          <Text className="header-years">2020 — 2022</Text>
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={200}
          duration={600}
        >
          <Text className="header-subtitle">爱隔山海，山海可平</Text>
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

                <View
                  className="event-image-wrap"
                  style={{
                    width: evt.imageWidth,
                    // +10 compensates for the 10px padding on .event-content
                    // so the effective visual crossing matches `offset`.
                    ...(evt.side === "left"
                      ? { marginRight: `-${evt.offset + 10}px` }
                      : { marginLeft: `-${evt.offset + 10}px` }),
                  }}
                >
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
    </View>
  );
};
