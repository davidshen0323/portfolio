import path from 'node:path';

const themes = {
  style: 'portfolio',
  demo: 'brand',
  shop: 'shop',
  dashboard: 'operations',
  dealer: 'dealer',
  api: 'earthquakes',
  fix: 'responsive',
  contests: 'contests',
  gameflow: 'gameflow',
};

/** Legacy visual themes are scoped to route roots so lazy-loaded CSS cannot leak. */
const scopePageThemes = {
  postcssPlugin: 'scope-page-themes',
  Once(root, { result }) {
    const name = path.basename(result.opts.from || '', '.css');
    const theme = themes[name];
    if (!theme) return;
    const scope = `:where(.page-${theme})`;
    root.walkAtRules('import', (rule) => rule.remove());
    root.walkRules((rule) => {
      if (rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
      rule.selector = rule.selector
        .split(',')
        .map((selector) => {
          const trimmed = selector.trim();
          if (/^(html|body)(\b|[.#:\[])/.test(trimmed))
            return trimmed.replace(/^(html|body)/, scope);
          if (/^\.(portfolio|auto|cafe)(?=[\s.:#\[]|$)/.test(trimmed)) return scope + trimmed;
          return `${scope} ${trimmed}`;
        })
        .join(', ');
    });
  },
};
export default { plugins: [scopePageThemes] };
