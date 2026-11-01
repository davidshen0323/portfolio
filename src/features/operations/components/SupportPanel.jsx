import { createId } from '../../../shared/lib/id';
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Panel from './Panel';
export default function SupportPanel({ tickets, setTickets }) {
  const { t } = useI18n();
  const [status, setStatus] = useState('all');
  const [form, setForm] = useState({ subject: '', order: '', priority: '一般', note: '' });
  const rows = tickets.filter((ticket) => status === 'all' || ticket.status === status);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <Panel title="客服紀錄" eyebrow="CUSTOMER CARE">
      <form
        className="ticket-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.subject.trim()) return;
          const saved = setTickets((items) => [
            {
              ...form,
              subject: form.subject.trim(),
              id: `TK-${createId().slice(0, 8)}`,
              status: '待處理',
              created: new Date().toISOString(),
            },
            ...items,
          ]);
          if (saved) {
            setForm({ subject: '', order: '', priority: '一般', note: '' });
            setStatus('all');
          }
        }}
      >
        <label>
          {t('主旨')}
          <input name="subject" required value={form.subject} onChange={update} maxLength={100} />
        </label>
        <label>
          {t('關聯訂單')}
          <input name="order" value={form.order} onChange={update} maxLength={40} />
        </label>
        <label>
          {t('優先程度')}
          <select name="priority" value={form.priority} onChange={update}>
            {['一般', '優先'].map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="action">
          {t('建立紀錄 ＋')}
        </button>
        <label className="ticket-wide">
          {t('處理筆記')}
          <textarea name="note" value={form.note} onChange={update} rows={3} maxLength={800} />
        </label>
      </form>
      <div className="toolbar">
        <select aria-label={t('進度')} value={status} onChange={(e) => setStatus(e.target.value)}>
          {['all', '待處理', '處理中', '已結案'].map((s) => (
            <option key={s} value={s}>
              {t(s === 'all' ? '全部進度' : s)}
            </option>
          ))}
        </select>
      </div>
      <div className="ticket-list">
        {rows.map((ticket) => (
          <article className="ticket-card" key={ticket.id}>
            <div>
              <small>
                {ticket.id} / {ticket.order || t('無關聯訂單')} · {t(ticket.priority)}
              </small>
              <h3>{ticket.id.startsWith('TK-100') ? t(ticket.subject) : ticket.subject}</h3>
              <p>{ticket.id.startsWith('TK-100') ? t(ticket.note) : ticket.note}</p>
            </div>
            <div className="ticket-actions">
              <select
                aria-label={t('更新') + ticket.id}
                value={ticket.status}
                onChange={(e) =>
                  setTickets((items) =>
                    items.map((item) =>
                      item.id === ticket.id ? { ...item, status: e.target.value } : item,
                    ),
                  )
                }
              >
                {['待處理', '處理中', '已結案'].map((s) => (
                  <option key={s} value={s}>
                    {t(s)}
                  </option>
                ))}
              </select>
              <button
                className="text-button"
                onClick={() => setTickets((items) => items.filter((item) => item.id !== ticket.id))}
              >
                {t('刪除紀錄')}
              </button>
            </div>
          </article>
        ))}
        {!rows.length && <p className="empty">{t('沒有符合條件的客服紀錄。')}</p>}
      </div>
    </Panel>
  );
}
