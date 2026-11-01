// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
function files(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}
describe('module dependency boundaries', () => {
  it('keeps business rules independent from React, browser storage and UI components', () => {
    const modules = files('src/features').filter(
      (path) => path.includes('/domain/') && path.endsWith('.js'),
    );
    for (const path of modules) {
      const source = readFileSync(path, 'utf8');
      expect(source, path).not.toMatch(/from\s+['"](?:react|.*(?:components|hooks|services))['"]/);
      expect(source, path).not.toMatch(/\b(?:document|window|localStorage)\b/);
    }
  });
  it('does not use HTML injection or DOM-based text replacement to render React screens', () => {
    for (const path of files('src').filter((path) => /\.(jsx|js)$/.test(path))) {
      expect(readFileSync(path, 'utf8'), path).not.toMatch(
        /dangerouslySetInnerHTML|\.innerHTML\s*=/,
      );
    }
  });
});
