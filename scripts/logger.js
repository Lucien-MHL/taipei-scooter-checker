const fs = require('fs')
const path = require('path')

class Logger {
  constructor() {
    this.logFile = path.join(
      __dirname,
      '../logs',
      `geocoding-${new Date().toISOString().split('T')[0]}.log`
    )
    this.ensureLogDir()
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile)
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${level}: ${message}`
    const fullEntry = data
      ? `${logEntry}\n${JSON.stringify(data, null, 2)}`
      : logEntry

    // Console output
    console.log(message)

    // File output
    fs.appendFileSync(this.logFile, fullEntry + '\n')
  }

  info(message, data) {
    this.log('INFO', message, data)
  }

  error(message, data) {
    this.log('ERROR', message, data)
    console.error(message)
  }

  success(message, data) {
    this.log('SUCCESS', message, data)
  }

  warning(message, data) {
    this.log('WARNING', message, data)
  }

  summary(stats) {
    const summaryMessage = `
📊 執行完成統計:
  - 需要geocoding: ${stats.total}筆
  - 成功: ${stats.success}筆 (${((stats.success / stats.total) * 100).toFixed(1)}%)
  - 失敗: ${stats.failed}筆 (${((stats.failed / stats.total) * 100).toFixed(1)}%)
  - 需手動處理的站點: ${stats.failedStations.length}家
    `

    this.info(summaryMessage, {
      stats,
      failedStations: stats.failedStations
    })

    if (stats.failedStations.length > 0) {
      this.warning('\n❌ 需要手動處理的檢驗站:')
      stats.failedStations.forEach((station) => {
        this.warning(`  - ${station.id}: ${station.name} (${station.address})`)
      })
    }
  }
}

module.exports = { Logger }
