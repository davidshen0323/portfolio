import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import DataTable from '../../../shared/components/DataTable';
import Panel, { StatusBadge } from './Panel';
export default function BookingsPanel({ bookings, setBookings, resetBookings }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const rows = bookings.filter(
    (b) =>
      (status === 'all' || b.status === status) &&
      `${b.id} ${b.name} ${b.service} ${t(b.service)}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Panel title="預約管理" eyebrow="BOOKINGS">
      <div className="toolbar">
        <label className="search-wrap">
          <input
            aria-label={t('搜尋預約')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('搜尋姓名、服務或編號')}
          />
        </label>
        <select aria-label={t('狀態')} value={status} onChange={(e) => setStatus(e.target.value)}>
          {['all', '待確認', '已確認', '已完成'].map((s) => (
            <option key={s} value={s}>
              {t(s === 'all' ? '全部狀態' : s)}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        rows={rows}
        empty="找不到符合條件的預約。"
        columns={[
          {
            key: 'id',
            label: '預約編號 / 客戶',
            render: (b) => (
              <>
                <b>{b.name}</b>
                <small>{b.id}</small>
              </>
            ),
          },
          { key: 'service', label: '服務項目', render: (b) => t(b.service) },
          { key: 'date', label: '日期' },
          { key: 'status', label: '狀態', render: (b) => <StatusBadge status={b.status} /> },
          {
            key: 'action',
            label: '處理',
            render: (b) => (
              <button
                className="action"
                disabled={b.status === '已完成'}
                onClick={() =>
                  setBookings((items) =>
                    items.map((item) =>
                      item.id === b.id
                        ? { ...item, status: item.status === '待確認' ? '已確認' : '已完成' }
                        : item,
                    ),
                  )
                }
              >
                {t(
                  b.status === '待確認'
                    ? '確認預約'
                    : b.status === '已確認'
                      ? '標記完成'
                      : '已結束',
                )}
              </button>
            ),
          },
        ]}
      />
      <div className="panel-foot">
        {t('狀態暫存在目前裝置的瀏覽器中。')}
        <button onClick={resetBookings}>{t('重設預約資料')}</button>
      </div>
    </Panel>
  );
}
