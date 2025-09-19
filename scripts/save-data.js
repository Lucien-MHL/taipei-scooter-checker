/**
 * 保存檢驗站資料到指定檔案
 */

const fs = require('fs')
const path = require('path')

// 檔案路徑常數
const PATHS = {
  DEVELOPMENT: path.join(__dirname, '../data/stations.json'),
  PRODUCTION: path.join(__dirname, '../public/data/stations.json')
}

const saveStationsData = (
  stations,
  outputPath = PATHS.DEVELOPMENT,
  createBackup = true
) => {
  try {
    // 1. 資料驗證
    if (!Array.isArray(stations) || stations.length === 0) {
      throw new Error('stations 資料格式不正確或為空')
    }

    // 2. 確保目錄存在
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // 3. 建立備份 (如果檔案存在)
    if (createBackup && fs.existsSync(outputPath)) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const backupPath = `${outputPath}.backup-${timestamp}`
      fs.copyFileSync(outputPath, backupPath)
      console.log(`📄 備份檔案已建立: ${backupPath}`)
    }

    // 4. 準備最終資料格式
    const finalData = {
      metadata: {
        total: stations.length,
        updated_at: new Date().toISOString()
      },
      stations: stations
    }

    // 5. 儲存檔案
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8')

    console.log(`✅ 資料已保存: ${outputPath} (${stations.length} 筆)`)
    return true
  } catch (error) {
    console.error(`❌ 保存檔案失敗: ${error.message}`)
    throw error
  }
}

module.exports = {
  saveStationsData,
  PATHS
}
