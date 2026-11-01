import { useMemo, useState } from 'react';
import products from '../data/products.json';
import { cartItems, cartTotal } from '../domain/cart';

export function useCart(stock) {
  const [cart, setCart] = useState({});
  const items = useMemo(() => cartItems(cart, products), [cart]);
  const change = (id, delta) =>
    setCart((current) => {
      const available = stock.find((row) => row.id === id)?.qty || 0;
      const qty = Math.min(available, Math.max(0, (current[id] || 0) + delta));
      const next = { ...current };
      if (qty) next[id] = qty;
      else delete next[id];
      return next;
    });
  return {
    cart,
    items,
    total: cartTotal(items),
    count: items.reduce((n, item) => n + item.qty, 0),
    change,
    remove: (id) =>
      setCart((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      }),
    clear: () => setCart({}),
  };
}
