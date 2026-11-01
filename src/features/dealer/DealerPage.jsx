import { useMemo, useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import ProjectBanner from '../../shared/components/ProjectBanner';
import CaseStudyLink from '../../shared/components/CaseStudyLink';
import Modal from '../../shared/components/Modal';
import FaqList from '../../shared/components/FaqList';
import { money } from '../../shared/lib/format';
import cars from './data/cars.json';
import VehicleComparison from './components/VehicleComparison';
import LoanCalculator from './components/LoanCalculator';
import { InquiryForm, SellCarForm } from './components/InquiryForms';
import '../../shared/styles/dealer.css';
export default function DealerPage() {
  const { t, locale } = useI18n();
  const [body, setBody] = useState('all');
  const [price, setPrice] = useState('all');
  const [sort, setSort] = useState('featured');
  const [detail, setDetail] = useState(null);
  const [inquiry, setInquiry] = useState('');
  const filtered = useMemo(
    () =>
      cars
        .filter(
          (c) =>
            (body === 'all' || c.body === body) && (price === 'all' || c.price <= Number(price)),
        )
        .sort((a, b) =>
          sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0,
        ),
    [body, price, sort],
  );
  return (
    <Page theme="dealer" title="ATELIER SELECT｜外匯車買賣">
      <ProjectBanner label="汽車網站概念作品" />
      <header>
        <a className="logo" href="#top">
          ATELIER<span>SELECT MOTOR CO.</span>
        </a>
        <nav>
          {[
            ['inventory', '精選車源'],
            ['process', '購車流程'],
            ['inquiry', '詢問車輛'],
            ['sell', '委託售車'],
          ].map(([id, label]) => (
            <a key={id} href={'#' + id}>
              {t(label)}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#inventory">
          {t('探索車源 ↗')}
        </a>
      </header>
      <main id="top">
        <section className="hero">
          <div>
            <span className="kicker">CURATED IMPORTS / TAIPEI</span>
            <h1>
              {t('找到值得')}
              <br />
              {t('開回家的那一台。')}
            </h1>
            <p>{t('用清楚的車輛資訊與簡單的比較方式，開始你的選車旅程。')}</p>
            <a className="primary" href="#inventory">
              {t('瀏覽精選車源')} ↘
            </a>
          </div>
          <span className="hero-caption">DRIVE WITH CONFIDENCE · SELECT WITH CARE</span>
        </section>
        <section className="intro">
          <span className="kicker">THE COLLECTION / 01</span>
          <h2>{t('精選車源')}</h2>
          <p>{t('選擇你在意的條件，快速找到合適的車款。')}</p>
        </section>
        <section className="inventory" id="inventory">
          <div className="filters">
            <label>
              {t('車型')}
              <select value={body} onChange={(e) => setBody(e.target.value)}>
                {['all', '房車', '休旅', '雙門'].map((v) => (
                  <option key={v} value={v}>
                    {t(v === 'all' ? '全部車型' : v)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('預算')}
              <select value={price} onChange={(e) => setPrice(e.target.value)}>
                <option value="all">{t('不限預算')}</option>
                {[200, 250, 300].map((n) => (
                  <option key={n} value={n}>
                    {t(`${n} 萬以下`)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('排序')}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {[
                  ['featured', '精選排序'],
                  ['low', '價格由低到高'],
                  ['high', '價格由高到低'],
                ].map(([v, label]) => (
                  <option key={v} value={v}>
                    {t(label)}
                  </option>
                ))}
              </select>
            </label>
            <span>
              {filtered.length} {t('台')}
            </span>
          </div>
          <div className="cars">
            {filtered.map((c) => (
              <article className="car" key={c.id}>
                <div
                  className={`car-photo ${c.className}`}
                  style={{ backgroundImage: "url('/dealer-hero.png')" }}
                  role="img"
                  aria-label={t(c.name)}
                />
                <div className="car-body">
                  <span>{c.id} / SELECTED IMPORT</span>
                  <h3>{t(c.name)}</h3>
                  <div className="spec">
                    <span>{c.year}</span>
                    <span>{c.mileage}</span>
                    <span>{t(c.body)}</span>
                  </div>
                  <div className="car-bottom">
                    <b>{money(c.price * 10000, locale)}</b>
                    <button onClick={() => setDetail(c)}>{t('查看詳情 ↗')}</button>
                  </div>
                </div>
              </article>
            ))}
            {!filtered.length && <p>{t('目前沒有符合條件的車輛，請調整篩選條件。')}</p>}
          </div>
          <p className="note">{t('ATELIER SELECT 為概念品牌，車源與售價並非實際刊登資訊。')}</p>
        </section>
        <VehicleComparison cars={cars} />
        <LoanCalculator />
        <section className="portfolio-extra dealer-faq">
          <span className="kicker">BEFORE YOU DECIDE</span>
          <h2>{t('把問題先準備好。')}</h2>
          <FaqList
            items={[
              [
                '看車時可以先詢問哪些資訊？',
                '車輛識別資訊、車況檢查文件、里程與保養紀錄、進口與領牌狀態，以及可供確認的配備清單。',
              ],
              [
                '網站價格代表最終成交金額嗎？',
                '本作品的價格是概念設定。實際交易需由車商書面說明車價與各項費用，再確認條件。',
              ],
              [
                '可以直接預約看車嗎？',
                '本頁提供詢問內容預覽。正式網站需連接車商的預約與聯絡管道，才能送出需求。',
              ],
            ]}
          />
        </section>
        <section className="process" id="process">
          <div>
            <span className="kicker">A CLEARER JOURNEY / 02</span>
            <h2>{t('每一步，都看得明白。')}</h2>
          </div>
          <div className="steps">
            {[
              ['篩選車源', '依車型與預算縮小選擇，查看主要規格。'],
              ['確認資訊', '閱讀里程、年份與配備，整理想問的問題。'],
              ['提出詢問', '選定車輛後，填寫需求摘要供後續聯絡。'],
            ].map(([label, text], i) => (
              <article key={label}>
                <b>0{i + 1}</b>
                <h3>{t(label)}</h3>
                <p>{t(text)}</p>
              </article>
            ))}
          </div>
        </section>
        <InquiryForm cars={cars} selectedId={inquiry} onSelect={setInquiry} />
        <SellCarForm />
      </main>
      <Modal open={!!detail} onClose={() => setDetail(null)} title="車輛資訊">
        {detail && (
          <div className="detail-copy">
            <h2>{t(detail.name)}</h2>
            <p>{t(detail.feature)}</p>
            <ul>
              {[
                ['年份', detail.year],
                ['里程', detail.mileage],
                ['車型', t(detail.body)],
                ['排氣量', detail.engine],
                ['顏色', t(detail.color)],
              ].map(([label, value]) => (
                <li key={label}>
                  {t(label)}: {value}
                </li>
              ))}
            </ul>
            <p>{money(detail.price * 10000, locale)}</p>
            <p className="note">{t('這是概念車源，規格與價格未對應實際在售車輛。')}</p>
            <a
              className="primary"
              href="#inquiry"
              onClick={() => {
                setInquiry(detail.id);
                setDetail(null);
              }}
            >
              {t('詢問這台車 ↗')}
            </a>
          </div>
        )}
      </Modal>
      <footer>
        ATELIER SELECT<span>CONCEPT BY DAVID SHEN · 2026</span>
      </footer>
      <CaseStudyLink slug="dealer" />
    </Page>
  );
}
