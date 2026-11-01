import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money } from '../../../shared/lib/format';
import Feedback from '../../../shared/components/Feedback';
import Modal from '../../../shared/components/Modal';
import DataTable from '../../../shared/components/DataTable';
import Panel from '../../operations/components/Panel';
import products from '../../commerce/data/products.json';
import { useBusiness } from '../hooks/useBusiness';
import { contractTotal } from '../domain/business';
const blank = () => ({
  title: '',
  partner: '',
  productId: 'P01',
  quantity: 10,
  months: 6,
  unitFee: 120,
  startDate: new Date().toISOString().slice(0, 10),
});
export default function ContractsPanel() {
  const { t, locale } = useI18n();
  const store = useBusiness();
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [reviewId, setReviewId] = useState(null);
  const [note, setNote] = useState('');
  const rows = store.business.contracts.filter(
    (entry) =>
      (status === 'all' || entry.status === status) &&
      `${entry.id} ${entry.partner} ${entry.title} ${t(entry.title)} ${t(entry.partner)}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const review = store.business.contracts.find((entry) => entry.id === reviewId);
  const edit = (contract) => {
    setEditing(contract?.id || null);
    setForm(
      contract
        ? {
            title: contract.title,
            partner: contract.partner,
            productId: contract.productId,
            quantity: contract.quantity,
            months: contract.months,
            unitFee: contract.unitFee,
            startDate: contract.startDate,
          }
        : blank(),
    );
    setOpen(true);
  };
  return (
    <Panel
      title="合約審核"
      eyebrow="BUSINESS / CONTRACTS"
      action={
        <button className="action" onClick={() => edit(null)}>
          {t('新增合約 ＋')}
        </button>
      }
    >
      <div className="business-explainer">
        <strong>{t('數量 × 月數 × 每件月費')}</strong>
        <span>{t('先確認條件，再核准或退回。每次變更都會留下操作紀錄。')}</span>
      </div>
      <Feedback message={store.message} error={store.failed} />
      <div className="toolbar">
        <label className="search-wrap">
          <input
            aria-label={t('搜尋合約')}
            placeholder={t('搜尋合約、合作對象或編號')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label={t('審核狀態')}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {['all', '待審核', '已核准', '已退回'].map((value) => (
            <option key={value} value={value}>
              {t(value === 'all' ? '全部狀態' : value)}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        rows={rows}
        empty="找不到符合條件的合約。"
        columns={[
          {
            key: 'id',
            label: '合約 / 合作對象',
            render: (c) => (
              <>
                <b>{c.id.startsWith('CT-100') ? t(c.title) : c.title}</b>
                <small>
                  {c.id} / {c.id.startsWith('CT-100') ? t(c.partner) : c.partner}
                </small>
              </>
            ),
          },
          { key: 'quantity', label: '數量' },
          { key: 'months', label: '期間（月）' },
          { key: 'unitFee', label: '每件月費', render: (c) => money(c.unitFee, locale) },
          { key: 'total', label: '合約總額', render: (c) => money(contractTotal(c), locale) },
          {
            key: 'status',
            label: '狀態',
            render: (c) => (
              <span
                className={`business-status status-${c.status === '待審核' ? 'pending' : c.status === '已核准' ? 'approved' : 'returned'}`}
              >
                {t(c.status)}
              </span>
            ),
          },
          {
            key: 'actions',
            label: '處理',
            render: (c) =>
              c.status === '已退回' ? (
                <button className="action" onClick={() => edit(c)}>
                  {t('修改並重送')}
                </button>
              ) : (
                <button
                  className="action"
                  onClick={() => {
                    setReviewId(c.id);
                    setNote('');
                  }}
                >
                  {t(c.status === '待審核' ? '審核條件' : '查看內容')}
                </button>
              ),
          },
        ]}
      />
      <Modal open={open} title={editing ? '修改合約' : '新增合約'} onClose={() => setOpen(false)}>
        <form
          className="business-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (store.submit(form, editing)) setOpen(false);
          }}
        >
          {[
            ['title', '方案名稱'],
            ['partner', '合作對象'],
          ].map(([key, label]) => (
            <label key={key}>
              {t(label)}
              <input
                required
                maxLength={80}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
          <label>
            {t('對應商品')}
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {t(product.name)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('開始日期')}
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </label>
          {[
            ['quantity', '數量', 1, 10000],
            ['months', '期間（月）', 1, 60],
            ['unitFee', '每件月費', 0, 1000000],
          ].map(([key, label, min, max]) => (
            <label key={key}>
              {t(label)}
              <input
                type="number"
                required
                min={min}
                max={max}
                step="1"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
              />
            </label>
          ))}
          <div className="business-total">
            <span>{t('合約總額')}</span>
            <strong>{money(contractTotal(form), locale)}</strong>
          </div>
          <Feedback message={store.message} error={store.failed} />
          <button className="business-primary" type="submit">
            {t('送交審核')}
          </button>
        </form>
      </Modal>
      <Modal open={Boolean(review)} title="合約內容與審核" onClose={() => setReviewId(null)}>
        {review && (
          <div className="business-review">
            <h3>{review.id.startsWith('CT-100') ? t(review.title) : review.title}</h3>
            <dl>
              <dt>{t('合作對象')}</dt>
              <dd>{review.id.startsWith('CT-100') ? t(review.partner) : review.partner}</dd>
              <dt>{t('開始日期')}</dt>
              <dd>{review.startDate}</dd>
              <dt>{t('數量 / 月數 / 每件月費')}</dt>
              <dd>
                {review.quantity} × {review.months} × {money(review.unitFee, locale)}
              </dd>
              <dt>{t('合約總額')}</dt>
              <dd>
                <strong>{money(contractTotal(review), locale)}</strong>
              </dd>
            </dl>
            {review.note && (
              <p className="business-note">
                {review.id.startsWith('CT-100') ? t(review.note) : review.note}
              </p>
            )}
            {review.status === '待審核' && (
              <>
                <label>
                  {t('審核備註／退回原因')}
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </label>
                <Feedback message={store.message} error={store.failed} />
                <div className="business-actions">
                  <button
                    className="business-primary"
                    onClick={() => {
                      if (store.review(review.id, '已核准', note)) setReviewId(null);
                    }}
                  >
                    {t('核准合約')}
                  </button>
                  <button
                    className="action"
                    onClick={() => {
                      if (store.review(review.id, '已退回', note)) setReviewId(null);
                    }}
                  >
                    {t('退回補件')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </Panel>
  );
}
