import { Station } from '@/types/station'

/**
 * 取得沒有座標的站點列表
 * Get stations without coordinates
 */
export const getNoCoordinateStations = (
  stations: Station[] | null
): Station[] => {
  if (!stations) return []
  return stations.filter((station) => !station.coordinates)
}

/**
 * 檢查是否有無座標站點
 * Check if there are stations without coordinates
 */
export const hasNoCoordinateStations = (
  stations: Station[] | null
): boolean => {
  return getNoCoordinateStations(stations).length > 0
}

/**
 * 取得無座標站點數量
 * Get count of stations without coordinates
 */
export const getNoCoordinateStationsCount = (
  stations: Station[] | null
): number => {
  return getNoCoordinateStations(stations).length
}
