import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import DataTable from '../../../shared/components/DataTable';
import Modal from '../../../shared/components/Modal';
import Feedback from '../../../shared/components/Feedback';
import Panel from '../../operations/components/Panel';
import products from '../../commerce/data/products.json';
import { useBusiness } from '../hooks/useBusiness';
export default function ReceivingPanel({ onNavigate }) {
  const { t } = useI18n();
  const store = useBusiness();
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ received: 0, damaged: 0, reason: '' });
  const receipt = store.business.receipts.find((entry) => entry.id === selected);
  const rows = store.business.receipts.filter(
    (entry) => status === 'all' || entry.status === status,
  );
  const productName = (id) => t(products.find((product) => product.id === id)?.name || id);
  return (
    <Panel
      title="商家入庫"
      eyebrow="BUSINESS / RECEIVING"
      action={
        <button className="text-button" onClick={() => onNavigate('inventory')}>
          {t('查看商品庫存 ↗')}
        </button>
      }
    >
      <div className="business-explainer">
        <strong>{t('實收 − 損壞 = 可入庫良品')}</strong>
        <span>{t('有差異必須說明，已完成的入庫單不會重複增加庫存。')}</span>
      </div>
      <Feedback message={store.message} error={store.failed} />
      <div className="toolbar">
        <select
          aria-label={t('驗收狀態')}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {['all', '待驗收', '已入庫'].map((value) => (
            <option key={value} value={value}>
              {t(value === 'all' ? '全部狀態' : value)}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        rows={rows}
        empty="找不到符合條件的入庫單。"
        columns={[
          {
            key: 'id',
            label: '入庫單 / 供應商',
            render: (entry) => (
              <>
                <b>{entry.id}</b>
                <small>{t(entry.supplier)}</small>
              </>
            ),
          },
          { key: 'productId', label: '商品', render: (entry) => productName(entry.productId) },
          { key: 'container', label: '載具', render: (entry) => t(entry.container) },
          { key: 'expected', label: '預計數量' },
          { key: 'accepted', label: '已入庫良品', render: (entry) => entry.accepted ?? '—' },
          {
            key: 'status',
            label: '狀態',
            render: (entry) => <span className="business-status">{t(entry.status)}</span>,
          },
          {
            key: 'actions',
            label: '處理',
            render: (entry) => (
              <button
                className="action"
                disabled={entry.status === '已入庫'}
                onClick={() => {
                  setSelected(entry.id);
                  setForm({ received: entry.expected, damaged: 0, reason: '' });
                }}
              >
                {t(entry.status === '已入庫' ? '已完成' : '開始驗收')}
              </button>
            ),
          },
        ]}
      />
      <Modal open={Boolean(receipt)} onClose={() => setSelected(null)} title="入庫驗收">
        {receipt && (
          <form
            className="business-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (store.receive(receipt.id, form)) setSelected(null);
            }}
          >
            <p className="full">
              {receipt.id} · {productName(receipt.productId)} · {t(receipt.container)} ·{' '}
              {t('預計數量')} {receipt.expected}
            </p>
            {[
              ['received', '實收數量'],
              ['damaged', '損壞數量'],
            ].map(([key, label]) => (
              <label key={key}>
                {t(label)}
                <input
                  type="number"
                  required
                  min="0"
                  max={key === 'damaged' ? form.received : 10000}
                  step="1"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                />
              </label>
            ))}
            <label className="full">
              {t('差異或損壞原因')}
              <textarea
                rows={3}
                maxLength={500}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                required={form.received !== receipt.expected || form.damaged > 0}
              />
            </label>
            <div className="business-total">
              <span>{t('本次增加庫存')}</span>
              <strong>{Math.max(0, form.received - form.damaged)}</strong>
            </div>
            <Feedback message={store.message} error={store.failed} />
            <button className="business-primary" type="submit">
              {t('確認入庫')}
            </button>
          </form>
        )}
      </Modal>
    </Panel>
  );
}
