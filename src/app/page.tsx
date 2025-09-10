import { SideBar } from '@/components/SideBar'
import { StationDrawer } from '@/components/StationDrawer'
import { StationsProvider } from '@/components/StationsProvider'
import Map from '@/components/Map'
import { cn } from '@/utils/cn'

export default function Home() {
  return (
    <StationsProvider>
      <div
        className={cn(
          // Base styled
          'h-full w-full',
          // width >= 1024px
          'md:bg-linear-to-r md:from-teal-800 md:to-cyan-800'
        )}
      >
        <main className="flex h-full w-full">
          <SideBar />
          <div
            className={cn(
              // Base styled
              'flex-1 bg-slate-800',
              // width >= 1024px
              'md:overflow-hidden md:rounded-s-2xl'
            )}
          >
            <Map />
          </div>
        </main>

        {/* Mobile Station Drawer */}
        <StationDrawer />
      </div>
    </StationsProvider>
  )
}
