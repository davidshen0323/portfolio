import AppLink from './AppLink';
import { useI18n } from '../i18n/I18nProvider';
export default function CaseStudyLink({ slug }) {
  const { t } = useI18n();
  return (
    <AppLink className="case-study-link" href={`case-${slug}.html`}>
      {t('閱讀這個作品的需求與實作解析 ↗')}
    </AppLink>
  );
}
