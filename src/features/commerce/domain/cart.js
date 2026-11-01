export function cartItems(cart, products) {
  return products
    .filter((product) => Number.isInteger(cart[product.id]) && cart[product.id] > 0)
    .map((product) => ({ ...product, qty: cart[product.id] }));
}
export const cartTotal = (items) => items.reduce((total, item) => total + item.price * item.qty, 0);

export function validateCart(cart, products, stock) {
  const items = cartItems(cart, products);
  if (
    !items.length ||
    Object.keys(cart).some((id) => !products.some((product) => product.id === id))
  )
    throw new Error('購物車目前沒有商品。');
  for (const item of items) {
    const available = stock.find((row) => row.id === item.id)?.qty ?? 0;
    if (item.qty > available) throw new Error('有商品庫存不足，請調整購物車數量。');
  }
  return items;
}
