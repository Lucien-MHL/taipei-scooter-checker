#!/usr/bin/env node

/**
 * 測試特定地址的Nominatim geocoding效果
 * Test specific addresses with new Nominatim logic
 */

const { NominatimGeocoder } = require("./geocode-stations");

// 測試用戶發現的關鍵地址
const testAddresses = [
  "臺北市文山區興隆路2段241號",
  "臺北市文山區忠順街1段36、38號",
  "臺北市信義區莊敬路204號1樓",
  "臺北市大安區和平東路2段128之1號",
  "臺北市松山區八德路4段28-1號",
];

async function testNominatimDirectly() {
  console.log("🧪 直接測試Nominatim geocoding (使用新的逗號分隔邏輯)\n");

  const geocoder = new NominatimGeocoder();

  for (let i = 0; i < testAddresses.length; i++) {
    const address = testAddresses[i];
    console.log(`${i + 1}. 測試地址: "${address}"`);

    try {
      console.log("   ⏳ 正在geocoding...");
      const result = await geocoder.geocode(address);

      console.log(`   ✅ 成功! 座標: ${result.lat}, ${result.lng}`);
      console.log(`   📍 來源: ${result.source}`);
      console.log(`   🏠 格式化地址: ${result.formatted_address}`);
    } catch (error) {
      console.log(`   ❌ 失敗: ${error.message}`);
    }

    console.log("");

    // Rate limiting - 等待1秒
    if (i < testAddresses.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// 執行測試
if (require.main === module) {
  testNominatimDirectly().catch((error) => {
    console.error("測試失敗:", error.message);
    process.exit(1);
  });
}
