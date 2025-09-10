'use client'

import { Drawer } from 'vaul'
import { useStations } from '@/stores/useStations'
import { GoogleMap } from '@/icons/GoogleMap'
import { MapPin } from '@/icons/MapPin'
import { Phone } from '@/icons/Phone'
import { User } from '@/icons/User'
import { formatDate } from '@/utils/formatDate'
import { Metadata, Station } from '@/types/station'

export const StationDrawer = () => {
  const { selectedStation, metadata, isLoading } = useStations()

  return (
    <div className="fixed right-0 bottom-0 left-0 z-[9999] md:hidden">
      <Drawer.Root dismissible={false} open={!isLoading && !!metadata}>
        <Drawer.Portal>
          <Drawer.Content
            title="Drawer"
            className="fixed right-0 bottom-0 left-0 h-fit rounded-t-2xl bg-white shadow-2xl transition-all duration-300 outline-none md:hidden"
          >
            <div className="h-full overflow-y-auto p-4">
              <Drawer.Title />
              <Drawer.Description />
              {!selectedStation && <BasicContent metadata={metadata!} />}
              {selectedStation && <SelectedContent station={selectedStation} />}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

const BasicContent = ({ metadata }: { metadata: Metadata }) => (
  <div className="h-fit space-y-2 text-center">
    <h1 className="text-lg font-semibold text-teal-800">
      台北市機車排氣檢驗站
    </h1>
    <p className="text-sm text-gray-500">🔍 點擊地圖標記查看檢驗站詳細資訊</p>
    <p className="text-xs text-gray-500">
      資料最後更新：{formatDate(metadata.generated_at)}
    </p>
    <p className="text-xs text-gray-500">
      資料來源：
      <a href="https://data.taipei/dataset/detail?id=a81edafd-c1e9-4678-9df2-bad8ce0fc383">
        台北市資料大平臺
      </a>
    </p>
  </div>
)

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
        <List Icon={User} text={station.owner} />
        <List Icon={MapPin} text={station.address} />
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
