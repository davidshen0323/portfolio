import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import AppLink from '../../shared/components/AppLink';
import cases from './data/caseStudies.json';
import '../../shared/styles/style.css';

export default function CaseStudyPage({ slug }) {
  const { t } = useI18n();
  const index = cases.findIndex((item) => item.slug === slug);
  if (index < 0)
    return (
      <Page theme="portfolio" title="David Shen">
        <main>
          <h1>404</h1>
          <AppLink href="index.html">Home</AppLink>
        </main>
      </Page>
    );
  const item = cases[index];
  const next = cases[(index + 1) % cases.length];
  return (
    <Page theme="portfolio" title={`${item.title}｜David Shen 作品解析`}>
      <header className="port-header">
        <AppLink href="index.html" className="wordmark">
          DAVID SHEN<span> / DIGITAL WORK</span>
        </AppLink>
        <AppLink href="index.html#case-studies">{t('所有作品解析 ↗')}</AppLink>
      </header>
      <main>
        <section className="case-hero">
          <span className="eyebrow">{t(item.eyebrow)}</span>
          <h1>{t(item.title)}</h1>
          <p>{t(item.lead)}</p>
          <AppLink className="pill" href={`${slug}.html`}>
            {t('開啟作品 ↗')}
          </AppLink>
        </section>
        <div className="case-meta">
          {item.meta.map((text) => (
            <span key={text}>{t(text)}</span>
          ))}
        </div>
        {item.image && <img className="case-image" src={`/${item.image}`} alt={t(item.title)} />}
        {item.sections.map((section) => (
          <section
            key={section.label}
            className={`content-section ${section.scope ? 'case-limit' : ''}`}
          >
            <span className="eyebrow">{section.label}</span>
            <h2>{t(section.heading)}</h2>
            {section.paragraphs.map((text) => (
              <p className="case-reading" key={text}>
                {t(text)}
              </p>
            ))}
            {section.features.length > 0 && (
              <div className="content-grid">
                {section.features.map((feature, i) => (
                  <article key={feature.title}>
                    <small>0{i + 1}</small>
                    <h3>{t(feature.title)}</h3>
                    <p>{t(feature.body)}</p>
                  </article>
                ))}
              </div>
            )}
            {section.steps.length > 0 && (
              <>
                <ol className="case-reading">
                  {section.steps.map((text) => (
                    <li key={text}>{t(text)}</li>
                  ))}
                </ol>
                <AppLink className="pill" href={`${slug}.html`}>
                  {t('開始操作 ↗')}
                </AppLink>
              </>
            )}
          </section>
        ))}
        <section className="content-section case-next">
          <div>
            <span className="eyebrow">NEXT PROJECT</span>
            <h2>{t(next.title)}</h2>
          </div>
          <AppLink className="pill" href={`case-${next.slug}.html`}>
            {t('下一個作品 ↗')}
          </AppLink>
        </section>
      </main>
      <footer className="port-footer">
        DAVID SHEN<span>© 2026 · SELECTED WORK</span>
      </footer>
    </Page>
  );
}
