import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

export default function AppLink({ href = 'index.html', children, ...props }) {
  const { language } = useI18n();
  const target = new URL(href, window.location.href);
  if (target.origin !== window.location.origin)
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  target.searchParams.set('lang', language);
  return (
    <Link to={target.pathname + target.search + target.hash} {...props}>
      {children}
    </Link>
  );
}
