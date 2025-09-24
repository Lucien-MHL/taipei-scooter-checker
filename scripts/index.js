/**
 * github corn jobs 運行用腳本
 * 負責每個月更新檢驗站的資料
 * 以避免資料過舊導致內容錯誤
 */

const { getStations, translateKeys } = require('./get-stations')
const { compareDifferent } = require('./compare-different')
const { formatAddress } = require('./format-address')
const { geocoding } = require('./geocoding')
const { saveStationsData, PATHS } = require('./save-data')
const { Logger } = require('./logger')

async function main() {
  const logger = new Logger()

  // Step 1: 獲取檢驗站資料
  let stations = null
  try {
    stations = await getStations()
    console.log('Step 1: ✅ 檢驗站資料獲取成功, 共', stations.length, '筆')
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
  const translatedStations = stations.reduce((arr, cur) => {
    if (!cur) return arr
    return [...arr, translateKeys(cur)]
  }, [])
  console.log('Step 2: ✅ ', translatedStations.length, '筆檢驗站資料轉換成功')

  // Step 3: 比對新資料與舊資料
  let compareResult = null
  try {
    compareResult = compareDifferent(translatedStations)
    console.log('Step 3: ✅ 比對完成')
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
  const geocodingResults = []

  let successCount = 0
  let failedCount = 0
  const failedStations = []

  if (needsGeocoding.length > 0) {
    logger.info(`開始處理 ${needsGeocoding.length} 個需要geocoding的檢驗站`)

    // Step 4-1: 逐一座標化檢驗站資料，並將座標化成功的檢驗站逐一更新進 station 中
    for (let index = 0; index < needsGeocoding.length; index++) {
      const station = needsGeocoding[index]
      const progress = `[${index + 1}/${needsGeocoding.length}]`

      logger.info(`${progress} ${station.id} - ${station.name} starting...`)
      const result = await geocoding(formatAddress(station))

      if (!result.coordinates) {
        failedCount++
        failedStations.push({
          id: station.id,
          name: station.name,
          address: station.address
        })
        logger.warning(
          `${progress} ${station.id} - ${station.name} ❌ geocoding失敗，需要手動處理`
        )
      } else {
        successCount++
        logger.success(`${progress} ${station.id} - ${station.name} ✅ done`)
      }
      geocodingResults.push({ ...station, ...result })

      // Rate limiting: 最後一個不需要等待
      if (index < needsGeocoding.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // 輸出統計結果
    logger.summary({
      total: needsGeocoding.length,
      success: successCount,
      failed: failedCount,
      failedStations
    })
  }

  // Step 5: 將分散的資料合併處理
  const processedData = [
    ...compareResult.unchanged,
    ...geocodingResults,
    ...compareResult.modified.map(({ fresh, current }) => ({
      ...current,
      ...fresh
    }))
  ]

  // Step 6: 保存更新後的資料
  try {
    const isDevelopment =
      process.env.NODE_ENV === 'development' || process.argv.includes('--dev')
    const outputPath = isDevelopment ? PATHS.DEVELOPMENT : PATHS.PRODUCTION

    console.log(`📍 儲存路徑: ${outputPath}`)
    console.log(`🔧 模式: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`)

    saveStationsData(processedData, outputPath)
    console.log('✅ 資料更新完成')
  } catch (error) {
    console.error('❌ 資料保存失敗:', error.message)
  }
}

main().catch(console.error)
