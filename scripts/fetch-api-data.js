#!/usr/bin/env node

/**
 * 台北市機車檢驗站 API 資料測試腳本
 * Test script for Taipei City scooter inspection station API
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const API_URL =
  "https://data.taipei/api/v1/dataset/5fce41d6-f48f-4190-9ba4-c9cf0b2db426?scope=resourceAquire&limit=1000";

async function fetchTaipeiAPI() {
  return new Promise((resolve, reject) => {
    console.log("🔍 正在獲取台北市機車檢驗站資料...");
    console.log("📡 API URL:", API_URL);

    https
      .get(API_URL, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`JSON 解析錯誤: ${error.message}`));
          }
        });
      })
      .on("error", (error) => {
        reject(new Error(`API 請求錯誤: ${error.message}`));
      });
  });
}

function analyzeData(data) {
  console.log("\n📊 資料分析結果:");
  console.log("=".repeat(50));

  // Debug: 先檢查實際的資料結構
  console.log("🔍 API 回傳資料結構:", typeof data);
  console.log("🔍 頂層屬性:", Object.keys(data));

  if (typeof data === "object") {
    console.log("🔍 詳細結構:");
    for (const [key, value] of Object.entries(data)) {
      console.log(
        `  - ${key}:`,
        typeof value,
        Array.isArray(value) ? `(陣列長度: ${value.length})` : "",
      );

      // 如果是result物件，進一步檢查其內容
      if (
        key === "result" &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        console.log("🔍 result 物件內容:");
        console.log("   屬性:", Object.keys(value));
        for (const [resultKey, resultValue] of Object.entries(value)) {
          console.log(
            `     - ${resultKey}:`,
            typeof resultValue,
            Array.isArray(resultValue)
              ? `(陣列長度: ${resultValue.length})`
              : "",
          );
        }
      }
    }
  }

  // 嘗試不同的可能屬性名稱
  let stations = null;
  if (
    data.result &&
    data.result.results &&
    Array.isArray(data.result.results)
  ) {
    stations = data.result.results;
    console.log("✅ 使用 data.result.results");
  } else if (data.result && Array.isArray(data.result)) {
    stations = data.result;
    console.log("✅ 使用 data.result");
  } else if (data.data && Array.isArray(data.data)) {
    stations = data.data;
    console.log("✅ 使用 data.data");
  } else if (Array.isArray(data)) {
    stations = data;
    console.log("✅ 直接使用 data 陣列");
  } else {
    console.log("❌ 無效的資料格式");
    return null;
  }
  console.log(`📍 總店家數量: ${stations.length} 家`);

  // 分析地址格式
  const addressFormats = new Set();
  const districts = new Set();
  const requiredFields = ["站名", "地址", "電話", "行政區"];
  const fieldCoverage = {};

  requiredFields.forEach((field) => {
    fieldCoverage[field] = 0;
  });

  stations.forEach((station, index) => {
    // 檢查必要欄位完整性
    requiredFields.forEach((field) => {
      if (station[field] && station[field].trim()) {
        fieldCoverage[field]++;
      }
    });

    // 分析地址格式
    if (station["地址"]) {
      const address = station["地址"].trim();
      addressFormats.add(address.substring(0, 6)); // 前6個字符 (通常是"臺北市XX區")

      if (station["行政區"]) {
        districts.add(station["行政區"]);
      }
    }
  });

  console.log("\n📋 欄位完整性分析:");
  requiredFields.forEach((field) => {
    const coverage = ((fieldCoverage[field] / stations.length) * 100).toFixed(
      1,
    );
    const status = coverage > 95 ? "✅" : coverage > 80 ? "⚠️" : "❌";
    console.log(
      `  ${status} ${field}: ${fieldCoverage[field]}/${stations.length} (${coverage}%)`,
    );
  });

  console.log(`\n🏘️  行政區分布: ${districts.size} 個區`);
  console.log("   ", Array.from(districts).sort().join(", "));

  console.log(`\n📮 地址格式類型: ${addressFormats.size} 種`);
  Array.from(addressFormats)
    .sort()
    .slice(0, 5)
    .forEach((format) => {
      console.log(`    ${format}...`);
    });

  return {
    totalStations: stations.length,
    fieldCoverage,
    districts: Array.from(districts).sort(),
    sampleStations: stations.slice(0, 3), // 前3筆作為樣本
  };
}

function saveSampleData(analysisResult, rawData) {
  const outputPath = path.join(__dirname, "../data/api-test-result.json");

  const testResult = {
    timestamp: new Date().toISOString(),
    apiUrl: API_URL,
    analysis: analysisResult,
    sampleData:
      rawData.result && rawData.result.results
        ? rawData.result.results.slice(0, 5)
        : [], // 保存前5筆樣本
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(testResult, null, 2), "utf8");
    console.log(`\n💾 測試結果已保存至: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ 保存測試結果失敗: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    console.log("🚀 開始測試台北市機車檢驗站 API");
    console.log("⏰ 時間:", new Date().toLocaleString("zh-TW"));

    const rawData = await fetchTaipeiAPI();
    const analysisResult = analyzeData(rawData);

    if (analysisResult) {
      const saved = saveSampleData(analysisResult, rawData);

      console.log("\n🎉 API 測試完成!");
      console.log(`✅ 資料獲取: 成功`);
      console.log(`✅ 資料分析: 完成 (${analysisResult.totalStations} 筆資料)`);
      console.log(`✅ 結果保存: ${saved ? "成功" : "失敗"}`);

      // 檢查是否適合進行 geocoding
      const addressCoverage =
        (analysisResult.fieldCoverage["地址"] / analysisResult.totalStations) *
        100;
      if (addressCoverage > 95) {
        console.log("\n🎯 建議: 地址資料完整度高，適合進行 geocoding 處理");
      } else {
        console.log("\n⚠️  警告: 地址資料完整度較低，geocoding 前需要資料清理");
      }
    }
  } catch (error) {
    console.error("\n❌ API 測試失敗:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchTaipeiAPI, analyzeData };
