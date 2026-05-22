import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleHeart } from '../../../components/DoodleElements'
import './PageBirth.scss'

interface PageBirthProps {
  isActive: boolean
}

export const PageBirth: React.FC<PageBirthProps> = ({ isActive }) => {
  return (
    <View className='page page-birth'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='year-badge'>2001年</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Text className='intro-text'>同一个医生，接生了两个注定相遇的灵魂。</Text>
        </motion.div>

        <View className='birth-cards'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='birth-card groom'
          >
            <View className='card-decoration'>
              <DoodleHeart className='card-heart' />
            </View>
            <Text className='date-text'>01月06日</Text>
            <Text className='label-text'>新郎降临</Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='birth-card bride'
          >
            <View className='card-decoration'>
              <DoodleHeart className='card-heart' />
            </View>
            <Text className='date-text'>06月19日</Text>
            <Text className='label-text'>新娘出生</Text>
          </motion.div>
        </View>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Text className='doctor-text'>命运的安排，从此开始</Text>
        </motion.div>
      </View>
    </View>
  )
}
