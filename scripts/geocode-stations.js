#!/usr/bin/env node

/**
 * 台北市機車檢驗站 Geocoding 服務
 * Taipei City scooter inspection station geocoding service
 */

const https = require('https')
const http = require('http')
const path = require('path')
const {
  normalizeAddress,
  isValidTaipeiAddress,
  extractDistrict,
  sleep,
  retryWithBackoff,
  isValidCoordinates,
  formatError,
  loadJSONFile,
  saveJSONFile
} = require('./utils')
const { fetchTaipeiAPI } = require('./fetch-api-data')
const { getApproximateCoordinates } = require('./district-coordinates')

// 設定檔 Configuration
const CONFIG = {
  TGOS: {
    enabled: false, // 需要APPID和APIKEY才能啟用
    appId: process.env.TGOS_APPID || null,
    apiKey: process.env.TGOS_APIKEY || null,
    baseUrl: 'https://addr.tgos.tw/addrws/v40/QueryAddr.asmx/QueryAddr'
  },
  NOMINATIM: {
    enabled: true,
    baseUrl: 'https://nominatim.openstreetmap.org/search',
    rateLimit: 1000, // 1 second between requests
    userAgent: 'taipei-scooter-checker/1.0 (dev@example.com)'
  },
  FILES: {
    stationsOutput: path.join(__dirname, '../data/stations.json'),
    cacheFile: path.join(__dirname, '../data/geocoding-cache.json'),
    errorLog: path.join(__dirname, '../data/geocoding-errors.json')
  }
}

/**
 * TGOS Geocoding 服務
 * TGOS Geocoding Service
 */
class TGOSGeocoder {
  constructor(appId, apiKey) {
    this.appId = appId
    this.apiKey = apiKey
    this.enabled = !!(appId && apiKey)
  }

  async geocode(address) {
    if (!this.enabled) {
      throw new Error('TGOS service not enabled - missing APPID or APIKEY')
    }

    const normalizedAddress = normalizeAddress(address)
    if (!normalizedAddress) {
      throw new Error('Invalid address format')
    }

    const queryParams = new URLSearchParams({
      oAPPId: this.appId,
      oAPIKey: this.apiKey,
      oAddress: normalizedAddress,
      oSRS: 'EPSG:4326', // WGS84 coordinate system
      oFuzzyType: '2',
      oResultDataType: 'JSON',
      oReturnMaxCount: '1'
    })

    const url = `${CONFIG.TGOS.baseUrl}?${queryParams}`

    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = ''

          res.on('data', (chunk) => {
            console.log(chunk)
            data += chunk
          })

          res.on('end', () => {
            try {
              const result = JSON.parse(data)

              // 解析TGOS回應格式
              if (
                result &&
                result.AddressList &&
                result.AddressList.length > 0
              ) {
                const location = result.AddressList[0]
                const lat = parseFloat(location.Y)
                const lng = parseFloat(location.X)

                if (isValidCoordinates(lat, lng)) {
                  resolve({
                    lat,
                    lng,
                    formatted_address: location.FULL_ADDR || normalizedAddress,
                    source: 'TGOS',
                    accuracy: location.SIMILARITY || 'unknown'
                  })
                } else {
                  reject(new Error('Invalid coordinates from TGOS'))
                }
              } else {
                reject(new Error('No results from TGOS'))
              }
            } catch (error) {
              reject(new Error(`TGOS response parsing error: ${error.message}`))
            }
          })
        })
        .on('error', (error) => {
          reject(new Error(`TGOS request error: ${error.message}`))
        })
    })
  }
}

/**
 * Nominatim Geocoding 服務
 * Nominatim Geocoding Service
 */
class NominatimGeocoder {
  constructor() {
    this.lastRequestTime = 0
  }

  async geocode(address) {
    // Rate limiting
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < CONFIG.NOMINATIM.rateLimit) {
      const waitTime = CONFIG.NOMINATIM.rateLimit - timeSinceLastRequest
      console.log(`⏱️  Rate limiting: 等待 ${waitTime}ms`)
      await sleep(waitTime)
    }

    // 嘗試多種地址格式
    const normalizedAddress = normalizeAddress(address)
    const nominatimAddress = normalizeAddress(address, true)

    if (!normalizedAddress) {
      throw new Error('Invalid address format')
    }

    // 先嘗試英文格式
    let queryParams = new URLSearchParams({
      q: nominatimAddress,
      format: 'json',
      addressdetails: '1',
      limit: '1',
      countrycodes: 'tw'
    })

    const url = `${CONFIG.NOMINATIM.baseUrl}?${queryParams}`
    this.lastRequestTime = Date.now()

    return new Promise((resolve, reject) => {
      const request = https.get(
        url,
        {
          headers: {
            'User-Agent': CONFIG.NOMINATIM.userAgent
          }
        },
        (res) => {
          let data = ''

          res.on('data', (chunk) => {
            data += chunk
          })

          res.on('end', () => {
            try {
              const results = JSON.parse(data)

              if (results && results.length > 0) {
                const location = results[0]
                const lat = parseFloat(location.lat)
                const lng = parseFloat(location.lon)

                if (isValidCoordinates(lat, lng)) {
                  resolve({
                    lat,
                    lng,
                    formatted_address: location.display_name,
                    source: 'Nominatim',
                    accuracy: location.importance || 'unknown'
                  })
                } else {
                  reject(new Error('Invalid coordinates from Nominatim'))
                }
              } else {
                reject(new Error('No results from Nominatim'))
              }
            } catch (error) {
              reject(
                new Error(`Nominatim response parsing error: ${error.message}`)
              )
            }
          })
        }
      )

      request.on('error', (error) => {
        reject(new Error(`Nominatim request error: ${error.message}`))
      })

      // 設置超時
      request.setTimeout(10000, () => {
        request.abort()
        reject(new Error('Nominatim request timeout'))
      })
    })
  }
}

/**
 * 主要的 Geocoding 管理器
 * Main Geocoding Manager
 */
class GeocodingManager {
  constructor() {
    this.tgosGeocoder = new TGOSGeocoder(CONFIG.TGOS.appId, CONFIG.TGOS.apiKey)
    this.nominatimGeocoder = new NominatimGeocoder()
    this.cache = this.loadCache()
    this.errors = []
  }

  loadCache() {
    const cacheData = loadJSONFile(CONFIG.FILES.cacheFile)
    return cacheData || {}
  }

  saveCache() {
    try {
      saveJSONFile(CONFIG.FILES.cacheFile, this.cache)
      console.log(`💾 快取已儲存: ${Object.keys(this.cache).length} 筆記錄`)
    } catch (error) {
      console.error('❌ 儲存快取失敗:', error.message)
    }
  }

  async geocodeAddress(address, stationInfo = {}) {
    const normalizedAddress = normalizeAddress(address)
    if (!normalizedAddress) {
      throw new Error(`無效的地址格式: ${address}`)
    }

    // 檢查快取
    if (this.cache[normalizedAddress]) {
      console.log(`📦 快取命中: ${normalizedAddress}`)
      return this.cache[normalizedAddress]
    }

    const { 站名: stationName = 'Unknown' } = stationInfo
    console.log(`🔍 正在處理: ${stationName} - ${normalizedAddress}`)

    let result = null
    let errors = []

    // 1. 嘗試使用 TGOS (如果已設定)
    if (this.tgosGeocoder.enabled) {
      try {
        console.log('   📍 嘗試 TGOS...')
        result = await retryWithBackoff(() =>
          this.tgosGeocoder.geocode(normalizedAddress)
        )
        console.log(`   ✅ TGOS 成功: ${result.lat}, ${result.lng}`)
      } catch (error) {
        errors.push(formatError(error, 'TGOS'))
        console.log(`   ❌ TGOS 失敗: ${error.message}`)
      }
    }

    // 2. 備援使用 Nominatim
    if (!result) {
      try {
        console.log('   📍 嘗試 Nominatim...')
        result = await retryWithBackoff(() =>
          this.nominatimGeocoder.geocode(normalizedAddress)
        )
        console.log(`   ✅ Nominatim 成功: ${result.lat}, ${result.lng}`)
      } catch (error) {
        errors.push(formatError(error, 'Nominatim'))
        console.log(`   ❌ Nominatim 失敗: ${error.message}`)
      }
    }

    // 3. 最後備援：使用行政區中心座標
    if (!result) {
      try {
        console.log('   📍 使用行政區備援座標...')
        const district =
          extractDistrict(normalizedAddress) || stationInfo['行政區']

        if (district) {
          const approximateCoords = getApproximateCoordinates(
            normalizedAddress,
            district
          )

          result = {
            lat: approximateCoords.lat,
            lng: approximateCoords.lng,
            formatted_address: normalizedAddress,
            source: 'district_fallback',
            accuracy: approximateCoords.accuracy
          }

          console.log(
            `   ✅ 行政區備援成功: ${district} - ${result.lat}, ${result.lng}`
          )
        }
      } catch (error) {
        errors.push(formatError(error, 'District_Fallback'))
        console.log(`   ❌ 行政區備援失敗: ${error.message}`)
      }
    }

    // 4. 記錄結果
    if (result) {
      // 加入額外資訊
      result.address = normalizedAddress
      result.station_name = stationName
      result.district =
        extractDistrict(normalizedAddress) || stationInfo['行政區']
      result.geocoded_at = new Date().toISOString()

      // 存入快取
      this.cache[normalizedAddress] = result

      return result
    } else {
      // 記錄錯誤
      const errorRecord = {
        address: normalizedAddress,
        station_name: stationName,
        errors: errors,
        failed_at: new Date().toISOString()
      }

      this.errors.push(errorRecord)
      throw new Error(`所有 geocoding 服務都失敗: ${normalizedAddress}`)
    }
  }

  async processAllStations() {
    try {
      console.log('🚀 開始 geocoding 所有檢驗站...')
      console.log(
        `⚙️  設定: TGOS ${this.tgosGeocoder.enabled ? '啟用' : '停用'}, Nominatim 啟用`
      )

      // 獲取台北市API資料
      console.log('📡 獲取台北市檢驗站資料...')
      const apiData = await fetchTaipeiAPI()
      const stations = apiData.result.results

      console.log(`📍 共 ${stations.length} 家檢驗站需要處理`)
      console.log(`💾 快取中已有 ${Object.keys(this.cache).length} 筆記錄\n`)

      const results = []
      const startTime = Date.now()

      for (let i = 0; i < stations.length; i++) {
        const station = stations[i]
        const progress = `[${i + 1}/${stations.length}]`

        try {
          const geocoded = await this.geocodeAddress(station['地址'], station)

          // 建立完整的檢驗站資料
          const stationData = {
            id: station['_id'] || `station_${i}`,
            name: station['站名'],
            address: station['地址'],
            phone: station['電話'],
            district: station['行政區'],
            owner: station['負責人'],
            coordinates: {
              lat: geocoded.lat,
              lng: geocoded.lng
            },
            geocoding: {
              source: geocoded.source,
              accuracy: geocoded.accuracy,
              geocoded_at: geocoded.geocoded_at
            }
          }

          results.push(stationData)
          console.log(`${progress} ✅ ${station['站名']} - ${geocoded.source}`)
        } catch (error) {
          console.error(`${progress} ❌ ${station['站名']}: ${error.message}`)
        }

        // 定期儲存快取
        if ((i + 1) % 10 === 0) {
          this.saveCache()
        }
      }

      // 最終儲存
      this.saveCache()

      // 儲存結果
      const finalData = {
        metadata: {
          total_stations: stations.length,
          successful_geocoding: results.length,
          failed_geocoding: this.errors.length,
          processing_time_ms: Date.now() - startTime,
          tgos_enabled: this.tgosGeocoder.enabled,
          generated_at: new Date().toISOString()
        },
        stations: results
      }

      saveJSONFile(CONFIG.FILES.stationsOutput, finalData)
      console.log(`\n🎉 處理完成!`)
      console.log(`✅ 成功: ${results.length} 家`)
      console.log(`❌ 失敗: ${this.errors.length} 家`)
      console.log(`💾 結果已儲存至: ${CONFIG.FILES.stationsOutput}`)

      // 儲存錯誤記錄
      if (this.errors.length > 0) {
        saveJSONFile(CONFIG.FILES.errorLog, this.errors)
        console.log(`📝 錯誤記錄已儲存至: ${CONFIG.FILES.errorLog}`)
      }

      return finalData
    } catch (error) {
      console.error('❌ Geocoding 處理失敗:', error.message)
      throw error
    }
  }
}

async function main() {
  // 檢查環境變數
  if (process.env.TGOS_APPID && process.env.TGOS_APIKEY) {
    console.log('✅ 偵測到 TGOS 憑證，將啟用 TGOS 服務')
    CONFIG.TGOS.enabled = true
  } else {
    console.log('⚠️  未偵測到 TGOS 憑證，僅使用 Nominatim 服務')
    console.log('   設定環境變數 TGOS_APPID 和 TGOS_APIKEY 以啟用 TGOS')
  }

  const manager = new GeocodingManager()
  await manager.processAllStations()
}

if (require.main === module) {
  main().catch((error) => {
    console.error('💥 程式執行失敗:', error.message)
    process.exit(1)
  })
}

module.exports = { GeocodingManager, TGOSGeocoder, NominatimGeocoder }
