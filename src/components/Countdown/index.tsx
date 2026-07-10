import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";

/** Wedding ceremony — Chengdu (UTC+8), 2026-07-25 17:25 */
const TARGET_MS = new Date("2026-07-25T17:25:00+08:00").getTime();

const UNITS = [
  { key: "days", label: "天" },
  { key: "hours", label: "时" },
  { key: "minutes", label: "分" },
  { key: "seconds", label: "秒" },
] as const;

type TimeRemaining = Record<(typeof UNITS)[number]["key"], number>;

function getTimeRemaining(): TimeRemaining {
  const diff = Math.max(0, TARGET_MS - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function formatValue(key: (typeof UNITS)[number]["key"], value: number): string {
  if (key === "days") return String(value);
  return String(value).padStart(2, "0");
}

export interface CountdownProps {
  /** Pause ticking when the page is not visible. */
  isActive?: boolean;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  isActive = true,
  className = "",
}) => {
  const [remaining, setRemaining] = useState<TimeRemaining>(getTimeRemaining);

  useEffect(() => {
    if (!isActive) return;

    setRemaining(getTimeRemaining());
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <View className={["countdown", className].filter(Boolean).join(" ")}>
      {UNITS.map((unit, index) => (
        <React.Fragment key={unit.key}>
          {index > 0 && <View className="countdown__divider" />}
          <View className="countdown__segment">
            <Text className="countdown__value">
              {formatValue(unit.key, remaining[unit.key])}
            </Text>
            <Text className="countdown__label">{unit.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};
