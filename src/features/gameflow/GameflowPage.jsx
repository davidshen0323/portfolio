import { useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import AppLink from '../../shared/components/AppLink';
import Feedback from '../../shared/components/Feedback';
import { useGameSession } from './hooks/useGameSession';
import GameArena from './components/GameArena';
import EventLog from './components/EventLog';
import '../../shared/styles/gameflow.css';
export default function GameflowPage() {
  const { t, locale } = useI18n();
  const [target, setTarget] = useState(0);
  const { session, lastClaim, error, send, fire } = useGameSession(target);
  return (
    <Page theme="gameflow" title="GAMEFLOW｜遊戲事件控制台">
      <div className="project-strip">
        <AppLink href="index.html">← DAVID SHEN / WORK 09</AppLink>
        <AppLink href="case-gameflow.html">{t('作品解析 ↗')}</AppLink>
      </div>
      <main>
        <header className="game-header">
          <div>
            <span className="eyebrow">INTERACTIVE SYSTEM / 2026</span>
            <h1>
              GAME<span>FLOW</span>
            </h1>
            <p>{t('一個畫面，看見操作如何變成事件。')}</p>
          </div>
          <div className="connection">
            <i style={{ background: session.connected ? '#8be2c1' : '#d38888' }} />
            <span>{t(session.connected ? '連線就緒' : '連線中斷')}</span>
            <button onClick={() => send({ type: session.connected ? 'DISCONNECT' : 'RECONNECT' })}>
              {t(session.connected ? '中斷連線' : '恢復連線')}
            </button>
          </div>
        </header>
        <Feedback message={error} error />
        <div className="game-layout">
          <section className="game-main">
            <div className="hud">
              {[
                ['體驗點數', session.balance.toLocaleString(locale)],
                ['發射次數', session.shots],
                ['命中次數', session.hits],
                ['流程狀態', t(session.phase === 'lobby' ? '大廳' : '戰鬥')],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{t(label)}</small>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            {session.phase === 'lobby' ? (
              <section className="room-lobby">
                <div className="lobby-title">
                  <span className="eyebrow">SELECT A ROOM</span>
                  <h2>{t('先選擇你的場次。')}</h2>
                  <p>{t('進入房間後，開始體驗操作與事件紀錄。')}</p>
                </div>
                <div className="room-grid">
                  {[
                    ['近岸海域', '明亮淺海 / 自由練習'],
                    ['深藍海域', '夜色深海 / 自由練習'],
                  ].map(([room, description], index) => (
                    <button key={room} onClick={() => send({ type: 'JOIN', room })}>
                      <span className="room-number">0{index + 1}</span>
                      <h3>{t(room)}</h3>
                      <p>{t(description)}</p>
                      <span className="room-enter">{t('進入房間 ↗')}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section>
                <div className="arena-top">
                  <span>{t(session.room)}</span>
                  <button onClick={() => send({ type: 'LEAVE' })}>{t('返回大廳 ↗')}</button>
                </div>
                <GameArena room={session.room} target={target} onTarget={setTarget} />
                <div className="battle-controls">
                  <label>
                    {t('瞄準目標')}
                    <select value={target} onChange={(e) => setTarget(Number(e.target.value))}>
                      {['珊瑚光點 / 20 點', '海流光點 / 30 點', '深海光點 / 50 點'].map(
                        (label, i) => (
                          <option key={label} value={i}>
                            {t(label)}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label>
                    {t('單次發射')}
                    <select
                      value={session.cost}
                      onChange={(e) => send({ type: 'COST', cost: Number(e.target.value) })}
                    >
                      {[10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                          {t(`${n} 點`)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="fire-button"
                    disabled={!session.connected || session.balance < session.cost}
                    onClick={fire}
                  >
                    {t('發射 ↗')}
                  </button>
                  <button
                    className="auto-button"
                    disabled={!session.connected || session.balance < session.cost}
                    aria-pressed={session.auto}
                    onClick={() => send({ type: 'AUTO' })}
                  >
                    {t(session.auto ? 'AUTO 開啟' : 'AUTO 關閉')}
                  </button>
                </div>
                <p className="arena-note">
                  {t(
                    '點選畫面或選單瞄準，再發射即可觸發本機命中事件。這個版本用固定規則呈現流程，不是隨機勝負遊戲。',
                  )}
                </p>
              </section>
            )}
            <section className="game-principles">
              {[
                ['FLOW', '選房與戰鬥切換', '依流程狀態決定可用操作，離房自動停止 AUTO。'],
                ['EVENTS', '一次事件，一次處理', '命中事件帶有編號，重複回傳不會重複增加點數。'],
                ['CONNECTION', '離線時暫停操作', '連線中斷停止 AUTO；恢復後保留本次場次。'],
              ].map(([label, title, body], i) => (
                <div key={label}>
                  <span>
                    0{i + 1} / {label}
                  </span>
                  <h3>{t(title)}</h3>
                  <p>{t(body)}</p>
                </div>
              ))}
            </section>
          </section>
          <EventLog
            events={session.events}
            canRepeat={!!lastClaim && session.connected && session.phase === 'playing'}
            onRepeat={() => send({ type: 'REPEAT_HIT' })}
            onClear={() => send({ type: 'CLEAR_LOG' })}
          />
        </div>
        <footer>
          <p>
            {t(
              '依遊戲開發經驗自主重建的網頁作品。所有連線與事件都在本機運作，沒有真實 Socket、多人同步或金錢交易。',
            )}
          </p>
          <button onClick={() => send({ type: 'RESET' })}>{t('重設體驗')}</button>
        </footer>
      </main>
    </Page>
  );
}
