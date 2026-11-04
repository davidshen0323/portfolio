import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function WorkGallery() {
  const { t } = useI18n();
  return (
    <section id="work" className="works">
      <div className="section-title">
        <span>{t('作品選集')}</span>
        <span>{'WEB / INTERFACE'}</span>
      </div>
      <article className="work-card dash-card">
        <div>
          <span className="tag">{t('01 / 互動介面')}</span>
          <h2>
            {t('營運管家')}
            <br />
            {t('商務管理')}
          </h2>
          <p>{t('訂單、合約、入庫與庫存管理')}</p>
          <div className="work-actions">
            <AppLink className="view-link" href="https://forma-operations.dav0323.chatgpt.site">
              {t('開啟網站 ↗')}
            </AppLink>
            <a
              className="view-link"
              href="https://github.com/davidshen0323/operation-manager"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="dash-preview">
          <div className="mini-top"></div>
          <div className="mini-grid">
            <b>
              {t('本週預約')}
              <br />
              <strong>{'24'}</strong>
            </b>
            <b>
              {t('待確認')}
              <br />
              <strong>{'06'}</strong>
            </b>
          </div>
          <div className="mini-line"></div>
          <div className="mini-line short"></div>
        </div>
      </article>
      <article className="work-card dealer-card">
        <div>
          <span className="tag">{t('02 / 汽車銷售')}</span>
          <h2>
            {t('好車選品')}
            <br />
            {t('外匯車選購')}
          </h2>
          <p>{t('車源篩選、車輛詳情與詢問流程')}</p>
          <div className="work-actions">
            <AppLink
              className="view-link"
              href="https://atelier-select-motors.dav0323.chatgpt.site"
            >
              {t('開啟網站 ↗')}
            </AppLink>
            <a
              className="view-link"
              href="https://github.com/davidshen0323/goodcar-motors"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="dealer-preview">
          <span>{'CURATED IMPORTED CARS'}</span>
        </div>
      </article>
      <article className="work-card shop-card">
        <div>
          <span className="tag">{t('03 / 電子商務')}</span>
          <h2>
            {t('車旅好物')}
            <br />
            {t('選物商店')}
          </h2>
          <p>{t('商品搜尋、購物車與結帳流程')}</p>
          <div className="work-actions">
            <AppLink className="view-link" href="https://axis-objects.dav0323.chatgpt.site">
              {t('開啟網站 ↗')}
            </AppLink>
            <a
              className="view-link"
              href="https://github.com/davidshen0323/drive-essentials"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="shop-preview">
          <span>{'OBJECTS FOR THE DRIVE'}</span>
        </div>
      </article>
      <AppLink className="work-card car-card" href="auto.html">
        <div>
          <span className="tag">{t('04 / 品牌網站')}</span>
          <h2>
            {'FORM'}
            <br />
            {t('汽車美容')}
          </h2>
          <p>{t('服務介紹、方案比較與預約引導')}</p>
          <span className="view-link">{t('開啟網站 ↗')}</span>
        </div>
        <div className="abstract-car">
          <span>{'FORM / AUTO CARE'}</span>
        </div>
      </AppLink>
      <AppLink className="work-card cafe-card" href="cafe.html">
        <div>
          <span className="tag">{t('05 / 品牌網站')}</span>
          <h2>
            {t('日常留白')}
            <br />
            {t('咖啡工作室')}
          </h2>
          <p>{t('品牌故事、產品呈現與營業資訊')}</p>
          <span className="view-link">{t('開啟網站 ↗')}</span>
        </div>
        <div className="cafe-mark">
          {t('日常')}
          <br />
          {t('留白')}
          <span>{'COFFEE & SPACE'}</span>
        </div>
      </AppLink>
      <AppLink className="work-card api-card" href="api.html">
        <div>
          <span className="tag">{t('06 / API 串接')}</span>
          <h2>
            {'FIELDNOTE'}
            <br />
            {t('地震資料')}
          </h2>
          <p>{t('即時查詢、條件篩選與錯誤處理')}</p>
          <span className="view-link">{t('實際查詢 ↗')}</span>
        </div>
        <div className="api-preview">
          <div className="api-orbit">
            <strong>{'3.8'}</strong>
          </div>
          <span>{'USGS / LIVE DATA'}</span>
        </div>
      </AppLink>
      <AppLink className="work-card fix-card" href="fix.html">
        <div>
          <span className="tag">{t('07 / Bug 修復')}</span>
          <h2>
            {t('手機版')}
            <br />
            {t('跑版修復')}
          </h2>
          <p>{t('切換修復前後，觀察實測溢出值')}</p>
          <span className="view-link">{t('查看案例 ↗')}</span>
        </div>
        <div className="fix-preview">
          <div>
            <span>{'BEFORE'}</span>
            <b>{'→'}</b>
            <span>{'AFTER'}</span>
          </div>
          <small>{'RESPONSIVE / CASE STUDY'}</small>
        </div>
      </AppLink>
    </section>
  );
}
