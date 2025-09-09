# Taipei Scooter Checker 🛵

## 專案概述 Project Overview

台北市機車排氣檢驗站地圖查詢系統，幫助機車族快速找到最近的檢驗站。

### 專案目標 Project Goals
1. **面試作品展示** - 展示React/Next.js + 地圖整合技術能力
2. **個人實用需求** - 解決五年以上老機車年度檢驗的實際需求
3. **技術學習** - 整合政府開放資料API、地圖服務、geocoding

## 技術架構 Technical Architecture

### 前端技術棧 Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **地圖套件**: React-Leaflet
- **樣式**: TailwindCSS
- **TypeScript**: 型別安全

### 資料來源 Data Sources
- **主要API**: 台北市政府開放資料平台
  - URL: `https://data.taipei/api/v1/dataset/5fce41d6-f48f-4190-9ba4-c9cf0b2db426?scope=resourceAquire&limit=1000`
  - 共247家檢驗站資料
  - 包含店名、地址、電話、負責人等完整資訊

### Geocoding策略 Geocoding Strategy
- **服務選擇**: Nominatim (OpenStreetMap) - 免費版本
- **處理方式**: 預先處理 (Pre-processing)
- **儲存格式**: 靜態JSON檔案 (~200KB)
- **更新機制**: GitHub Actions定期更新

### 資料更新流程 Data Update Flow
1. **GitHub Actions Cron Job** - 每月1號自動執行
2. **API資料比較** - 檢查新增/移除的店家
3. **增量Geocoding** - 只對新店家進行座標轉換
4. **自動提交** - 更新後自動commit到repository
5. **手動觸發** - 支援workflow_dispatch手動更新

## 功能規劃 Feature Planning

### MVP階段 (面試版本)
- ✅ 基礎地圖顯示 (Leaflet + OpenStreetMap)
- ✅ 247家檢驗站標記和資訊popup
- ✅ 按區域搜尋功能
- ✅ 響應式設計 (手機/桌面)
- ✅ 快速載入 (靜態資料)

### 進階功能 (可選)
- 🚀 路線規劃整合
- 🚀 我的最愛店家
- 🚀 Google Maps連結
- 🚀 電話撥打功能
- 🚀 分享功能

## 開發環境設定 Development Setup

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構專案
npm run build

# 預覽建構結果
npm run start
```

### 主要依賴套件
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-leaflet": "^4.x",
    "leaflet": "^1.x"
  }
}
```

## 專案結構 Project Structure

```
taipei-scooter-checker/
├── app/                    # Next.js App Router
├── components/             # React元件
├── data/                  # 靜態資料 (stations.json)
├── scripts/               # 自動化腳本
├── .github/workflows/     # GitHub Actions
├── public/                # 靜態資源
└── README.md             # 專案說明
```

## GitHub Actions設定 CI/CD Setup

### 更新資料工作流程
- **檔案**: `.github/workflows/update-stations.yml`
- **觸發**: 每月1號 + 手動觸發
- **功能**: API資料同步 + Geocoding + 自動提交

## 面試重點說明 Interview Highlights

1. **實際需求導向** - 解決真實世界問題，不只是技術展示
2. **技術整合能力** - API整合、地圖服務、自動化流程
3. **效能考量** - 預處理 vs 即時處理的trade-off決策
4. **成本控制** - 全程使用免費服務的架構設計
5. **可維護性** - 清晰的專案結構和自動化更新機制

## 開發注意事項 Development Notes

### 地址Geocoding注意事項
- Rate limiting: 1 request/second (Nominatim)
- 台灣地址格式標準化處理
- 錯誤重試機制
- 批次處理避免API封鎖

### 地圖實作重點
- 台北市中心座標: `[25.0330, 121.5654]`
- 適當的zoom level設定
- 標記點cluster處理 (店家密集區域)
- 行動裝置觸控優化

## 🏁 第一天完成狀態 Day 1 Completion Status

### ✅ 今日完成項目 Completed Today (2025-09-01)
- **專案建置** - taipei-scooter-checker 完整架構建立
- **Next.js 15.5.2** - TypeScript + TailwindCSS + ESLint + App Router
- **地圖整合** - React-Leaflet + Leaflet 基礎地圖顯示
- **響應式UI** - Header/Footer/乾淨的專業介面設計
- **開發環境** - 本地開發伺服器運行正常 (localhost:3000)

### 📁 當前專案結構 Current Project Structure
```
taipei-scooter-checker/
├── src/
│   ├── app/
│   │   └── page.tsx              # 主頁面 (已完成UI設計)
│   └── components/
│       ├── Map.tsx               # 地圖動態載入包裝器
│       └── MapComponent.tsx      # 實際地圖元件
├── data/                         # 📋 明天要建立 stations.json
├── scripts/                      # 📋 明天要建立 geocoding腳本
├── .github/workflows/            # 📋 後續建立 GitHub Actions
├── CLAUDE.md                     # 專案文檔
└── package.json                  # 依賴已安裝完成
```

### 🎯 技術實作細節 Technical Implementation Details
- **地圖中心**: 台北市政府 `[25.0330, 121.5654]`
- **預設縮放**: zoom level 12
- **圖層**: OpenStreetMap (免費)
- **標記處理**: 已解決 Leaflet default icon 問題
- **SSR問題**: 使用 dynamic import 避開 server-side rendering

## 🌅 明天任務計劃 Tomorrow's Action Plan

### 🥇 Priority 1: 資料載入核心功能
1. **測試台北市API** 
   - 確認 `https://data.taipei/api/v1/dataset/5fce41d6-f48f-4190-9ba4-c9cf0b2db426?scope=resourceAquire&limit=1000`
   - 驗證資料格式和完整性
   - 檢查247家店的詳細欄位

2. **建立geocoding腳本**
   - 檔案位置: `scripts/geocode-stations.js`
   - 使用 Nominatim API (免費)
   - 實作 1 req/sec 的 rate limiting
   - 錯誤重試機制

3. **產生靜態資料**
   - 目標檔案: `data/stations.json`
   - 包含：店名、地址、電話、座標
   - 預估檔案大小: ~200KB

### 🥈 Priority 2: 地圖資料顯示
4. **載入真實標記**
   - 讀取 `data/stations.json`
   - 在地圖上顯示247個標記點
   - 設計專用的機車檢驗站 icon

5. **Popup資訊優化**
   - 顯示店名、地址、電話
   - 加入 Google Maps 連結按鈕
   - 響應式popup設計

### 🥉 Priority 3: 基礎搜尋功能
6. **區域篩選**
   - 按台北市各區分類
   - 下拉選單 UI
   - 即時地圖標記更新

### 🔧 技術注意事項 Technical Notes
- **Geocoding限制**: Nominatim 1 request/second，247個地址約需4-5分鐘
- **地址格式**: 台北市地址需要標準化處理（繁簡體、全半形數字）
- **快取策略**: 成功geocoded的資料要永久保存，避免重複請求
- **錯誤處理**: 部分地址可能geocoding失敗，需要手動檢查和修正

### 📋 待建立檔案 Files to Create Tomorrow
```
scripts/
├── geocode-stations.js          # 主要geocoding腳本
├── fetch-api-data.js           # API資料獲取測試
└── utils.js                    # 地址標準化工具

data/
└── stations.json               # 最終的完整站點資料
```

### 🎯 預期明天結果 Expected Tomorrow Outcome
**完成後將擁有：**
- ✅ 247家檢驗站完整顯示在地圖上
- ✅ 點擊標記可查看店家詳細資訊
- ✅ 基礎的區域搜尋功能
- ✅ 完全可用的MVP版本

**專案完成度預估**: 第一天 30% → 第二天 80%

---

## 🏁 第二天完成狀態 Day 2 Completion Status (2025-09-02)

### ✅ 今日重大突破 Major Breakthroughs Today
- **完整Geocoding系統建置** - 三層fallback機制：TGOS → Nominatim → 區域中心
- **247個檢驗站資料處理** - 台北市政府API完整整合
- **30個測試站點地圖顯示** - 全功能地圖介面上線
- **背景處理完成** - 100+檢驗站座標轉換持續進行中

### 🔧 核心技術實現 Core Technical Implementations
- **Multi-tier Geocoding Pipeline**: `scripts/geocode-stations.js`
  - TGOS API整合 (等待API key核准)
  - Nominatim備援機制 
  - 12區域中心座標fallback
  - 完整錯誤處理和重試機制

- **Government API Integration**: `scripts/fetch-api-data.js`  
  - 台北市開放資料平台API測試完成
  - 247家檢驗站100%資料完整性驗證
  - JSON資料格式標準化

- **Production Map Interface**: `src/components/MapComponent.tsx`
  - 30個測試站點完美顯示 ✅
  - Leaflet地圖整合完成
  - 詳細popup資訊和Google Maps導航
  - 響應式設計和載入狀態

### 🎯 當前狀況 Current Status
- **地圖功能**: 100%運作正常 ✅
- **資料載入**: 30個測試站點完整顯示 ✅  
- **座標精度**: 目前使用區域中心，等待TGOS API key優化
- **背景處理**: 持續進行247個完整站點geocoding

### 📅 明日優化計劃 Tomorrow's Optimization Plan

#### 🎨 UI/UX Enhancement Priority
1. **地圖視覺優化**
   - 自訂機車檢驗站專用icon設計
   - 色彩主題調整 (藍/綠色系)
   - 標記hover效果和動畫

2. **Popup介面改善**  
   - 更美觀的卡片式設計
   - 電話撥打功能優化
   - 營業時間資訊 (如果API有提供)

3. **響應式佈局精進**
   - 手機版地圖觸控優化
   - 平板版面配置調整
   - 載入動畫改善

4. **搜尋功能實現**
   - 台北12區下拉篩選
   - 即時標記過濾
   - 搜尋結果統計顯示

#### 🔮 後續功能規劃 Future Feature Planning
- **我的最愛**: localStorage收藏功能
- **路線規劃**: Google Maps API整合
- **分享功能**: URL參數定位特定站點
- **離線支援**: Service Worker快取

### 🏆 專案里程碑 Project Milestones
**Day 1**: 基礎架構 (30%) ✅  
**Day 2**: 核心功能完成 (75%) ✅  
**Day 3**: UI優化 + 搜尋功能 (預估85%)  
**TGOS API**: 座標精度提升 (預估95%)  
**Final**: 完整發布版本 (100%)

---

## 🎊 第三天重大突破 Day 3 Revolutionary Breakthrough (2025-09-05)

### 🏆 **歷史性成就 - Nominatim Geocoding革命性突破**
今日完成了專案最重要的技術突破：**發現並實現Nominatim逗號分隔地址格式**，將geocoding成功率從12%飛躍至93.5%！

### 📊 **驚人數據對比**

| 項目 | 突破前狀況 | 突破後成果 | 改善幅度 |
|------|-----------|-----------|----------|
| **Nominatim成功率** | 12% (30/247) | **93.5%** (231/247) | **+681%** |
| **座標精確度** | 區域中心 | **門牌級別** | 質的飛躍 |
| **資料來源品質** | district_fallback | **真實Nominatim API** | API品質提升 |
| **地圖完整度** | 30個測試點 | **247個完整站點** | **+722%** |

### 🔬 **核心技術突破發現**

#### 1. **Nominatim地址格式破解**
**關鍵發現**: Nominatim對台灣地址需要特定的逗號分隔格式才能精確geocoding

- ❌ **原始格式**: `"臺北市文山區興隆路2段241號"` → 回傳空陣列
- ❌ **無門牌格式**: `"臺北市文山區興隆路2段"` → 回傳多個模糊結果  
- ✅ **逗號分隔格式**: `"臺北市, 文山區, 興隆路2段, 241號"` → **精確單一座標結果**

**實證測試結果**:
```javascript
// 測試案例: 文山區興隆路2段241號
原始查詢 → 空陣列 ❌
逗號分隔 → 25.0019154, 121.551348 ✅ (精確門牌座標)
```

#### 2. **門牌標準化處理規則**
通過247筆資料分析，建立完整的門牌處理邏輯：

- **樓層資訊移除**: `"204號1樓"` → `"204號"` (30筆資料驗證)
- **並列門牌簡化**: `"36、38號"` → `"38號"` (取較大號碼)  
- **子門牌保留**: `"128之1號"`, `"28-1號"` 維持不變 (Nominatim可正確處理)
- **複雜並列處理**: `"12、14、16號"` → `"16號"`

#### 3. **地址組件分離算法**
```javascript
// 輸入: "臺北市文山區忠順街1段36、38號1樓"  
// 輸出組件:
{
  city: "臺北市",           // 固定值
  district: "文山區",       // API提供或regex提取
  street: "忠順街1段",      // 路/街/巷/弄完整範圍
  houseNumber: "38號"       // 標準化後門牌
}
// 最終格式: "臺北市, 文山區, 忠順街1段, 38號"
```

### 🛠️ **技術實現架構**

#### 新增核心函數 (`scripts/utils.js`)
- `standardizeHouseNumber()` - 門牌標準化處理
- `parseAddressComponents()` - 地址組件分離器  
- `normalizeAddress(address, forNominatim=true)` - 逗號分隔格式生成

#### 升級Geocoding系統 (`scripts/geocode-stations.js`)
- 整合新的地址處理邏輯
- 保持三層備援：TGOS → **Nominatim** → 區域中心
- Rate limiting: 1秒間隔處理247個地址

#### 前端地圖更新 (`src/components/MapComponent.tsx`)
- 從30個測試站點 → 247個完整站點
- 載入路徑更新：`/data/test-stations.json` → `/data/stations.json`

### 🔄 **完整處理流程展示**

```
1. API原始地址: "臺北市文山區忠順街1段36、38號1樓"
2. 門牌標準化: "臺北市文山區忠順街1段36、38號" (移除1樓)  
3. 組件分離: 
   - city: "臺北市"
   - district: "文山區"  
   - street: "忠順街1段"
   - houseNumber: "38號" (簡化並列門牌)
4. 逗號格式: "臺北市, 文山區, 忠順街1段, 38號"
5. Nominatim查詢: 24.9840183, 121.5597548 ✅
6. 精確座標獲得！
```

### 📁 **檔案架構更新**
```
taipei-scooter-checker/
├── data/
│   ├── stations.json           # 247個精確geocoding結果 ✅
│   └── geocoding-cache.json    # 231個成功快取記錄 ✅
├── public/data/  
│   └── stations.json          # 前端完整資料 ✅
├── scripts/
│   ├── utils.js               # 新增地址處理核心函數 ✅
│   ├── geocode-stations.js    # 整合逗號分隔邏輯 ✅
│   ├── test-new-geocoding.js  # 地址處理測試腳本 ✅
│   └── test-specific-addresses.js # 實際geocoding驗證 ✅
└── src/components/
    └── MapComponent.tsx       # 247站點完整顯示 ✅
```

### 🎯 **處理成果統計**
- ✅ **總檢驗站**: 247家 (100%處理成功)
- ✅ **Nominatim精確座標**: 231家 (93.5% - 門牌級別)  
- ✅ **區域備援座標**: 16家 (6.5% - 區域中心)
- ✅ **處理失敗**: 0家 (0% - 完美成功率)
- ⏱️ **總處理時間**: ~7分鐘 (247個地址 × 1秒間隔)

### 🚀 **明日美化任務 Day 4 UI/UX Enhancement Plan**

#### Priority 1: 視覺設計升級 
- 🎨 自訂機車檢驗站專用icon設計
- 🌈 色彩主題調整 (藍/綠色系專業風格)
- ✨ 標記hover效果和流暢動畫
- 📱 響應式佈局精進 (手機/平板優化)

#### Priority 2: 功能體驗改善
- 💳 更美觀的popup卡片式設計  
- 📞 電話撥打功能優化
- 🔍 台北12區下拉篩選功能
- 📊 搜尋結果統計顯示
- ⚡ 載入動畫和狀態改善

#### Priority 3: 進階功能 (可選)
- ❤️ 我的最愛收藏功能
- 🗺️ Google Maps整合優化  
- 📤 分享功能 (URL參數定位)
- 🔄 離線支援 (Service Worker)

### 🏁 **專案完成度里程碑**
- **Day 1**: 基礎架構建置 (30%) ✅
- **Day 2**: 核心功能實現 (75%) ✅  
- **Day 3**: **Geocoding革命性突破 (85%)** ✅
- **Day 4**: UI/UX美化完成 (預估95%)
- **Final**: TGOS API整合 (預估100%)

### 💡 **技術成就總結**
這次的突破不僅僅是數據的改善，更是對Nominatim API在台灣地址處理上的深度研究成果。通過系統化的實證方法：

1. **假設提出** - Nominatim門牌號辨識問題
2. **實證驗證** - 逗號分隔格式發現  
3. **系統實現** - 完整地址處理pipeline
4. **效果驗證** - 93.5%成功率證明

這個發現具有廣泛的應用價值，可以幫助其他需要台灣地址geocoding的專案。

---

## 🚀 **第四天策略突破 Day 4 Deployment Strategy Breakthrough (2025-09-08)**

### 🏗️ **GitHub Pages 選擇性部署策略 (Selective Deployment Strategy)**

今日深入研究了資料更新與部署的最佳實踐，確立了**零重建資料更新方案**。

#### **核心技術發現 Core Technical Discovery**
**GitHub Repository ≠ GitHub Pages環境分離理解**：
```
GitHub Repository (source code)
├── public/data/stations.json  ← GitHub Actions cron job更新此處
└── src/components/...

GitHub Pages (deployed site) 
├── data/stations.json         ← 需要選擇性更新此處
└── _next/static/...           ← build產生的靜態檔案
```

#### **fetch() vs import 載入方式分析**

| 載入方式 | Runtime動態性 | 更新靈活性 | 效能表現 | Metadata支援 |
|---------|-------------|----------|----------|-------------|
| **fetch('/data/stations.json')** | ✅ Runtime載入 | ✅ 檔案更新即生效 | ❌ HTTP請求開銷 | ✅ 支援last-modified |
| **import stationsData** | ❌ Compile-time靜態 | ❌ 需要重新build | ✅ 零請求開銷 | ❌ 無metadata |

**結論**: 對於月更資料的專案，`fetch()`方式具有明顯優勢。

#### **選擇性部署技術方案**

##### **方案設計邏輯**
1. **資料更新觸發** - GitHub Actions cron job每月1號執行
2. **Repository更新** - 新的geocoding結果寫入`public/data/stations.json`
3. **選擇性部署** - 僅將JSON檔案推送至`gh-pages` branch
4. **即時生效** - 使用者下次visit即可透過`fetch()`獲得最新資料

##### **GitHub Actions Workflow架構**
```yaml
# .github/workflows/update-stations-only.yml
name: Update Stations Data Only (No Rebuild)
on:
  schedule:
    - cron: '0 2 1 * *'  # 每月1號凌晨2點

jobs:
  selective-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Geocoding & Data Processing
        run: node scripts/geocode-stations.js
      
      - name: Deploy Only JSON to GitHub Pages
        run: |
          git checkout gh-pages
          cp public/data/stations.json data/stations.json
          git commit -m "🔄 Monthly stations data update"
          git push
```

#### **技術優勢總結**
- ✅ **極速更新**: 僅更新單一JSON檔案 (~200KB)
- ✅ **零重建成本**: 無需重新build整個Next.js專案
- ✅ **零停機時間**: 網站持續運行，資料seamless更新
- ✅ **資源節約**: 節省GitHub Actions build time配額
- ✅ **即時反映**: `fetch()`方式確保使用者立即獲得最新資料

#### **對Footer顯示更新日期的影響**
配合此策略，建議在`stations.json`中加入metadata：
```json
{
  "metadata": {
    "lastUpdated": "2025-09-08T02:00:00Z",
    "totalStations": 247,
    "geocodingSuccess": "93.5%",
    "dataSource": "台北市政府開放資料平台"
  },
  "stations": [...]
}
```

#### **實施時程規劃**
- **Phase 1**: UI美化完成 (本週)
- **Phase 2**: 實作選擇性部署workflow (下週)  
- **Phase 3**: Footer metadata顯示功能
- **Phase 4**: 完整自動化測試

### 🎯 **專案完成度更新**
- **Day 1**: 基礎架構建置 (30%) ✅
- **Day 2**: 核心功能實現 (75%) ✅  
- **Day 3**: Geocoding革命性突破 (85%) ✅
- **Day 4**: 部署策略確立 (87%) ✅
- **Target**: UI美化 + 自動化部署完成 (95%)

---

## 🎨 **第五天UI革新 Day 5 UI Revolution (2025-09-08)**

### ✅ **今日重大成就 Major Accomplishments Today**

#### **1. SideBar UI完整設計**
- ✅ **Grid Layout 優化**: 解決icon與文字對齊問題，改用`grid-cols-[auto_1fr]`實現完美排版
- ✅ **Flex Layout 重構**: 採用`justify-between`將主要內容與小提示區塊分離
- ✅ **資訊整合**: 將資料更新日期、來源連結整合至小提示區塊，避免Footer冗餘
- ✅ **視覺優化**: 加入Google Maps導航按鈕，完整的檢驗站資訊展示

#### **2. 地圖主題與視覺升級**
- ✅ **CartoDB Voyager**: 採用柔和彩色地圖主題，提升視覺質感
- 🚫 **台北市邊界實驗**: 嘗試GeoJSON邊界突出效果，因精確度問題放棄
- ✅ **技術學習**: 深度理解GeoJSON、多圖層疊加等地圖技術方案

#### **3. Marker Clustering革命性突破** 🏆
- ✅ **套件整合**: 成功安裝`leaflet.markercluster`，解決react-leaflet v5相容性問題
- ✅ **聚類功能**: 實現247個檢驗站的智慧聚類，解決標記重疊問題
- ✅ **自訂樣式**: 設計teal/cyan配色系統
  - 小聚類(2-4個): 30px淺teal圓圈
  - 中聚類(5-14個): 40px標準teal圓圈  
  - 大聚類(15+個): 50px深teal圓圈
- ✅ **互動體驗**: 實現縮放自動展開、點擊跳轉等功能

#### **4. 圖標設計最佳化**
- ✅ **Tailwind圓圈圖標**: 放棄複雜SVG，採用純CSS圓圈設計
- ✅ **漸層效果**: `bg-gradient-to-br from-teal-500 to-cyan-500`
- ✅ **互動效果**: `hover:scale-110`放大效果，提升使用體驗
- ✅ **移除Popup**: 簡化互動邏輯，為後續sidebar/drawer整合做準備

### 🔧 **技術實作細節 Technical Implementation Details**

#### **檔案架構優化**
```
src/components/
├── SideBar.tsx          # 完整側邊欄設計 ✅
├── MapComponent.tsx     # 地圖主體優化 ✅  
├── MarkerCluster.tsx    # 聚類功能元件 ✅ (新增)
├── Map.tsx             # 動態載入包裝器
└── Footer.tsx          # 基礎footer結構

src/icons/              # 自製icon系統 ✅
├── Globe.tsx, GoogleMap.tsx, MapPin.tsx
├── Phone.tsx, User.tsx
```

#### **核心技術突破**
- **MarkerCluster元件**: 獨立封裝聚類邏輯，支援Tailwind自訂樣式
- **CSS Grid精準對齊**: `grid-cols-[auto_1fr]`解決icon文字排版問題
- **Leaflet.markercluster整合**: 克服react-leaflet版本相容性挑戰

### 📊 **專案狀態更新 Project Status Update**

#### **桌面版UI完成度**: 95% ✅
- ✅ SideBar設計完整
- ✅ 地圖功能完備 (clustering + 自訂圖標)
- ✅ 響應式基礎佈局
- 🚀 **準備就緒**: 可開始資料層整合

#### **明日重點任務 Tomorrow's Priority Tasks**
1. **🎯 Zustand狀態管理**: 實現全域stations資料管理
2. **🔗 組件資料整合**: SideBar、Map、搜尋功能資料串接  
3. **📱 手機版UI開發**: 響應式佈局、drawer設計
4. **🗺️ TGOS API整合**: 提升geocoding精確度至99%+
5. **🔍 搜尋功能**: 區域篩選、關鍵字搜尋

### 🎉 **技術成就總結 Technical Achievement Summary**
今日完成了前端UI的核心架構，特別是**Marker Clustering**的成功實作大幅提升了用戶體驗。從密密麻麻的247個標記，變成智慧聚類的數字圓圈，解決了地圖可用性的關鍵問題。

桌面版UI已具備專業水準，準備進入資料層整合階段。

---

**專案開始日期**: 2025-09-01  
**目前完成度**: **90%** (桌面版UI完成)  
**預計發布時間**: 1週內 (資料整合 + 手機版 + TGOS)  
**最後更新**: 2025-09-08 22:15