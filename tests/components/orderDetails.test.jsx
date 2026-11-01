import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { it, expect, beforeAll, afterAll } from 'vitest';
import { I18nProvider } from '../../src/shared/i18n/I18nProvider';
import OrderDetails from '../../src/features/operations/components/OrderDetails';
beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value: function () {
        this.open = true;
      },
    },
    close: {
      configurable: true,
      value: function () {
        this.open = false;
      },
    },
  });
});
afterAll(() => {
  delete HTMLDialogElement.prototype.showModal;
  delete HTMLDialogElement.prototype.close;
});
function mount(order) {
  render(
    <MemoryRouter>
      <I18nProvider>
        <OrderDetails order={order} onClose={() => {}} />
      </I18nProvider>
    </MemoryRouter>,
  );
}
it('shows stored delivery and price snapshots with add-ons separately', () => {
  mount({
    id: 'new',
    name: 'Test',
    email: 'test@example.com',
    status: '待處理',
    delivery: '超商取貨',
    deliveryInfo: { city: '臺北市', district: '內湖區', storeCode: '123456' },
    items: [{ id: 'P03', name: '超細纖維布', price: 290, qty: 1, isAddOn: true }],
    total: 1542,
    pricing: { subtotal: 1280, discount: 128, addonTotal: 290, shipping: 100, coupon: 'AXIS10' },
    statusHistory: [{ from: '待處理', to: '處理中', at: '2026-11-01T01:00:00Z' }],
  });
  expect(screen.getByRole('dialog', { name: '訂單詳情' })).toBeVisible();
  expect(screen.getByText(/取貨門市代碼 123456/)).toBeInTheDocument();
  expect(screen.getByText('NT$ 1,542')).toBeInTheDocument();
  expect(screen.getByText('−NT$ 128')).toBeInTheDocument();
  expect(screen.getByText('待處理 → 處理中')).toBeInTheDocument();
});
it('makes missing historical delivery and fee data explicit', () => {
  mount({
    id: 'old',
    name: 'Test',
    status: '已完成',
    items: [{ name: '皮革鑰匙套', qty: 1 }],
    total: 980,
  });
  expect(screen.getByText('此筆歷史資料未保存配送明細。')).toBeInTheDocument();
  expect(screen.getByText(/此筆歷史資料只保存訂單總額/)).toBeInTheDocument();
  expect(screen.getByText('尚無狀態變更紀錄。')).toBeInTheDocument();
});
