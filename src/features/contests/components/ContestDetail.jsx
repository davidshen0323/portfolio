import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { useNow } from '../../../shared/hooks/useNow';
import { states } from '../domain/contest';

function ParticipationForm({ contest, onAction }) {
  const { t } = useI18n();
  const [side, setSide] = useState('');
  const [amount, setAmount] = useState(50);
  return (
    <form
      className="participation-form"
      onSubmit={(e) => {
        e.preventDefault();
        onAction('participate', { side, amount });
      }}
    >
      <div className="side-select">
        {['a', 'b'].map((s) => (
          <label key={s}>
            <input
              type="radio"
              name="side"
              required
              checked={side === s}
              onChange={() => setSide(s)}
            />
            {contest.owner === 'visitor' ? contest[s] : t(contest[s])}
          </label>
        ))}
      </div>
      <label>
        {t('參與點數（10–500）')}
        <input
          type="number"
          min="10"
          max="500"
          step="1"
          required
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      <button type="submit" className="primary">
        {t('確認參與')}
      </button>
      <p className="fine">{t('一次選擇、一次扣點，無真實金錢交易。')}</p>
    </form>
  );
}
function ContestActions({ contest: c, onAction }) {
  const { t } = useI18n();
  const now = useNow(c.status === 'pending');
  const vote = c.votes.find((v) => v.user === 'visitor');
  const label = (side) => (c.owner === 'visitor' ? c[side] : t(c[side]));
  if (c.status === 'ongoing') {
    if (c.owner === 'visitor')
      return (
        <>
          <p>{t('這是你建立的競賽。建立者不能參與自己的競賽。')}</p>
          <button className="primary" onClick={() => onAction('close')}>
            {t('結束參與，等待結果')}
          </button>
        </>
      );
    if (vote)
      return (
        <p>
          {t('你已選擇')} {label(vote.side)}, {vote.amount} {t('體驗點數。')}
        </p>
      );
    if (c.deadline <= now) return <p>{t('參與時間已截止，等待建立者更新狀態。')}</p>;
    return <ParticipationForm contest={c} onAction={onAction} />;
  }
  if (c.status === 'awaiting')
    return c.owner === 'visitor' ? (
      <>
        <p>{t('選擇實際勝出的一方，送交參與者確認。')}</p>
        <div className="result-choices">
          {['a', 'b'].map((side) => (
            <button key={side} onClick={() => onAction('result', { side })}>
              {label(side)}
            </button>
          ))}
        </div>
      </>
    ) : (
      <p>{t('參與已結束，等待建立者提出結果。')}</p>
    );
  if (c.status === 'pending') {
    const seconds = Math.max(0, Math.floor((c.confirmBy - now) / 1000));
    const countdown = [Math.floor(seconds / 3600), Math.floor((seconds / 60) % 60), seconds % 60]
      .map((value) => String(value).padStart(2, '0'))
      .join(':');
    return (
      <>
        <p>
          {t('建立者提出的結果：')} <strong>{label(c.result)}</strong>
        </p>
        <small>{t('確認期限剩餘')}</small>
        <span className="countdown">{seconds ? countdown : t('確認期限已到（待後續處理）')}</span>
        <p>
          {c.approvals.length} / {c.votes.length} {t('位參與者已確認')}
        </p>
        {vote && !c.approvals.includes('visitor') ? (
          <div className="action-stack">
            <button className="primary" onClick={() => onAction('approve')}>
              {t('我確認這個結果')}
            </button>
            <button className="secondary danger" onClick={() => onAction('dispute')}>
              {t('結果有疑問，提出爭議')}
            </button>
          </div>
        ) : (
          <p>{t('等待其他參與者確認。這個作品不會自動結算。')}</p>
        )}
      </>
    );
  }
  if (c.status === 'disputed')
    return <p>{t('結果有爭議，參與操作已停止。正式產品可在這個階段接續審核與通知流程。')}</p>;
  return (
    <>
      <p>
        {t('結果已確認：')} <strong>{label(c.result) || t('未指定')}</strong>
      </p>
      <p>{t('這個作品不會進行點數派發或金流結算。')}</p>
    </>
  );
}
export default function ContestDetail({ contest: c, onAction, onBack }) {
  const { t, locale } = useI18n();
  return (
    <section className="detail-view">
      <button className="back-button" onClick={onBack}>
        ← {t('返回競賽列表')}
      </button>
      <div className="detail-heading">
        <span className={`status-pill ${c.status}`}>{t(states[c.status])}</span>
        <h2>{c.owner === 'visitor' ? c.title : t(c.title)}</h2>
        <p>{c.owner === 'visitor' ? c.description : t(c.description)}</p>
        <small>
          {c.id} · {new Date(c.deadline).toLocaleString(locale)}
        </small>
        <div className="state-timeline">
          {Object.entries(states).map(([key, label]) => (
            <span key={key} className={c.status === key ? 'current' : ''}>
              {t(label)}
            </span>
          ))}
        </div>
      </div>
      <div className="detail-columns">
        <section className="detail-panel">
          <h3>{t('競賽兩方')}</h3>
          <div className="choices">
            <div>A · {c.owner === 'visitor' ? c.a : t(c.a)}</div>
            <span>VS</span>
            <div>B · {c.owner === 'visitor' ? c.b : t(c.b)}</div>
          </div>
          <h3 className="entries-heading">{t('參與紀錄')}</h3>
          {c.votes.map((vote) => (
            <div className="vote-row" key={vote.user}>
              <span>
                {t(vote.user === 'visitor' ? '你的參與' : '體驗參與者')} ·{' '}
                {c.owner === 'visitor' ? c[vote.side] : t(c[vote.side])}
              </span>
              <strong>
                {vote.amount} {t('點')}
              </strong>
            </div>
          ))}
          {!c.votes.length && <p>{t('尚無參與者。')}</p>}
        </section>
        <section className="detail-panel">
          <h3>{t('目前可以進行的操作')}</h3>
          <ContestActions contest={c} onAction={onAction} />
        </section>
      </div>
    </section>
  );
}
