import L from 'leaflet'

export const ClusterCircle = (count: number) => {
  let className = 'marker-cluster marker-cluster-'

  // 根據數量決定大小和顏色
  if (count < 5) {
    className += 'small'
  } else if (count < 15) {
    className += 'medium'
  } else {
    className += 'large'
  }

  return new L.DivIcon({
    html: `<div class="cluster-inner"><span>${count}</span></div>`,
    className: className,
    iconSize: new L.Point(40, 40)
  })
}
