/**
 * github corn jobs 運行用腳本
 * 負責每個月更新檢驗站的資料
 * 以避免資料過舊導致內容錯誤
 */

const { getStations, translateKeys } = require('./get-stations')
const { compareDifferent } = require('./compare-different')
const { geocoding } = require('./geocoding')
const { processData } = require('./process-data')
const { saveStationsData, PATHS } = require('./save-data')

async function main() {
  // Step 1: 獲取檢驗站資料
  let stations = null
  try {
    stations = await getStations()
  } catch (error) {
    console.error('檢驗站資料獲取失敗:', error.message)
    return
  }

  // Step 2: 將政府回傳的檢驗站資料做格式轉換
  if (!stations || !Array.isArray(stations)) {
    console.error('無效的檢驗站資料')
    console.error('stations:', stations)
    return
  }
  const translatedStations = stations.map(translateKeys)

  // Step 3: 比對新資料與舊資料
  let compareResult = null
  try {
    compareResult = compareDifferent(translatedStations)
  } catch (error) {
    console.error('比對失敗:', error.message)
    return
  }

  // Step 4: 檢查是否有需要座標化的資料
  if (!compareResult) {
    console.error('比對結果無效')
    console.error('compareResult:', compareResult)
    return
  }
  const { fresh, moved } = compareResult
  const needsGeocoding = [...fresh, ...moved]
  if (needsGeocoding.length > 0) {
    // Step 4-1: 逐一座標化檢驗站資料
    const geocodingResults = []
    for (let index = 0; index < needsGeocoding.length; index++) {
      const station = needsGeocoding[index]
      const progress = `[${index + 1}/${needsGeocoding.length}]`

      console.log(`${progress} ${station.id} - ${station.name}`)

      try {
        const result = await geocoding(station)
        geocodingResults.push(result)
        console.log(`${progress} ${station.id} - ${station.name} done`)
      } catch (error) {
        console.error(
          `${progress} ${station.id} - ${station.name} geocoding 失敗:`,
          error.message
        )
      }

      // Rate limiting: 最後一個不需要等待
      if (index < needsGeocoding.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Step 4-2: 將座標化成功的檢驗站逐一更新進 fresh、moved 資料
    geocodingResults.forEach((result) => {
      const freshStation = fresh.find((station) => station.id === result.id)
      if (freshStation) {
        Object.assign(freshStation, result)
      }

      const movedStation = moved.find((station) => station.id === result.id)
      if (movedStation) {
        Object.assign(movedStation, result)
      }
    })
  }

  // Step 5: 將分散的資料合併處理
  const processedData = processData(compareResult)

  // Step 6: 保存更新後的資料
  try {
    const path =
      process.env.NODE_ENV === 'development'
        ? PATHS.DEVELOPMENT
        : PATHS.PRODUCTION
    await saveStationsData(processedData, path)
    console.log('✅ 資料更新完成')
  } catch (error) {
    console.error('❌ 資料保存失敗:', error.message)
  }
}

main().catch(console.error)
