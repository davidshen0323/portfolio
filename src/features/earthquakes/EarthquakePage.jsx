import { useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import ProjectBanner from '../../shared/components/ProjectBanner';
import AppLink from '../../shared/components/AppLink';
import CaseStudyLink from '../../shared/components/CaseStudyLink';
import { useEarthquakes } from './hooks/useEarthquakes';
import '../../shared/styles/api.css';
export default function EarthquakePage() {
  const { t, locale } = useI18n();
  const [days, setDays] = useState(7);
  const [magnitude, setMagnitude] = useState(2.5);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(12);
  const data = useEarthquakes(days, magnitude);
  const entries = data.entries.filter((entry) =>
    entry.place.toLowerCase().includes(query.toLowerCase()),
  );
  const time = (value) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Taipei',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(value));
  const change = (setter) => (e) => {
    setter(Number(e.target.value));
    setVisible(12);
  };
  return (
    <Page theme="earthquakes" title="臺灣周邊地震資料｜API 串接作品">
      <ProjectBanner label="API 串接作品 · 資料由 USGS 提供" />
      <header>
        <AppLink className="brand" href="index.html">
          FIELDNOTE<span> / LIVE DATA</span>
        </AppLink>
        <a href="https://earthquake.usgs.gov/fdsnws/event/1/" target="_blank" rel="noreferrer">
          {t('資料來源 USGS ↗')}
        </a>
      </header>
      <main>
        <div className="intro">
          <span className="eyebrow">LIVE API / TAIWAN REGION</span>
          <h1>
            {t('臺灣周邊')}
            <br />
            <em>{t('地震資料')}</em>
          </h1>
          <p>{t('查詢近期地震，依時間、規模與地點篩選。每次更改條件都會重新向 USGS 取得資料。')}</p>
        </div>
        <section className="workspace" aria-label={t('地震資料查詢')}>
          <form id="filters" onSubmit={(e) => e.preventDefault()}>
            <label>
              {t('查詢期間')}
              <select value={days} onChange={change(setDays)}>
                {[7, 30].map((n) => (
                  <option key={n} value={n}>
                    {t(`近 ${n} 天`)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('最低規模')}
              <select value={magnitude} onChange={change(setMagnitude)}>
                {[2.5, 3.5, 4.5].map((n) => (
                  <option key={n} value={n}>
                    {t(`規模 ${n} 以上`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="search">
              {t('地點關鍵字')}
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(12);
                }}
                placeholder={t('例如 Taiwan、Hualien')}
              />
            </label>
            <button id="refresh" type="button" disabled={data.loading} onClick={data.refresh}>
              {t('重新整理 ↻')}
            </button>
          </form>
          <div className={`status ${data.error ? 'error' : ''}`} role="status">
            {data.loading ? (
              t('正在從 USGS 取得資料…')
            ) : data.error ? (
              <>
                {t(data.error)}
                <button onClick={data.refresh}>{t('再試一次')}</button>
              </>
            ) : (
              <>
                {t('資料已更新：')} {data.updatedAt && time(data.updatedAt)} · USGS
              </>
            )}
          </div>
          <div className="stat-grid">
            <div>
              <span>{t('符合條件')}</span>
              <strong>{entries.length}</strong>
              <small>{t('筆地震紀錄')}</small>
            </div>
            <div>
              <span>{t('最大規模')}</span>
              <strong>
                {entries.length
                  ? Math.max(...entries.map((e) => e.magnitude || 0)).toFixed(1)
                  : '—'}
              </strong>
              <small>{t('目前查詢範圍')}</small>
            </div>
            <div>
              <span>{t('最新一筆')}</span>
              <strong className="latest-time">
                {entries.length ? time(entries[0].time) : '—'}
              </strong>
              <small>{t('臺灣時間')}</small>
            </div>
          </div>
          <div className="results-head">
            <div>
              <span className="eyebrow">EVENTS</span>
              <h2>{t('查詢結果')}</h2>
            </div>
            <span>
              {Math.min(visible, entries.length)} / {entries.length}
            </span>
          </div>
          <div className="results" aria-busy={data.loading}>
            {entries.slice(0, visible).map((entry) => (
              <article className="event" key={entry.id}>
                <span
                  className={`mag ${entry.magnitude >= 5 ? 'strong' : ''}`}
                  aria-label={`${t('規模')} ${entry.magnitude}`}
                >
                  {entry.magnitude?.toFixed(1) || '—'}
                </span>
                <div>
                  <h3>{entry.place}</h3>
                  <p>
                    {t('深度')} {entry.depth === null ? '—' : Math.round(entry.depth)} km ·{' '}
                    {entry.id}
                  </p>
                </div>
                <time dateTime={new Date(entry.time).toISOString()}>
                  {time(entry.time)} (Taiwan)
                </time>
                {entry.url && (
                  <a href={entry.url} target="_blank" rel="noreferrer">
                    {t('詳細資料 ↗')}
                  </a>
                )}
              </article>
            ))}
            {!data.loading && !entries.length && (
              <div className="empty">
                <strong>{t('目前沒有符合條件的紀錄')}</strong>
                <p>{t('可以調整查詢期間、最低規模或清除地點關鍵字。')}</p>
              </div>
            )}
          </div>
          {visible < entries.length && (
            <button id="more" onClick={() => setVisible((n) => n + 12)}>
              {t('顯示更多結果')}
            </button>
          )}
        </section>
        <section className="method">
          <div>
            <span className="eyebrow">BEHIND THE SCREEN</span>
            <h2>{t('資料如何運作？')}</h2>
          </div>
          <ul>
            {[
              '向 USGS GeoJSON API 發送查詢，根據期間及規模組合參數。',
              '資料載入時顯示狀態，失敗時提供重試，查無結果時顯示提示。',
              '顯示臺灣時間，並可用地點文字再次篩選回傳資料。',
            ].map((text) => (
              <li key={text}>{t(text)}</li>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <span>FIELDNOTE / API PROJECT BY DAVID SHEN</span>
        <span>
          {t(
            '範圍：北緯 20.5–26.5°、東經 119–123.5°；資料可能與臺灣官方地震資訊不同。非地震警報服務。',
          )}
        </span>
      </footer>
      <CaseStudyLink slug="api" />
    </Page>
  );
}
