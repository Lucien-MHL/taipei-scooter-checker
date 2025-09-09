import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerCluster from "./MarkerCluster";
import { useStations } from "@/stores/useStations";

const TAIPEI_CENTER: [number, number] = [25.05, 121.56]; // 台北市中心座標
const DEFAULT_ZOOM = 12; // 預設縮放倍數

export default function MapComponent() {
  const stations = useStations((state) => state.stations);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={TAIPEI_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* 檢驗站 Marker Cluster */}
        <MarkerCluster stations={stations!} />
      </MapContainer>
    </div>
  );
}
