import { useMemo, useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import AppLink from '../../shared/components/AppLink';
import Feedback from '../../shared/components/Feedback';
import CaseStudyLink from '../../shared/components/CaseStudyLink';
import { useMessageCenter } from './hooks/useMessageCenter';
import { selectMessages } from './domain/messages';
import MessageList from './components/MessageList';
import './messages.css';

const categories = [
  ['all', '全部訊息', '◈'],
  ['orders', '訂單通知', '▤'],
  ['operations', '營運通知', '▣'],
  ['system', '系統通知', '◇'],
];
export default function MessagesPage() {
  const { t, locale } = useI18n();
  const center = useMessageCenter();
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    read: 'all',
    archived: false,
  });
  const [selected, setSelected] = useState(null);
  const messages = useMemo(
    () => selectMessages(center.messages, filters, t),
    [center.messages, filters, t],
  );
  const message = center.messages.find((entry) => entry.id === selected);
  const unread = center.messages.filter((entry) => !entry.read && !entry.archived).length;
  const openMessage = (id) => {
    setSelected(id);
    center.markRead([id]);
  };
  return (
    <Page theme="messages" title="RELAY｜即時訊息中心">
      <div className="relay-strip">
        <AppLink href="index.html">← DAVID SHEN / WORK 10</AppLink>
        <AppLink href="case-messages.html">{t('閱讀作品解析 ↗')}</AppLink>
      </div>
      <div className="relay-app">
        <aside className="relay-sidebar">
          <div className="relay-logo">
            RELAY<span>MESSAGE CENTER</span>
          </div>
          <small className="relay-label">WORKSPACE / 01</small>
          <nav aria-label={t('訊息分類')}>
            {categories.map(([key, label, icon]) => (
              <button
                key={key}
                className={!filters.archived && filters.category === key ? 'active' : ''}
                onClick={() => setFilters({ ...filters, category: key, archived: false })}
              >
                <span>
                  {icon} {t(label)}
                </span>
                <small>
                  {
                    center.messages.filter(
                      (entry) => !entry.archived && (key === 'all' || entry.category === key),
                    ).length
                  }
                </small>
              </button>
            ))}
            <button
              className={filters.archived ? 'active' : ''}
              onClick={() => setFilters({ ...filters, archived: true, category: 'all' })}
            >
              <span>▧ {t('已封存')}</span>
              <small>{center.messages.filter((entry) => entry.archived).length}</small>
            </button>
          </nav>
          <div className="relay-sidebar-note">
            <b>REACT / EVENT-DRIVEN</b>
            <p>{t('列表、狀態與事件來源分層，為後續串接 WebSocket 預留邊界。')}</p>
          </div>
        </aside>
        <main className="relay-main">
          <header className="relay-header">
            <div>
              <span className="relay-label">COMMUNICATION / INBOX</span>
              <h1>{t('訊息中心')}</h1>
              <p>{t('重要的更新，不必在訊息中找來找去。')}</p>
            </div>
            <div className="relay-unread">
              <span>{t('未讀訊息')}</span>
              <b>{unread}</b>
            </div>
          </header>
          <Feedback message={center.error} error />
          <div className="relay-transport">
            <div>
              <span className={`connection-light ${center.connected ? 'online' : ''}`} />
              <b>{t(center.connected ? '事件來源已連線' : '事件來源已離線')}</b>
              <small>{t('本機事件模式，沒有連線至正式訊息伺服器。')}</small>
            </div>
            <div className="relay-transport-actions">
              <button onClick={() => center.setConnected(!center.connected)}>
                {t(center.connected ? '中斷連線' : '恢復連線')}
              </button>
              <button disabled={!center.connected} onClick={center.receive}>
                {t('接收一則訊息')}
              </button>
              <button disabled={!center.connected || !center.canReplay} onClick={center.replay}>
                {t('重送最近事件')}
              </button>
              <label>
                <input
                  type="checkbox"
                  checked={center.automatic}
                  onChange={(e) => center.setAutomatic(e.target.checked)}
                />
                {t('自動接收')}
              </label>
            </div>
          </div>
          <div className="relay-toolbar">
            <label className="relay-search">
              <span>⌕</span>
              <input
                type="search"
                aria-label={t('搜尋訊息')}
                placeholder={t('搜尋標題、內容或編號')}
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              />
            </label>
            <label>
              {t('閱讀狀態')}
              <select
                value={filters.read}
                onChange={(e) => setFilters({ ...filters, read: e.target.value })}
              >
                <option value="all">{t('全部狀態')}</option>
                <option value="unread">{t('只看未讀')}</option>
              </select>
            </label>
            <button onClick={() => center.markRead(messages.map((entry) => entry.id))}>
              {t('全部標為已讀')}
            </button>
          </div>
          <div className="relay-workspace">
            <MessageList
              messages={messages}
              selected={selected}
              onSelect={openMessage}
              filterKey={JSON.stringify(filters)}
            />
            <article className="relay-detail" aria-label={t('訊息詳情')}>
              {message ? (
                <>
                  <div className="relay-detail-top">
                    <span>{t(message.sender)}</span>
                    <span className="read-badge">{t(message.read ? '已讀' : '未讀')}</span>
                  </div>
                  <h2>{t(message.subject)}</h2>
                  <time dateTime={new Date(message.createdAt).toISOString()}>
                    {new Date(message.createdAt).toLocaleString(locale)}
                  </time>
                  <p className="relay-message-body">{t(message.body)}</p>
                  <div className="relay-detail-meta">
                    <span>EVENT ID</span>
                    <code>{message.id}</code>
                  </div>
                  <button
                    className="relay-archive"
                    onClick={() => {
                      if (center.archive(message.id, !message.archived)) setSelected(null);
                    }}
                  >
                    {t(message.archived ? '移回收件匣' : '封存訊息')}
                  </button>
                </>
              ) : (
                <div className="relay-detail-empty">
                  <span>✉</span>
                  <h2>{t('選擇一則訊息')}</h2>
                  <p>{t('開啟訊息後會更新未讀數，重複事件不會重複建立紀錄。')}</p>
                </div>
              )}
            </article>
          </div>
          <p className="relay-disclosure">
            {t('依過往訊息中心開發經驗自主重建。資料為概念內容，操作僅保留在目前瀏覽器。')}
          </p>
        </main>
      </div>
      <CaseStudyLink slug="messages" />
    </Page>
  );
}
