import React from 'react'
import { View, Text } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
import { DoodleFlower, DoodleLine } from '../../../components/DoodleElements'
import './PageGrowingUp.scss'

interface PageGrowingUpProps {
  isActive: boolean
}

export const PageGrowingUp: React.FC<PageGrowingUpProps> = ({ isActive }) => {
  return (
    <View className='page page-growing-up'>
      <View className='content-wrapper'>
        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          duration={600}
        >
          <Text className='years-text'>2001 - 2019</Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={200}
          duration={600}
        >
          <View className='timeline-line'>
            <View className='timeline-dot' />
            <DoodleLine className='timeline-doodle' />
            <View className='timeline-dot' />
          </View>
        </AnimatedView>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={400}
          duration={800}
        >
          <Text className='story-text'>
            从懵懂孩提到并肩成长，
            {'\n'}
            命运的轨迹早已悄然重合，
            {'\n'}
            最好的朋友，
            {'\n'}
            也是彼此青春的见证者。
          </Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeInScale'
          isActive={isActive}
          delay={800}
          duration={600}
        >
          <View className='flowers-row'>
            <DoodleFlower className='flower-icon' />
            <DoodleFlower className='flower-icon' />
            <DoodleFlower className='flower-icon' />
          </View>
        </AnimatedView>

        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          delay={1000}
          duration={600}
        >
          <Text className='quote-text'>{`"那些一起走过的日子，是青春最美的底色"`}</Text>
        </AnimatedView>
      </View>
    </View>
  )
}
