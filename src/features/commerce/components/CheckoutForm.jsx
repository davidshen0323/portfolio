import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Feedback from '../../../shared/components/Feedback';
import { deliveryAreas } from '../data/delivery';
import { calculateOrder } from '../domain/pricing';
import OrderSummary from './OrderSummary';
export default function CheckoutForm({ basket, customer, setCustomer, onCheckout, message }) {
  const { t } = useI18n();
  const [couponDraft, setCouponDraft] = useState('');
  const [options, setOptions] = useState({ coupon: '', addOn: false });
  let quote,
    quoteError = '';
  try {
    quote = calculateOrder(basket.items, { ...options, delivery: customer.delivery });
  } catch (error) {
    quoteError = error.message;
    quote = calculateOrder(basket.items, { delivery: customer.delivery });
  }
  const update = (key, value) => setCustomer({ ...customer, [key]: value });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!quoteError) onCheckout(options);
      }}
    >
      <p>{t('此流程不收集付款資料，也不會寄出商品。')}</p>
      {[
        ['name', '收件人', 'text'],
        ['email', '聯絡 Email', 'email'],
      ].map(([key, label, type]) => (
        <label key={key}>
          {t(label)}
          <input
            type={type}
            value={customer[key]}
            onChange={(e) => update(key, e.target.value)}
            required
            maxLength={100}
          />
        </label>
      ))}
      <label>
        {t('配送方式')}
        <select value={customer.delivery} onChange={(e) => update('delivery', e.target.value)}>
          {['宅配', '超商取貨'].map((value) => (
            <option key={value} value={value}>
              {t(value)}
            </option>
          ))}
        </select>
      </label>
      <div className="delivery-fields">
        <label>
          {t('配送城市')}
          <select
            required
            value={customer.city || ''}
            onChange={(e) => setCustomer({ ...customer, city: e.target.value, district: '' })}
          >
            <option value="">{t('請選擇城市')}</option>
            {Object.keys(deliveryAreas).map((city) => (
              <option key={city} value={city}>
                {t(city)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('行政區')}
          <select
            required
            disabled={!customer.city}
            value={customer.district || ''}
            onChange={(e) => update('district', e.target.value)}
          >
            <option value="">{t('請選擇行政區')}</option>
            {(deliveryAreas[customer.city] || []).map((district) => (
              <option key={district} value={district}>
                {t(district)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {customer.delivery === '宅配' ? (
        <label>
          {t('街道地址')}
          <input
            required
            minLength={5}
            maxLength={120}
            value={customer.address || ''}
            onChange={(e) => update('address', e.target.value)}
            placeholder={t('僅輸入測試地址')}
          />
        </label>
      ) : (
        <label>
          {t('取貨門市代碼')}
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={customer.storeCode || ''}
            onChange={(e) => update('storeCode', e.target.value)}
            placeholder={t('6 位數測試代碼')}
          />
        </label>
      )}
      <small className="checkout-note">
        {t('配送區域提供臺北、新北與桃園的部分行政區；此流程不會建立真實配送。')}
      </small>
      <section className="checkout-promotions">
        <h3>{t('購物優惠')}</h3>
        <p>
          {t(
            '商品小計滿 NT$ 1,000，可用 AXIS10 折抵 10%，最高 NT$ 200；折扣後商品合計滿 NT$ 2,000 免運。',
          )}
        </p>
        <div className="coupon-controls">
          <input
            aria-label={t('優惠碼')}
            value={couponDraft}
            onChange={(e) => setCouponDraft(e.target.value)}
            placeholder="AXIS10"
            maxLength={20}
          />
          <button
            type="button"
            onClick={() => setOptions({ ...options, coupon: couponDraft.trim().toUpperCase() })}
          >
            {t('套用')}
          </button>
          {options.coupon && (
            <button
              type="button"
              onClick={() => {
                setCouponDraft('');
                setOptions({ ...options, coupon: '' });
              }}
            >
              {t('移除')}
            </button>
          )}
        </div>
        <label className="addon-choice">
          <input
            type="checkbox"
            checked={options.addOn}
            disabled={basket.total < 1000}
            onChange={(e) => setOptions({ ...options, addOn: e.target.checked })}
          />
          <span>{t('滿額加價購：超細纖維布 NT$ 290（每筆限 1 件）')}</span>
        </label>
        <small>{t('加價購與原價商品共用庫存，結帳時重新確認可售數量。')}</small>
      </section>
      <OrderSummary quote={quote} />
      <Feedback message={quoteError || message} error />
      <button
        className="checkout-btn"
        type="submit"
        disabled={Boolean(quoteError) || !basket.count}
      >
        {t('確認訂單內容')}
      </button>
    </form>
  );
}
