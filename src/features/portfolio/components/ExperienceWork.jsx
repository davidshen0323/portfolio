import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';
const projects = [
  {
    number: '08',
    tag: '行動產品與狀態流程',
    art: 'contests',
    subtitle: 'A　 VS　 B',
    flow: 'ONGOING → PENDING → ENDED',
    title: '競賽預測平台',
    text: '建立競賽、參與選邊、結果確認與爭議處理。把 Flutter 專案裡的狀態設計轉成可操作的網頁作品。',
    href: 'contests.html',
    slug: 'contests',
    theme: 'contests',
  },
  {
    number: '09',
    tag: '遊戲流程與事件整合',
    art: 'GAMEFLOW',
    subtitle: 'FLOW / EVENTS / HUD',
    flow: 'JOIN → FIRE → HIT → UPDATE',
    title: '遊戲事件控制台',
    text: '選房、AUTO、扣點與命中事件，連同離線處理及重複事件去重，呈現我在遊戲專案裡的流程整合經驗。',
    href: 'gameflow.html',
    slug: 'gameflow',
    theme: 'gameflow',
  },
  {
    number: '10',
    tag: 'React 訊息與事件處理',
    art: 'RELAY',
    subtitle: 'INBOX / UNREAD / LIVE',
    flow: 'RECEIVE → READ → ARCHIVE',
    title: 'RELAY 即時訊息中心',
    text: '搜尋、未讀數、持續載入與封存，加上連線切換與重複事件去重，呈現長列表與即時資料的處理方式。',
    href: 'messages.html',
    slug: 'messages',
    theme: 'messages',
  },
  {
    number: '11',
    tag: '商務流程與資料驗證',
    art: '營運管家',
    subtitle: 'CONTRACTS / RECEIVING',
    flow: 'REVIEW → RECEIVE → TRACK',
    title: '商務營運模組',
    text: '合約數量、期間與費用審核；紙箱與周轉箱驗收、良品入庫及操作紀錄，與商品庫存連動。',
    href: 'https://forma-operations.dav0323.chatgpt.site/#contracts',
    slug: 'business',
    theme: 'business',
  },
];
export default function ExperienceWork() {
  const { t } = useI18n();
  return (
    <section id="experience-work" className="content-section experience-section">
      <span className="eyebrow">FROM MY EXPERIENCE / 08—11</span>
      <h2>
        {t('做過的流程，')}
        <br />
        {t('用作品說得更清楚。')}
      </h2>
      <p className="experience-intro">
        {t(
          '從 React 商務系統、Flutter 行動產品與遊戲專案經驗出發，重建可操作的公開作品。每個案例都說明需求、責任背景與實作範圍。',
        )}
      </p>
      <div className="experience-cards">
        {projects.map((project) => (
          <article key={project.slug} className={`experience-card ${project.theme}-work`}>
            <span className="tag">
              {project.number} / {t(project.tag)}
            </span>
            <div className={`experience-art ${project.theme}-art`}>
              <strong>{t(project.art)}</strong>
              <span>{project.subtitle}</span>
              <small>{project.flow}</small>
            </div>
            <h3>{t(project.title)}</h3>
            <p>{t(project.text)}</p>
            <div className="experience-links" style={{ flexWrap: 'wrap' }}>
              <AppLink href={project.href}>{t('開啟作品 ↗')}</AppLink>
              <AppLink href={`case-${project.slug}.html`}>{t('經驗與實作解析 ↗')}</AppLink>
              {project.slug === 'business' && (
                <a
                  href="https://github.com/davidshen0323/operation-manager"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
