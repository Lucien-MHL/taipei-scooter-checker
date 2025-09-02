/**
 * 台北市各行政區中心座標
 * Central coordinates for Taipei districts
 * 資料來源：OpenStreetMap + 政府公開資料
 */

const DISTRICT_COORDINATES = {
  中正區: { lat: 25.0323, lng: 121.5127, name: "Zhongzheng District" },
  大同區: { lat: 25.0632, lng: 121.5127, name: "Datong District" },
  中山區: { lat: 25.0636, lng: 121.5342, name: "Zhongshan District" },
  松山區: { lat: 25.0578, lng: 121.5773, name: "Songshan District" },
  大安區: { lat: 25.0265, lng: 121.5436, name: "Daan District" },
  萬華區: { lat: 25.0377, lng: 121.5019, name: "Wanhua District" },
  信義區: { lat: 25.0336, lng: 121.5797, name: "Xinyi District" },
  士林區: { lat: 25.0876, lng: 121.5259, name: "Shilin District" },
  北投區: { lat: 25.1315, lng: 121.5017, name: "Beitou District" },
  內湖區: { lat: 25.0821, lng: 121.5946, name: "Neihu District" },
  南港區: { lat: 25.0554, lng: 121.6477, name: "Nangang District" },
  文山區: { lat: 24.9889, lng: 121.5706, name: "Wenshan District" },
};

/**
 * 取得行政區中心座標
 */
function getDistrictCoordinates(district) {
  // 移除可能的"臺北市"前綴
  const cleanDistrict = district.replace("臺北市", "").replace("台北市", "");

  return DISTRICT_COORDINATES[cleanDistrict] || null;
}

/**
 * 取得所有行政區列表
 */
function getAllDistricts() {
  return Object.keys(DISTRICT_COORDINATES);
}

/**
 * 檢查是否為有效的台北市行政區
 */
function isValidTaipeiDistrict(district) {
  const cleanDistrict = district.replace("臺北市", "").replace("台北市", "");
  return DISTRICT_COORDINATES.hasOwnProperty(cleanDistrict);
}

/**
 * 根據地址推測最近的行政區座標
 * （當精確geocoding失敗時使用）
 */
function getApproximateCoordinates(address, district) {
  const districtCoords = getDistrictCoordinates(district);

  if (!districtCoords) {
    // 如果行政區不存在，返回台北市中心
    return {
      lat: 25.0375198,
      lng: 121.5636796,
      accuracy: "city_center",
      source: "fallback",
    };
  }

  // 根據路名進行微調（可選的精細化）
  let adjustedCoords = { ...districtCoords };

  // 一些主要道路的微調
  if (address.includes("忠孝東路") || address.includes("忠孝西路")) {
    adjustedCoords.lat += 0.002; // 向北微調
  } else if (address.includes("信義路")) {
    adjustedCoords.lat -= 0.002; // 向南微調
  } else if (address.includes("敦化南路") || address.includes("敦化北路")) {
    adjustedCoords.lng += 0.003; // 向東微調
  } else if (address.includes("中山北路") || address.includes("中山南路")) {
    adjustedCoords.lng -= 0.003; // 向西微調
  }

  return {
    lat: adjustedCoords.lat,
    lng: adjustedCoords.lng,
    accuracy: "district_center",
    source: "approximate",
  };
}

module.exports = {
  DISTRICT_COORDINATES,
  getDistrictCoordinates,
  getAllDistricts,
  isValidTaipeiDistrict,
  getApproximateCoordinates,
};
