"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// 動態載入地圖元件，避免SSR問題
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">載入地圖中...</div>
    </div>
  ),
});

export default function Map() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <MapComponent />
    </Suspense>
  );
}
