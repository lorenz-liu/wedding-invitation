import { useState, useEffect, useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'

export function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  const initAudio = useCallback(() => {
    // Prevent multiple initialization
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    if (process.env.TARO_ENV === 'weapp') {
      // Use InnerAudioContext for local files in WeChat mini program
      const innerAudioContext = Taro.createInnerAudioContext()
      innerAudioContext.src = require('../assets/music/our-love.mp3')
      innerAudioContext.loop = true
      innerAudioContext.volume = 0.7
      
      // Track actual playing state
      innerAudioContext.onPlay(() => {
        console.log('Audio: onPlay event')
        setIsPlaying(true)
      })
      
      innerAudioContext.onPause(() => {
        console.log('Audio: onPause event')
        setIsPlaying(false)
      })
      
      innerAudioContext.onStop(() => {
        console.log('Audio: onStop event')
        setIsPlaying(false)
      })
      
      innerAudioContext.onError((err) => {
        console.error('Audio error:', err)
        setIsPlaying(false)
      })
      
      innerAudioContext.onCanplay(() => {
        console.log('Audio: can play')
        innerAudioContext.play()
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
        
        // Listen for actual state changes
        bgm.onPlay(() => setIsPlaying(true))
        bgm.onPause(() => setIsPlaying(false))
        bgm.onStop(() => setIsPlaying(false))
        
        bgm.play()
        audioRef.current = bgm
        setIsPlaying(true)
      }
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      console.log('No audio instance available')
      return
    }

    const audio = audioRef.current
    
    // Use isPlaying state to determine action
    if (isPlaying) {
      console.log('Pausing audio...')
      audio.pause?.()
    } else {
      console.log('Playing audio...')
      audio.play?.()
    }
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
