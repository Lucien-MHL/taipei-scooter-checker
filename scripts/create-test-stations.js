#!/usr/bin/env node

/**
 * 建立測試用的stations.json檔案
 */

const { loadJSONFile, saveJSONFile } = require("./utils");
const { fetchTaipeiAPI } = require("./fetch-api-data");

async function createTestStations() {
  try {
    console.log("🧪 建立測試用 stations.json...");

    // 載入geocoding cache
    const cache = loadJSONFile("./data/geocoding-cache.json");
    if (!cache) {
      throw new Error("無法載入 geocoding cache");
    }

    console.log(`📦 已載入 ${Object.keys(cache).length} 筆 geocoded 資料`);

    // 獲取原始API資料
    const apiData = await fetchTaipeiAPI();
    const allStations = apiData.result.results;

    // 建立測試資料
    const testStations = [];
    let processedCount = 0;

    for (const station of allStations) {
      const address = station["地址"];

      if (cache[address]) {
        const geocoded = cache[address];

        const stationData = {
          id: station["_id"] || `station_${processedCount}`,
          name: station["站名"],
          address: station["地址"],
          phone: station["電話"],
          district: station["行政區"],
          owner: station["負責人"],
          coordinates: {
            lat: geocoded.lat,
            lng: geocoded.lng,
          },
          geocoding: {
            source: geocoded.source,
            accuracy: geocoded.accuracy,
            geocoded_at: geocoded.geocoded_at,
          },
        };

        testStations.push(stationData);
        processedCount++;
      }
    }

    // 建立完整的資料結構
    const testData = {
      metadata: {
        total_stations: allStations.length,
        successful_geocoding: testStations.length,
        failed_geocoding: 0,
        processing_time_ms: 0,
        tgos_enabled: false,
        generated_at: new Date().toISOString(),
        note: "This is a test version with partial data",
      },
      stations: testStations,
    };

    // 儲存測試檔案
    const outputPath = "./data/test-stations.json";
    saveJSONFile(outputPath, testData);

    console.log(`✅ 測試資料已建立: ${outputPath}`);
    console.log(`📍 包含 ${testStations.length} 家檢驗站`);

    // 按行政區統計
    const districtStats = {};
    testStations.forEach((station) => {
      const district = station.district;
      districtStats[district] = (districtStats[district] || 0) + 1;
    });

    console.log("\n📊 行政區分布:");
    Object.entries(districtStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([district, count]) => {
        console.log(`  ${district}: ${count} 家`);
      });

    return testData;
  } catch (error) {
    console.error("❌ 建立測試資料失敗:", error.message);
    throw error;
  }
}

if (require.main === module) {
  createTestStations().catch((error) => {
    console.error("💥 程式執行失敗:", error.message);
    process.exit(1);
  });
}

module.exports = { createTestStations };
