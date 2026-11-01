export const messageTemplates = [
  {
    category: 'orders',
    subject: '訂單已完成付款',
    body: '新的訂單已完成付款，請核對商品數量並安排後續處理。',
    sender: '訂單服務',
  },
  {
    category: 'operations',
    subject: '入庫單等待驗收',
    body: '物流中心已收到貨件，請核對紙箱、周轉箱與實收數量，完成入庫驗收。',
    sender: '物流中心',
  },
  {
    category: 'system',
    subject: '帳戶安全提醒',
    body: '請定期檢查登入與通知設定；本作品沒有真實帳戶登入。',
    sender: '系統通知',
  },
  {
    category: 'operations',
    subject: '合約審核待辦',
    body: '合作方案已送交審核，請確認數量、期間與費用是否符合提案。',
    sender: '營運團隊',
  },
  {
    category: 'orders',
    subject: '配送資訊已更新',
    body: '配送進度已更新。可從後台確認訂單與收件資訊，避免重複處理。',
    sender: '配送服務',
  },
  {
    category: 'system',
    subject: '本週功能更新',
    body: '訊息中心提供搜尋、未讀篩選、封存與持續載入，所有操作僅保留於目前裝置。',
    sender: '產品團隊',
  },
];
export function createInitialMessages(now = Date.now()) {
  return Array.from({ length: 48 }, (_, index) => ({
    ...messageTemplates[index % messageTemplates.length],
    id: `MSG-${String(index + 1).padStart(4, '0')}`,
    createdAt: now - index * 1800000,
    read: index >= 12,
    archived: false,
  }));
}
