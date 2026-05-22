import React from 'react'
import { View, Text } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
import './PageDistance.scss'

interface PageDistanceProps {
  isActive: boolean
}

export const PageDistance: React.FC<PageDistanceProps> = ({ isActive }) => {
  const years = [
    { year: '2020', location: '西雅图', desc: '第一场的雪', icon: '❄️' },
    { year: '2021', location: '短暂团聚', desc: '相聚有时', icon: '💫' },
    { year: '2022', location: '久别重逢', desc: '思念累积', icon: '✈️' },
  ]

  return (
    <View className='page page-distance'>
      <View className='content-wrapper'>
        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          duration={600}
        >
          <Text className='years-range'>2019 - 2023</Text>
          <Text className='main-title'>跨越了时差与国界</Text>
        </AnimatedView>

        <View className='timeline-container'>
          {years.map((item, index) => (
            <AnimatedView
              key={item.year}
              animation={index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}
              isActive={isActive}
              delay={200 + index * 150}
              duration={600}
              className='timeline-item'
            >
              <View className={`timeline-card ${index % 2 === 0 ? 'left' : 'right'}`}>
                <Text className='year-badge'>{item.year}</Text>
                <Text className='timeline-icon'>{item.icon}</Text>
                <Text className='location-text'>{item.location}</Text>
                <Text className='desc-text'>{item.desc}</Text>
              </View>
            </AnimatedView>
          ))}
        </View>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={800}
          duration={800}
        >
          <View className='conclusion-box'>
            <Text className='conclusion-text'>
              这些跨越距离的时光，
              {'\n'}
              让我们更确信，
              {'\n'}
              并肩前行才是最好的选择。
            </Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  )
}
