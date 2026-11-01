export const orderStatuses = ['待處理', '處理中', '已完成', '已取消'];
const transitions = {
  待處理: ['處理中', '已取消'],
  處理中: ['已完成', '已取消'],
  已完成: [],
  已取消: [],
};
export function availableOrderStatuses(status) {
  return [status, ...(transitions[status] || [])];
}
export function transitionOrder(order, nextStatus, at) {
  if (nextStatus === order.status) return order;
  if (!transitions[order.status]?.includes(nextStatus))
    throw new Error('此訂單無法變更為指定狀態。');
  return {
    ...order,
    status: nextStatus,
    statusHistory: [{ from: order.status, to: nextStatus, at }, ...(order.statusHistory || [])],
  };
}
export function orderExportRows(orders, translate = (value) => value) {
  return [
    [
      '訂單編號',
      '收件人',
      '聯絡 Email',
      '配送方式',
      '配送城市',
      '行政區',
      '街道地址',
      '取貨門市代碼',
      '商品小計',
      '優惠折抵',
      '加價購',
      '運費',
      '訂單總額',
      '狀態',
      '建立日期',
    ].map((label) => translate(label)),
    ...orders.map((order) => [
      order.id,
      order.name,
      order.email || '',
      translate(order.delivery || ''),
      translate(order.deliveryInfo?.city || ''),
      translate(order.deliveryInfo?.district || ''),
      order.deliveryInfo?.address || '',
      order.deliveryInfo?.storeCode || '',
      order.pricing?.subtotal ?? '',
      order.pricing?.discount ?? '',
      order.pricing?.addonTotal ?? '',
      order.pricing?.shipping ?? '',
      order.total,
      translate(order.status),
      order.created,
    ]),
  ];
}
