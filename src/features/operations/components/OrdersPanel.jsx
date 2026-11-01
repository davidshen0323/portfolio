import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { formatDate, money } from '../../../shared/lib/format';
import DataTable from '../../../shared/components/DataTable';
import Panel, { StatusBadge } from './Panel';
import { orderStatuses, availableOrderStatuses, orderExportRows } from '../domain/orderWorkflow';
import { downloadCsv } from '../../../shared/lib/csv';
import Feedback from '../../../shared/components/Feedback';
import OrderDetails from './OrderDetails';
import '../orders.css';
export default function OrdersPanel({ orders, updateOrder }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const selected = orders.find((order) => order.id === selectedId);
  const rows = orders.filter(
    (o) =>
      (status === 'all' || status === o.status) &&
      [o.id, o.name, ...o.items.map((i) => t(i.name))]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <Panel
      title="訂單管理"
      eyebrow="ORDERS"
      action={
        <button
          className="action"
          disabled={!rows.length}
          onClick={() => downloadCsv('FORMA-filtered-orders.csv', orderExportRows(rows, t))}
        >
          {t('匯出目前結果')}
        </button>
      }
    >
      <p className="order-panel-note">
        {t('查看收件資訊與費用明細；完成或取消後，不再變更處理狀態。')}
      </p>
      <Feedback message={message} />
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
              <div className="order-row-actions">
                <button
                  className="action"
                  aria-label={`${t('查看訂單')} ${o.id}`}
                  onClick={() => setSelectedId(o.id)}
                >
                  {t('查看詳情')}
                </button>
                <select
                  className="status-select"
                  aria-label={`${t('更新')} ${o.id}`}
                  value={o.status}
                  disabled={availableOrderStatuses(o.status).length === 1}
                  onChange={(e) => {
                    setMessage(updateOrder(o.id, e.target.value) ? '訂單狀態已更新。' : '');
                  }}
                >
                  {availableOrderStatuses(o.status).map((s) => (
                    <option key={s} value={s}>
                      {t(s)}
                    </option>
                  ))}
                </select>
              </div>
            ),
          },
        ]}
      />
      <OrderDetails order={selected} onClose={() => setSelectedId(null)} />
    </Panel>
  );
}
