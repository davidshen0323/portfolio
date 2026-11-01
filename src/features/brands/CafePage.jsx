import { useI18n } from '../../shared/i18n/I18nProvider';
import AppLink from '../../shared/components/AppLink';
import Page from '../../shared/components/Page';
import '../../shared/styles/demo.css';

export default function CafePage() {
  const { t } = useI18n();
  return (
    <Page theme="brand" title="日常留白｜咖啡品牌網站" className="cafe">
      <div className="demo-banner">
        {t('DAVID SHEN / 概念作品 ')}
        <AppLink href="index.html">{t('返回 David 作品集 ↗')}</AppLink>
      </div>
      <header className="cafe-nav">
        <a href="#top" className="cafe-logo">
          {t('日常留白')}
          <span>{'COFFEE & SPACE'}</span>
        </a>
        <nav>
          <a href="#story">{t('關於我們')}</a>
          <a href="#menu">{t('今日選擇')}</a>
          <a href="#visit">{t('來坐坐')}</a>
        </nav>
      </header>
      <main id="top">
        <section className="cafe-hero">
          <div className="cafe-hero-copy">
            <span className="cafe-small">{'A SLOWER MOMENT, EVERY DAY.'}</span>
            <h1>
              {t('把日子，')}
              <br />
              {t('留一點給自己。')}
            </h1>
            <p>
              {t('一杯咖啡，一段不趕時間的午後。')}
              <br />
              {t('在城市裡，給自己一個慢下來的位置。')}
            </p>
            <a href="#story" className="cafe-link">
              {t('認識我們 ')}
              <span>{'↗'}</span>
            </a>
          </div>
          <div className="cafe-photo" role="img" aria-label={t('咖啡與桌面靜物')}></div>
          <div className="cafe-side">{'TAIPEI · COFFEE STUDIO · EST. 2026'}</div>
        </section>
        <section className="cafe-story" id="story">
          <span className="cafe-small">{'01 / THE STORY'}</span>
          <h2>
            {t('好的日常，')}
            <br />
            {t('常常從一杯咖啡開始。')}
          </h2>
          <p>
            {t(
              '我們喜歡剛好的溫度、舒服的空間，也喜歡讓對話自然發生。走進來，暫時放下行程，把這段時間留給自己。',
            )}
          </p>
        </section>
        <section className="cafe-menu" id="menu">
          <div>
            <span className="cafe-small">{'02 / THE SELECTION'}</span>
            <h2>{t('今日選擇')}</h2>
            <p>{t('熟悉的風味，細心地做好。')}</p>
          </div>
          <div className="menu-items">
            <article>
              <span>{'01'}</span>
              <div>
                <h3>{t('經典拿鐵')}</h3>
                <p>{t('濃縮咖啡與細緻牛奶，溫柔而平衡。')}</p>
              </div>
              <b>{'LATTE'}</b>
            </article>
            <article>
              <span>{'02'}</span>
              <div>
                <h3>{t('手沖單品')}</h3>
                <p>{t('讓豆子的香氣，慢慢成為今天的節奏。')}</p>
              </div>
              <b>{'POUR OVER'}</b>
            </article>
            <article>
              <span>{'03'}</span>
              <div>
                <h3>{t('午後甜點')}</h3>
                <p>{t('搭配咖啡的一點甜，留給值得休息的你。')}</p>
              </div>
              <b>{'DESSERT'}</b>
            </article>
          </div>
        </section>
        <section className="cafe-visit" id="visit">
          <span className="cafe-small">{'03 / VISIT US'}</span>
          <h2>{t('有空，來坐坐。')}</h2>
          <p>{t('日常留白是為本作品設定的品牌；商品與營業資訊為概念內容。')}</p>
          <AppLink href="index.html" className="cafe-link">
            {t('返回作品集 ↗')}
          </AppLink>
        </section>
      </main>
      <footer className="cafe-footer">
        {t('日常留白 ')}
        <span>{'CONCEPT BY DAVID SHEN © 2026'}</span>
      </footer>
      <AppLink
        href="case-cafe.html"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '24px',
          fontSize: '14px',
          textDecoration: 'underline',
        }}
      >
        {t('閱讀這個作品的需求與實作解析 ↗')}
      </AppLink>
    </Page>
  );
}
