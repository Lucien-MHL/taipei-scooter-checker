/**
 *  比對原先資料中與新資料中的差異，再決定是否覆蓋保存跟座標化
 *  比對情況可能會有幾下幾種:
 *  - 無變更 unchanged
 *  - 資料更新 modified
 *  - 地址變更 moved
 *  - 新增店家 new
 *  - 關閉店家 closed
 */

const path = require('path')

const originalData = require(path.join(__dirname, '../data/stations.json'))

const compareDifferent = (newStations) => {
  if (!originalData) throw new Error('原始資料不存在')
  if (!newStations) throw new Error('新資料不存在')
  const originalStations = originalData.stations
  const newMap = new Map(newStations.map((station) => [station.id, station]))
  const originalMap = new Map(
    originalStations.map((station) => [station.id, station])
  )

  const summary = {
    unchanged: [],
    modified: [],
    moved: [],
    fresh: [],
    closed: []
  }

  console.log('Start to compare different')
  console.log('originalStations length:', originalStations.length)
  console.log('newStations length:', newStations.length)

  // 先從舊資料開始遞迴尋找是否有 closed、move、modified、unchanged 的檢驗站
  originalStations.forEach((station) => {
    const newStation = newMap.get(station.id)
    if (!newStation) {
      // 找尋不到表示該檢驗站已關閉
      summary.closed.push(station)
      return
    }

    if (station.date === newStation.date) {
      // 日期相同代表不需要更新
      summary.unchanged.push(station)
      return
    }

    if (station.address !== newStation.address) {
      // 地址不同，需要進行座標化
      summary.moved.push(newStation)
      return
    } else {
      // 日期不同，但地址相同，代表該檢驗站的其他資訊有變動
      summary.modified.push({
        fresh: newStation,
        current: station
      })
      return
    }
  })

  // 最後從新資料中比對出是否有新增的檢驗站
  newStations.forEach((newStation) => {
    if (!originalMap.has(newStation.id)) {
      summary.fresh.push(newStation)
    }
  })

  return summary
}

module.exports = { compareDifferent }
