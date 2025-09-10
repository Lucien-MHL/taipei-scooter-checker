'use client'

import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { Station } from '@/types/station'
import { MapPin } from './ui/MapPin'
import { ClusterCircle } from './ui/ClusterCircle'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useStations } from '@/stores/useStations'

export default function MarkerCluster({ stations }: { stations: Station[] }) {
  const map = useMap()
  const { setSelectedStation, setDrawerState, resetToPreview } = useStations()

  useEffect(() => {
    // 建立 marker cluster group
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

    // 為每個檢驗站建立 marker (無popup)
    stations.forEach((station) => {
      const marker = L.marker(
        [station.coordinates.lat, station.coordinates.lng],
        { icon: MapPin }
      ).on('click', () => {
        setSelectedStation(station)
        // Mobile devices: set drawer to 'basic' state to show station info
        setDrawerState('basic')
      })
      markers.addLayer(marker) // 不綁定popup，點擊後可由sidebar或drawer處理
    })

    map.addLayer(markers) // 將 cluster group 加到地圖

    // Add map click handler to reset to peek state when clicking on empty areas
    const handleMapClick = () => {
      resetToPreview()
    }

    map.on('click', handleMapClick)

    // 清理函數
    return () => {
      map.removeLayer(markers)
      map.off('click', handleMapClick)
    }
  }, [map, stations])

  return null
}
