import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money } from '../../../shared/lib/format';
import Modal from '../../../shared/components/Modal';
import DataTable from '../../../shared/components/DataTable';
import { StatusBadge } from './Panel';
export default function OrderDetails({ order, onClose }) {
  const { t, locale } = useI18n();
  const info = order?.deliveryInfo;
  return (
    <Modal open={Boolean(order)} title="訂單詳情" onClose={onClose}>
      {order && (
        <div className="order-details">
          <div className="order-detail-heading">
            <strong>{order.id}</strong>
            <StatusBadge status={order.status} />
          </div>
          <h3>{t('收件與配送')}</h3>
          <dl className="order-delivery">
            <dt>{t('收件人')}</dt>
            <dd>{order.name}</dd>
            <dt>{t('聯絡 Email')}</dt>
            <dd>{order.email || '—'}</dd>
            <dt>{t('配送方式')}</dt>
            <dd>{order.delivery ? t(order.delivery) : t('未提供')}</dd>
            <dt>{t('配送資訊')}</dt>
            <dd>
              {info ? (
                <>
                  {t(info.city)} / {t(info.district)}
                  <br />
                  {order.delivery === '宅配'
                    ? info.address
                    : `${t('取貨門市代碼')} ${info.storeCode}`}
                </>
              ) : (
                t('此筆歷史資料未保存配送明細。')
              )}
            </dd>
          </dl>
          <h3>{t('商品明細')}</h3>
          <DataTable
            rows={order.items.map((item, index) => ({
              ...item,
              rowId: `${item.id || 'item'}-${index}`,
            }))}
            rowKey="rowId"
            columns={[
              {
                key: 'name',
                label: '商品',
                render: (item) => (
                  <>
                    {t(item.name)}{' '}
                    {item.isAddOn && <span className="order-addon">{t('加價購')}</span>}
                  </>
                ),
              },
              { key: 'qty', label: '數量' },
              {
                key: 'price',
                label: '單價',
                render: (item) => (Number.isFinite(item.price) ? money(item.price, locale) : '—'),
              },
              {
                key: 'lineTotal',
                label: '項目金額',
                render: (item) =>
                  Number.isFinite(item.price) ? money(item.price * item.qty, locale) : '—',
              },
            ]}
          />
          <h3>{t('費用明細')}</h3>
          {order.pricing ? (
            <dl className="order-costs">
              {[
                ['商品小計', order.pricing.subtotal],
                ['優惠折抵', -order.pricing.discount],
                ['加價購', order.pricing.addonTotal],
                ['運費', order.pricing.shipping],
                ['訂單總額', order.total],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{t(label)}</dt>
                  <dd>{value < 0 ? '−' + money(-value, locale) : money(value, locale)}</dd>
                </div>
              ))}
              {order.pricing.coupon && (
                <div>
                  <dt>{t('優惠碼')}</dt>
                  <dd>{order.pricing.coupon}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="order-history-note">
              {t('此筆歷史資料只保存訂單總額，未拆分折扣與運費。')}{' '}
              <strong>{money(order.total, locale)}</strong>
            </p>
          )}
          <h3>{t('狀態變更紀錄')}</h3>
          {order.statusHistory?.length ? (
            <ol className="order-history">
              {order.statusHistory.map((entry, index) => (
                <li key={`${entry.at}-${index}`}>
                  <span>
                    {t(entry.from)} → {t(entry.to)}
                  </span>
                  <time dateTime={entry.at}>{new Date(entry.at).toLocaleString(locale)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <p className="order-history-note">{t('尚無狀態變更紀錄。')}</p>
          )}
          <p className="order-history-note">
            {t('變更狀態僅記錄處理進度，不會執行退款、寄送通知或自動回補庫存。')}
          </p>
        </div>
      )}
    </Modal>
  );
}
