# Taipei Scooter Checker 🛵

## 專案概述 Project Overview

台北市機車排氣檢驗站地圖查詢系統，結合政府開放資料與地圖服務的完整解決方案。

**🚀 Live Demo**: https://lucien-mhl.github.io/taipei-scooter-checker/

### 專案目標
- **面試作品展示** - 展示 React/Next.js + 地圖整合技術能力
- **個人實用需求** - 解決機車年度檢驗站點查詢問題
- **技術學習** - 整合政府開放資料 API、Geocoding、地圖服務

## 核心技術架構 Core Technical Architecture

### 前端技術棧
- **Framework**: Next.js 15.5.2 (App Router, Static Export)
- **UI**: React 18 + TypeScript + TailwindCSS 4.0
- **地圖**: React-Leaflet + Leaflet MarkerCluster
- **狀態管理**: Zustand
- **部署**: GitHub Pages + GitHub Actions

### 資料處理系統
- **資料源**: 台北市政府開放資料平台 (247家檢驗站)
- **Geocoding**: Nominatim API (**98.8%成功率**)
- **失敗處理**: 僅3家需手動處理 (市民大道2家, 哈密街巷弄1家)
- **更新機制**: GitHub Actions 自動化 + 完整logging

## 關鍵技術突破 Key Technical Breakthroughs

### 1. 地址格式化策略 **🎯 重大突破**
**發現**: 台灣地址逗號分隔格式大幅提升geocoding成功率
```javascript
// ✅ 最佳格式 (98.8%成功率)
"臺北市, 中正區, 重慶南路3段, 135號"
// ❌ 原始格式 (低成功率)
"臺北市中正區重慶南路3段135號"
```

### 2. 符號轉換技術
- **破折號處理**: `-` → `之` (解決部分門牌號問題)
- **子門牌處理**: 識別無法處理的案例並保留資料

### 3. GitHub Pages 部署最佳化
```typescript
// 解決Next.js靜態導出 + 子路徑部署
const nextConfig = {
  output: 'export',
  basePath: '/taipei-scooter-checker'
}
```

## 專案結構 Project Structure

```
taipei-scooter-checker/
├── src/
│   ├── app/page.tsx              # 主頁面
│   ├── components/               # React組件
│   ├── stores/useStations.ts     # Zustand狀態管理
│   └── types/station.ts          # TypeScript類型
├── scripts/
│   ├── index.js                  # 主控制器腳本
│   ├── get-stations.js           # API資料獲取
│   ├── geocoding.js              # 座標化處理
│   ├── format-address.js         # 地址格式化
│   ├── compare-different.js      # 資料比對
│   ├── logger.js                 # 日誌系統
│   └── save-data.js              # 資料保存
├── public/data/stations.json     # 前端資料
└── .github/workflows/deploy.yml  # 自動部署
```

## 技術成就總結 Technical Achievement Summary

### 🏆 核心成就
- **98.8% Geocoding精確率** - 247家中244家成功自動化
- **完整產品交付** - 從概念到上線的完整流程
- **現代化技術棧** - Next.js 15 + React 18 + TypeScript
- **完美響應式設計** - 桌面/手機雙版本適配
- **健壯的自動化系統** - 完整logging + 失敗處理

### 🎯 技術突破
- **地址格式化算法** - 逗號分隔格式提升成功率至98.8%
- **失敗站點保留機制** - 確保資料完整性，coordinates: null標記
- **模組化架構** - 7個專門模組，職責分離清晰
- **完整測試驗證** - 247個站點端到端測試通過

### 📊 最終數據 (2025-09-22)
- **檢驗站覆蓋**: 247/247 家 (100%)
- **自動化成功**: 244 家 Nominatim geocoding
- **需手動處理**: 3 家 (AI6-駿全車坊, AK0-國真車業, AM9-樺新車業)
- **整體可用性**: 100%

## 開發記錄 Development Log

### 最新完成項目 (2025-09-22)
✅ **主控制器修復完成** - 解決geocoding結果更新問題
✅ **Logger系統** - 完整的執行追蹤和統計
✅ **失敗處理機制** - 保留失敗站點而非丟棄
✅ **端到端測試** - 247個站點完整測試通過

### 待完成項目

#### Phase 1 - 資料與前端更新 (高優先級)
🔄 **資料更新** - 更新 `public/data/stations.json` 為98.8%成功率的最新資料
🔄 **前端失敗站點顯示** - 處理 `coordinates: null` 的站點UI顯示
🔄 **TypeScript類型更新** - 支援 `coordinates: null` 的型別定義
🔄 **搜尋功能優化** - 確保search能找到無座標站點
🔄 **地圖標記調整** - MarkerCluster處理無座標站點邏輯

#### Phase 2 - GitHub自動化系統 (中優先級)
🔄 **GitHub Issues自動化** - 失敗站點手動處理workflow
🔄 **Cron Jobs設定** - GitHub Actions每月自動更新機制

#### Phase 3 - 系統驗證 (低優先級)
🔄 **Logger生產環境** - 驗證logging在production正常運作
🔄 **路徑邏輯確認** - save-data.js的production/development路徑

---

**專案狀態**: 核心功能完成，98.8%自動化率達成 ✅
**開發期間**: 2025-09-01 ~ 2025-09-22
**技術難度**: ⭐⭐⭐⭐⭐ (高)
**最後更新**: 2025-09-22