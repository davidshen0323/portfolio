import { useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import ProjectBanner from '../../shared/components/ProjectBanner';
import CaseStudyLink from '../../shared/components/CaseStudyLink';
import AppLink from '../../shared/components/AppLink';
import '../../shared/styles/fix.css';
export default function ResponsivePage() {
  const { t } = useI18n();
  const [version, setVersion] = useState('before');
  const [width, setWidth] = useState(375);
  const [metrics, setMetrics] = useState({ client: 0, content: 0 });
  const viewport = useRef(null);
  useLayoutEffect(() => {
    const el = viewport.current;
    const measure = () => setMetrics({ client: el.clientWidth, content: el.scrollWidth });
    el.scrollLeft = 0;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [version, width, t]);
  const overflow = Math.max(0, metrics.content - metrics.client);
  return (
    <Page theme="responsive" title="手機版溢出修復｜案例研究">
      <ProjectBanner label="自主製作的修復案例" />
      <header>
        <AppLink className="brand" href="index.html">
          DAVID SHEN<span> / CASE STUDY</span>
        </AppLink>
        <span>01 / RESPONSIVE FIX</span>
      </header>
      <main>
        <section className="hero">
          <span className="eyebrow">BEFORE / AFTER · INTERACTIVE CASE</span>
          <h1>
            {t('讓手機版不再')}
            <br />
            <em>{t('左右滑到迷路。')}</em>
          </h1>
          <p>
            {t(
              '一個常見的接案需求：桌機版看起來正常，手機打開卻出現橫向捲動，按鈕也被擠出畫面。你可以切換狀態並調整寬度，觀察實際差異。',
            )}
          </p>
        </section>
        <section className="demo">
          <div className="controls">
            <fieldset>
              <legend>{t('選擇版本')}</legend>
              {[
                ['before', '修復前'],
                ['after', '修復後'],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="version"
                    checked={version === value}
                    onChange={() => setVersion(value)}
                  />
                  <span>{t(label)}</span>
                </label>
              ))}
            </fieldset>
            <label className="width-control">
              {t('預覽寬度')} <strong>{width} px</strong>
              <input
                type="range"
                min="320"
                max="768"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </label>
            <button onClick={() => setVersion(version === 'before' ? 'after' : 'before')}>
              {t('切換版本 ↔')}
            </button>
          </div>
          <div className="metrics" aria-live="polite">
            {[
              ['預覽區寬度', metrics.client],
              ['內容實際寬度', metrics.content],
              ['橫向溢出', overflow],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{t(label)}</span>
                <strong className={label === '橫向溢出' ? (overflow ? 'bad' : 'good') : ''}>
                  {value} px
                </strong>
              </div>
            ))}
          </div>
          <p className="diagnosis">
            {version === 'before'
              ? `${t('內容比預覽區寬')} ${overflow} px. ${t('右側的價格和購買按鈕可能要橫向捲動才能看到。')}`
              : t('內容符合預覽寬度；商品資訊與按鈕改為手機可閱讀的排列。')}
          </p>
          <div className="device-shell">
            <div className="device-top">
              <span />
              <b>STORE / CHECKOUT</b>
              <small>{metrics.client} px</small>
            </div>
            <div className="viewport" ref={viewport} style={{ width }}>
              <div className={`preview ${version}`}>
                <div className="sample-nav">
                  <b>
                    EVERYDAY<span>SHOP</span>
                  </b>
                  <div>
                    <span>{t('商店')}</span>
                    <span>{t('選物清單')}</span>
                    <span>{t('我的帳戶')}</span>
                  </div>
                </div>
                <div className="sample-main">
                  <div className="sample-photo" role="img" aria-label={t('商品示意圖')} />
                  <div className="sample-copy">
                    <small>ACCESSORIES / 001</small>
                    <h2>{t('城市日常隨行杯')}</h2>
                    <p>{t('出門前的一杯咖啡，讓路上的每個片刻都更從容。')}</p>
                    <div className="sample-price">NT$ 1,280</div>
                    <div className="sample-actions">
                      <button type="button" tabIndex={-1}>
                        {t('加入購物車')}
                      </button>
                      <button type="button" tabIndex={-1}>
                        {t('立即購買 →')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="hint">
            {t('「修復前」在窄螢幕中保留了桌機寬度；可在預覽區內左右滑動，找到被推出畫面的按鈕。')}
          </p>
        </section>
        <section className="details">
          <div>
            <span className="eyebrow">THE PROBLEM</span>
            <h2>{t('問題出在哪裡？')}</h2>
            <p>
              {t(
                '產品資訊區原本固定為 880px，兩欄永遠不換行。當手機螢幕比內容窄，瀏覽器只能讓內部內容向右溢出。',
              )}
            </p>
          </div>
          <div className="change-list">
            {[
              ['去掉固定寬度', '讓內容以容器寬度為上限，不再強迫手機承載桌機尺寸。'],
              ['窄螢幕改單欄', '圖片、標題、價格與按鈕依閱讀順序向下排列。'],
              [
                '實測，而非只看截圖',
                '直接讀取預覽區的 scrollWidth 與 clientWidth，顯示橫向超出的像素數。',
              ],
            ].map(([title, body], i) => (
              <div key={title}>
                <b>0{i + 1}</b>
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="takeaway">
          <h2>{t('修完之後要交付什麼？')}</h2>
          <p>
            {t(
              '除了改好畫面，還要確認常見手機寬度、按鈕可點、文字不裁切、橫向溢出歸零。本頁的數值由瀏覽器即時計算；此情境由我自行建立，呈現處理手機版溢出的方式。',
            )}
          </p>
          <AppLink href="index.html">{t('回到作品集 ↗')}</AppLink>
        </section>
      </main>
      <footer>
        DAVID SHEN / BUG FIX CASE<span>SELF-INITIATED CASE · 2026</span>
      </footer>
      <CaseStudyLink slug="fix" />
    </Page>
  );
}
