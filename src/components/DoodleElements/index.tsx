import React from 'react'
import { View } from '@tarojs/components'
import './index.scss'

export const DoodleHeart: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-heart ${className || ''}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M50 85C50 85 20 65 20 45C20 32 30 22 43 22C48 22 50 25 50 25C50 25 52 22 57 22C70 22 80 32 80 45C80 65 50 85 50 85Z" 
        stroke="#c9a87c" 
        strokeWidth="2.5" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </View>
)

export const DoodleRing: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-ring ${className || ''}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="50" 
        cy="50" 
        r="35" 
        stroke="#c9a87c" 
        strokeWidth="2.5" 
        fill="none"
        strokeLinecap="round"
        strokeDasharray="8 4"
      />
      <path 
        d="M50 25 L50 75 M25 50 L75 50" 
        stroke="#c9a87c" 
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </View>
)

export const DoodleFlower: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-flower ${className || ''}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="8" stroke="#c9a87c" strokeWidth="2" fill="none"/>
      <circle cx="65" cy="50" r="8" stroke="#c9a87c" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="65" r="8" stroke="#c9a87c" strokeWidth="2" fill="none"/>
      <circle cx="35" cy="50" r="8" stroke="#c9a87c" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="50" r="6" fill="#c9a87c"/>
      <path d="M50 70 Q50 85 50 95" stroke="#c9a87c" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </View>
)

export const DoodleLine: React.FC<{ className?: string }> = ({ className }) => (
  <View className={`doodle-line ${className || ''}`}>
    <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M5 10 Q50 5 100 10 T195 10" 
        stroke="#c9a87c" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </View>
)

export const DoodleCorner: React.FC<{ className?: string; position?: 'tl' | 'tr' | 'bl' | 'br' }> = ({ 
  className, 
  position = 'tl' 
}) => {
  const rotateMap = {
    tl: 0,
    tr: 90,
    br: 180,
    bl: 270
  }
  
  return (
    <View 
      className={`doodle-corner ${className || ''}`} 
      style={{ transform: `rotate(${rotateMap[position]}deg)` }}
    >
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M5 55 L5 15 Q5 5 15 5 L55 5" 
          stroke="#c9a87c" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </View>
  )
}
