'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 動態載入地圖元件，避免SSR問題
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <LoadingPerformance />
})

const LoadingPerformance = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Main pulse circle */}
      <div className="h-16 w-16 rounded-full border-2 border-cyan-400 bg-cyan-400/30 animate-pulse" />

      {/* Outer pulse ring - slow animation */}
      <div className="animate-ping absolute h-24 w-24 rounded-full border border-cyan-400/20" />

      {/* Inner pulse ring - medium animation */}
      <div className="animation-delay-75 animate-ping absolute h-20 w-20 rounded-full border border-cyan-400/40" />

      {/* Center dot */}
      <div className="absolute h-2 w-2 rounded-full bg-cyan-400" />
    </div>
  )
}

export default function Map() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <MapComponent />
    </Suspense>
  )
}
