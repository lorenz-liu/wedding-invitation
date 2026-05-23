import React, { useState, useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AnimatedView } from '../AnimatedView'
import './index.scss'

type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInScale' | 'fadeInLeft' | 'fadeInRight'

export interface AnimatedImageProps {
  src: string
  alt?: string
  animation?: AnimationType | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'polaroid'
  delay?: number
  duration?: number
  isActive?: boolean
  className?: string
  caption?: string
  captionPosition?: 'bottom' | 'overlay'
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto'
  frameStyle?: 'none' | 'polaroid' | 'rounded' | 'vintage'
}

const mapAnimation = (animation: AnimatedImageProps['animation']): AnimationType => {
  switch (animation) {
    case 'slideInLeft':
      return 'fadeInLeft'
    case 'slideInRight':
      return 'fadeInRight'
    case 'slideInUp':
      return 'fadeInUp'
    case 'polaroid':
      return 'fadeInScale'
    default:
      return animation || 'fadeInScale'
  }
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  animation = 'fadeInScale',
  delay = 0,
  duration = 800,
  isActive = true,
  className = '',
  caption,
  captionPosition = 'bottom',
  aspectRatio = 'auto',
  frameStyle = 'none'
}) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isActive) return

    // Fallback: show image even if onLoad doesn't fire (common in WeChat devtools)
    const fallbackTimer = setTimeout(() => {
      setLoaded(true)
    }, 300)

    return () => clearTimeout(fallbackTimer)
  }, [isActive, src])

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
    console.error('Image load error:', src)
  }

  if (error) {
    return (
      <View className={`animated-image error ${className}`}>
        <View className='image-placeholder'>
          <Text className='placeholder-text'>图片加载失败</Text>
        </View>
      </View>
    )
  }

  return (
    <AnimatedView
      animation={mapAnimation(animation)}
      delay={delay}
      duration={duration}
      isActive={isActive}
      className={`animated-image-wrapper ${frameStyle} ${className}`}
    >
      <View className={`image-container aspect-${aspectRatio} ${loaded ? 'loaded' : 'loading'}`}>
        <Image
          className='animated-img'
          src={src}
          mode='aspectFill'
          showMenuByLongpress={false}
          onLoad={handleLoad}
          onError={handleError}
        />
        {!loaded && (
          <View className='image-loading'>
            <View className='loading-spinner' />
          </View>
        )}
      </View>

      {caption && (
        <View className={`image-caption ${captionPosition}`}>
          <Text className='caption-text'>{caption}</Text>
        </View>
      )}
    </AnimatedView>
  )
}

interface ImageGroupProps {
  images: {
    src: string
    caption?: string
    animation?: AnimatedImageProps['animation']
    delay?: number
  }[]
  layout?: 'row' | 'column' | 'grid' | 'masonry'
  gap?: number
  isActive?: boolean
  className?: string
}

export const AnimatedImageGroup: React.FC<ImageGroupProps> = ({
  images,
  layout = 'row',
  gap = 16,
  isActive = true,
  className = ''
}) => {
  return (
    <View
      className={`animated-image-group layout-${layout} ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {images.map((img, index) => (
        <AnimatedImage
          key={index}
          src={img.src}
          caption={img.caption}
          animation={img.animation || 'fadeInScale'}
          delay={img.delay || index * 200}
          isActive={isActive}
          frameStyle={layout === 'masonry' ? 'polaroid' : 'none'}
        />
      ))}
    </View>
  )
}
