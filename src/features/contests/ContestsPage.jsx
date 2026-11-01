import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import AppLink from '../../shared/components/AppLink';
import Feedback from '../../shared/components/Feedback';
import { useContests } from './hooks/useContests';
import { states } from './domain/contest';
import ContestCard from './components/ContestCard';
import ContestForm from './components/ContestForm';
import ContestDetail from './components/ContestDetail';
import '../../shared/styles/contests.css';

export default function ContestsPage() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const store = useContests();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [mine, setMine] = useState('participated');
  const hash = location.hash.slice(1);
  const selected = hash.startsWith('contest/')
    ? store.contests.find((c) => c.id === hash.slice(8))
    : null;
  const view = selected ? 'detail' : ['mine', 'create'].includes(hash) ? hash : 'explore';
  const go = (next) => navigate({ ...location, hash: '#' + next });
  const cards = (rows) =>
    rows.length ? (
      rows.map((c) => <ContestCard key={c.id} contest={c} onOpen={() => go('contest/' + c.id)} />)
    ) : (
      <div className="empty-state">{t('沒有符合條件的競賽。')}</div>
    );
  const filtered = store.contests.filter(
    (c) =>
      `${c.title} ${c.owner === 'visitor' ? '' : t(c.title)}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === 'all' || c.category === category) &&
      (status === 'all' || c.status === status),
  );
  const personal = store.contests.filter((c) =>
    mine === 'created' ? c.owner === 'visitor' : c.votes.some((v) => v.user === 'visitor'),
  );
  return (
    <Page theme="contests" title="競賽預測與狀態流程">
      <div className="project-strip">
        <AppLink href="index.html">← DAVID SHEN / WORK 08</AppLink>
        <AppLink href="case-contests.html">{t('閱讀作品解析 ↗')}</AppLink>
      </div>
      <div className="app-shell">
        <aside className="app-side">
          <AppLink href="contests.html" className="brand">
            contests<span>MAKE YOUR CALL.</span>
          </AppLink>
          <nav>
            {[
              ['explore', '◈', '探索競賽'],
              ['mine', '▤', '我的競賽'],
              ['create', '＋', '建立競賽'],
            ].map(([key, icon, label]) => (
              <button key={key} onClick={() => go(key)} className={view === key ? 'active' : ''}>
                {icon} <span>{t(label)}</span>
              </button>
            ))}
          </nav>
          <div className="side-note">
            <span>PRODUCT EXPERIENCE</span>
            <p>
              {t('從預測，到確認。')}
              <br />
              {t('每一個狀態都清楚。')}
            </p>
            <AppLink href="case-contests.html">{t('Flutter 經驗與本作範圍 ↗')}</AppLink>
          </div>
        </aside>
        <main>
          <header className="app-header">
            <div>
              <span className="eyebrow">CONTESTS / COMMUNITY</span>
              <h1>
                {t(
                  { explore: '探索競賽', mine: '我的競賽', create: '建立競賽', detail: '競賽詳情' }[
                    view
                  ],
                )}
              </h1>
            </div>
            <div className="point-wallet">
              <span>{t('體驗點數')}</span>
              <strong>{store.points.toLocaleString(locale)}</strong>
            </div>
          </header>
          <Feedback message={store.message} />
          {view === 'explore' && (
            <>
              <section className="feature-banner">
                <div>
                  <span className="eyebrow">WHAT'S YOUR PICK?</span>
                  <h2>
                    {t('看好哪一邊？')}
                    <br />
                    {t('把你的判斷留下來。')}
                  </h2>
                  <p>{t('建立競賽、選擇一方，與參與者一起確認結果。')}</p>
                  <button className="primary" onClick={() => go('create')}>
                    {t('建立你的第一場競賽 ↗')}
                  </button>
                </div>
                <div className="versus-art" aria-hidden="true">
                  <span>A</span>
                  <b>VS</b>
                  <span>B</span>
                </div>
              </section>
              <div className="summary-grid">
                {[
                  ['開放參與', store.contests.filter((c) => c.status === 'ongoing').length],
                  [
                    '我的參與',
                    store.contests.filter((c) => c.votes.some((v) => v.user === 'visitor')).length,
                  ],
                  [
                    '等待我確認',
                    store.contests.filter(
                      (c) =>
                        c.status === 'pending' &&
                        c.votes.some((v) => v.user === 'visitor') &&
                        !c.approvals.includes('visitor'),
                    ).length,
                  ],
                ].map(([label, n]) => (
                  <div key={label}>
                    <small>{t(label)}</small>
                    <strong>{n}</strong>
                  </div>
                ))}
              </div>
              <div className="section-heading">
                <h2>{t('找一場感興趣的競賽')}</h2>
                <span>
                  {filtered.length} {t('場競賽')}
                </span>
              </div>
              <div className="filter-row">
                <input
                  aria-label={t('搜尋競賽')}
                  type="search"
                  placeholder={t('搜尋競賽名稱')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <select
                  aria-label={t('篩選類別')}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {['all', '運動', '遊戲', '生活'].map((s) => (
                    <option key={s} value={s}>
                      {t(s === 'all' ? '所有類別' : s)}
                    </option>
                  ))}
                </select>
                <select
                  aria-label={t('篩選狀態')}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">{t('所有狀態')}</option>
                  {Object.entries(states).map(([key, label]) => (
                    <option key={key} value={key}>
                      {t(label)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="contest-grid">{cards(filtered)}</div>
            </>
          )}
          {view === 'mine' && (
            <>
              <div className="section-heading">
                <h2>{t('追蹤每一次參與')}</h2>
                <span>{t('目前體驗身份 / 訪客')}</span>
              </div>
              <div className="segmented">
                {[
                  ['participated', '我參與的'],
                  ['created', '我建立的'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={mine === key ? 'active' : ''}
                    onClick={() => setMine(key)}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
              <div className="contest-grid">{cards(personal)}</div>
            </>
          )}
          {view === 'create' && (
            <ContestForm
              onCreate={(form) => {
                const created = store.create(form);
                if (created) go('contest/' + created.id);
              }}
            />
          )}
          {selected && (
            <ContestDetail
              key={selected.id}
              contest={selected}
              onAction={(action, options) => store.act(selected.id, action, options)}
              onBack={() => go('explore')}
            />
          )}
          <footer className="app-footer">
            <p>
              {t(
                '以跨平台競賽產品開發經驗延伸的網頁互動作品。沒有真實下注、金流、登入或伺服器同步；點數不會依結果派發。',
              )}
            </p>
            <button
              onClick={() => {
                store.reset();
                go('explore');
              }}
            >
              {t('還原體驗資料')}
            </button>
          </footer>
        </main>
      </div>
    </Page>
  );
}
