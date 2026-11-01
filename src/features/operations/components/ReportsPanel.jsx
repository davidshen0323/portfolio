import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money, formatDate } from '../../../shared/lib/format';
import { downloadCsv } from '../../../shared/lib/csv';
import DataTable from '../../../shared/components/DataTable';
import Panel, { StatusBadge } from './Panel';
import { orderStatuses } from '../domain/orderWorkflow';
export default function ReportsPanel({ orders }) {
  const { t, locale } = useI18n();
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState('all');
  const rows = orders.filter(
    (o) => (!month || o.created.slice(0, 7) === month) && (status === 'all' || o.status === status),
  );
  const total = rows.reduce((n, o) => n + o.total, 0);
  const exportData = () =>
    downloadCsv('FORMA-orders.csv', [
      [t('訂單編號'), t('客戶'), t('金額'), t('狀態'), t('建立日期')],
      ...rows.map((o) => [o.id, o.name, o.total, t(o.status), o.created]),
    ]);
  return (
    <Panel
      title="訂單營運報表"
      eyebrow="REPORTS"
      action={
        <button className="action" onClick={exportData}>
          {t('匯出 CSV')}
        </button>
      }
    >
      <div className="toolbar">
        <label>
          {t('月份')}{' '}
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <select aria-label={t('狀態')} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t('全部狀態')}</option>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
        <button
          className="action"
          onClick={() => {
            setMonth('');
            setStatus('all');
          }}
        >
          {t('清除條件')}
        </button>
      </div>
      <div className="stats report-stats">
        {[
          ['符合訂單', rows.length],
          ['訂單總額', money(total, locale)],
          ['平均訂單金額', money(rows.length ? Math.round(total / rows.length) : 0, locale)],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{t(label)}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <p className="report-note">
        {t('總額為篩選後所有訂單金額，包含待處理與已取消；不代表實收款項。')}
      </p>
      <DataTable
        rows={rows}
        empty="這個條件沒有訂單。"
        columns={[
          { key: 'id', label: '訂單' },
          { key: 'name', label: '客戶' },
          { key: 'total', label: '金額', render: (o) => money(o.total, locale) },
          { key: 'status', label: '狀態', render: (o) => <StatusBadge status={o.status} /> },
          { key: 'created', label: '日期', render: (o) => formatDate(o.created, locale) },
        ]}
      />
    </Panel>
  );
}
