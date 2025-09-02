#!/usr/bin/env node

/**
 * Geocoding 功能測試腳本
 * Test script for geocoding functionality
 */

const { GeocodingManager } = require("./geocode-stations");
const { fetchTaipeiAPI } = require("./fetch-api-data");

async function testGeocoding() {
  try {
    console.log("🧪 開始測試 Geocoding 功能...");

    // 獲取測試資料
    console.log("📡 獲取台北市檢驗站資料...");
    const apiData = await fetchTaipeiAPI();
    const allStations = apiData.result.results;

    // 只處理前5筆進行測試
    const testStations = allStations.slice(0, 5);
    console.log(`🔬 測試用途：處理前 ${testStations.length} 筆資料\n`);

    const manager = new GeocodingManager();

    // 測試地址標準化和geocoding
    for (let i = 0; i < testStations.length; i++) {
      const station = testStations[i];
      const progress = `[${i + 1}/${testStations.length}]`;

      console.log(`${progress} 測試: ${station["站名"]}`);
      console.log(`   地址: ${station["地址"]}`);

      try {
        const result = await manager.geocodeAddress(station["地址"], station);
        console.log(
          `   ✅ 成功: ${result.source} - ${result.lat}, ${result.lng}`,
        );
        console.log(`   📍 標準化地址: ${result.address}`);
        console.log(`   🏘️  行政區: ${result.district}\n`);
      } catch (error) {
        console.error(`   ❌ 失敗: ${error.message}\n`);
      }
    }

    // 儲存快取
    manager.saveCache();
    console.log("🎉 測試完成！");
  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testGeocoding();
}

module.exports = { testGeocoding };
