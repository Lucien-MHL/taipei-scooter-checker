#!/usr/bin/env node

/**
 * 測試新的逗號分隔geocoding邏輯
 * Test new comma-separated geocoding logic based on user discoveries
 */

const {
  normalizeAddress,
  parseAddressComponents,
  standardizeHouseNumber,
} = require("./utils");

// 測試用的複雜地址 (基於真實檢驗站資料)
const testAddresses = [
  // 用戶發現的關鍵測試案例
  {
    original: "臺北市文山區興隆路2段241號",
    description: "用戶原始測試地址",
  },
  {
    original: "臺北市文山區忠順街1段36、38號",
    description: "並列門牌測試",
  },
  {
    original: "臺北市信義區莊敬路204號1樓",
    description: "樓層移除測試",
  },
  // 更多複雜案例
  {
    original: "臺北市大安區和平東路2段128之1號",
    description: "子門牌保留測試",
  },
  {
    original: "臺北市松山區八德路4段28-1號",
    description: "連字號子門牌測試",
  },
  {
    original: "臺北市中山區民生東路2段100巷2弄5號",
    description: "巷弄完整測試",
  },
  {
    original: "臺北市大同區承德路3段12、14、16號",
    description: "多重並列門牌測試",
  },
];

console.log("🧪 測試新的地址處理邏輯\n");

// 測試函數功能
function testAddressComponents() {
  console.log("📋 測試地址組件分離功能：\n");

  testAddresses.forEach((test, index) => {
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   原始: "${test.original}"`);

    // 解析地址組件
    const components = parseAddressComponents(test.original);
    console.log(
      `   解析: 城市="${components.city}" | 區域="${components.district}" | 街道="${components.street}" | 門牌="${components.houseNumber}"`,
    );

    // 生成Nominatim格式
    const nominatimFormat = normalizeAddress(test.original, true);
    console.log(`   逗號格式: "${nominatimFormat}"`);
    console.log("");
  });
}

// 測試門牌標準化
function testHouseNumberStandardization() {
  console.log("🏠 測試門牌標準化功能：\n");

  const houseNumberTests = [
    "204號1樓",
    "36、38號",
    "128之1號",
    "28-1號",
    "12、14、16號",
  ];

  houseNumberTests.forEach((houseNumber, index) => {
    const standardized = standardizeHouseNumber(houseNumber);
    console.log(`${index + 1}. "${houseNumber}" → "${standardized}"`);
  });

  console.log("");
}

async function runTest() {
  try {
    testHouseNumberStandardization();
    testAddressComponents();

    console.log("✅ 所有測試完成！準備進行實際Geocoding測試...\n");

    // 建議下一步
    console.log("🚀 下一步建議：");
    console.log("1. 使用 node scripts/geocode-stations.js 進行完整批次處理");
    console.log("2. 或先測試幾個地址: node scripts/test-geocoding.js");
  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  runTest();
}

module.exports = { testAddresses };
