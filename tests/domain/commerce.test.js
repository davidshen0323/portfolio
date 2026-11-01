import { describe, expect, it } from 'vitest';
import { cartItems, cartTotal } from '../../src/features/commerce/domain/cart';
import {
  ORDER_KEY,
  STOCK_KEY,
  placeOrder,
} from '../../src/features/commerce/services/orderRepository';
import products from '../../src/features/commerce/data/products.json';
import stock from '../../src/features/commerce/data/stock.json';
const customer = { name: 'Test User', email: 'test@example.com', delivery: '宅配' };
describe('local checkout consistency', () => {
  it('creates an order with verified prices and deducts stock', () => {
    const order = placeOrder({ P01: 2 }, customer);
    expect(order.total).toBe(1960);
    expect(JSON.parse(localStorage.getItem(STOCK_KEY)).find((p) => p.id === 'P01').qty).toBe(10);
    expect(JSON.parse(localStorage.getItem(ORDER_KEY))[0].id).toBe(order.id);
    expect(cartTotal(cartItems({ P01: 2 }, products))).toBe(1960);
  });
  it('rechecks stock and rejects overselling without creating an order', () => {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock.map((p) => ({ ...p, qty: 0 }))));
    expect(() => placeOrder({ P01: 1 }, customer)).toThrow('庫存不足');
    expect(localStorage.getItem(ORDER_KEY)).toBeNull();
  });
  it('restores the prior stock if the order write fails', () => {
    const values = new Map([[STOCK_KEY, JSON.stringify(stock)]]);
    const storage = {
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => values.delete(key),
      setItem: (key, value) => {
        if (key === ORDER_KEY) throw new Error('Quota');
        values.set(key, value);
      },
    };
    expect(() => placeOrder({ P01: 1 }, customer, storage)).toThrow('無法儲存');
    expect(JSON.parse(values.get(STOCK_KEY))).toEqual(stock);
  });
});
