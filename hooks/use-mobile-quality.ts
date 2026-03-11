'use client'

import { useEffect, useState } from 'react'

function getQualityLevel() {
  if (typeof window === 'undefined') return 'desktop'

  const mobile = window.matchMedia('(max-width: 768px)').matches
  const lowCpu = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4

  if (mobile || lowCpu) {
    return 'mobile'
  }

  return 'desktop'
}

export function useMobileQuality() {
  const [quality, setQuality] = useState<'desktop' | 'mobile'>(() => getQualityLevel())

  useEffect(() => {
    const onResize = () => setQuality(getQualityLevel())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    quality,
    isMobile: quality === 'mobile',
    particleScale: quality === 'mobile' ? 0.56 : 1,
  }
}

