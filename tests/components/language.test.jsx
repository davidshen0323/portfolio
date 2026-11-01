import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { I18nProvider, useI18n } from '../../src/shared/i18n/I18nProvider';
import LanguageSwitcher from '../../src/shared/components/LanguageSwitcher';
import AppLink from '../../src/shared/components/AppLink';
function Fixture() {
  const { t } = useI18n();
  return (
    <>
      <LanguageSwitcher />
      <label>
        {t('狀態')}
        <select defaultValue="待處理">
          <option value="待處理">{t('待處理')}</option>
        </select>
      </label>
      <input aria-label="user-input" defaultValue="一般生活" />
      <AppLink href="shop.html#products">Shop</AppLink>
    </>
  );
}
describe('React localization', () => {
  it('changes labels and links while preserving stored values and user text', () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <Fixture />
        </I18nProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByRole('combobox')).toHaveValue('待處理');
    expect(screen.getByRole('option')).toHaveTextContent('Pending');
    expect(screen.getByLabelText('user-input')).toHaveValue('一般生活');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/shop.html?lang=en#products');
    expect(localStorage.getItem('david-site-language')).toBe('en');
    fireEvent.click(screen.getByRole('button', { name: '繁體中文' }));
    expect(screen.getByRole('option')).toHaveTextContent('待處理');
  });
});
