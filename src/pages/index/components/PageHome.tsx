import React from 'react'
import { View, Text } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
import { DoodleHeart, DoodleLine, DoodleCorner } from '../../../components/DoodleElements'
import './PageHome.scss'

interface PageHomeProps {
  isActive: boolean
}

export const PageHome: React.FC<PageHomeProps> = ({ isActive }) => {
  return (
    <View className='page page-home'>
      <DoodleCorner position='tl' className='corner-tl' />
      <DoodleCorner position='tr' className='corner-tr' />
      <DoodleCorner position='bl' className='corner-bl' />
      <DoodleCorner position='br' className='corner-br' />
      
      <View className='content-wrapper'>
        <AnimatedView animation='fadeInUp' delay={0} duration={800} isActive={isActive}>
          <Text className='names-text'>刘兆薰 & 高文珩</Text>
        </AnimatedView>

        <AnimatedView animation='fadeInScale' delay={300} duration={600} isActive={isActive}>
          <DoodleHeart className='main-heart' />
        </AnimatedView>

        <AnimatedView animation='fadeInUp' delay={500} duration={600} isActive={isActive}>
          <View className='date-info'>
            <Text className='date-text'>2026年7月25日 · 礼拜六 · 成都</Text>
          </View>
        </AnimatedView>

        <DoodleLine className='divider-line' />

        <AnimatedView animation='fadeInUp' delay={700} duration={600} isActive={isActive}>
          <Text className='invite-title'>诚挚邀请您见证我们的婚礼</Text>
        </AnimatedView>

        <AnimatedView animation='fadeIn' delay={900} duration={800} isActive={isActive}>
          <View className='poem-section'>
            <Text className='poem-line'>我们期待</Text>
            <Text className='poem-line'>于我们意义非凡的您</Text>
            <Text className='poem-line'>能够莅临现场</Text>
          </View>
        </AnimatedView>

        <AnimatedView animation='fadeInUp' delay={1200} duration={600} isActive={isActive} className='scroll-hint'>
          <Text className='scroll-text'>向下滑动开启故事</Text>
          <View className='scroll-arrow'>↓</View>
        </AnimatedView>
      </View>
    </View>
  )
}
