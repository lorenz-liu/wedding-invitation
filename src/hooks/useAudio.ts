import { useState, useEffect, useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'

export function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<any>(null)

  const initAudio = useCallback(() => {
    if (audioRef.current) return

    if (process.env.TARO_ENV === 'weapp') {
      // Use InnerAudioContext for local files in WeChat mini program
      const innerAudioContext = Taro.createInnerAudioContext()
      innerAudioContext.src = require('../assets/music/our-love.mp3')
      innerAudioContext.loop = true
      innerAudioContext.volume = 0.7
      
      innerAudioContext.onError((err) => {
        console.error('Audio error:', err)
      })
      
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play()
        setIsPlaying(true)
      })
      
      audioRef.current = innerAudioContext
    } else {
      // H5: use BackgroundAudioManager
      const bgm = Taro.getBackgroundAudioManager()
      if (bgm) {
        bgm.title = 'Our Love'
        bgm.epname = 'Wedding Invitation'
        bgm.singer = 'Wedding'
        bgm.src = require('../assets/music/our-love.mp3')
        bgm.loop = true
        bgm.play()
        audioRef.current = bgm
        setIsPlaying(true)
      }
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (process.env.TARO_ENV === 'weapp') {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    } else {
      if (isPlaying) {
        audioRef.current.pause?.()
      } else {
        audioRef.current.play?.()
      }
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  useEffect(() => {
    return () => {
      if (audioRef.current && process.env.TARO_ENV === 'weapp') {
        audioRef.current.destroy?.()
      }
    }
  }, [])

  return { isPlaying, togglePlay, initAudio }
}
