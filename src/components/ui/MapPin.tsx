import L from 'leaflet'

// 🎯 統一的站點激活狀態管理 - 一個函數解決所有視覺狀態
export const setStationActive = (stationId: string) => {
  // 1. 清除所有其他站點的狀態（動畫 + 選中）
  clearAllStationStates()

  // 2. 為當前站點設定完整的激活狀態
  const currentStation = document.querySelector(`#pin-${stationId}`)
  if (currentStation) {
    // 添加彈跳動畫
    currentStation.classList.add('pin-bounce-animation')
    // 添加選中視覺狀態
    currentStation.classList.add('pin-selected-state')
  }
}

// 🧹 清除所有站點狀態 - 統一清理函數
export const clearAllStationStates = () => {
  const allPins = document.querySelectorAll('[id^="pin-"]')
  allPins.forEach((pin) => {
    // 移除所有相關的狀態 class
    pin.classList.remove('pin-bounce-animation', 'pin-selected-state')
  })
}

export const MapPin = (stationId: string) =>
  L.divIcon({
    html: `
      <div id="pin-${stationId}" class="w-5 h-5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110">
      </div>
    `,
    className: 'custom-station-marker selected-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
