import React from 'react'
import { View, Text } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
import { DoodleRing, DoodleLine } from '../../../components/DoodleElements'
import './PageStoryTitle.scss'

interface PageStoryTitleProps {
  isActive: boolean
}

export const PageStoryTitle: React.FC<PageStoryTitleProps> = ({ isActive }) => {
  return (
    <View className='page page-story-title'>
      <View className='content-wrapper'>
        <AnimatedView
          animation='fadeInScale'
          isActive={isActive}
          duration={800}
        >
          <DoodleRing className='title-ring' />
        </AnimatedView>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={300}
          duration={800}
        >
          <Text className='story-title'>我们的故事</Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          delay={600}
          duration={600}
        >
          <DoodleLine className='title-line' />
        </AnimatedView>

        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          delay={800}
          duration={800}
        >
          <View className='subtitle-section'>
            <Text className='subtitle-text'>七年之约</Text>
            <Text className='subtitle-desc'>从青梅竹马到一生伴侣</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  )
}
