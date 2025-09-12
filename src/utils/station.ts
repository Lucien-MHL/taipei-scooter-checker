import L from 'leaflet'
import { Station } from '@/types/station'

export const zoomToStation = (station: Station, map: L.Map) => {
  const stationLatLng = [station.coordinates.lat, station.coordinates.lng] as [
    number,
    number
  ]
  const currentZoom = map.getZoom()
  const currentCenter = map.getCenter()

  // 計算當前中心與檢驗站的距離 (米)
  const distance = currentCenter.distanceTo(L.latLng(stationLatLng))

  // 智慧縮放策略：根據當前縮放等級和距離決定行為
  let targetZoom: number
  let shouldMove = true
  let animationDuration = 0.8

  if (currentZoom < 14) {
    // 距離很遠，需要大幅放大並移動
    targetZoom = 14
    animationDuration = 1.2
  } else if (currentZoom >= 17) {
    // 已經很近了，根據距離決定是否需要移動
    targetZoom = Math.min(currentZoom + 0.5, 18)

    if (distance < 100) {
      // 距離很近（<100米），只做輕微調整
      shouldMove = false
      animationDuration = 0.3
    } else {
      // 距離較遠但縮放夠大，只居中
      targetZoom = currentZoom
      animationDuration = 0.6
    }
  } else if (currentZoom >= 15) {
    // 中高縮放，適度放大
    targetZoom = Math.min(currentZoom + 1.5, 17)
    animationDuration = 0.8
  } else {
    // 中等縮放，適中放大
    targetZoom = 16
    animationDuration = 1.0
  }

  // 根據需求執行動畫
  if (shouldMove || Math.abs(targetZoom - currentZoom) > 0.1) {
    map.setView(stationLatLng, targetZoom, {
      animate: true,
      duration: animationDuration,
      easeLinearity: shouldMove ? 0.15 : 0.25 // 移動時更流暢，純縮放時更快
    })
  }
}
