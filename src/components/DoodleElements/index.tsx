import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

export const DoodleHeart: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-heart ${className || ""}`} />
);

export const DoodleRing: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-ring ${className || ""}`} />
);

export const DoodleFlower: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-flower ${className || ""}`}>
    <View className="doodle-flower__petal doodle-flower__petal--top" />
    <View className="doodle-flower__petal doodle-flower__petal--right" />
    <View className="doodle-flower__petal doodle-flower__petal--bottom" />
    <View className="doodle-flower__petal doodle-flower__petal--left" />
    <View className="doodle-flower__center" />
    <View className="doodle-flower__stem" />
  </View>
);

export const DoodleLine: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-line ${className || ""}`} />
);

export const DoodleCorner: React.FC<{
  className?: string;
  position?: "tl" | "tr" | "bl" | "br";
}> = ({ className, position = "tl" }) => (
  <View className={`doodle-corner doodle-corner--${position} ${className || ""}`} />
);
