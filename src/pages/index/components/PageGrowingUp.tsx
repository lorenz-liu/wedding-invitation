import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleFlower, DoodleLine } from '../../../components/DoodleElements'
import './PageGrowingUp.scss'

interface PageGrowingUpProps {
  isActive: boolean
}

export const PageGrowingUp: React.FC<PageGrowingUpProps> = ({ isActive }) => {
  return (
    <View className='page page-growing-up'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='years-text'>2001 - 2019</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <View className='timeline-line'>
            <View className='timeline-dot' />
            <DoodleLine className='timeline-doodle' />
            <View className='timeline-dot' />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <View className='flowers-row'>
            <DoodleFlower className='flower-icon' />
            <DoodleFlower className='flower-icon' />
            <DoodleFlower className='flower-icon' />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Text className='quote-text'>{`"那些一起走过的日子，是青春最美的底色"`}</Text>
        </motion.div>
      </View>
    </View>
  )
}
