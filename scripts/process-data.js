/**
 *  處理檢驗站資料
 *  1. 保留 unchanged 的資料
 *  2. 更新 modified 的資料
 *  3. 新增 new 、 moved 的資料
 */

const processData = (results) => {
  const { modified, unchanged, moved, fresh } = results
  const stations = [...unchanged, ...moved, ...fresh]

  // 處理 modified 的資料
  modified.forEach(({ fresh, current }) => {
    stations.push({
      ...current,
      ...fresh
    })
  })

  return stations
}

module.exports = { processData }
