import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money } from '../../../shared/lib/format';
export default function OrderSummary({ quote }) {
  const { t, locale } = useI18n();
  return (
    <div className="checkout-summary" aria-label={t('費用明細')}>
      {[
        ['商品小計', quote.subtotal],
        ['優惠折抵', -quote.discount],
        ['加價購', quote.addonTotal],
        ['運費', quote.shipping],
      ].map(([label, amount]) => (
        <div key={label}>
          <span>{t(label)}</span>
          <b>{amount < 0 ? '−' + money(-amount, locale) : money(amount, locale)}</b>
        </div>
      ))}
      <div className="summary-grand-total">
        <strong>{t('訂單總額')}</strong>
        <strong>{money(quote.total, locale)}</strong>
      </div>
    </div>
  );
}
