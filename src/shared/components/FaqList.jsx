import { useI18n } from '../i18n/I18nProvider';
export default function FaqList({ items }) {
  const { t } = useI18n();
  return items.map(([question, answer]) => (
    <details key={question}>
      <summary>{t(question)}</summary>
      <p>{t(answer)}</p>
    </details>
  ));
}
