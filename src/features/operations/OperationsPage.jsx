import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Page from '../../shared/components/Page';
import ProjectBanner from '../../shared/components/ProjectBanner';
import CaseStudyLink from '../../shared/components/CaseStudyLink';
import AppLink from '../../shared/components/AppLink';
import Feedback from '../../shared/components/Feedback';
import { useOperations } from './hooks/useOperations';
import OverviewPanel from './components/OverviewPanel';
import OrdersPanel from './components/OrdersPanel';
import BookingsPanel from './components/BookingsPanel';
import InventoryPanel from './components/InventoryPanel';
import CustomersPanel from './components/CustomersPanel';
import ReportsPanel from './components/ReportsPanel';
import SupportPanel from './components/SupportPanel';
import '../../shared/styles/dashboard.css';

const tabs = {
  overview: ['▦', '營運總覽', OverviewPanel],
  orders: ['▤', '訂單管理', OrdersPanel],
  bookings: ['▣', '預約管理', BookingsPanel],
  inventory: ['▧', '商品庫存', InventoryPanel],
  customers: ['♙', '客戶資料', CustomersPanel],
  reports: ['▥', '營運報表', ReportsPanel],
  support: ['◇', '客服紀錄', SupportPanel],
};
export default function OperationsPage() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const data = useOperations();
  const tab = tabs[location.hash.slice(1)] ? location.hash.slice(1) : 'overview';
  const [, title, View] = tabs[tab];
  const onNavigate = (name) => navigate({ ...location, hash: '#' + name });
  return (
    <Page theme="operations" title="FORMA｜營運管理工作台">
      <ProjectBanner label="介面作品" />
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">
            FORMA<span>STUDIO OPERATIONS</span>
          </div>
          <nav aria-label={t('主要導覽')}>
            {Object.entries(tabs).map(([key, [icon, label]]) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={key === tab ? 'active' : ''}
                aria-label={t(label)}
              >
                {icon}
                <span>{t(label)}</span>
              </button>
            ))}
          </nav>
          <div className="side-foot">PORTFOLIO / 2026</div>
        </aside>
        <main>
          <header className="topbar">
            <div>
              <small>
                {t('管理工作台 /')} {t(title)}
              </small>
              <h1>{t(title)}</h1>
              <p>{t('掌握訂單、預約與商品庫存。')}</p>
            </div>
            <div className="avatar">DS</div>
          </header>
          <div className="quick-link">
            {t('想看購物流程？')} <AppLink href="shop.html">{t('前往選物商店 ↗')}</AppLink>{' '}
            {t('訂單建立後會出現在這裡。')}
          </div>
          <Feedback message={data.error} error />
          <View {...data} onNavigate={onNavigate} />
          <p className="disclosure">
            {t('自主製作的介面作品。訂單與庫存僅儲存在此裝置，請勿輸入真實個資。')}
          </p>
        </main>
      </div>
      <CaseStudyLink slug="dashboard" />
    </Page>
  );
}
