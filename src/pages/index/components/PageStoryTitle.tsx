import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleRing, DoodleLine } from '../../../components/DoodleElements'
import './PageStoryTitle.scss'

interface PageStoryTitleProps {
  isActive: boolean
}

export const PageStoryTitle: React.FC<PageStoryTitleProps> = ({ isActive }) => {
  return (
    <View className='page page-story-title'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          <DoodleRing className='title-ring' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Text className='story-title'>我们的故事</Text>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <DoodleLine className='title-line' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <View className='subtitle-section'>
            <Text className='subtitle-text'>七年之约</Text>
            <Text className='subtitle-desc'>从青梅竹马到一生伴侣</Text>
          </View>
        </motion.div>
      </View>
    </View>
  )
}
