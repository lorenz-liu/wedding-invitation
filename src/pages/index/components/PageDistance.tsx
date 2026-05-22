import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='years-range'>2019 - 2023</Text>
          <Text className='main-title'>跨越了时差与国界</Text>
        </motion.div>

        <View className='timeline-container'>
          {years.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className='timeline-item'
            >
              <View className={`timeline-card ${index % 2 === 0 ? 'left' : 'right'}`}>
                <Text className='year-badge'>{item.year}</Text>
                <Text className='timeline-icon'>{item.icon}</Text>
                <Text className='location-text'>{item.location}</Text>
                <Text className='desc-text'>{item.desc}</Text>
              </View>
            </motion.div>
          ))}
        </View>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
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
        </motion.div>
      </View>
    </View>
  )
}
