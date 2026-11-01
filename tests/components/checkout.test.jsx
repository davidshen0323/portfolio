import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { I18nProvider } from '../../src/shared/i18n/I18nProvider';
import CheckoutForm from '../../src/features/commerce/components/CheckoutForm';
function Fixture() {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    delivery: '宅配',
    city: '臺北市',
    district: '內湖區',
  });
  return (
    <CheckoutForm
      basket={{ items: [{ price: 1280, qty: 1 }], total: 1280, count: 1 }}
      customer={customer}
      setCustomer={setCustomer}
      onCheckout={() => {}}
    />
  );
}
it('clears an incompatible district and changes required fields with delivery method', () => {
  render(
    <MemoryRouter>
      <I18nProvider>
        <Fixture />
      </I18nProvider>
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByRole('combobox', { name: '配送城市' }), {
    target: { value: '新北市' },
  });
  expect(screen.getByRole('combobox', { name: '行政區' })).toHaveValue('');
  expect(screen.queryByRole('option', { name: '內湖區' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox', { name: '配送方式' }), {
    target: { value: '超商取貨' },
  });
  expect(screen.queryByRole('textbox', { name: '街道地址' })).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: '取貨門市代碼' })).toBeRequired();
});
