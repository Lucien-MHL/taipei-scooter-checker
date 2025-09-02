"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
const TAIPEI_CENTER: [number, number] = [25.033, 121.5654];

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 載入檢驗站資料
    async function loadStations() {
      try {
        const response = await fetch("/data/test-stations.json");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data: StationsData = await response.json();
        setStationsData(data);
      } catch (err) {
        console.error("載入檢驗站資料失敗:", err);
        setError(err instanceof Error ? err.message : "未知錯誤");
      } finally {
        setLoading(false);
      }
    }

    loadStations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入檢驗站資料中...</p>
        </div>
      </div>
    );
  }

  if (error || !stationsData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">❌ 載入檢驗站資料失敗</p>
          <p className="text-sm text-gray-600">{error || "資料不可用"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 資料資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-800">
              檢驗站資料載入成功 ✅
            </h3>
            <p className="text-sm text-blue-600">
              顯示 {stationsData.stations.length} 家檢驗站
              {stationsData.metadata.note && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  測試版本
                </span>
              )}
            </p>
          </div>
          <div className="text-right text-xs text-blue-500">
            最後更新:{" "}
            {new Date(stationsData.metadata.generated_at).toLocaleString(
              "zh-TW",
            )}
          </div>
        </div>
      </div>

      {/* 地圖 */}
      <MapContainer
        center={TAIPEI_CENTER}
        zoom={11}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 檢驗站標記 */}
        {stationsData.stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates.lat, station.coordinates.lng]}
            icon={StationIcon}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-3 space-y-2">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-gray-800 text-base">
                    {station.name}
                  </h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {station.district}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-500 w-12 flex-shrink-0">📍</span>
                    <span className="text-gray-700">{station.address}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 w-12 flex-shrink-0">📞</span>
                    <a
                      href={`tel:${station.phone}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {station.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 w-12 flex-shrink-0">👤</span>
                    <span className="text-gray-600">{station.owner}</span>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded text-sm transition-colors"
                  >
                    🗺️ Google Maps 導航
                  </a>

                  <div className="text-xs text-gray-400 text-center">
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
