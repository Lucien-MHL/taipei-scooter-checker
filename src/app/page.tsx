import Map from "@/components/Map";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            台北市機車排氣檢驗站查詢 🛵
          </h1>
          <p className="text-gray-600 mt-1">快速找到離你最近的機車檢驗站</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              檢驗站地圖
            </h2>
            <p className="text-sm text-gray-600">
              共247家檢驗站 • 點擊標記查看詳細資訊
            </p>
          </div>

          <Map />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            資料來源：台北市政府開放資料平台
          </p>
        </div>
      </footer>
    </div>
  );
}
