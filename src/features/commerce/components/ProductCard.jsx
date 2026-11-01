import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money } from '../../../shared/lib/format';
export function ProductImage({ product, className = 'product-photo' }) {
  const { t } = useI18n();
  return (
    <div
      className={className}
      style={{ backgroundPosition: `${product.x} ${product.y}` }}
      role="img"
      aria-label={t(product.name)}
    />
  );
}
export default function ProductCard({ product, stock, onDetails, onAdd }) {
  const { t, locale } = useI18n();
  return (
    <article className="product">
      <ProductImage product={product} />
      <div className="product-info">
        <small>{t(product.category)} / AXIS OBJECTS</small>
        <h3>{t(product.name)}</h3>
        <p>{t(product.desc)}</p>
        <button className="detail-link" onClick={onDetails}>
          {t('商品詳情 ↗')}
        </button>
        <div className="product-bottom">
          <b>{money(product.price, locale)}</b>
          <button disabled={!stock} onClick={onAdd}>
            {t(stock ? '加入購物車 ＋' : '暫時售完')}
          </button>
        </div>
      </div>
    </article>
  );
}
