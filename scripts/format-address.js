const formatAddress = (station) => {
  const { address, district } = station
  if (!address || typeof address !== 'string') return null
  if (!district || typeof district !== 'string') return null

  const normalized = {
    city: '臺北市', // 固定值
    district, // 優先使用API提供的district
    street: null,
    houseNumber: null
  }

  // 移除district以前(含)，取得剩餘部分
  const regex = new RegExp(`^.*?${district}`)
  const remaining = address.replace(regex, '').trim()

  // 提取門牌號碼 (處理複雜門牌格式: 並列、子門牌、樓層等)
  const houseNumberPatterns = [
    /(\d+(?:-\d+)?、\d+(?:-\d+)?(?:、\d+(?:-\d+)?)*號(?:\d*樓)?)$/, // 並列門牌: 130-1、130-2號, 36、38號, 12、14、16號
    /(\d+(?:之\d+|-\d+)?號(?:\d*樓)?)$/ // 一般門牌: 241號, 128之1號, 28-1號, 204號1樓
  ]

  let houseNumberMatch = null
  for (const pattern of houseNumberPatterns) {
    houseNumberMatch = remaining.match(pattern)
    if (houseNumberMatch) break
  }

  if (houseNumberMatch) {
    const rawHouseNumber = houseNumberMatch[1]
    normalized.houseNumber = standardizeHouseNumber(rawHouseNumber)
    normalized.street = remaining.replace(houseNumberMatch[0], '').trim()
  } else {
    // 沒找到門牌號的 fallback 處理
    normalized.street = remaining
    normalized.houseNumber = null
  }

  const parts = Object.values(normalized).filter(
    (part) => part !== null && part.trim()
  )
  return parts.join(', ')
}

const standardizeHouseNumber = (houseNumber) => {
  if (!houseNumber || typeof houseNumber !== 'string') return null

  let standardized = houseNumber.trim()

  // 1. 移除樓層資訊 ("xx號1樓" → "xx號")
  standardized = standardized.replace(/(\d+號)\d*樓$/, '$1')

  // 2. 處理並列門牌 - 優化策略 ("130-1、130-2號" → "130號")
  const multipleHouseMatch = standardized.match(
    /(\d+(?:-\d+)?)、(\d+(?:-\d+)?)號/
  )

  if (multipleHouseMatch) {
    const firstHouseNumber = multipleHouseMatch[1].replace(/-/g, '之')
    standardized = `${firstHouseNumber}號`
  }

  // 3. 子門牌號碼 - 優化策略 ("128之1號" → "128號" 、 "28-1號" → "28號")
  const subHouseNumberMatch = standardized.match(/(\d+(?:之\d+|-\d+)?)號/)
  if (subHouseNumberMatch) {
    const firstHouseNumber = subHouseNumberMatch[1].replace(/-/g, '之')
    standardized = `${firstHouseNumber}號`
  }

  return standardized
}

module.exports = {
  formatAddress
}
