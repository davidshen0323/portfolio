import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function WorkflowSection() {
  const { t } = useI18n();
  return (
    <section className="content-section">
      <span className="eyebrow">{'WORKING TOGETHER'}</span>
      <h2>{t('合作從釐清需求開始。')}</h2>
      <div className="process-list">
        <article>
          <b>{'01'}</b>
          <h3>{t('整理需求')}</h3>
          <p>{t('確認使用者、核心頁面、素材與預期交付內容。')}</p>
        </article>
        <article>
          <b>{'02'}</b>
          <h3>{t('確認畫面')}</h3>
          <p>{t('先討論資訊層級與主要操作，確認方向再進入實作。')}</p>
        </article>
        <article>
          <b>{'03'}</b>
          <h3>{t('完成互動')}</h3>
          <p>{t('製作頁面與手機版，逐項確認表單、資料與操作狀態。')}</p>
        </article>
        <article>
          <b>{'04'}</b>
          <h3>{t('交付整理')}</h3>
          <p>{t('依約定範圍整理檔案、操作說明與後續維護事項。')}</p>
        </article>
      </div>
    </section>
  );
}
