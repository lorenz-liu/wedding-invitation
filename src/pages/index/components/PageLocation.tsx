import React from "react";
import { View, Text, Map, Button } from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import Taro from "@tarojs/taro";
import "./PageLocation.scss";

interface PageLocationProps {
  isActive: boolean;
}

const VENUE = {
  latitude: 30.4577,
  longitude: 104.0654,
  name: "慕上OnTheMoon·北欧餐厅(成都麓湖店)",
  address: "四川省成都市双流区华阳街道麓湖中路西段888号13栋附101-104号",
};

export const PageLocation: React.FC<PageLocationProps> = ({ isActive }) => {
  const handleOpenMap = () => {
    Taro.openLocation({
      latitude: VENUE.latitude,
      longitude: VENUE.longitude,
      name: VENUE.name,
      address: VENUE.address,
      scale: 18,
    });
  };

  return (
    <View className="page page-location">
      <Map
        className="map-fullscreen"
        longitude={VENUE.longitude}
        latitude={VENUE.latitude}
        scale={15}
        markers={[
          {
            id: 1,
            longitude: VENUE.longitude,
            latitude: VENUE.latitude,
            title: VENUE.name,
          },
        ]}
        enableScroll={false}
        enableZoom={false}
        enableRotate={false}
      />

      <View className="location-overlay">
        <View className="overlay-gradient overlay-gradient-top" />
        <View className="overlay-gradient overlay-gradient-bottom" />

        <View className="overlay-top">
          <AnimatedView animation="fadeInUp" isActive={isActive} duration={600}>
            <Text className="page-title">婚礼地点</Text>
          </AnimatedView>

          <AnimatedView
            animation="fadeInScale"
            isActive={isActive}
            delay={200}
            duration={600}
          >
            <View className="location-header">
              <Text className="location-city">成都</Text>
              <Text className="location-dot">·</Text>
              <Text className="location-venue">慕上</Text>
            </View>
          </AnimatedView>
        </View>

        <View className="overlay-bottom">
          <AnimatedView
            animation="fadeIn"
            isActive={isActive}
            delay={550}
            duration={600}
          >
            <Button className="open-map-btn" onClick={handleOpenMap}>
              打开导航
            </Button>
          </AnimatedView>
        </View>
      </View>
    </View>
  );
};
