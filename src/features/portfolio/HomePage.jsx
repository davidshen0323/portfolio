import { useI18n } from '../../shared/i18n/I18nProvider';
import AppLink from '../../shared/components/AppLink';
import Page from '../../shared/components/Page';
import '../../shared/styles/style.css';
import HomeHero from './components/HomeHero';
import ExperienceWork from './components/ExperienceWork';
import WorkGallery from './components/WorkGallery';
import CaseStudyIndex from './components/CaseStudyIndex';
import ServicesSection from './components/ServicesSection';
import WorkflowSection from './components/WorkflowSection';
import PortfolioFaq from './components/PortfolioFaq';
import ProjectBriefSection from './components/ProjectBriefSection';
import AboutSection from './components/AboutSection';

export default function HomePage() {
  const { t } = useI18n();
  return (
    <Page theme="portfolio" title="David Shen｜網站與互動介面作品" className="portfolio">
      <header className="port-header">
        <AppLink href="index.html" className="wordmark">
          {'DAVID SHEN'}
          <span>{' / DIGITAL WORK'}</span>
        </AppLink>
        <span>{t('網站・介面・產品實作')}</span>
      </header>
      <main>
        <HomeHero />
        <ExperienceWork />
        <WorkGallery />
        <CaseStudyIndex />
        <ServicesSection />
        <WorkflowSection />
        <PortfolioFaq />
        <ProjectBriefSection />
        <AboutSection />
      </main>
      <footer className="port-footer">
        {'DAVID SHEN '}
        <span>{'© 2026 · SELECTED WORK'}</span>
      </footer>
    </Page>
  );
}
