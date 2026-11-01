import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money } from '../../../shared/lib/format';
import Panel, { StatusBadge } from './Panel';
import { orderStatuses } from '../domain/orderWorkflow';
export default function OverviewPanel({ orders, bookings, stock, onNavigate }) {
  const { t, locale } = useI18n();
  const revenue = orders.filter((o) => o.status === '已完成').reduce((n, o) => n + o.total, 0);
  const tasks = [
    ['待處理訂單', orders.filter((o) => o.status === '待處理').length, 'orders'],
    ['待確認預約', bookings.filter((b) => b.status === '待確認').length, 'bookings'],
    ['低庫存商品', stock.filter((p) => p.qty <= 5).length, 'inventory'],
  ];
  return (
    <>
      <div className="stats">
        <div>
          <span>{t('訂單營業額')}</span>
          <strong>{money(revenue, locale)}</strong>
          <small>{t('已完成訂單總額')}</small>
        </div>
        {tasks.map(([label, n]) => (
          <div key={label}>
            <span>{t(label)}</span>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <div className="overview-grid">
        <Panel title="訂單狀態" eyebrow="ORDER STATUS">
          {orderStatuses.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <div className="bar-row" key={status}>
                <div>
                  <span>{t(status)}</span>
                  <b>{count}</b>
                </div>
                <div className="track">
                  <div
                    className="fill"
                    style={{ width: `${orders.length ? (count / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Panel>
        <Panel title="待辦事項" eyebrow="TO DO">
          <div className="tasks">
            {tasks.map(([label, n, tab]) => (
              <div className="task" key={tab}>
                <span>{t(label)}</span>
                <button className="text-button" onClick={() => onNavigate(tab)}>
                  {n} ↗
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel
        title="近期訂單"
        eyebrow="RECENT ORDERS"
        action={
          <button className="text-button" onClick={() => onNavigate('orders')}>
            {t('查看所有訂單 ↗')}
          </button>
        }
      >
        {orders.slice(0, 4).map((o) => (
          <div className="recent-row" key={o.id}>
            <b>{o.id}</b>
            <span>{o.name}</span>
            <span>{money(o.total, locale)}</span>
            <StatusBadge status={o.status} />
          </div>
        ))}
      </Panel>
    </>
  );
}
