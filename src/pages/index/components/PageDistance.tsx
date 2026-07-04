import React from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import { PageReadyGate, uniqueImageUrls, usePageAnimationsReady } from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import { getTimelineLineStyle } from "./distanceTimeline";
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
    caption: "21年的短暂团聚",
    image: images.together2021NoBg,
    framed: false,
    tilt: 2,
    side: "right",
    imageWidth: "min(200px, 50vw)",
    offset: 70,
  },
  {
    year: "2022",
    location: "伯克利",
    caption: "新娘本科毕业啦！",
    image: images.gaoUndergradNoBg,
    framed: false,
    tilt: -3,
    side: "left",
    imageWidth: "min(100px, 30vw)",
    offset: 30,
  },
];

const PAGE_IMAGES = uniqueImageUrls(EVENTS.map((event) => event.image));

function PageDistanceContent() {
  const animationsReady = usePageAnimationsReady();

  return (
      <View className="page page-distance">
      <View className="distance-header">
        <YearTitle>2019 — 2022</YearTitle>

        <AnimatedView
          animation="fadeInUp"
          isActive={animationsReady}
          delay={200}
          duration={600}
        >
          <Text className="header-subtitle">爱隔山海，山海可平</Text>
        </AnimatedView>
      </View>

      <View
        className={`timeline-board ${animationsReady ? "timeline-ready" : ""}`}
        style={getTimelineLineStyle(EVENTS.length)}
      >
        <View className="timeline-line" />

        {EVENTS.map((evt, idx) => (
          <AnimatedView
            key={`${evt.year}-${evt.location}-${idx}`}
            animation={evt.side === "left" ? "fadeInLeft" : "fadeInRight"}
            isActive={animationsReady}
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
                  <Text className="tag-location">{evt.location}</Text>
                </View>

                <View
                  className="event-image-wrap"
                  style={{
                    width: evt.imageWidth,
                    // +10 compensates for the 10px padding on .event-content
                    // so the effective visual crossing matches `offset`.
                    ...(evt.side === "left"
                      ? { marginRight: `-${evt.offset}px` }
                      : { marginLeft: `-${evt.offset}px` }),
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
}

export const PageDistance: React.FC<PageDistanceProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageDistanceContent />
  </PageReadyGate>
);
