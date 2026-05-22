import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AudioControl } from '../../components/AudioControl'
import { useBackgroundAudio } from '../../hooks/useAudio'
import { PageHome } from './components/PageHome'
import { PageStoryTitle } from './components/PageStoryTitle'
import { PageBirth } from './components/PageBirth'
import { PageGrowingUp } from './components/PageGrowingUp'
import { PageRelationship } from './components/PageRelationship'
import { PageDistance } from './components/PageDistance'
import { PageToronto } from './components/PageToronto'
import { PageLife } from './components/PageLife'
import { PageMilestone } from './components/PageMilestone'
import { PageSchedule } from './components/PageSchedule'
import { PageLocation } from './components/PageLocation'
import { PageForm } from './components/PageForm'
import './index.scss'

const TOTAL_PAGES = 12

const Index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { isPlaying, togglePlay, initAudio } = useBackgroundAudio()

  // Auto-init audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio()
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
    }

    window.addEventListener('touchstart', handleFirstInteraction, { once: true })
    window.addEventListener('click', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
    }
  }, [initAudio])

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < TOTAL_PAGES && !isAnimating) {
      setIsAnimating(true)
      setCurrentPage(pageIndex)
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)

  // Touch handling
  const handleTouchStart = (e: any) => {
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: any) => {
    const deltaY = touchStartY - e.changedTouches[0].clientY
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        nextPage()
      } else {
        prevPage()
      }
    }
  }

  // Wheel handling
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      clearTimeout(wheelTimeout)

      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 30) {
          nextPage()
        } else if (e.deltaY < -30) {
          prevPage()
        }
      }, 50)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      clearTimeout(wheelTimeout)
    }
  }, [currentPage])

  // Page visibility for animation
  const isPageActive = (index: number) => currentPage === index

  const pages = [
    <PageHome key="home" isActive={isPageActive(0)} />,
    <PageStoryTitle key="story-title" isActive={isPageActive(1)} />,
    <PageBirth key="birth" isActive={isPageActive(2)} />,
    <PageGrowingUp key="growing" isActive={isPageActive(3)} />,
    <PageRelationship key="relationship" isActive={isPageActive(4)} />,
    <PageDistance key="distance" isActive={isPageActive(5)} />,
    <PageToronto key="toronto" isActive={isPageActive(6)} />,
    <PageLife key="life" isActive={isPageActive(7)} />,
    <PageMilestone key="milestone" isActive={isPageActive(8)} />,
    <PageSchedule key="schedule" isActive={isPageActive(9)} />,
    <PageLocation key="location" isActive={isPageActive(10)} />,
    <PageForm key="form" isActive={isPageActive(11)} />,
  ]

  return (
    <View className='index'>
      <AudioControl isPlaying={isPlaying} onToggle={togglePlay} />

      <View className='page-indicator'>
        {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
          <View
            key={index}
            className={`indicator-dot ${currentPage === index ? 'active' : ''}`}
            onClick={() => goToPage(index)}
          />
        ))}
      </View>

      <ScrollView
        className='pages-container'
        scrollY={false}
        scrollX={false}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <View
          className='pages-wrapper'
          style={{ transform: `translateY(-${currentPage * 100}vh)` }}
        >
          {pages}
        </View>
      </ScrollView>

      {currentPage < TOTAL_PAGES - 1 && (
        <View className='scroll-hint-global' onClick={nextPage}>
          <View className='hint-arrow'>↓</View>
        </View>
      )}
    </View>
  )
}

export default Index
