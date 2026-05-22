import { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

function App({ children }) {
  const audioRef = useRef<any>(null)

  useEffect(() => {
    // Initialize audio context
    const initAudio = () => {
      // For WeChat mini program, use InnerAudioContext for local files
      // BackgroundAudioManager requires network URLs
      if (process.env.TARO_ENV === 'weapp') {
        const innerAudioContext = Taro.createInnerAudioContext()
        innerAudioContext.src = require('./assets/music/our-love.mp3')
        innerAudioContext.loop = true
        innerAudioContext.volume = 0.7
        
        // Error handling
        innerAudioContext.onError((err) => {
          console.error('Audio play error:', err)
        })
        
        // When can play, start playing
        innerAudioContext.onCanplay(() => {
          console.log('Audio can play')
          innerAudioContext.play()
        })
        
        audioRef.current = innerAudioContext
      } else {
        // For H5/web, use BackgroundAudioManager
        const bgm = Taro.getBackgroundAudioManager()
        if (bgm) {
          bgm.title = 'Our Love'
          bgm.epname = 'Wedding'
          bgm.singer = 'Wedding'
          bgm.coverImgUrl = ''
          bgm.src = require('./assets/music/our-love.mp3')
          bgm.loop = true
          bgm.play()
          audioRef.current = bgm
        }
      }
    }

    // Delay slightly to ensure page is ready
    const timer = setTimeout(initAudio, 500)

    return () => {
      clearTimeout(timer)
      // Cleanup audio
      if (audioRef.current) {
        if (process.env.TARO_ENV === 'weapp') {
          audioRef.current.destroy?.()
        }
      }
    }
  }, [])

  return children
}

export default App
