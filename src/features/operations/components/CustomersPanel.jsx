import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import DataTable from '../../../shared/components/DataTable';
import Panel from './Panel';
export default function CustomersPanel({ orders, bookings }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const customers = new Map();
  for (const order of orders) {
    const key = order.email || order.name;
    const row = customers.get(key) || {
      id: key,
      name: order.name,
      email: order.email || '—',
      orders: 0,
      bookings: 0,
    };
    row.orders++;
    customers.set(key, row);
  }
  for (const booking of bookings) {
    const key = 'booking:' + booking.name;
    const row = customers.get(key) || {
      id: key,
      name: booking.name,
      email: '—',
      orders: 0,
      bookings: 0,
    };
    row.bookings++;
    customers.set(key, row);
  }
  const rows = [...customers.values()].filter((c) =>
    `${c.name} ${c.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Panel title="客戶資料" eyebrow="CUSTOMERS">
      <div className="toolbar">
        <label className="search-wrap">
          <input
            aria-label={t('搜尋客戶')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('搜尋客戶或 Email')}
          />
        </label>
      </div>
      <DataTable
        rows={rows}
        empty="找不到符合條件的客戶。"
        columns={[
          { key: 'name', label: '客戶' },
          { key: 'source', label: '來源', render: (c) => t(c.orders ? '購物商店' : '預約服務') },
          { key: 'count', label: '交易 / 預約', render: (c) => `${c.orders} / ${c.bookings}` },
          { key: 'email', label: '聯絡資訊' },
        ]}
      />
    </Panel>
  );
}
