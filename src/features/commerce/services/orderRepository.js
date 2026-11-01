import { createId } from '../../../shared/lib/id';
import products from '../data/products.json';
import initialStock from '../data/stock.json';
import { validateCart } from '../domain/cart';
import { calculateOrder, validateDelivery } from '../domain/pricing';
import { addOnOffer } from '../data/delivery';
import { readStored, STORAGE_EVENT } from '../../../shared/lib/storage';

export const ORDER_KEY = 'axis-demo-orders';
export const STOCK_KEY = 'forma-demo-stock';

/** Re-read stock at checkout; preserve both keys if either write fails. */
export function placeOrder(cart, customer, storage = window.localStorage, options = {}) {
  if (!customer.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    throw new Error('請填寫有效的姓名與 Email。');
  const stock = readStored(STOCK_KEY, initialStock, storage);
  const items = validateCart(cart, products, stock);
  validateDelivery(customer);
  const quote = calculateOrder(items, { ...options, delivery: customer.delivery });
  const requested = { ...cart };
  if (options.addOn) requested[addOnOffer.productId] = (requested[addOnOffer.productId] || 0) + 1;
  validateCart(requested, products, stock);
  const addon = options.addOn
    ? products.find((product) => product.id === addOnOffer.productId)
    : null;
  const orders = readStored(ORDER_KEY, [], storage);
  const order = {
    id: `AX-${createId().slice(0, 8).toUpperCase()}`,
    name: customer.name.trim(),
    email: customer.email.trim(),
    delivery: customer.delivery,
    total: quote.total,
    pricing: quote,
    deliveryInfo: {
      city: customer.city,
      district: customer.district,
      ...(customer.delivery === '宅配'
        ? { address: customer.address.trim() }
        : { storeCode: customer.storeCode }),
    },
    items: [
      ...items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      ...(addon
        ? [{ id: addon.id, name: addon.name, price: addOnOffer.price, qty: 1, isAddOn: true }]
        : []),
    ],
    status: '待處理',
    created: new Date().toISOString(),
  };
  const snapshots = [STOCK_KEY, ORDER_KEY].map((key) => [key, storage.getItem(key)]);
  try {
    storage.setItem(
      STOCK_KEY,
      JSON.stringify(stock.map((row) => ({ ...row, qty: row.qty - (requested[row.id] || 0) }))),
    );
    storage.setItem(ORDER_KEY, JSON.stringify([order, ...orders]));
  } catch {
    for (const [key, previous] of snapshots) {
      try {
        if (previous === null) storage.removeItem(key);
        else storage.setItem(key, previous);
      } catch {
        /* Surface failure; never claim checkout succeeded. */
      }
    }
    throw new Error('無法儲存資料，請確認瀏覽器儲存空間後重試。');
  }
  for (const key of [STOCK_KEY, ORDER_KEY])
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
  return order;
}
