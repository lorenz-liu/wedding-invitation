import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

interface AnimatedViewProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "fadeInUp" | "fadeInScale" | "fadeInLeft" | "fadeInRight";
  delay?: number;
  duration?: number;
  isActive?: boolean;
  className?: string;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  isActive = true,
  className = "",
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [isActive, delay]);

  return (
    <View
      className={`animated-view ${animation} ${shouldAnimate ? "animate" : ""} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        opacity: shouldAnimate ? 1 : 0,
      }}
    >
      {children}
    </View>
  );
};
