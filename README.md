# David Shen Portfolio — React

以 React 重構的雙語作品集，包含 9 個可操作作品與 9 篇解析。保留既有 `.html` 網址、品牌視覺與瀏覽器本機資料，將頁面、狀態規則與儲存責任分開。

## 開始使用

使用 Node.js 22 或更新版本，解壓縮後在專案目錄執行：

```bash
npm ci
npm run dev
```

開啟終端機顯示的本機網址。不要直接雙擊 `index.html`。

```bash
npm test          # 業務規則與 React 互動測試
npm run build     # 建置至 dist，並產生 19 個靜態路由入口
npm run preview   # 預覽建置成品
npm run format    # 統一原始碼格式
```

`?lang=zh` 開啟中文；`?lang=en` 開啟英文。偏好保存在目前瀏覽器。

## 專案架構

| 路徑                        | 責任                                          |
| --------------------------- | --------------------------------------------- |
| `src/app/App.jsx`           | 路由、lazy loading、錯誤邊界與頁面導覽        |
| `src/features/portfolio/`   | 首頁區塊、需求摘要、解析內容與解析頁          |
| `src/features/brands/`      | 汽車美容與咖啡品牌頁                          |
| `src/features/commerce/`    | 商品、購物車計算、結帳及訂單儲存              |
| `src/features/operations/`  | 總覽、訂單、預約、庫存、客戶、報表與客服      |
| `src/features/dealer/`      | 車源篩選、比較、月付試算與詢問表單            |
| `src/features/earthquakes/` | USGS 資料存取、取消請求、載入與錯誤狀態       |
| `src/features/responsive/`  | 修復前後比較與實際尺寸量測                    |
| `src/features/contests/`    | Freebet 介面、競賽狀態規則與資料 Hooks        |
| `src/features/gameflow/`    | 遊戲事件模型、Canvas 繪圖與 AUTO 生命週期     |
| `src/shared/components/`    | 對話框、表格、語言切換、提示、共用連結        |
| `src/shared/hooks/`         | 本機資料同步、倒數計時                        |
| `src/shared/i18n/`          | React 語言 Context、翻譯函式與英文內容        |
| `src/shared/lib/`           | 儲存、識別碼、格式化與 CSV 邊界處理           |
| `src/shared/styles/`        | 頁面視覺主題與共用基礎樣式                    |
| `public/`                   | 圖片與 favicon                                |
| `tests/`                    | 業務規則、資料邊界、架構依賴與 React 互動測試 |
| `docs/ARCHITECTURE.md`      | 設計決策、資料流與擴充方式                    |

功能內再依需要分成 `components`、`hooks`、`domain`、`services`、`data`；沒有需求就不額外增加空的分層。

## 怎麼修改

- 改首頁某一區：`src/features/portfolio/components/` 的對應區塊元件。
- 改解析內容：`src/features/portfolio/data/caseStudies.json`。
- 改商品資料：`src/features/commerce/data/products.json` 與 `specifications.json`。
- 改結帳規則：`commerce/domain/cart.js`；改儲存／未來串 API：`commerce/services/orderRepository.js`。
- 改競賽規則：`contests/domain/contest.js` 與 `contestStore.js`，不要在按鈕中直接修改點數。
- 改遊戲事件規則：`gameflow/domain/game.js`；改場景繪圖：`gameflow/components/arenaRenderer.js`。
- 改英文：`shared/i18n/en.json`。只對固定文案或概念資料呼叫 `t()`，使用者輸入直接交給 React 顯示。

## 部署

執行 `npm run build`，將 `dist` 內的內容部署到靜態網站空間。建置會產生原有的 19 個 HTML 入口，直接開啟或重新整理 `shop.html` 等網址不需要伺服器 rewrite。

不要把 `src` 當成靜態成品上傳。`dist` 是自動產物，不應手動修改。`package-lock.json` 固定安裝版本；使用 `npm ci` 重建依賴。

## 範圍

這是前端作品集，並非正式電商、投注平台或多人遊戲後端。訂單、庫存、客服與競賽使用 localStorage；既有 key 保留，因此原網址上的本機資料可以沿用。不同網域、裝置或清除瀏覽資料後不會同步。

付款、真實登入、權威遊戲伺服器與多人同步沒有實作。Freebet 與 GAMEFLOW 是依實務經驗自主重建的網頁作品，不含公司原始碼或素材。USGS 查詢與 Google Fonts 需要外部網路。
# portfolio
