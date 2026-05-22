import React from 'react'
import { View, Text, Map, Button } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
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
        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          duration={600}
        >
          <Text className='page-title'>婚礼地点</Text>
        </AnimatedView>

        <AnimatedView
          animation='fadeInScale'
          isActive={isActive}
          delay={200}
          duration={600}
        >
          <View className='location-header'>
            <Text className='location-city'>成都</Text>
            <Text className='location-dot'>·</Text>
            <Text className='location-venue'>慕上</Text>
            <View className='ring-icon-wrapper'>
              <DoodleRing className='header-ring' />
            </View>
          </View>
        </AnimatedView>

        <AnimatedView
          animation='fadeInUp'
          isActive={isActive}
          delay={400}
          duration={600}
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
        </AnimatedView>

        <AnimatedView
          animation='fadeIn'
          isActive={isActive}
          delay={600}
          duration={600}
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
        </AnimatedView>
      </View>
    </View>
  )
}
