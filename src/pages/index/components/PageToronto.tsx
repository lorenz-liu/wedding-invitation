import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleHeart, DoodleRing } from '../../../components/DoodleElements'
import './PageToronto.scss'

interface PageTorontoProps {
  isActive: boolean
}

export const PageToronto: React.FC<PageTorontoProps> = ({ isActive }) => {
  return (
    <View className='page page-toronto'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <View className='date-box'>
            <Text className='date-year'>2023年</Text>
            <Text className='date-day'>10月14日</Text>
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          <View className='plane-icon'>✈️</View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Text className='arrival-text'>抵达多伦多</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <View className='decorations'>
            <DoodleHeart className='deco-heart' />
            <Text className='deco-text'>我们的坐标</Text>
            <DoodleRing className='deco-ring' />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Text className='forever-text'>从此永远重合</Text>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <View className='location-badge'>
            <Text className='pin-icon'>📍</Text>
            <Text className='city-name'>Toronto, Canada</Text>
          </View>
        </motion.div>
      </View>
    </View>
  )
}
