import { useState, useEffect, useCallback, useRef } from 'react'

const TOTAL_PAGES = 12
const SCROLL_THRESHOLD = 100
const PAGE_HEIGHT = 100 // vh

export function useScrollPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartY = useRef(0)

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < TOTAL_PAGES && !isScrolling) {
      setIsScrolling(true)
      setCurrentPage(pageIndex)
      
      // Reset scrolling lock after animation
      setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
    }
  }, [isScrolling])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > SCROLL_THRESHOLD) {
          nextPage()
        } else if (e.deltaY < -SCROLL_THRESHOLD) {
          prevPage()
        }
      }, 50)
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          nextPage()
        } else {
          prevPage()
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextPage()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        prevPage()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [nextPage, prevPage])

  return {
    currentPage,
    totalPages: TOTAL_PAGES,
    goToPage,
    nextPage,
    prevPage,
    isScrolling,
    progress: (currentPage / (TOTAL_PAGES - 1)) * 100
  }
}
