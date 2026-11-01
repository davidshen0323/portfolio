export function contractTotal(contract) {
  return contract.quantity * contract.months * contract.unitFee;
}
export function validateContract(form) {
  if (
    !form.partner?.trim() ||
    !form.title?.trim() ||
    !form.productId ||
    !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate) ||
    Number.isNaN(Date.parse(form.startDate)) ||
    new Date(form.startDate).toISOString().slice(0, 10) !== form.startDate
  )
    throw new Error('請完整填寫合作對象、方案名稱與開始日期。');
  if (
    !Number.isInteger(form.quantity) ||
    form.quantity < 1 ||
    form.quantity > 10000 ||
    !Number.isInteger(form.months) ||
    form.months < 1 ||
    form.months > 60 ||
    !Number.isInteger(form.unitFee) ||
    form.unitFee < 0 ||
    form.unitFee > 1000000
  )
    throw new Error('數量須為 1–10000、期間須為 1–60 個月，費用須為非負整數。');
}
export function createContract(form, id, at) {
  validateContract(form);
  return {
    ...form,
    partner: form.partner.trim(),
    title: form.title.trim(),
    id,
    status: '待審核',
    createdAt: at,
    note: '',
  };
}
export function reviewContract(contract, status, note) {
  if (contract.status !== '待審核' || !['已核准', '已退回'].includes(status))
    throw new Error('只有待審核的合約可以處理。');
  if (status === '已退回' && !note.trim()) throw new Error('退回時請填寫原因。');
  return { ...contract, status, note: note.trim() };
}
export function resubmitContract(contract, form) {
  if (contract.status !== '已退回') throw new Error('只有退回的合約可以重新送審。');
  validateContract(form);
  return { ...contract, ...form, status: '待審核', note: '' };
}
export function applyReceipt(state, stock, receiptId, values, at) {
  const receipt = state.receipts.find((entry) => entry.id === receiptId);
  if (!receipt || receipt.status !== '待驗收') throw new Error('這筆入庫單已處理，無法重複入庫。');
  const { received, damaged, reason = '' } = values;
  if (
    !Number.isInteger(received) ||
    received < 0 ||
    received > 10000 ||
    !Number.isInteger(damaged) ||
    damaged < 0 ||
    damaged > received
  )
    throw new Error('實收與損壞數量須為整數，損壞不得超過實收。');
  if ((received !== receipt.expected || damaged > 0) && !reason.trim())
    throw new Error('數量差異或商品損壞時，請填寫驗收原因。');
  if (!stock.some((product) => product.id === receipt.productId))
    throw new Error('找不到對應商品，請確認商品資料。');
  const accepted = received - damaged;
  return {
    business: {
      ...state,
      receipts: state.receipts.map((entry) =>
        entry.id === receiptId
          ? {
              ...entry,
              status: '已入庫',
              received,
              damaged,
              accepted,
              reason: reason.trim(),
              completedAt: at,
            }
          : entry,
      ),
      audit: [
        {
          id: `AUDIT-${receiptId}-${at}`,
          entity: receiptId,
          action: '完成入庫',
          detail: reason.trim(),
          quantity: accepted,
          at,
        },
        ...state.audit,
      ].slice(0, 100),
    },
    stock: stock.map((product) =>
      product.id === receipt.productId ? { ...product, qty: product.qty + accepted } : product,
    ),
  };
}
