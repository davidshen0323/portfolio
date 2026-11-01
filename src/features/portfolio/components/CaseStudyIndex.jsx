import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function CaseStudyIndex() {
  const { t } = useI18n();
  return (
    <section id="case-studies" className="content-section">
      <span className="eyebrow">{'BEHIND THE WORK'}</span>
      <h2>
        {t('從需求到成品，')}
        <br />
        {t('看見每個決定。')}
      </h2>
      <p>{t('除了開啟網站，也可以閱讀需求情境、操作路線與實作範圍。')}</p>
      <div className="case-list">
        <AppLink href="case-auto.html">
          <div>
            <small>{t('01 / 品牌網站')}</small>
            <p>{t('FORM 汽車美容')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-cafe.html">
          <div>
            <small>{t('02 / 品牌網站')}</small>
            <p>{t('日常留白 咖啡工作室')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-dashboard.html">
          <div>
            <small>{t('03 / 營運介面')}</small>
            <p>{t('FORMA 營運管理工作台')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-api.html">
          <div>
            <small>{t('04 / API 串接')}</small>
            <p>{t('FIELDNOTE 地震資料')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-fix.html">
          <div>
            <small>{t('05 / 介面修復')}</small>
            <p>{t('手機版跑版修復')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-dealer.html">
          <div>
            <small>{t('06 / 汽車買賣')}</small>
            <p>{t('ATELIER SELECT 外匯車')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-shop.html">
          <div>
            <small>{t('07 / 電子商務')}</small>
            <p>{t('AXIS 汽車生活選物')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-freebet.html">
          <div>
            <small>{t('08 / 行動產品')}</small>
            <p>{t('Freebet 競賽預測平台')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
        <AppLink href="case-gameflow.html">
          <div>
            <small>{t('09 / 遊戲流程')}</small>
            <p>{t('GAMEFLOW 事件控制台')}</p>
          </div>
          <span>{t('解析 ↗')}</span>
        </AppLink>
      </div>
    </section>
  );
}
