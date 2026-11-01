import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { formatDate, money } from '../../../shared/lib/format';
import DataTable from '../../../shared/components/DataTable';
import Panel, { StatusBadge } from './Panel';
export const orderStatuses = ['待處理', '處理中', '已完成', '已取消'];
export default function OrdersPanel({ orders, updateOrder }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const rows = orders.filter(
    (o) =>
      (status === 'all' || status === o.status) &&
      [o.id, o.name, ...o.items.map((i) => t(i.name))]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <Panel title="訂單管理" eyebrow="ORDERS">
      <div className="toolbar">
        <label className="search-wrap">
          <input
            aria-label={t('搜尋訂單')}
            placeholder={t('搜尋訂單、客戶或商品')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select aria-label={t('狀態')} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t('全部狀態')}</option>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        rows={rows}
        columns={[
          {
            key: 'id',
            label: '編號 / 客戶',
            render: (o) => (
              <>
                <b>{o.name}</b>
                <small>{o.id}</small>
              </>
            ),
          },
          {
            key: 'items',
            label: '商品',
            render: (o) => o.items.map((i) => `${t(i.name)} ×${i.qty}`).join(', '),
          },
          { key: 'total', label: '金額', render: (o) => money(o.total, locale) },
          { key: 'created', label: '日期', render: (o) => formatDate(o.created, locale) },
          { key: 'status', label: '狀態', render: (o) => <StatusBadge status={o.status} /> },
          {
            key: 'actions',
            label: '處理',
            render: (o) => (
              <select
                className="status-select"
                aria-label={`${t('更新')} ${o.id}`}
                value={o.status}
                onChange={(e) => updateOrder(o.id, e.target.value)}
              >
                {orderStatuses.map((s) => (
                  <option key={s} value={s}>
                    {t(s)}
                  </option>
                ))}
              </select>
            ),
          },
        ]}
      />
    </Panel>
  );
}
