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

  // 4. Nominatim 專用格式化 - 使用逗號分隔格式 (基於用戶突破性發現)
  if (forNominatim) {
    // 解析地址組件 - 使用新的分離器
    const addressComponents = parseAddressComponents(normalized);

    // 建構逗號分隔格式: "臺北市, 文山區, 興隆路2段, 241號"
    const parts = [
      addressComponents.city,
      addressComponents.district,
      addressComponents.street,
      addressComponents.houseNumber,
    ].filter((part) => part && part.trim()); // 移除空值和空白

    const commaFormat = parts.join(", ");
    console.log(`   🔍 地址轉換: "${normalized}" → "${commaFormat}"`);

    return commaFormat;
  }

  return normalized;
}

/**
 * 門牌標準化函數 (基於用戶實證研究)
 * Standardize house number based on user's empirical research
 */
function standardizeHouseNumber(houseNumber) {
  if (!houseNumber || typeof houseNumber !== "string") {
    return null;
  }

  let standardized = houseNumber.trim();

  // 1. 移除樓層資訊 ("204號1樓" → "204號")
  standardized = standardized.replace(/(\d+號)\d*樓$/, "$1");

  // 2. 處理並列門牌 ("36、38號" → "38號" - 取較大/後者)
  const multipleHouseMatch = standardized.match(/(\d+)、(\d+)號/);
  if (multipleHouseMatch) {
    const num1 = parseInt(multipleHouseMatch[1]);
    const num2 = parseInt(multipleHouseMatch[2]);
    const largerNum = Math.max(num1, num2);
    standardized = `${largerNum}號`;
  }

  // 3. 保留子門牌格式 ("128之1號", "28-1號" 維持不變)
  // 這些格式Nominatim能正確處理，不需修改

  return standardized;
}

/**
 * 地址組件分離器 (基於用戶發現的街道範圍)
 * Parse address components based on user's street range findings
 */
function parseAddressComponents(address, districtFromAPI = null) {
  if (!address) return {};

  const components = {
    city: "臺北市", // 固定值
    district: districtFromAPI || extractDistrict(address), // 優先使用API提供的行政區
    street: null,
    houseNumber: null,
  };

  // 移除城市和行政區，取得剩餘部分
  let remaining = address
    .replace("臺北市", "")
    .replace(components.district || "", "")
    .trim();

  // 提取門牌號碼 (處理複雜門牌格式: 並列、子門牌、樓層等)
  const houseNumberPatterns = [
    /(\d+、\d+(?:、\d+)*號(?:\d*樓)?)$/, // 並列門牌: 36、38號, 12、14、16號
    /(\d+(?:之\d+|-\d+)?號(?:\d*樓)?)$/, // 一般門牌: 241號, 128之1號, 28-1號, 204號1樓
  ];

  let houseNumberMatch = null;
  for (const pattern of houseNumberPatterns) {
    houseNumberMatch = remaining.match(pattern);
    if (houseNumberMatch) break;
  }

  if (houseNumberMatch) {
    const rawHouseNumber = houseNumberMatch[1];
    components.houseNumber = standardizeHouseNumber(rawHouseNumber);

    // 從剩餘部分移除門牌，得到街道部分
    components.street = remaining.replace(houseNumberMatch[0], "").trim();
  } else {
    // 如果沒有找到門牌，整個剩餘部分都是街道
    components.street = remaining;
  }

  return components;
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
  // 新增的地址處理函數 (基於用戶研究)
  standardizeHouseNumber,
  parseAddressComponents,
};
