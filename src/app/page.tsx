import { SideBar } from '@/components/SideBar'
import Map from '@/components/Map'

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col bg-linear-to-r from-teal-800 to-cyan-800">
      <main className="w-full h-full flex">
        <SideBar />
        <div className="bg-slate-800 text-white rounded-s-2xl flex-1 flex items-center justify-center text-9xl overflow-hidden">
          <Map />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
