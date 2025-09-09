export interface Station {
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

export interface Metadata {
  total_stations: number;
  successful_geocoding: number;
  failed_geocoding: number;
  processing_time_ms: number;
  tgos_enabled: boolean;
  generated_at: Date | string;
}
