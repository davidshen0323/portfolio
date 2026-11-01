import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import DataTable from '../../../shared/components/DataTable';
import Panel from '../../operations/components/Panel';
import { useBusiness } from '../hooks/useBusiness';
export default function AuditPanel() {
  const { t, locale } = useI18n();
  const { business } = useBusiness();
  const [query, setQuery] = useState('');
  const rows = business.audit.filter((entry) =>
    `${entry.entity} ${entry.action} ${t(entry.action)} ${entry.detail}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Panel title="操作紀錄" eyebrow="BUSINESS / ACTIVITY LOG">
      <p className="report-note">{t('這是目前裝置的流程紀錄，不是不可竄改的伺服器稽核軌跡。')}</p>
      <div className="toolbar">
        <label className="search-wrap">
          <input
            aria-label={t('搜尋操作紀錄')}
            placeholder={t('搜尋編號、動作或備註')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <DataTable
        rows={rows}
        empty="沒有符合條件的操作紀錄。"
        columns={[
          { key: 'entity', label: '關聯編號' },
          { key: 'action', label: '操作', render: (entry) => t(entry.action) },
          { key: 'quantity', label: '增加庫存', render: (entry) => entry.quantity ?? '—' },
          { key: 'detail', label: '備註' },
          {
            key: 'at',
            label: '時間',
            render: (entry) => new Date(entry.at).toLocaleString(locale),
          },
        ]}
      />
    </Panel>
  );
}
