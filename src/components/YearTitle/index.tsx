import React from "react";
import { Text } from "@tarojs/components";
import "./index.scss";

export interface YearTitleProps {
  children: React.ReactNode;
  className?: string;
}

/** Shared year heading — Childhood font, accent color, no animation. */
export const YearTitle: React.FC<YearTitleProps> = ({
  children,
  className = "",
}) => {
  return (
    <Text className={["year-title", className].filter(Boolean).join(" ")}>
      {children}
    </Text>
  );
};
