import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

function App({ children }) {
  useEffect(() => {
    // Background music auto-play setup
    const setupAudio = () => {
      const bgm = Taro.getBackgroundAudioManager()
      if (bgm) {
        bgm.title = 'Our Love'
        bgm.epname = 'Wedding'
        bgm.singer = 'Wedding'
        bgm.coverImgUrl = ''
        
        try {
          // Use the correct path for the audio file
          if (process.env.TARO_ENV === 'weapp') {
            // For WeChat mini program
            bgm.src = 'cloud://placeholder/our-love.mp3' // Replace with actual cloud path
          } else {
            // For H5/web
            bgm.src = require('./assets/music/our-love.mp3')
          }
          bgm.loop = true
          
          // WeChat requires user interaction before playing audio
          const playAudio = () => {
            bgm.play()
            document.removeEventListener('touchstart', playAudio)
            document.removeEventListener('click', playAudio)
          }
          
          document.addEventListener('touchstart', playAudio, { once: true })
          document.addEventListener('click', playAudio, { once: true })
        } catch (err) {
          console.log('Audio setup failed:', err)
        }
      }
    }

    setupAudio()
  }, [])

  return children
}

export default App
