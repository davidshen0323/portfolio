import { useI18n } from '../../../shared/i18n/I18nProvider';
export default function EventLog({ events, canRepeat, onRepeat, onClear }) {
  const { t, locale } = useI18n();
  return (
    <aside className="event-panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">EVENT STREAM</span>
          <h2>{t('事件紀錄')}</h2>
        </div>
        <span>{events.length}</span>
      </div>
      <p>{t('每次操作都會留下一筆流程事件，可觀察扣點、命中與連線處理。')}</p>
      <div className="event-tools">
        <button disabled={!canRepeat} onClick={onRepeat}>
          {t('重送上一筆命中')}
        </button>
        <button onClick={onClear}>{t('清空紀錄')}</button>
      </div>
      <div className="event-list" role="log" aria-live="polite" aria-relevant="additions">
        {events.map((event, index) => (
          <article key={`${event.time}-${index}`} className="event-entry">
            <div>
              <b>{event.type}</b>
              <small>{new Date(event.time).toLocaleTimeString(locale, { hour12: false })}</small>
            </div>
            <p>{t(event.detail)}</p>
          </article>
        ))}
        {!events.length && <p className="event-empty">{t('先選擇房間，開始觀察事件。')}</p>}
      </div>
    </aside>
  );
}
