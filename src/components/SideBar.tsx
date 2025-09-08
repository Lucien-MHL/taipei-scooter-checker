import { Globe } from "@/icons/Globe";
import { GoogleMap } from "@/icons/GoogleMap";
import { MapPin } from "@/icons/MapPin";
import { Phone } from "@/icons/Phone";
import { User } from "@/icons/User";
import { formatDate } from "@/utils/formatDate";

export const SideBar = () => {
  return (
    <aside className="flex w-sm flex-col justify-between p-6">
      <div>
        <h1 className="text-center text-2xl font-semibold">
          宏立機車事業有限公司
        </h1>
        <ul className="mt-10 space-y-3">
          <li className="flex items-center gap-4">
            <MapPin className="size-5" />
            <p>臺北市大安區和平東路2段141號</p>
          </li>
          <li className="flex items-center gap-4">
            <User className="size-5" />
            <p>沈鳳雲</p>
          </li>
          <li className="flex items-center gap-4">
            <Phone className="size-5" />
            <p>(02)27065429</p>
          </li>
          <li className="flex items-center gap-4">
            <Globe className="size-5" />
            <p>座標來源：Nominatim</p>
          </li>
        </ul>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            "宏立機車事業有限公司",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 block rounded-md bg-linear-to-r from-teal-500 to-cyan-500 py-3 text-center font-bold hover:from-teal-600 hover:to-cyan-600"
        >
          <p className="flex items-center justify-center gap-2 select-none">
            <GoogleMap className="size-5" />
            <span>前往 Google map</span>
          </p>
        </a>
      </div>
      {/* Website Hint */}
      <section className="mt-auto rounded-lg border p-4 text-sm">
        <h2 className="flex items-center gap-2">
          <span>🔍</span>小提示：
        </h2>
        <ul className="mt-4 list-disc space-y-2 px-4">
          <li>點擊地圖上的藍色標記查看檢驗站詳細資訊</li>
          <li>使用滑鼠滾輪或手勢縮放地圖檢視</li>
          <li>資料每月自動更新，確保檢驗站資訊準確</li>
          <li>資料最後更新：{formatDate("2025-09-05T13:58:42.082Z")}</li>
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
    </aside>
  );
};
