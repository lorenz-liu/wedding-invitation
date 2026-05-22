import React from 'react'
import { View } from '@tarojs/components'
import './index.scss'

interface AudioControlProps {
  isPlaying: boolean
  onToggle: () => void
}

export const AudioControl: React.FC<AudioControlProps> = ({ isPlaying, onToggle }) => {
  return (
    <View className='audio-control' onClick={onToggle}>
      <View className={`audio-icon ${isPlaying ? 'playing' : 'paused'}`}>
        <View className='sound-wave'>
          <View className='wave-bar'></View>
          <View className='wave-bar'></View>
          <View className='wave-bar'></View>
        </View>
      </View>
      <View className='audio-label'>{isPlaying ? '音乐开启' : '音乐暂停'}</View>
    </View>
  )
}
