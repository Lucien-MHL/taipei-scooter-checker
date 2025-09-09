import { SideBar } from "@/components/SideBar";
import { StationsProvider } from "@/components/StationsProvider";
import Map from "@/components/Map";

export default function Home() {
  return (
    <StationsProvider>
      <div className="flex h-full w-full flex-col bg-linear-to-r from-teal-800 to-cyan-800">
        <main className="flex h-full w-full">
          <SideBar />
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-s-2xl bg-slate-800 text-9xl text-white">
            <Map />
          </div>
        </main>
      </div>
    </StationsProvider>
  );
}
