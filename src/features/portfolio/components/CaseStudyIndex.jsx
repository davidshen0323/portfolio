import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';
import cases from '../data/caseStudies.json';
export default function CaseStudyIndex() {
  const { t } = useI18n();
  return (
    <section id="case-studies" className="content-section">
      <span className="eyebrow">BEHIND THE WORK</span>
      <h2>
        {t('從需求到成品，')}
        <br />
        {t('看見每個決定。')}
      </h2>
      <p>{t('除了開啟網站，也可以閱讀需求情境、操作路線與實作範圍。')}</p>
      <div className="case-list">
        {cases.map((item, index) => (
          <AppLink key={item.slug} href={`case-${item.slug}.html`}>
            <div>
              <small>
                {String(index + 1).padStart(2, '0')} /{' '}
                {t(item.eyebrow.split(' / ')[1] || '作品解析')}
              </small>
              <p>{t(item.title)}</p>
            </div>
            <span>{t('解析 ↗')}</span>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
