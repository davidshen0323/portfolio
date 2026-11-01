import { useMemo, useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nProvider';
import { useStoredState } from '../../shared/hooks/useStoredState';
import Page from '../../shared/components/Page';
import ProjectBanner from '../../shared/components/ProjectBanner';
import CaseStudyLink from '../../shared/components/CaseStudyLink';
import AppLink from '../../shared/components/AppLink';
import Modal from '../../shared/components/Modal';
import Feedback from '../../shared/components/Feedback';
import { money } from '../../shared/lib/format';
import products from './data/products.json';
import specifications from './data/specifications.json';
import initialStock from './data/stock.json';
import { STOCK_KEY, placeOrder } from './services/orderRepository';
import { useCart } from './hooks/useCart';
import ProductCard, { ProductImage } from './components/ProductCard';
import '../../shared/styles/shop.css';

export default function ShopPage() {
  const { t, locale } = useI18n();
  const [stock] = useStoredState(STOCK_KEY, initialStock);
  const basket = useCart(stock);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [dialog, setDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState({ name: '', email: '', delivery: '宅配' });
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (category === 'all' || p.category === category) &&
            `${p.name} ${t(p.name)}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0,
        ),
    [query, category, sort, t],
  );
  const add = (product) => {
    basket.change(product.id, 1);
    setDialog('cart');
  };
  const checkout = (event) => {
    event.preventDefault();
    try {
      const created = placeOrder(basket.cart, customer);
      setOrder(created);
      basket.clear();
      setMessage('');
      setDialog('success');
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <Page theme="shop" title="AXIS｜汽車生活選物">
      <ProjectBanner label="電商概念作品" />
      <header>
        <a className="logo" href="#top">
          AXIS<span>OBJECTS FOR THE DRIVE</span>
        </a>
        <nav>
          <a href="#products">{t('所有商品')}</a>
          <a href="#about">{t('關於選物')}</a>
        </nav>
        <button className="cart-button" onClick={() => setDialog('cart')}>
          {t('購物車')} <span>{basket.count}</span>
        </button>
      </header>
      <main id="top">
        <section className="hero">
          <div>
            <span className="kicker">THE EVERYDAY DRIVE / 2026</span>
            <h1>
              {t('好用的東西，')}
              <br />
              {t('陪你走得更遠。')}
            </h1>
            <p>{t('為車內日常與每一段路程，挑一些值得留下的物件。')}</p>
            <a className="hero-cta" href="#products">
              {t('探索商品 ↘')}
            </a>
          </div>
          <div className="hero-image" role="img" aria-label={t('汽車生活用品展示')} />
        </section>
        <section className="catalog" id="products">
          <div className="catalog-head">
            <div>
              <span className="kicker">CURATED OBJECTS / 01</span>
              <h2>{t('精選商品')}</h2>
            </div>
            <span>
              {filtered.length} {t('件商品')}
            </span>
          </div>
          <div className="controls">
            <label className="search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('搜尋商品名稱')}
                aria-label={t('搜尋商品名稱')}
                type="search"
              />
            </label>
            <label className="category">
              {t('分類')}
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {['all', '車內', '清潔', '生活'].map((value) => (
                  <option key={value} value={value}>
                    {t(value === 'all' ? '全部商品' : value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="category">
              {t('排序')}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {[
                  ['default', '精選排序'],
                  ['low', '價格低到高'],
                  ['high', '價格高到低'],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {t(label)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stock={stock.find((s) => s.id === product.id)?.qty}
                onDetails={() => {
                  setSelected(product);
                  setDialog('product');
                }}
                onAdd={() => add(product)}
              />
            ))}
          </div>
          {!filtered.length && <p>{t('沒有符合條件的商品，請試試其他搜尋條件。')}</p>}
        </section>
        <section className="about" id="about">
          <span className="kicker">MADE FOR THE RIDE</span>
          <h2>{t('從出發前，到抵達後。')}</h2>
          <p>
            {t('小配件也能讓每段路更舒服。AXIS 是自主創作的品牌，商品與訂單僅供體驗購物流程。')}
          </p>
        </section>
        <section className="shop-info">
          <h2>{t('選購前，先讀一點細節。')}</h2>
          {[
            [
              '商品可以直接購買嗎？',
              '這是自主創作的選購介面。結帳只建立此裝置上的訂單，不收款、不寄送。',
            ],
            [
              '如何確認庫存？',
              '購物車數量受此裝置庫存限制。下單後會扣除本機庫存，後台可調整數量。',
            ],
            [
              '在哪裡查看訂單？',
              '同一個瀏覽器可開啟 FORMA 後台查看訂單。更換裝置或清除瀏覽器資料後無法讀取。',
            ],
          ].map(([heading, body]) => (
            <details key={heading}>
              <summary>{t(heading)}</summary>
              <p>{t(body)}</p>
            </details>
          ))}
        </section>
      </main>
      <Modal open={dialog === 'product'} onClose={() => setDialog(null)} title="商品詳情">
        {selected && (
          <div className="product-detail">
            <ProductImage product={selected} />
            <h2>{t(selected.name)}</h2>
            <p>{t(selected.desc)}</p>
            <b>{money(selected.price, locale)}</b>
            <ul>
              {specifications[selected.id]?.map((line) => (
                <li key={line}>{t(line)}</li>
              ))}
            </ul>
            <p>{t('以上為概念商品設定，沒有對應實際供貨商品。')}</p>
            <button className="checkout-btn" onClick={() => add(selected)}>
              {t('加入購物車 ＋')}
            </button>
          </div>
        )}
      </Modal>
      <Modal open={dialog === 'cart'} onClose={() => setDialog(null)} title="購物車">
        <div className="cart-content">
          {basket.items.length ? (
            basket.items.map((item) => (
              <div className="cart-row" key={item.id}>
                <ProductImage product={item} className="cart-thumb" />
                <div>
                  <h3>{t(item.name)}</h3>
                  <small>{money(item.price, locale)}</small>
                  <div className="qty">
                    <button
                      aria-label={t('減少') + t(item.name)}
                      onClick={() => basket.change(item.id, -1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      aria-label={t('增加') + t(item.name)}
                      onClick={() => basket.change(item.id, 1)}
                    >
                      ＋
                    </button>
                  </div>
                </div>
                <div>
                  <b>{money(item.price * item.qty, locale)}</b>
                  <button className="remove" onClick={() => basket.remove(item.id)}>
                    {t('移除')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>{t('購物車目前沒有商品。')}</p>
          )}
          <div className="cart-total">
            <span>{t('商品小計')}</span>
            <b>{money(basket.total, locale)}</b>
          </div>
          <small>{t('此流程不收款、不寄送商品，資料只保留於此裝置。')}</small>
          <button
            disabled={!basket.count}
            className="checkout-btn"
            onClick={() => setDialog('checkout')}
          >
            {t('前往結帳 ↗')}
          </button>
        </div>
      </Modal>
      <Modal open={dialog === 'checkout'} onClose={() => setDialog(null)} title="結帳資料">
        <form onSubmit={checkout}>
          <p>{t('此流程不收集付款資料，也不會寄出商品。')}</p>
          {[
            ['name', '收件人', 'text'],
            ['email', '聯絡 Email', 'email'],
          ].map(([name, label, type]) => (
            <label key={name}>
              {t(label)}
              <input
                type={type}
                required
                maxLength={100}
                value={customer[name]}
                onChange={(e) => setCustomer({ ...customer, [name]: e.target.value })}
              />
            </label>
          ))}
          <label>
            {t('配送方式')}
            <select
              value={customer.delivery}
              onChange={(e) => setCustomer({ ...customer, delivery: e.target.value })}
            >
              {['宅配', '超商取貨'].map((value) => (
                <option key={value} value={value}>
                  {t(value)}
                </option>
              ))}
            </select>
          </label>
          <div className="cart-total">
            <span>{t('商品小計')}</span>
            <b>{money(basket.total, locale)}</b>
          </div>
          <Feedback message={message} error />
          <button className="checkout-btn" type="submit">
            {t('確認訂單內容')}
          </button>
        </form>
      </Modal>
      <Modal open={dialog === 'success'} onClose={() => setDialog(null)} title="訂單已建立於此裝置">
        <div className="success">
          <p>
            {order?.id} · {money(order?.total || 0, locale)}
          </p>
          <p>{t('資料僅保留在此裝置，沒有付款。')}</p>
          <AppLink href="dashboard.html">{t('後台管理')} ↗</AppLink>
        </div>
      </Modal>
      <footer>
        AXIS OBJECTS<span>ECOMMERCE CONCEPT BY DAVID SHEN · 2026</span>
      </footer>
      <CaseStudyLink slug="shop" />
    </Page>
  );
}
