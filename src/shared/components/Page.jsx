import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function Page({ theme, title, className = '', children }) {
  const { t } = useI18n();
  useEffect(() => {
    document.title = t(title);
  }, [t, title]);
  return (
    <div className={`page-${theme} ${theme === 'portfolio' ? 'portfolio' : ''} ${className}`}>
      {children}
    </div>
  );
}
