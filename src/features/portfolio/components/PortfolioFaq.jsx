import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function PortfolioFaq() {
  const { t } = useI18n();
  return (
    <section className="content-section faq">
      <span className="eyebrow">{'QUESTIONS'}</span>
      <h2>{t('先了解，合作更清楚。')}</h2>
      <details>
        <summary>{t('這些是客戶委託作品嗎？')}</summary>
        <p>
          {t(
            '這是自主製作的作品集。部分作品以實際開發經驗為背景重新實作，概念品牌則用來呈現網站與互動能力；各作品解析都有說明來源與範圍。',
          )}
        </p>
      </details>
      <details>
        <summary>{t('購物平台能直接收款嗎？')}</summary>
        <p>
          {t(
            '目前作品提供前台流程與同裝置後台連動。正式收款需要另外確認金流、物流、伺服器儲存與管理權限。',
          )}
        </p>
      </details>
      <details>
        <summary>{t('網站內容需要先準備什麼？')}</summary>
        <p>
          {t(
            '品牌名稱、服務或商品內容、圖片、想參考的網站，以及最想讓訪客完成的動作，都有助於確認製作範圍。',
          )}
        </p>
      </details>
      <details>
        <summary>{t('能只修改已有網站嗎？')}</summary>
        <p>
          {t(
            '可以先整理現有頁面的問題、程式與平台限制，再評估手機版調整、功能補充或內容整理的範圍。',
          )}
        </p>
      </details>
    </section>
  );
}
