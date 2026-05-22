import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleFlower } from '../../../components/DoodleElements'
import './PageLife.scss'

interface PageLifeProps {
  isActive: boolean
}

export const PageLife: React.FC<PageLifeProps> = ({ isActive }) => {
  return (
    <View className='page page-life'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='years-text'>2023 - 2026</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text className='life-text'>
            在硕士学业与职场生活中，
            {'\n'}
            我们学会了分担与陪伴。
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Text className='cat-desc'>
            家里还有一只名叫"宝宝"的小猫，
            {'\n'}
            是我们在这个城市里最暖的陪伴，
            {'\n'}
            也让我们的生活因为彼此而变得圆满。
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <View className='quote-box'>
            <Text className='quote-text'>"有你在的地方，就是家"</Text>
          </View>
        </motion.div>
      </View>
    </View>
  )
}
