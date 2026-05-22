import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleHeart, DoodleRing } from '../../../components/DoodleElements'
import './PageRelationship.scss'

interface PageRelationshipProps {
  isActive: boolean
}

export const PageRelationship: React.FC<PageRelationshipProps> = ({ isActive }) => {
  return (
    <View className='page page-relationship'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6 }}
        >
          <View className='special-date'>
            <Text className='date-number'>2019</Text>
            <Text className='date-month-day'>7月25日</Text>
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <View className='icons-row'>
            <DoodleHeart className='rel-heart' />
            <Text className='plus-sign'>+</Text>
            <DoodleRing className='rel-ring' />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Text className='story-title'>故事的转角</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Text className='story-content'>
            我们正式确定了彼此的心意。
            {'\n'}
            从青梅竹马到一生伴侣，
            {'\n'}
            我们的故事，
            {'\n'}
            由此写下新的篇章。
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          <View className='heart-decoration'>
            <DoodleHeart className='big-heart' />
          </View>
        </motion.div>
      </View>
    </View>
  )
}
