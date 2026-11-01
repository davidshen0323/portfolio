import { useI18n } from '../../shared/i18n/I18nProvider';
import AppLink from '../../shared/components/AppLink';
import Page from '../../shared/components/Page';
import '../../shared/styles/demo.css';

export default function AutoCarePage() {
  const { t } = useI18n();
  return (
    <Page theme="brand" title="FORM Auto Care｜汽車美容品牌網站" className="auto">
      <div className="demo-banner">
        {t('DAVID SHEN / 概念作品 ')}
        <AppLink href="index.html">{t('返回 David 作品集 ↗')}</AppLink>
      </div>
      <header className="auto-nav">
        <a className="auto-logo" href="#top">
          {'FORM'}
          <span>{'AUTO CARE'}</span>
        </a>
        <nav>
          <a href="#services">{t('服務項目')}</a>
          <a href="#plans">{t('保養方案')}</a>
          <a href="#contact">{t('聯絡資訊')}</a>
        </nav>
        <a className="nav-cta" href="#contact">
          {t('預約諮詢 ↗')}
        </a>
      </header>
      <main id="top">
        <section className="auto-hero">
          <div className="auto-hero-inner">
            <span className="overline">{'DETAIL IS EVERYTHING — 2026'}</span>
            <h1>
              {t('讓每一道光')}
              <br />
              {t('都值得停留。')}
            </h1>
            <p>{t('從日常清潔到漆面護理，為你的愛車找回理想中的細節。')}</p>
            <a className="auto-button" href="#services">
              {t('探索服務 ')}
              <span>{'↘'}</span>
            </a>
          </div>
          <span className="hero-bottom">{'FORM / TAIPEI — CAR DETAILING STUDIO'}</span>
        </section>
        <section className="auto-intro" id="services">
          <div>
            <span className="overline">{'OUR APPROACH / 01'}</span>
            <h2>
              {t('乾淨之外，')}
              <br />
              {t('還有講究。')}
            </h2>
          </div>
          <p>
            {t(
              '車子每天陪你經過不同的風景，也值得被仔細照顧。從車室整理、外觀清潔到漆面保護，依照車況挑選合適的處理方式。',
            )}
          </p>
        </section>
        <section className="auto-services">
          <article>
            <span>{'01 / EXTERIOR'}</span>
            <h3>{t('精緻洗車')}</h3>
            <p>{t('手工清潔車身、輪圈與細節，減少日常髒污累積。')}</p>
          </article>
          <article>
            <span>{'02 / INTERIOR'}</span>
            <h3>{t('車室整理')}</h3>
            <p>{t('清潔常接觸的表面、座椅與角落，還原舒適的乘坐空間。')}</p>
          </article>
          <article>
            <span>{'03 / PROTECTION'}</span>
            <h3>{t('漆面護理')}</h3>
            <p>{t('依車漆狀態評估清潔與保護步驟，維持亮澤質感。')}</p>
          </article>
        </section>
        <section className="auto-plans" id="plans">
          <div className="auto-plans-head">
            <span className="overline">{'SERVICE OPTIONS / 02'}</span>
            <h2>
              {t('依照你的車況，')}
              <br />
              {t('安排剛剛好的照顧。')}
            </h2>
          </div>
          <div className="plan-list">
            <div>
              <b>{t('日常維護')}</b>
              <span>{t('外觀清潔、輪圈、內裝基礎整理')}</span>
              <i>{'01'}</i>
            </div>
            <div>
              <b>{t('完整整理')}</b>
              <span>{t('外觀與車室深入清潔、細節處理')}</span>
              <i>{'02'}</i>
            </div>
            <div>
              <b>{t('漆面保養')}</b>
              <span>{t('漆面檢視、清潔與保護方案評估')}</span>
              <i>{'03'}</i>
            </div>
          </div>
        </section>
        <section className="auto-contact" id="contact">
          <span className="overline">{'NEXT DRIVE, FRESH START'}</span>
          <h2>
            {t('讓你的下一趟旅程，')}
            <br />
            {t('從好好整理開始。')}
          </h2>
          <p>{t('FORM 是為這件作品設定的品牌，服務內容為概念提案。')}</p>
          <AppLink href="index.html" className="auto-button">
            {t('返回作品集 ↗')}
          </AppLink>
        </section>
      </main>
      <footer className="auto-footer">
        {'FORM AUTO CARE '}
        <span>{'CONCEPT BY DAVID SHEN · 2026'}</span>
      </footer>
      <AppLink
        href="case-auto.html"
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
