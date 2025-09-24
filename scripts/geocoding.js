const https = require('https')

const CONFIG = {
  baseUrl: 'https://nominatim.openstreetmap.org/search',
  userAgent: 'taipei-scooter-checker/1.0 (dev@example.com)'
}

const failedGeocoding = {
  coordinates: null,
  geocoding: {
    source: 'failed'
  }
}

const geocoding = (address) => {
  const headers = {
    'User-Agent': CONFIG.userAgent
  }
  const params = new URLSearchParams({
    q: address,
    format: 'json',
    addressdetails: '1',
    limit: '1',
    countrycodes: 'tw'
  })
  const url = `${CONFIG.baseUrl}?${params}`

  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        try {
          const result = JSON.parse(data)

          if (!result || result.length !== 1) return resolve(failedGeocoding)

          const location = result[0]
          const lat = parseFloat(location.lat)
          const lng = parseFloat(location.lon)

          if (!lat || !lng) return resolve(failedGeocoding)

          resolve({
            coordinates: {
              lat,
              lng
            },
            geocoding: {
              source: 'Nominatim',
              accuracy: location.importance || 'unknown',
              geocoded_at: new Date()
            }
          })
        } catch (error) {
          reject(
            new Error(`Nominatim response parsing error: ${error.message}`)
          )
        }
      })
    })

    request.on('error', (error) => {
      reject(new Error(`Nominatim request error: ${error.message}`))
    })

    // 設置超時
    request.setTimeout(10000, () => {
      request.destroy()
      reject(new Error('Nominatim request timeout'))
    })
  })
}

module.exports = { geocoding }
