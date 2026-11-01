import { useI18n } from '../i18n/I18nProvider';
import AppLink from './AppLink';
export default function ProjectBanner({ label }) {
  const { t } = useI18n();
  return (
    <div className="demo-banner">
      <span>DAVID SHEN / {t(label)}</span>
      <AppLink href="index.html">{t('返回 David 作品集 ↗')}</AppLink>
    </div>
  );
}
