import english from './en.json';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const phrases = new RegExp(
  Object.keys(english)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join('|'),
  'g',
);

/** Translation never runs against DOM nodes, stored records or user input. */
export function translate(text, language = 'zh', variables = {}) {
  const source = String(text ?? '');
  let result = source;
  if (language === 'en') {
    const key = source.trim();
    result = Object.hasOwn(english, key)
      ? source.replace(key, () => english[key])
      : source.replace(phrases, (phrase) => english[phrase]);
  }
  return result.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(variables, key) ? String(variables[key]) : match,
  );
}

export function initialLanguage(search, storage) {
  const query = new URLSearchParams(search).get('lang');
  if (query === 'en' || query === 'zh') return query;
  try {
    return storage.getItem('david-site-language') === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}
