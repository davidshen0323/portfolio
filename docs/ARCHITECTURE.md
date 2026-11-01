# 架構與設計決策

## 目標

把原本靜態頁面搭配零散 DOM 操作的作品集，整理成可以追蹤資料流、替換資料來源、測試核心規則的 React 專案。重點是責任明確，不是為了增加檔案數量而增加抽象。

## 分層規則

| 層                | 可以做的事                                     | 不應承擔的責任                  |
| ----------------- | ---------------------------------------------- | ------------------------------- |
| Page / components | 畫面組合、受控表單、顯示資料與派送動作         | 直接改庫存、繞過競賽狀態規則    |
| hooks             | 協調 UI 狀態、資料讀寫、訂閱、計時器與取消請求 | 把可獨立驗證的計算寫死在 JSX 裡 |
| domain            | 純函式計算、驗證、狀態轉換                     | React、DOM、localStorage、HTTP  |
| services          | HTTP、儲存及邊界資料處理                       | 渲染畫面                        |
| data              | 概念資料與內容設定                             | 執行 UI 操作                    |
| shared            | 跨功能的基礎能力與通用元件                     | 引用特定功能的畫面              |

`tests/domain/architecture.test.js` 會檢查 domain 對 React／UI／儲存的依賴，並防止 HTML 字串注入回到 React 畫面。

## 結帳的資料流

1. `ShopPage` 收集商品與使用者操作。
2. `useCart` 管理購物車；`cart.js` 計算價格與驗證數量。
3. `orderRepository.placeOrder` 在送出當下重新讀取庫存，以商品資料的價格建立訂單。
4. 儲存訂單與扣除庫存；任一寫入失敗時嘗試還原先前內容，並顯示錯誤，不假裝建立成功。
5. 共用儲存事件通知後台 Hooks 讀取最新資料。

這不是資料庫交易。localStorage 不提供多分頁交易鎖；正式多人環境仍需由伺服器進行庫存鎖定與訂單交易。這個邊界在 service 層，可以替換成 HTTP API，而不用重寫商品卡片。

## 競賽與遊戲

競賽元件只傳出 `participate`、`close`、`result`、`approve`、`dispute`。`contest.js` 驗證身份、期限、參與限制與狀態；`contestStore.js` 處理整份資料與點數一致性。

遊戲模型處理 JOIN、LEAVE、FIRE、HIT、AUTO、DISCONNECT 等事件。命中必須能對應到已發射的請求，重複命中編號不重複增加點數。React hook 協調計時器；Canvas renderer 專心畫圖，沒有修改點數的權限。

所有 interval、ResizeObserver、requestAnimationFrame 和請求取消都有相應清理，避免離開頁面後持續執行。

## 中英文

`I18nProvider` 決定語言、網址參數與偏好記憶。元件使用 `useI18n()` 取得 `t()`，不再用 MutationObserver 改畫面上的字。篩選值與儲存狀態維持原值，使用者輸入保持原樣。

現有中文文案作為翻譯索引，保留舊翻譯表以減少遷移風險。這對目前規模足夠；若需要翻譯協作平台，可逐步將索引改為穩定的語意 key。此次沒有導入不需要的全域狀態套件。

## 路由與樣式

各作品使用 React Router 與 lazy import。建置後為每個原有 `.html` 網址產生入口殼，兼容舊連結與靜態託管。

保留既有視覺設計，各 CSS 主題在 PostCSS 階段被限定到 `.page-*` 根節點。這讓路由切換後仍留在頁面的樣式不會污染其他作品。樣式原始碼經格式化，可以直接閱讀；這是一個明確的視覺遷移策略，未額外重畫所有作品。

## 驗證

測試重點放在具有失敗成本的規則：避免超賣、儲存失敗回復、點數不足與重複參與、結果確認／爭議、命中去重、離線停止 AUTO、API 空資料與不安全連結、CSV 公式注入、語言切換保留輸入值。

瀏覽器驗證與單元測試互補；測試沒有宣稱完整涵蓋正式付款、伺服器權限或多人同步。

## 建議先閱讀的檔案

1. `src/app/App.jsx`：看到 11 個作品與解析頁如何組合。
2. `src/features/commerce/ShopPage.jsx`：理解 Page 與 Hooks 如何協作。
3. `src/features/commerce/services/orderRepository.js`：理解外部資料邊界。
4. `src/features/contests/domain/contestStore.js`：理解純函式處理資料一致性。
5. `tests/domain/commerce.test.js`：從失敗情境理解規則。

## 經驗延伸功能

`messages/domain` 管理篩選、已讀與去重，`services/localMessageSource` 提供可取消訂閱的事件來源和可中止的分頁請求。列表負責 IntersectionObserver 與載入狀態；手動載入按鈕作為替代操作。

`business/domain` 管理合約狀態轉移、日期和費用驗證、驗收差異與良品計算。`receivingRepository` 重新讀取資料並更新共用庫存，寫入失敗嘗試回復兩筆原值。本機儲存沒有跨分頁交易鎖，操作紀錄也不是不可竄改的伺服器稽核。

`commerce/domain/pricing` 是結帳顯示與下單共用的費用規則；門檻按原價小計判斷，免運按折扣及加價購後金額判斷。下單合併同商品的原價與加價購數量後檢查庫存。城市更換清空行政區，配送方式決定地址或門市欄位。

## 訂單處理與相容舊資料

`operations/domain/orderWorkflow.js` 定義允許的狀態轉換與 CSV 資料投影。待處理可進入處理中或取消；處理中可完成或取消；完成、取消為終態。畫面選項與寫入驗證使用相同規則，避免只在下拉選單限制。每次有效變更在訂單中保存前後狀態與時間，與狀態一起寫入。

詳情頁直接顯示結帳保存的價格快照與收件資料，不依現行商品價格重新推算。舊訂單若無地址或費用拆分則明確顯示缺少紀錄，不補造運費與折扣。狀態變更不代表退款、通知或庫存回補；這些需要獨立的正式業務流程。CSV 只匯出目前篩選結果，透過共用函式處理引號與公式注入。
