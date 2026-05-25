import { useState, useEffect, useCallback, useRef } from "react";
import Taro from "@tarojs/taro";
import { resolveAssetPath } from "../utils/assetResolver";

export function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(async () => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (process.env.TARO_ENV === "weapp") {
      const audioSrc = resolveAssetPath("music/our-love.mp3");

      const innerAudioContext = Taro.createInnerAudioContext();
      innerAudioContext.src = audioSrc;
      innerAudioContext.loop = true;
      innerAudioContext.volume = 0.7;

      innerAudioContext.onPlay(() => setIsPlaying(true));
      innerAudioContext.onPause(() => setIsPlaying(false));
      innerAudioContext.onStop(() => setIsPlaying(false));
      innerAudioContext.onError((err) => {
        console.error("Audio error:", err);
        setIsPlaying(false);
      });
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play();
      });

      audioRef.current = innerAudioContext;
      return;
    }

    if (process.env.TARO_ENV === "h5") {
      require("./useAudio.h5").initH5BackgroundAudio({
        setIsPlaying,
        audioRef,
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause?.();
    } else {
      audioRef.current.play?.();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current && process.env.TARO_ENV === "weapp") {
        audioRef.current.destroy?.();
      }
    };
  }, []);

  return { isPlaying, togglePlay, initAudio };
}
