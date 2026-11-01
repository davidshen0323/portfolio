import { useI18n } from '../../../shared/i18n/I18nProvider';
import AppLink from '../../../shared/components/AppLink';

export default function AboutSection() {
  const { t } = useI18n();
  return (
    <section className="port-about">
      <span className="eyebrow">{'ABOUT'}</span>
      <h2>{t('你好，我是 David。')}</h2>
      <p>
        {t(
          '我有前端網站、行動應用與遊戲介面的開發經驗。接案時，我會先釐清使用情境，再把畫面、互動與手機版整理成容易使用的成品。',
        )}
      </p>
      <p className="fine">
        {t(
          '本作品集包含自主概念創作，以及根據實務經驗重建的互動作品。重建作品不含原公司程式碼與素材，詳細範圍列於各作品解析。',
        )}
      </p>
    </section>
  );
}
