export interface Station {
  id: string
  name: string
  address: string
  phone: string
  district: string
  owner: string
  coordinates: {
    lat: number
    lng: number
  } | null
  geocoding: {
    source: string
    accuracy: string
    geocoded_at: string
  } | null
}

export interface Metadata {
  total: number
  updated_at: Date | string
}
