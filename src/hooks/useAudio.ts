import { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'

export function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const initAudio = useCallback(() => {
    const bgm = Taro.getBackgroundAudioManager()
    if (bgm && !hasInteracted) {
      bgm.title = 'Our Love'
      bgm.epname = 'Wedding Invitation'
      bgm.singer = 'Wedding'
      bgm.src = require('../assets/music/our-love.mp3')
      bgm.loop = true
      bgm.play()
      setIsPlaying(true)
      setHasInteracted(true)
    }
  }, [hasInteracted])

  const togglePlay = useCallback(() => {
    const bgm = Taro.getBackgroundAudioManager()
    if (bgm) {
      if (isPlaying) {
        bgm.pause()
        setIsPlaying(false)
      } else {
        bgm.play()
        setIsPlaying(true)
      }
    }
  }, [isPlaying])

  useEffect(() => {
    // Try to autoplay on first interaction
    const handleTouch = () => {
      if (!hasInteracted) {
        initAudio()
      }
    }

    if (process.env.TARO_ENV === 'weapp') {
      // WeChat mini program uses different API
      Taro.onTouchStart?.(handleTouch)
    }

    return () => {
      if (process.env.TARO_ENV === 'weapp') {
        Taro.offTouchStart?.(handleTouch)
      }
    }
  }, [hasInteracted, initAudio])

  return { isPlaying, togglePlay, initAudio }
}
