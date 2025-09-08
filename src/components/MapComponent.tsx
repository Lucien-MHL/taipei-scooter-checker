"use client";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

// 機車檢驗站專用圖標
const StationIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 台北市中心座標
const TAIPEI_CENTER: [number, number] = [25.05, 121.56];

// 檢驗站資料類型
interface Station {
  id: string;
  name: string;
  address: string;
  phone: string;
  district: string;
  owner: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geocoding: {
    source: string;
    accuracy: string;
    geocoded_at: string;
  };
}

interface StationsData {
  metadata: {
    total_stations: number;
    successful_geocoding: number;
    failed_geocoding: number;
    generated_at: string;
    note?: string;
  };
  stations: Station[];
}

export default function MapComponent() {
  const [stationsData, setStationsData] = useState<StationsData | null>(null);
  const [taipeiGeoJSON, setTaipeiGeoJSON] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 載入檢驗站資料和台北市邊界
    async function loadData() {
      try {
        // 載入檢驗站資料
        const stationsResponse = await fetch("/data/stations.json");
        if (!stationsResponse.ok) {
          throw new Error(
            `HTTP ${stationsResponse.status}: ${stationsResponse.statusText}`,
          );
        }
        const stationsData: StationsData = await stationsResponse.json();
        setStationsData(stationsData);

        // 載入台北市GeoJSON邊界
        try {
          const geoResponse = await fetch("/data/taipei-boundary.geojson");
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            setTaipeiGeoJSON(geoData);
          }
        } catch (geoError) {
          console.log("台北市邊界檔案不存在，跳過邊界顯示");
        }
      } catch (err) {
        console.error("載入資料失敗:", err);
        setError(err instanceof Error ? err.message : "未知錯誤");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">載入檢驗站資料中...</p>
        </div>
      </div>
    );
  }

  if (error || !stationsData) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 shadow-lg">
        <div className="text-center">
          <p className="mb-2 text-red-600">❌ 載入檢驗站資料失敗</p>
          <p className="text-sm text-gray-600">{error || "資料不可用"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={TAIPEI_CENTER}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* 台北市邊界 */}
        {taipeiGeoJSON && (
          <GeoJSON
            data={taipeiGeoJSON}
            style={{
              color: "#0891b2", // teal-600
              weight: 3,
              opacity: 0.8,
              fillColor: "#06b6d4", // cyan-500
              fillOpacity: 0.1,
            }}
          />
        )}

        {/* 檢驗站標記 */}
        {stationsData.stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates.lat, station.coordinates.lng]}
            icon={StationIcon}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="space-y-2 p-3">
                <div className="border-b pb-2">
                  <h3 className="text-base font-bold text-gray-800">
                    {station.name}
                  </h3>
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {station.district}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="w-12 flex-shrink-0 text-gray-500">📍</span>
                    <span className="text-gray-700">{station.address}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="w-12 flex-shrink-0 text-gray-500">📞</span>
                    <a
                      href={`tel:${station.phone}`}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {station.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="w-12 flex-shrink-0 text-gray-500">👤</span>
                    <span className="text-gray-600">{station.owner}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      station.address,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full rounded bg-green-500 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-green-600"
                  >
                    🗺️ Google Maps 導航
                  </a>

                  <div className="text-center text-xs text-gray-400">
                    座標來源:{" "}
                    {station.geocoding.source === "district_fallback"
                      ? "行政區中心"
                      : station.geocoding.source}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
