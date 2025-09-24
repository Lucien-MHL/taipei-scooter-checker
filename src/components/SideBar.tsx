'use client'

import { Globe } from '@/icons/Globe'
import { GoogleMap } from '@/icons/GoogleMap'
import { MapPin } from '@/icons/MapPin'
import { Phone } from '@/icons/Phone'
import { User } from '@/icons/User'
import { useStations } from '@/stores/useStations'
import { Metadata, Station } from '@/types/station'
import { formatDate } from '@/utils/formatDate'
import { getNoCoordinateStations } from '@/utils/noCoordinateStations'
import { useState } from 'react'

export const SideBar = () => {
  const selectedStation = useStations((state) => state.selectedStation)
  const metadata = useStations((state) => state.metadata)

  return (
    <aside className="hidden flex-col justify-between p-6 md:flex md:w-xs lg:w-sm">
      {selectedStation ? (
        <StationInformation station={selectedStation} />
      ) : (
        <WelcomeMessage metadata={metadata!} />
      )}
      <WebsiteHint metadata={metadata!} />
    </aside>
  )
}

const WelcomeMessage = ({ metadata }: { metadata: Metadata }) => {
  const stations = useStations((state) => state.stations)
  const [showNoCoordModal, setShowNoCoordModal] = useState(false)
  const noCoordStations = getNoCoordinateStations(stations)
  if (!metadata)
    return (
      <div className="animate-pulse">
        <div className="mx-auto h-8 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50 md:w-full lg:w-3/5" />
        <div className="mt-8 h-24 w-full rounded-lg bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
        <div className="mt-6 space-y-3 text-sm">
          <div className="h-8 w-1/2 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <div className="h-8 w-2/5 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <div className="h-8 w-3/5 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
        </div>
      </div>
    )

  return (
    <>
      <h1 className="text-center font-semibold md:text-xl lg:text-2xl">
        🛵 台北市機車排氣檢驗站 💨
      </h1>
      <div className="mt-8 rounded-lg bg-teal-50 p-4">
        <h2 className="font-semibold text-teal-800 lg:text-lg">✨ 歡迎使用</h2>
        <p className="mt-2 text-teal-700 md:text-xs lg:text-sm">
          點擊地圖上的標記查看檢驗站詳細資訊，快速找到最近的檢驗站！
        </p>
      </div>
      <div className="lg:text-md mt-6 space-y-3 md:text-sm">
        <div className="flex items-center gap-3">
          <span className="md:text-lg lg:text-2xl">📍</span>
          <span>
            共 <strong>{metadata.total} 家</strong> 檢驗站
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="md:text-lg lg:text-2xl">🎯</span>
          <span>精確座標定位</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="md:text-lg lg:text-2xl">🗺️</span>
          <span>整合 Google Maps 連結</span>
        </div>
      </div>

      {noCoordStations.length > 0 && (
        <button
          onClick={() => setShowNoCoordModal(true)}
          className="mt-6 w-full rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-amber-800 transition-colors hover:bg-amber-100 md:text-sm lg:text-base"
        >
          📝 查看尚未座標化的站點 ({noCoordStations.length})
        </button>
      )}

      {/* 無座標站點彈窗 */}
      {showNoCoordModal && (
        <NoCoordinateStationsModal
          stations={noCoordStations}
          onClose={() => setShowNoCoordModal(false)}
        />
      )}
    </>
  )
}

const StationInformation = ({ station }: { station: Station }) => {
  const List = ({
    Icon,
    text
  }: {
    Icon: React.ComponentType<{ className?: string }>
    text: string
  }) => {
    return (
      <li className="flex items-center gap-4">
        <Icon className="md:size-4 lg:size-5" />
        <p className="md:text-sm lg:text-lg">{text}</p>
      </li>
    )
  }

  return (
    <div>
      <h1 className="text-center font-semibold md:text-xl lg:text-2xl">
        {station.name}
      </h1>
      <ul className="mt-10 space-y-3">
        <List Icon={MapPin} text={station.address} />
        <List Icon={User} text={station.owner} />
        <List Icon={Phone} text={station.phone} />
        <List
          Icon={Globe}
          text={
            station.geocoding
              ? `座標來源：${station.geocoding.source}`
              : '座標來源：未知'
          }
        />
      </ul>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 block rounded-md bg-linear-to-r from-teal-500 to-cyan-500 py-3 text-center font-bold hover:from-teal-600 hover:to-cyan-600"
      >
        <p className="flex items-center justify-center gap-2 select-none">
          <GoogleMap className="md:size-4 lg:size-5" />
          <span className="md:text-sm lg:text-lg">前往 Google map 導航</span>
        </p>
      </a>
    </div>
  )
}

const WebsiteHint = ({ metadata }: { metadata: Metadata }) => {
  if (!metadata)
    return (
      <section className="mt-auto w-full rounded-lg border p-4">
        <div className="h-5 w-1/4 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
        <ul className="mt-4 space-y-2 pr-4">
          <li className="h-5 w-full rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <li className="h-5 w-3/4 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <li className="h-5 w-4/5 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <li className="h-5 w-1/2 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <li className="h-5 w-3/4 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
          <li className="h-5 w-3/5 rounded-sm bg-linear-to-r from-teal-300/50 to-cyan-300/50" />
        </ul>
      </section>
    )

  return (
    <section className="mt-auto rounded-lg border md:p-4 lg:p-6">
      <h2 className="text-md flex items-center gap-2">
        <span>🔍</span>小提示：
      </h2>
      <ul className="mt-4 list-disc space-y-2 md:px-4 md:text-xs lg:px-6 lg:text-sm">
        <li>點擊地圖上的標記查看檢驗站詳細資訊</li>
        <li>使用滑鼠滾輪或手勢縮放地圖檢視</li>
        <li>資料每月自動更新，確保資訊準確</li>
        <li>資料最後更新：{formatDate(metadata.updated_at)}</li>
        <li>支援手機版，隨時隨地查找最近檢驗站</li>
        <li>
          資料來源：
          <a
            href="https://data.taipei/dataset/detail?id=a81edafd-c1e9-4678-9df2-bad8ce0fc383"
            className="hover:text-cyan-500"
          >
            台北市資料大平臺
          </a>
        </li>
      </ul>
    </section>
  )
}

const NoCoordinateStationsModal = ({
  stations,
  onClose
}: {
  stations: Station[]
  onClose: () => void
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">
            📝 尚未座標化的站點 ({stations.length})
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <h3 className="mb-2 text-lg font-semibold">{station.name}</h3>
                <div className="mb-3 space-y-1 text-sm text-gray-600">
                  <p>📍 {station.address}</p>
                  <p>📞 {station.phone}</p>
                  <p>👤 {station.owner}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  <GoogleMap className="h-4 w-4" />
                  前往 Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
