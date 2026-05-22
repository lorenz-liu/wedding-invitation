import React from 'react'
import { View, Text } from '@tarojs/components'
import { motion } from 'framer-motion'
import { DoodleFlower, DoodleLine } from '../../../components/DoodleElements'
import './PageSchedule.scss'

interface PageScheduleProps {
  isActive: boolean
}

interface ScheduleItem {
  time: string
  title: string
  subtitle: string
  description: string
}

const scheduleData: ScheduleItem[] = [
  {
    time: '15:00',
    title: '宾客入席',
    subtitle: '扉启迎宾，静候光临',
    description: '您可以以这个时间点规划抵达时间，于入口处签到后我们会有专人引导您进入会场。'
  },
  {
    time: '17:00',
    title: '典礼开始',
    subtitle: '花门轻启，盟誓此夕',
    description: '婚礼仪式将于教堂内开始。我们没有着装要求，请您以舒适度为主安排服饰。'
  },
  {
    time: '18:30',
    title: '喜宴开始',
    subtitle: '佳肴盈席，共叙情谊',
    description: '请您在该电子请柬最后一页告知我们您的特殊饮食需求，比如食物过敏等。典礼结束后会有专人引导您入座。'
  },
  {
    time: '20:00',
    title: '欢聚时光',
    subtitle: '欢聚尽兴，杯盏余音',
    description: '在晚宴结束后，我们准备了餐后甜点和酒水供您消遣，让这一天在轻松愉悦中画上完美的句号。'
  }
]

export const PageSchedule: React.FC<PageScheduleProps> = ({ isActive }) => {
  return (
    <View className='page page-schedule'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='page-title'>当日安排</Text>
          <DoodleLine className='title-line' />
        </motion.div>

        <View className='schedule-list'>
          {scheduleData.map((item, index) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className='schedule-item'
            >
              <View className={`time-badge ${index % 2 === 0 ? 'left' : 'right'}`}>
                <Text className='time-text'>{item.time}</Text>
              </View>
              <View className='schedule-card'>
                <Text className='event-title'>{item.title}</Text>
                <Text className='event-subtitle'>{item.subtitle}</Text>
                <Text className='event-desc'>{item.description}</Text>
              </View>
            </motion.div>
          ))}
        </View>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <View className='decoration-footer'>
            <DoodleFlower className='footer-flower' />
          </View>
        </motion.div>
      </View>
    </View>
  )
}
