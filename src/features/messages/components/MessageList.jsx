import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { requestNextPage } from '../services/localMessageSource';

export default function MessageList({ messages, selected, onSelect, filterKey }) {
  const { t, locale } = useI18n();
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(false);
  const root = useRef(null);
  const sentinel = useRef(null);
  const pending = useRef(null);
  useEffect(() => {
    pending.current?.abort();
    pending.current = null;
    setLoading(false);
    setLimit(12);
    if (root.current) root.current.scrollTop = 0;
  }, [filterKey]);
  useEffect(() => () => pending.current?.abort(), []);
  const loadMore = () => {
    if (pending.current || limit >= messages.length) return;
    const controller = new AbortController();
    pending.current = controller;
    setLoading(true);
    requestNextPage({ offset: limit, total: messages.length, signal: controller.signal })
      .then((next) => {
        if (!controller.signal.aborted) setLimit(next);
      })
      .catch(() => {})
      .finally(() => {
        if (pending.current === controller) {
          pending.current = null;
          setLoading(false);
        }
      });
  };
  useEffect(() => {
    if (!window.IntersectionObserver || limit >= messages.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { root: root.current, rootMargin: '100px' },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [limit, messages.length, filterKey]);
  return (
    <section className="inbox-list" ref={root} aria-label={t('訊息列表')} aria-busy={loading}>
      {messages.slice(0, limit).map((message) => (
        <button
          key={message.id}
          className={`inbox-row ${selected === message.id ? 'selected' : ''} ${!message.read ? 'unread' : ''}`}
          onClick={() => onSelect(message.id)}
        >
          <div className="message-dot" aria-label={t(message.read ? '已讀' : '未讀')} />
          <div className="message-row-copy">
            <div>
              <span>{t(message.sender)}</span>
              <time dateTime={new Date(message.createdAt).toISOString()}>
                {new Date(message.createdAt).toLocaleString(locale, {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
            <h3>{t(message.subject)}</h3>
            <p>{t(message.body)}</p>
            <small>{message.id}</small>
          </div>
        </button>
      ))}
      {!messages.length && (
        <div className="inbox-empty">
          <b>{t('沒有符合條件的訊息')}</b>
          <p>{t('試著調整搜尋或篩選，或接收一則新訊息。')}</p>
        </div>
      )}
      <div ref={sentinel} className="inbox-more">
        {limit < messages.length ? (
          <button onClick={loadMore} disabled={loading}>
            {t(loading ? '載入更多訊息中…' : '載入更多訊息')}
          </button>
        ) : (
          messages.length > 0 && <span>{t('所有訊息已載入')}</span>
        )}
        <small>
          {Math.min(limit, messages.length)} / {messages.length}
        </small>
      </div>
    </section>
  );
}
