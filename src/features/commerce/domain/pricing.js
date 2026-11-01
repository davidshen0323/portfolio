import { addOnOffer, deliveryAreas } from '../data/delivery';
import { cartTotal } from './cart';
export function calculateOrder(items, { delivery = '宅配', coupon = '', addOn = false } = {}) {
  const subtotal = cartTotal(items);
  if (!['宅配', '超商取貨'].includes(delivery)) throw new Error('請選擇支援的配送方式。');
  const code = coupon.trim().toUpperCase();
  if (code && code !== 'AXIS10') throw new Error('優惠碼無效，請確認後再試。');
  if (code && subtotal < 1000) throw new Error('AXIS10 需商品小計滿 NT$ 1,000 才可使用。');
  if (addOn && subtotal < addOnOffer.minimumSubtotal)
    throw new Error('加價購需商品小計滿 NT$ 1,000。');
  const discount = code ? Math.min(200, Math.floor(subtotal * 0.1)) : 0;
  const addonTotal = addOn ? addOnOffer.price : 0;
  const merchandise = subtotal - discount + addonTotal;
  const shipping = merchandise >= 2000 ? 0 : delivery === '宅配' ? 100 : 60;
  return { subtotal, discount, addonTotal, shipping, total: merchandise + shipping, coupon: code };
}
export function validateDelivery(customer) {
  if (!deliveryAreas[customer.city]?.includes(customer.district))
    throw new Error('請選擇配送城市與行政區。');
  if (
    customer.delivery === '宅配' &&
    (!customer.address?.trim() || customer.address.trim().length < 5)
  )
    throw new Error('請填寫完整街道地址。');
  if (customer.delivery === '超商取貨' && !/^\d{6}$/.test(customer.storeCode || ''))
    throw new Error('請填寫 6 位數取貨門市代碼。');
}
