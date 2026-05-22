import React from 'react'
import { View, Text, Map, Button } from '@tarojs/components'
import { motion } from 'framer-motion'
import Taro from '@tarojs/taro'
import { DoodleRing, DoodleCorner } from '../../../components/DoodleElements'
import './PageLocation.scss'

interface PageLocationProps {
  isActive: boolean
}

export const PageLocation: React.FC<PageLocationProps> = ({ isActive }) => {
  const handleOpenMap = () => {
    Taro.openLocation({
      latitude: 30.5728,
      longitude: 104.0668,
      name: '慕上OnTheMoon',
      address: '成都市',
      scale: 18
    })
  }

  return (
    <View className='page page-location'>
      <DoodleCorner position='tl' className='corner-tl' />
      <DoodleCorner position='tr' className='corner-tr' />
      
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Text className='page-title'>婚礼地点</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <View className='location-header'>
            <Text className='location-city'>成都</Text>
            <Text className='location-dot'>·</Text>
            <Text className='location-venue'>慕上</Text>
            <View className='ring-icon-wrapper'>
              <DoodleRing className='header-ring' />
            </View>
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <View className='map-container'>
            <Map
              className='map'
              longitude={104.0668}
              latitude={30.5728}
              scale={14}
              markers={[
                {
                  id: 1,
                  longitude: 104.0668,
                  latitude: 30.5728,
                  title: '慕上OnTheMoon',
                  iconPath: '',
                  width: 30,
                  height: 30
                }
              ]}
              showLocation
            />
            <Button className='open-map-btn' onClick={handleOpenMap}>
              打开导航
            </Button>
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <View className='transport-info'>
            <View className='transport-item'>
              <Text className='transport-icon'>🚗</Text>
              <Text className='transport-text'>若您自驾出行，请告知我们，我们会提前为您准备车位。</Text>
            </View>
            <View className='transport-item'>
              <Text className='transport-icon'>🚌</Text>
              <Text className='transport-text'>若您希望我们提供接驳服务，请在下一页表单中填写。</Text>
            </View>
          </View>
        </motion.div>
      </View>
    </View>
  )
}
