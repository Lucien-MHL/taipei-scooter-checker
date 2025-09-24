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
  const findKey = (obj, patterns) => {
    for (const pattern of patterns) {
      const key = Object.keys(obj).find((k) => k.includes(pattern))
      if (key && obj[key]) return obj[key]
    }
    return null
  }
  const result = {
    id: findKey(station, ['站號', '號']),
    name: findKey(station, ['站名', '名']),
    address: findKey(station, ['地址', '地', '址']),
    phone: findKey(station, ['電話', '電', '話']),
    district: findKey(station, ['行政區', '行政', '行', '政']),
    owner: findKey(station, ['負責人', '負責', '人']),
    date: station['_importdate']['date'] || generateDate()
  }
  if (Object.values(result).some((value) => !value)) {
    console.log('該檢驗站資料不完整:', station)
    return null
  } else {
    return result
  }
}

const generateDate = () => {
  const pad = (num, size) => String(num).padStart(size, '0')
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

const demo = {
  站號: 'A12',
  廠牌: '山葉',
  站名: '宏立機車事業有限公司',
  行政區: '大安區',
  郵遞區號: '106025',
  地址: '臺北市大安區和平東路2段141號',
  電話: '(02)27065429',
  負責人: '沈鳳雲'
}
