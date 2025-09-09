"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PulseLoading } from "./ui/PulseLoading";

// 動態載入地圖元件，避免SSR問題
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <PulseLoading />,
});

export default function Map() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <MapComponent />
    </Suspense>
  );
}
