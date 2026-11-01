import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function ExperienceWork() {
  const { t } = useI18n();
  return (
    <section id="experience-work" className="content-section experience-section">
      <span className="eyebrow">{'FROM MY EXPERIENCE / 08—09'}</span>
      <h2>
        {t('做過的流程，')}
        <br />
        {t('用作品說得更清楚。')}
      </h2>
      <p className="experience-intro">
        {t(
          '從 Flutter 行動產品與遊戲專案整合經驗出發，重建可以公開體驗的操作流程。你可以先動手操作，再閱讀經驗與實作範圍。',
        )}
      </p>
      <div className="experience-cards">
        <article className="experience-card freebet-work">
          <span className="tag">{t('08 / 行動產品與狀態流程')}</span>
          <div className="experience-art freebet-art">
            <strong>{'freebet'}</strong>
            <span>{'A　 VS　 B'}</span>
            <small>{'ONGOING → PENDING → ENDED'}</small>
          </div>
          <h3>{t('Freebet 競賽預測平台')}</h3>
          <p>
            {t(
              '建立競賽、參與選邊、結果確認與爭議處理。把 Flutter 專案裡的狀態設計轉成可操作的網頁作品。',
            )}
          </p>
          <div className="experience-links">
            <AppLink href="freebet.html">{t('開啟作品 ↗')}</AppLink>
            <AppLink href="case-freebet.html">{t('經驗與實作解析 ↗')}</AppLink>
          </div>
        </article>
        <article className="experience-card gameflow-work">
          <span className="tag">{t('09 / 遊戲流程與事件整合')}</span>
          <div className="experience-art gameflow-art">
            <strong>{'GAMEFLOW'}</strong>
            <span>{'FLOW　 /　 EVENTS　 /　 HUD'}</span>
            <small>{'JOIN → FIRE → HIT → UPDATE'}</small>
          </div>
          <h3>{t('遊戲事件控制台')}</h3>
          <p>
            {t(
              '選房、AUTO、扣點與命中事件，連同離線處理及重複事件去重，呈現我在遊戲專案裡的流程整合經驗。',
            )}
          </p>
          <div className="experience-links">
            <AppLink href="gameflow.html">{t('開啟作品 ↗')}</AppLink>
            <AppLink href="case-gameflow.html">{t('經驗與實作解析 ↗')}</AppLink>
          </div>
        </article>
      </div>
    </section>
  );
}
