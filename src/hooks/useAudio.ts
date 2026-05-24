import { useState, useEffect, useCallback, useRef } from "react";
import Taro from "@tarojs/taro";
import { resolveAssetPath } from "../utils/assetResolver";

export function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (process.env.TARO_ENV === "weapp") {
      const innerAudioContext = Taro.createInnerAudioContext();
      innerAudioContext.src = resolveAssetPath("music/our-love.mp3");
      innerAudioContext.loop = true;
      innerAudioContext.volume = 0.7;

      innerAudioContext.onPlay(() => {
        console.log("Audio: onPlay event");
        setIsPlaying(true);
      });

      innerAudioContext.onPause(() => {
        console.log("Audio: onPause event");
        setIsPlaying(false);
      });

      innerAudioContext.onStop(() => {
        console.log("Audio: onStop event");
        setIsPlaying(false);
      });

      innerAudioContext.onError((err) => {
        console.error("Audio error:", err);
        setIsPlaying(false);
      });

      innerAudioContext.onCanplay(() => {
        console.log("Audio: can play");
        innerAudioContext.play();
      });

      audioRef.current = innerAudioContext;
    } else {
      const bgm = Taro.getBackgroundAudioManager();
      if (bgm) {
        bgm.title = "Our Love";
        bgm.epname = "Wedding Invitation";
        bgm.singer = "Wedding";
        bgm.src = require("@assets/music/our-love.mp3");
        bgm.loop = true;

        bgm.onPlay(() => setIsPlaying(true));
        bgm.onPause(() => setIsPlaying(false));
        bgm.onStop(() => setIsPlaying(false));

        bgm.play();
        audioRef.current = bgm;
        setIsPlaying(true);
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      console.log("No audio instance available");
      return;
    }

    const audio = audioRef.current;

    if (isPlaying) {
      console.log("Pausing audio...");
      audio.pause?.();
    } else {
      console.log("Playing audio...");
      audio.play?.();
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
