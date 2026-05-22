import React from 'react'
import { View, Text } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
import { DoodleFlower } from '../../../components/DoodleElements'
import './PageLife.scss'

interface PageLifeProps {
  isActive: boolean
}

export const PageLife: React.FC<PageLifeProps> = ({ isActive }) => {
  return (
    <View className='page page-life'>
      <View className='content-wrapper'>
        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          duration={600}
        >
          <Text className='years-text'>2023 - 2026</Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={200}
          duration={800}
        >
          <Text className='life-text'>
            在硕士学业与职场生活中，
            {'\n'}
            我们学会了分担与陪伴。
          </Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeInScale'
          isActive={isActive}
          delay={500}
          duration={600}
        >
          <View className='cat-section'>
            <View className='cat-icon'>🐱</View>
            <Text className='cat-name'>宝宝</Text>
            <View className='flowers-around'>
              <DoodleFlower className='flower-1' />
              <DoodleFlower className='flower-2' />
              <DoodleFlower className='flower-3' />
            </View>
          </View>
        </AnimatedView>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={700}
          duration={800}
        >
          <Text className='cat-desc'>
            家里还有一只名叫"宝宝"的小猫，
            {'\n'}
            是我们在这个城市里最暖的陪伴，
            {'\n'}
            也让我们的生活因为彼此而变得圆满。
          </Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          delay={1000}
          duration={600}
        >
          <View className='quote-box'>
            <Text className='quote-text'>"有你在的地方，就是家"</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  )
}
