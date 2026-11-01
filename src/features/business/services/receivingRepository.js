import { readStored, STORAGE_EVENT } from '../../../shared/lib/storage';
import { STOCK_KEY } from '../../commerce/services/orderRepository';
import initialStock from '../../commerce/data/stock.json';
import { initialBusiness } from '../data/business';
import { applyReceipt } from '../domain/business';
export const BUSINESS_KEY = 'forma-business-v1';
export function completeReceiving(id, values, storage = window.localStorage) {
  const current = readStored(BUSINESS_KEY, initialBusiness, storage);
  const stock = readStored(STOCK_KEY, initialStock, storage);
  const result = applyReceipt(current, stock, id, values, new Date().toISOString());
  const previous = [BUSINESS_KEY, STOCK_KEY].map((key) => [key, storage.getItem(key)]);
  try {
    storage.setItem(STOCK_KEY, JSON.stringify(result.stock));
    storage.setItem(BUSINESS_KEY, JSON.stringify(result.business));
  } catch {
    for (const [key, value] of previous) {
      try {
        if (value === null) storage.removeItem(key);
        else storage.setItem(key, value);
      } catch {}
    }
    throw new Error('無法儲存資料，請確認瀏覽器儲存空間後重試。');
  }
  for (const key of [STOCK_KEY, BUSINESS_KEY])
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
  return result.business;
}
