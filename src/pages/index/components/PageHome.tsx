import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleHeart, DoodleLine, DoodleCorner } from '../../../components/DoodleElements'
import './PageHome.scss'

interface PageHomeProps {
  isActive: boolean
}

export const PageHome: React.FC<PageHomeProps> = ({ isActive }) => {
  return (
    <View className='page page-home'>
      <DoodleCorner position='tl' className='corner-tl' />
      <DoodleCorner position='tr' className='corner-tr' />
      <DoodleCorner position='bl' className='corner-bl' />
      <DoodleCorner position='br' className='corner-br' />
      
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
        >
          <Text className='names-text'>刘兆薰 & 高文珩</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
        >
          <DoodleHeart className='main-heart' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <View className='date-info'>
            <Text className='date-text'>2026年7月25日 · 礼拜六 · 成都</Text>
          </View>
        </motion.div>

        <DoodleLine className='divider-line' />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Text className='invite-title'>诚挚邀请您见证我们的婚礼</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <View className='poem-section'>
            <Text className='poem-line'>我们期待</Text>
            <Text className='poem-line'>于我们意义非凡的您</Text>
            <Text className='poem-line'>能够莅临现场</Text>
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className='scroll-hint'
        >
          <Text className='scroll-text'>向下滚动开启故事</Text>
          <View className='scroll-arrow'>↓</View>
        </motion.div>
      </View>
    </View>
  )
}
