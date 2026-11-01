import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function HomeHero() {
  const { t } = useI18n();
  return (
    <section className="port-hero">
      <div className="eyebrow">{'SELECTED WORK / 2026'}</div>
      <h1>
        {t('把想法做成')}
        <br />
        <em>{t('真正能使用')}</em>
        {t('的網站。')}
      </h1>
      <p>
        {t(
          '品牌形象、汽車銷售、購物流程與後台管理。以下是我自主製作的作品，包含品牌頁、營運介面，以及從 Flutter 與遊戲開發經驗延伸的互動作品。',
        )}
      </p>
      <a className="pill" href="#experience-work">
        {t('查看作品 ')}
        <span>{'↗'}</span>
      </a>
      <div className="hero-index">
        {'01 — 11 '}
        <span>{'SCROLL TO EXPLORE ↓'}</span>
      </div>
    </section>
  );
}
