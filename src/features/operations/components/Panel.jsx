import { useI18n } from '../../../shared/i18n/I18nProvider';
export default function Panel({ title, eyebrow, action, children }) {
  const { t } = useI18n();
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          {eyebrow && <small>{eyebrow}</small>}
          <h2>{t(title)}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function StatusBadge({ status }) {
  const { t } = useI18n();
  const variant = ['待處理', '待確認'].includes(status)
    ? 'pending'
    : ['已確認', '處理中'].includes(status)
      ? 'confirmed'
      : status === '已取消'
        ? 'cancelled'
        : 'done';
  return <span className={`badge ${variant}`}>{t(status)}</span>;
}
