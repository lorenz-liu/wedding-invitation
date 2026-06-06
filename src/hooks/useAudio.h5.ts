import Taro from "@tarojs/taro";
import type { MutableRefObject } from "react";
import { getMusicUrl } from "../utils/assets";

interface InitH5AudioOptions {
  setIsPlaying: (playing: boolean) => void;
  audioRef: MutableRefObject<any>;
}

export function initH5BackgroundAudio({
  setIsPlaying,
  audioRef,
}: InitH5AudioOptions): void {
  const bgm = Taro.getBackgroundAudioManager();
  if (!bgm) return;

  bgm.title = "Our Love";
  bgm.epname = "Wedding Invitation";
  bgm.singer = "Wedding";
  bgm.src = getMusicUrl();
  bgm.loop = true;

  bgm.onPlay(() => setIsPlaying(true));
  bgm.onPause(() => setIsPlaying(false));
  bgm.onStop(() => setIsPlaying(false));

  bgm.play();
  audioRef.current = bgm;
  setIsPlaying(true);
}
