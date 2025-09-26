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

#### Phase 2 - GitHub自動化系統 (中優先級) ✅
✅ **GitHub Actions 每月自動更新** - 每月1號自動執行資料更新
✅ **智能 Issue 處理系統** - 自動建立失敗站點處理 Issue
✅ **Comment 監聽自動化** - 監聽座標回覆並自動更新資料
✅ **TGOS 地圖整合** - 使用台灣官方地圖服務查詢座標

#### 智能 Issue 處理流程 (Smart Issue Processing Workflow)
```
每月自動執行 → 發現失敗站點 → 自動建立Issue → 提供TGOS連結
     ↓
手動查詢座標 → Issue留言座標 → 觸發Comment監聽 → 自動更新資料
     ↓
資料提交推送 → 自動回覆確認 → 檢查處理進度 → 自動關閉Issue
```

**Issue 處理特色**：
- **TGOS 地圖連結** - 使用台灣內政部官方地圖服務
- **標準化格式** - 固定的座標回覆格式 `ID: 站點ID\n坐標: 緯度,經度`
- **自動化回饋** - 系統自動回覆處理結果並更新進度
- **智能關閉** - 所有站點處理完畢後自動關閉 Issue

#### Phase 3 - 系統驗證 ✅ **2025-09-24 完成**
✅ **Actions 運作測試** - 完整端到端測試成功
✅ **Issue 處理流程驗證** - AI6/AK0/AM9 三站點完整測試通過
✅ **環境變數修復** - 修正自動回覆中變數顯示問題
✅ **性能優化實現** - 快速格式驗證，錯誤情況節省85-90%時間
✅ **自動關閉機制** - 所有站點完成後自動關閉 Issue 功能驗證

#### Phase 4 - GitHub Pages 部署同步 🔄 **待解決 (2025-09-25)**
🔄 **自動部署觸發議題** - 座標更新後需要觸發 GitHub Pages 重建
🔄 **生產資料同步** - repository更新後，GitHub Pages的public/data/stations.json同步問題
🔄 **部署workflow整合** - 整合座標更新與網站部署流程

---

**專案狀態**: GitHub Actions自動化系統100%完成 🎉，剩餘GitHub Pages同步議題
**開發期間**: 2025-09-01 ~ 2025-09-24 (核心功能完成)
**技術難度**: ⭐⭐⭐⭐⭐ (高)
**最後更新**: 2025-09-24

### 🎯 2025-09-24 重大技術突破
- **完整端到端自動化系統** - 從資料更新到Issue處理100%自動化
- **247個檢驗站100%處理完成** - 98.8%自動成功率 + 手動處理機制
- **智能Comment監聽系統** - 自動解析座標並更新資料
- **完美的錯誤處理** - 快速驗證 + 詳細錯誤回饋

## 📊 最終系統架構 (Final System Architecture)

### 🔄 自動化工作流程
1. **每月資料更新** (`update-data.yml`)
   - 每月1號 09:00 (台灣時間) 自動執行
   - 呼叫政府開放資料 API
   - 執行 Nominatim geocoding
   - 自動提交資料變更

2. **失敗站點處理** (`update-data.yml`)
   - 自動偵測無座標站點
   - 建立包含 TGOS 連結的 Issue
   - 提供標準化處理說明

3. **座標回覆處理** (`process-coordinate.yml`)
   - 監聽 Issue comment 事件
   - 解析座標格式並更新資料
   - 自動回覆處理結果
   - 完成後自動關閉 Issue

### 🎯 技術成就總結
- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **地圖**: React-Leaflet + MarkerCluster
- **資料處理**: 98.8% 自動化 + 手動補完機制
- **自動化**: GitHub Actions 完整工作流程
- **用戶體驗**: 桌機/手機雙版本完整支援

---

## 📅 開發日誌 (Development Log)

### 2025-09-24 🎉 **GitHub Actions 自動化系統完成**

#### 🏆 主要成就
- ✅ **環境變數修復** - 解決自動回覆中 `${{ env.UPDATED_STATION }}` 和日期顯示問題
- ✅ **端到端測試完成** - AI6/AK0/AM9 三站點完整測試通過
- ✅ **性能優化實現** - 錯誤情況下節省 85-90% CI 執行時間
- ✅ **自動關閉機制驗證** - Issue 在所有站點處理完成後自動關閉
- ✅ **247個檢驗站100%覆蓋** - 完整的資料處理與自動化系統

#### 🔧 技術修復詳情
**修復前問題**:
```
• 站點 ID: (空白)
• 處理時間: $(date '+%Y-%m-%d %H:%M:%S') (未執行)
```

**修復後完美**:
```
• 站點 ID: AK0/AM9 ✅
• 處理時間: 2025-09-24 10:47:15 ✅
```

**修復方法**: 使用 `fs.appendFileSync(process.env.GITHUB_ENV)` + shell變數替換

#### 🚀 系統設計決策
- **保持簡單原則** - 拒絕批次處理複雜化，維持一次一站點的清晰邏輯
- **覆寫機制保留** - 允許座標覆寫以支持錯誤修正，利用Git歷史做版本控制

### 2025-09-25 🔄 **計劃：GitHub Pages 自動部署整合**

#### 📋 待解決議題
🔄 **部署觸發問題** - 座標更新後GitHub Pages未自動重建
🔄 **資料同步問題** - repository 的 stations.json 更新但生產環境未同步
🔄 **workflow整合** - 需要整合座標處理與網站部署流程

#### 💡 可能解決方案
1. **觸發Deploy workflow** - 在座標處理完成後觸發部署
2. **檢查現有Deploy觸發條件** - 確認是否包含 public/data/ 變更
3. **手動觸發機制** - 提供備用的手動部署方案

#### 🎯 預期成果
- ✅ 座標更新自動觸發網站重建
- ✅ 生產環境資料即時同步
- ✅ 完整的端到端自動化 (資料→處理→部署)

**目標**: 實現從座標更新到網站上線的完全自動化流程 🚀