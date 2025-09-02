#!/usr/bin/env node

/**
 * Nominatim API Debug 腳本
 */

const https = require("https");
const { normalizeAddress } = require("./utils");

async function debugNominatim(address) {
  const testAddresses = [
    address,
    normalizeAddress(address),
    normalizeAddress(address, true),
    "Taipei, Taiwan",
    "台北市大安區和平東路2段141號",
    "Daan District, Taipei City, Taiwan",
  ];

  for (const testAddr of testAddresses) {
    console.log(`\n🔍 測試地址: ${testAddr}`);

    const queryParams = new URLSearchParams({
      q: testAddr,
      format: "json",
      addressdetails: "1",
      limit: "3",
    });

    const url = `https://nominatim.openstreetmap.org/search?${queryParams}`;
    console.log(`📡 URL: ${url}`);

    try {
      const response = await makeRequest(url);
      console.log(`✅ 回應狀態: ${response.length} 筆結果`);

      if (response.length > 0) {
        response.forEach((result, index) => {
          console.log(`   結果 ${index + 1}:`);
          console.log(`     地址: ${result.display_name}`);
          console.log(`     座標: ${result.lat}, ${result.lon}`);
          console.log(`     類型: ${result.type || "unknown"}`);
        });
        break; // 找到結果就停止
      } else {
        console.log(`❌ 無結果`);
      }

      // Rate limiting
      await sleep(1000);
    } catch (error) {
      console.log(`❌ 錯誤: ${error.message}`);
    }
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "taipei-scooter-checker/1.0 (debug@example.com)",
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const results = JSON.parse(data);
            resolve(results);
          } catch (error) {
            reject(new Error(`JSON parsing error: ${error.message}`));
          }
        });
      },
    );

    request.on("error", (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });

    request.setTimeout(10000, () => {
      request.abort();
      reject(new Error("Request timeout"));
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const testAddress = process.argv[2] || "臺北市大安區和平東路2段141號";
  console.log(`🚀 Debug Nominatim API`);
  console.log(`🎯 測試地址: ${testAddress}`);

  await debugNominatim(testAddress);

  console.log("\n🎉 Debug 完成");
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Debug 失敗:", error.message);
    process.exit(1);
  });
}
