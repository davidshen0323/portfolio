import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function ServicesSection() {
  const { t } = useI18n();
  return (
    <section className="content-section">
      <span className="eyebrow">{'WHAT I CAN BUILD'}</span>
      <h2>{t('讓作品對應你的需求。')}</h2>
      <div className="content-grid">
        <article>
          <small>{'01 / BRAND'}</small>
          <h3>{t('品牌與服務網站')}</h3>
          <p>{t('整理服務定位、方案內容與聯絡動線，建立適合手機閱讀的形象網站。')}</p>
          <AppLink href="case-auto.html">{t('看汽車美容案例 ↗')}</AppLink>
        </article>
        <article>
          <small>{'02 / COMMERCE'}</small>
          <h3>{t('商品與選購介面')}</h3>
          <p>{t('規劃分類、搜尋、商品詳情與購物流程。正式上線範圍再依金流與物流需求確認。')}</p>
          <AppLink href="case-shop.html">{t('看選物商店案例 ↗')}</AppLink>
        </article>
        <article>
          <small>{'03 / OPERATIONS'}</small>
          <h3>{t('管理與資料介面')}</h3>
          <p>{t('把訂單、預約、庫存與客服整理成日常工作流程，並提供篩選與報表。')}</p>
          <AppLink href="case-dashboard.html">{t('看營運工作台案例 ↗')}</AppLink>
        </article>
      </div>
    </section>
  );
}
