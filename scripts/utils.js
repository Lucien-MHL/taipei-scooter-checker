/**
 * 地址處理和工具函數
 * Address processing and utility functions
 */

/**
 * 標準化台灣地址格式
 * Standardize Taiwan address format
 */
function normalizeAddress(address, forNominatim = false) {
  if (!address || typeof address !== "string") {
    return null;
  }

  let normalized = address.trim();

  // 1. 統一繁簡體字
  const tradSimplifiedMap = {
    台北市: "臺北市",
    台北: "臺北",
    台: "臺",
  };

  Object.entries(tradSimplifiedMap).forEach(([simplified, traditional]) => {
    normalized = normalized.replace(new RegExp(simplified, "g"), traditional);
  });

  // 2. 統一全半形數字和符號
  const fullWidthMap = {
    "０": "0",
    "１": "1",
    "２": "2",
    "３": "3",
    "４": "4",
    "５": "5",
    "６": "6",
    "７": "7",
    "８": "8",
    "９": "9",
    "－": "-",
    號: "號",
  };

  Object.entries(fullWidthMap).forEach(([fullWidth, halfWidth]) => {
    normalized = normalized.replace(new RegExp(fullWidth, "g"), halfWidth);
  });

  // 3. 確保臺北市開頭
  if (!normalized.startsWith("臺北市")) {
    if (normalized.startsWith("北市")) {
      normalized = "臺北市" + normalized.substring(2);
    } else if (
      normalized.match(
        /^(中山區|中正區|信義區|內湖區|北投區|南港區|士林區|大同區|大安區|文山區|松山區|萬華區)/,
      )
    ) {
      normalized = "臺北市" + normalized;
    }
  }

  // 4. Nominatim 專用格式化
  if (forNominatim) {
    // 轉換為更通用的格式
    const nominatimFormatted = normalized
      .replace("臺北市", "Taipei City, Taiwan")
      .replace("區", " District, ");

    return nominatimFormatted;
  }

  return normalized;
}

/**
 * 驗證台北市地址有效性
 * Validate Taipei address
 */
function isValidTaipeiAddress(address) {
  if (!address) return false;

  const normalized = normalizeAddress(address);
  if (!normalized) return false;

  // 檢查是否包含台北市行政區
  const taipeiDistricts = [
    "中山區",
    "中正區",
    "信義區",
    "內湖區",
    "北投區",
    "南港區",
    "士林區",
    "大同區",
    "大安區",
    "文山區",
    "松山區",
    "萬華區",
  ];

  const hasDistrict = taipeiDistricts.some((district) =>
    normalized.includes(district),
  );

  // 檢查是否有路名或街名
  const hasRoad = /[路街巷弄段]/.test(normalized);

  return hasDistrict && hasRoad;
}

/**
 * 提取地址中的行政區
 * Extract district from address
 */
function extractDistrict(address) {
  const normalized = normalizeAddress(address);
  if (!normalized) return null;

  const taipeiDistricts = [
    "中山區",
    "中正區",
    "信義區",
    "內湖區",
    "北投區",
    "南港區",
    "士林區",
    "大同區",
    "大安區",
    "文山區",
    "松山區",
    "萬華區",
  ];

  for (const district of taipeiDistricts) {
    if (normalized.includes(district)) {
      return district;
    }
  }

  return null;
}

/**
 * 睡眠函數 (用於rate limiting)
 * Sleep function for rate limiting
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重試機制包裝器
 * Retry mechanism wrapper
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // 指數退避算法 Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(
        `❌ 第 ${attempt} 次嘗試失敗，${delay}ms 後重試: ${error.message}`,
      );
      await sleep(delay);
    }
  }

  throw new Error(`重試 ${maxRetries} 次後依然失敗: ${lastError.message}`);
}

/**
 * 驗證座標有效性
 * Validate coordinates
 */
function isValidCoordinates(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return false;
  }

  // 台北市大致座標範圍 Rough coordinates range for Taipei
  // 緯度: 24.9°N - 25.3°N
  // 經度: 121.4°E - 121.7°E
  const isInTaipeiRange =
    lat >= 24.9 && lat <= 25.3 && lng >= 121.4 && lng <= 121.7;

  return isInTaipeiRange;
}

/**
 * 格式化錯誤訊息
 * Format error message
 */
function formatError(error, context = "") {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}] ` : "";

  return {
    timestamp,
    error: `${contextStr}${error.message}`,
    stack: error.stack,
  };
}

/**
 * 載入JSON檔案
 * Load JSON file with error handling
 */
function loadJSONFile(filePath) {
  const fs = require("fs");

  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`📄 檔案不存在，將建立新檔案: ${filePath}`);
      return null;
    }
    throw new Error(`載入JSON檔案失敗: ${error.message}`);
  }
}

/**
 * 儲存JSON檔案
 * Save JSON file with backup
 */
function saveJSONFile(filePath, data, createBackup = true) {
  const fs = require("fs");
  const path = require("path");

  try {
    // 建立備份
    if (createBackup && fs.existsSync(filePath)) {
      const backupPath = `${filePath}.backup`;
      fs.copyFileSync(filePath, backupPath);
    }

    // 確保目錄存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 儲存檔案
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    throw new Error(`儲存JSON檔案失敗: ${error.message}`);
  }
}

module.exports = {
  normalizeAddress,
  isValidTaipeiAddress,
  extractDistrict,
  sleep,
  retryWithBackoff,
  isValidCoordinates,
  formatError,
  loadJSONFile,
  saveJSONFile,
};
