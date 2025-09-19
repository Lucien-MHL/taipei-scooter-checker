/**
 *  獲取台北市所有機車店家資訊，並將部分的欄位翻譯成英文
 */
const https = require('https')
const STATION_API_URL =
  'https://data.taipei/api/v1/dataset/5fce41d6-f48f-4190-9ba4-c9cf0b2db426?scope=resourceAquire&limit=1000'

const getStations = async () => {
  return new Promise((resolve, reject) => {
    https
      .get(STATION_API_URL, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data)
            if (
              !jsonData.result?.results ||
              !Array.isArray(jsonData.result.results)
            ) {
              reject(new Error('API 回應格式錯誤'))
              return
            }
            resolve(jsonData.result.results)
          } catch (error) {
            reject(new Error(`JSON 解析錯誤: ${error.message}`))
          }
        })
      })
      .setTimeout(10000, () => {
        reject(new Error('API 請求超時'))
      })
      .on('error', (error) => {
        reject(new Error(`API 請求錯誤: ${error.message}`))
      })
  })
}

const translateKeys = (station) => {
  const result = {
    id: station['站號'],
    name: station['站名'],
    address: station['地址'],
    phone: station['電話'],
    district: station['行政區'],
    owner: station['負責人'],
    date: station['_importdate']['date'] || generateDate()
  }
  if (Object.values(result).some((value) => !value)) {
    return null
  } else {
    return result
  }
}

const pad = (num, size) => {
  return String(num).padStart(size, '0')
}

const generateDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = pad(now.getMonth() + 1, 2)
  const day = pad(now.getDate(), 2)
  const hour = pad(now.getHours(), 2)
  const minute = pad(now.getMinutes(), 2)
  const second = pad(now.getSeconds(), 2)
  const ms = pad(now.getMilliseconds(), 3)
  return `${year}-${month}-${day} ${hour}:${minute}:${second}.${ms}`
}

module.exports = {
  getStations,
  translateKeys
}
