'use client'

import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { Station } from '@/types/station'
import { MapPin, setStationActive, clearAllStationStates } from './ui/MapPin'
import { ClusterCircle } from './ui/ClusterCircle'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import './MarkerCluster.css'
import { useStations } from '@/stores/useStations'
import { zoomToStation } from '@/utils/station'

export default function MarkerCluster({ stations }: { stations: Station[] }) {
  const map = useMap()
  const { setSelectedStation, resetToPreview } = useStations()

  useEffect(() => {
    // 建立 marker cluster group
    const markers = createMarkers()

    // 為每個檢驗站建立 marker
    stations.forEach((station) => {
      const marker = L.marker(
        [station.coordinates.lat, station.coordinates.lng],
        { icon: MapPin(station.id) }
      ).on('click', () => {
        // 🎯 統一處理所有視覺狀態（彈跳動畫 + 選中狀態）
        setStationActive(station.id)

        // 🔍 智慧縮放
        zoomToStation(station, map)

        // ⚛️ 更新 React 狀態
        setSelectedStation(station)
      })

      markers.addLayer(marker) // 不綁定popup，點擊後可由sidebar或drawer處理
    })

    map.addLayer(markers) // 將 cluster group 加到地圖

    // Add map click handler to reset to peek state when clicking on empty areas
    const handleMapClick = () => {
      resetToPreview()
    }

    map.on('click', () => {
      // 🧹 清除所有站點狀態
      clearAllStationStates()
      resetToPreview()
    })

    // 清理函數
    return () => {
      map.removeLayer(markers)
      map.off('click', handleMapClick)
    }
  }, [map, stations])

  return null
}

const createMarkers = () => {
  const markers = L.markerClusterGroup({
    // 自訂cluster圖示
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount()
      return ClusterCircle(count)
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  })
  return markers
}
