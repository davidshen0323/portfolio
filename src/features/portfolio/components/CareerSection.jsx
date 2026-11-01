import { useI18n } from '../../../shared/i18n/I18nProvider';
import { career } from '../data/career';
export default function CareerSection() {
  const { t } = useI18n();
  return (
    <section className="content-section career-section" id="career">
      <span className="eyebrow">EXPERIENCE / RESPONSIBILITIES</span>
      <h2>{t('從實務工作，累積產品能力。')}</h2>
      <p className="career-intro">
        {t(
          '我的經驗涵蓋產品後台、電商、遊戲與跨平台介面。以下整理實際參與的工作；互動作品則以自建資料重新實作。',
        )}
      </p>
      <div className="career-grid">
        {career.map((item, index) => (
          <article key={item.label}>
            <div className="career-index">
              0{index + 1}
              <span>{item.label}</span>
            </div>
            <h3>{t(item.title)}</h3>
            <p>{t(item.body)}</p>
            <ul>
              {item.points.map((point) => (
                <li key={point}>{t(point)}</li>
              ))}
            </ul>
            <div className="skill-tags">
              {item.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="career-scope">
        {t(
          '上述內容為實際參與經歷；公開作品為自主重建，不含公司原始碼或素材，也不代表原產品的完整功能。',
        )}
      </p>
    </section>
  );
}
