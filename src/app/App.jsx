import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { I18nProvider } from '../shared/i18n/I18nProvider';
import LanguageSwitcher from '../shared/components/LanguageSwitcher';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import cases from '../features/portfolio/data/caseStudies.json';
const Home = lazy(() => import('../features/portfolio/HomePage'));
const CaseStudy = lazy(() => import('../features/portfolio/CaseStudyPage'));
const AutoCare = lazy(() => import('../features/brands/AutoCarePage'));
const Cafe = lazy(() => import('../features/brands/CafePage'));
const Shop = lazy(() => import('../features/commerce/ShopPage'));
const Operations = lazy(() => import('../features/operations/OperationsPage'));
const Dealer = lazy(() => import('../features/dealer/DealerPage'));
const Earthquakes = lazy(() => import('../features/earthquakes/EarthquakePage'));
const Responsive = lazy(() => import('../features/responsive/ResponsivePage'));
const Contests = lazy(() => import('../features/contests/ContestsPage'));
const Gameflow = lazy(() => import('../features/gameflow/GameflowPage'));
const Messages = lazy(() => import('../features/messages/MessagesPage'));
const routes = {
  messages: Messages,
  auto: AutoCare,
  cafe: Cafe,
  shop: Shop,
  dashboard: Operations,
  dealer: Dealer,
  api: Earthquakes,
  fix: Responsive,
  contests: Contests,
  gameflow: Gameflow,
};

function ScrollRestoration() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (['/dashboard.html', '/contests.html'].includes(pathname)) return;
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Lazy pages may mount after the route changes; observe until the anchor exists.
    const find = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return true;
      }
      return false;
    };
    if (find()) return;
    const observer = new MutationObserver(() => {
      if (find()) observer.disconnect();
    });
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash]);
  return null;
}
export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <LanguageSwitcher />
        <ScrollRestoration />
        <Suspense
          fallback={
            <div className="app-loading" role="status">
              載入中 / Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            {Object.entries(routes).map(([path, Component]) => (
              <Route key={path} path={`/${path}.html`} element={<Component />} />
            ))}
            {cases.map((item) => (
              <Route
                key={item.slug}
                path={`/case-${item.slug}.html`}
                element={<CaseStudy slug={item.slug} />}
              />
            ))}
            <Route
              path="*"
              element={
                <main className="app-error">
                  <h1>404</h1>
                  <a href="/">Home</a>
                </main>
              }
            />
          </Routes>
        </Suspense>
      </I18nProvider>
    </ErrorBoundary>
  );
}
