import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';
import BriefBuilder from './BriefBuilder';

export default function ProjectBriefSection() {
  const { t } = useI18n();
  return (
    <section className="content-section" id="brief">
      <span className="eyebrow">{'PROJECT BRIEF'}</span>
      <h2>{t('先整理一份網站需求。')}</h2>
      <p>{t('選擇你需要的方向，產生可以複製的需求摘要。內容不會自動送出。')}</p>
      <BriefBuilder />
    </section>
  );
}
