import { readFile, writeFile } from 'node:fs/promises';
import cases from '../src/features/portfolio/data/caseStudies.json' with { type: 'json' };
const shell = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const pages = [
  'auto',
  'cafe',
  'shop',
  'dashboard',
  'dealer',
  'api',
  'fix',
  'freebet',
  'gameflow',
  ...cases.map((item) => `case-${item.slug}`),
];
for (const page of pages) await writeFile(new URL(`../dist/${page}.html`, import.meta.url), shell);
console.log(`Created ${pages.length + 1} static route entrypoints.`);
