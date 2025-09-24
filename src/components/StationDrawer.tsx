'use client'

import { useStations } from '@/stores/useStations'
import { GoogleMap } from '@/icons/GoogleMap'
import { MapPin } from '@/icons/MapPin'
import { Phone } from '@/icons/Phone'
import { User } from '@/icons/User'
import { formatDate } from '@/utils/formatDate'
import { Metadata, Station } from '@/types/station'
import { getNoCoordinateStations } from '@/utils/noCoordinateStations'
import { useState } from 'react'

export const StationDrawer = () => {
  const { selectedStation, metadata, isLoading, stations } = useStations()
  const [showNoCoordList, setShowNoCoordList] = useState(false)

  if (isLoading || !metadata) return null

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="rounded-t-2xl bg-white shadow-2xl transition-all duration-300">
        <div className="p-4">
          {showNoCoordList ? (
            <NoCoordinateListContent
              stations={getNoCoordinateStations(stations)}
              onBack={() => setShowNoCoordList(false)}
            />
          ) : !selectedStation ? (
            <BasicContent
              metadata={metadata}
              stations={stations}
              onShowNoCoordList={() => setShowNoCoordList(true)}
            />
          ) : (
            <SelectedContent station={selectedStation} />
          )}
        </div>
      </div>
    </div>
  )
}

const BasicContent = ({
  metadata,
  stations,
  onShowNoCoordList
}: {
  metadata: Metadata
  stations: Station[] | null
  onShowNoCoordList: () => void
}) => {
  const noCoordStations = getNoCoordinateStations(stations)

  return (
    <div className="space-y-3 text-center">
      <h1 className="text-lg font-semibold text-teal-800">
        台北市機車排氣檢驗站
      </h1>
      <p className="text-sm text-gray-500">🔍 點擊地圖標記查看檢驗站詳細資訊</p>

      {noCoordStations.length > 0 && (
        <button
          onClick={onShowNoCoordList}
          className="w-full rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 transition-colors hover:bg-amber-100"
        >
          📝 查看尚未座標化的站點 ({noCoordStations.length})
        </button>
      )}

      <p className="text-xs text-gray-500">
        資料最後更新：{formatDate(metadata.updated_at)}
      </p>
      <p className="text-xs text-gray-500">
        資料來源：
        <a href="https://data.taipei/dataset/detail?id=a81edafd-c1e9-4678-9df2-bad8ce0fc383">
          台北市資料大平臺
        </a>
      </p>
    </div>
  )
}

const SelectedContent = ({ station }: { station: Station }) => {
  const List = ({
    Icon,
    text
  }: {
    Icon: React.ComponentType<{ className?: string }>
    text: string
  }) => (
    <li className="flex items-center gap-4 text-teal-800">
      <Icon className="size-5" />
      <p className="text-sm">{text}</p>
    </li>
  )

  return (
    <div>
      <h1 className="mb-6 border-b border-teal-800 pb-4 text-center text-xl font-semibold text-teal-800">
        {station.name}
      </h1>

      <ul className="mb-6 space-y-3 border-b border-teal-800 pb-4">
        <List Icon={MapPin} text={station.address} />
        <List Icon={User} text={station.owner} />
      </ul>

      <div className="flex justify-between gap-2">
        <a
          href={`tel:${station.phone}`}
          className="flex items-center justify-center gap-2 rounded bg-cyan-800 p-3 text-sm text-white"
        >
          <Phone className="size-5" />
          撥打電話
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-gradient-to-r from-teal-700 to-cyan-700 p-3 text-center font-bold text-white"
        >
          <div className="flex items-center justify-center gap-2">
            <GoogleMap className="size-5" />
            <span>前往導航</span>
          </div>
        </a>
      </div>
    </div>
  )
}

const NoCoordinateListContent = ({
  stations,
  onBack
}: {
  stations: Station[]
  onBack: () => void
}) => {
  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="sticky top-0 mb-4 flex items-center justify-between bg-white pb-2">
        <h2 className="text-lg font-semibold text-teal-800">
          📝 尚未座標化的站點 ({stations.length})
        </h2>
        <button
          onClick={onBack}
          className="text-xl text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {stations.map((station) => (
          <div
            key={station.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <h3 className="mb-2 text-base font-semibold text-teal-800">
              {station.name}
            </h3>
            <div className="mb-3 space-y-1 text-xs text-gray-600">
              <p>📍 {station.address}</p>
              <p>📞 {station.phone}</p>
              <p>👤 {station.owner}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${station.phone}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-cyan-600 py-2 text-xs text-white"
              >
                <Phone className="h-3 w-3" />
                撥打
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-2 items-center justify-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-xs text-white"
              >
                <GoogleMap className="h-3 w-3" />
                Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
