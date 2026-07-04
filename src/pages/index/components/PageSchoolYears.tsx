import React from "react";
import { View, Text, Image } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import { YearTitle } from "../../../components/YearTitle";
import {
  PageReadyGate,
  uniqueImageUrls,
  usePageAnimationsReady,
} from "../../../components/PageReadyGate";
import { images } from "../../../utils/assets";
import { getTimelineLineStyle } from "./distanceTimeline";
import "./PageDistance.scss";
import "./PageSchoolYears.scss";

interface PageSchoolYearsProps {
  isActive: boolean;
}

interface SchoolEvent {
  year: string;
  label: string;
  image: string;
  tilt: number;
  side: "left" | "right";
  imageWidth: string;
  offset: number;
}

const EVENTS: SchoolEvent[] = [
  {
    year: "2008",
    label: "小学",
    image: images.elementarySchool,
    tilt: 0,
    side: "left",
    imageWidth: "min(300px, 65vw)",
    offset: 30,
  },
  {
    year: "2016",
    label: "初中",
    image: images.middleSchool,
    tilt: 0,
    side: "right",
    imageWidth: "min(180px, 40vw)",
    offset: 30,
  },
  {
    year: "2019",
    label: "高中",
    image: images.highSchool,
    tilt: 0,
    side: "left",
    imageWidth: "min(200px, 40vw)",
    offset: 30,
  },
];

const PAGE_IMAGES = uniqueImageUrls(EVENTS.map((event) => event.image));

function PageSchoolYearsContent() {
  const animationsReady = usePageAnimationsReady();

  return (
    <View className="page page-distance page-school-years">
      <View className="distance-header">
        <YearTitle>2008 — 2019</YearTitle>
      </View>

      <View
        className={`timeline-board ${animationsReady ? "timeline-ready" : ""}`}
        style={getTimelineLineStyle(EVENTS.length)}
      >
        <View className="timeline-line" />

        {EVENTS.map((evt, idx) => (
          <AnimatedView
            key={`${evt.year}-${evt.label}-${idx}`}
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
                  <Text className="tag-sep">·</Text>
                  <Text className="tag-location">{evt.label}</Text>
                </View>

                <View
                  className="event-image-wrap"
                  style={{
                    width: evt.imageWidth,
                    ...(evt.side === "left"
                      ? { marginRight: `-${evt.offset}px` }
                      : { marginLeft: `-${evt.offset}px` }),
                  }}
                >
                  <Image
                    className="event-img no-bg"
                    src={evt.image}
                    mode="widthFix"
                  />
                </View>
              </View>
            </View>
          </AnimatedView>
        ))}
      </View>
    </View>
  );
}

export const PageSchoolYears: React.FC<PageSchoolYearsProps> = ({ isActive }) => (
  <PageReadyGate imageUrls={PAGE_IMAGES} isActive={isActive}>
    <PageSchoolYearsContent />
  </PageReadyGate>
);
