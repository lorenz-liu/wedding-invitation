import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleHeart, DoodleRing } from '../../../components/DoodleElements'
import './PageMilestone.scss'

interface PageMilestoneProps {
  isActive: boolean
}

export const PageMilestone: React.FC<PageMilestoneProps> = ({ isActive }) => {
  return (
    <View className='page page-milestone'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='year-count'>七年</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Text className='context-text'>在这个充满随机性的世界</Text>
          <Text className='context-text'>我们的轨迹始终指向彼此</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          <View className='milestone-icons'>
            <DoodleHeart className='ms-heart' />
            <Text className='ms-plus'>+</Text>
            <DoodleRing className='ms-ring' />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Text className='poetry-text'>
            当所有的经纬度最终重合
            {'\n'}
            便成为里程碑
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <View className='wedding-date-box'>
            <Text className='date-highlight'>2026年7月25日</Text>
            <Text className='we-text'>我们共同铭刻</Text>
          </View>
        </motion.div>
      </View>
    </View>
  )
}
