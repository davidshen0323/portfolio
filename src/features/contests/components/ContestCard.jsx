import { useI18n } from '../../../shared/i18n/I18nProvider';
import { states } from '../domain/contest';
export default function ContestCard({ contest: c, onOpen }) {
  const { t, locale } = useI18n();
  const totals = ['a', 'b'].map((side) =>
    c.votes.filter((v) => v.side === side).reduce((n, v) => n + v.amount, 0),
  );
  const sum = totals[0] + totals[1];
  const title = c.owner === 'visitor' ? c.title : t(c.title);
  return (
    <article className="contest-card">
      <div className="card-top">
        <span>
          {t(c.category)} / {c.id}
        </span>
        <span className={`status-pill ${c.status}`}>{t(states[c.status])}</span>
      </div>
      <h3>{title}</h3>
      <div className="choices">
        <div>A · {c.owner === 'visitor' ? c.a : t(c.a)}</div>
        <span>VS</span>
        <div>B · {c.owner === 'visitor' ? c.b : t(c.b)}</div>
      </div>
      <div className="split-track">
        <i style={{ width: `${sum ? (totals[0] / sum) * 100 : 50}%` }} />
        <i style={{ width: `${sum ? (totals[1] / sum) * 100 : 50}%` }} />
      </div>
      <div className="card-meta">
        <span>
          {c.votes.length} {t('人參與')} · {sum} {t('點')}
        </span>
        <span>
          {new Date(c.deadline).toLocaleString(locale, {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          {t('截止')}
        </span>
      </div>
      <button className="card-open" onClick={onOpen}>
        {t(c.owner === 'visitor' ? '管理我的競賽' : '查看競賽')} ↗
      </button>
    </article>
  );
}
