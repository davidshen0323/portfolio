import { describe, expect, it } from 'vitest';
import {
  ingestMessage,
  markMessagesRead,
  selectMessages,
} from '../../src/features/messages/domain/messages';
import { createInitialMessages } from '../../src/features/messages/data/messages';
import {
  createContract,
  contractTotal,
  reviewContract,
  resubmitContract,
  applyReceipt,
} from '../../src/features/business/domain/business';
import { initialBusiness } from '../../src/features/business/data/business';
import {
  completeReceiving,
  BUSINESS_KEY,
} from '../../src/features/business/services/receivingRepository';
import { calculateOrder, validateDelivery } from '../../src/features/commerce/domain/pricing';
import { placeOrder, STOCK_KEY } from '../../src/features/commerce/services/orderRepository';
import stock from '../../src/features/commerce/data/stock.json';
const form = {
  partner: 'Partner',
  title: 'Plan',
  productId: 'P01',
  quantity: 10,
  months: 6,
  unitFee: 120,
  startDate: '2026-11-01',
};
describe('message state', () => {
  it('deduplicates replay without resetting read state', () => {
    const message = {
      id: 'live',
      createdAt: 9999999999999,
      subject: 'subject',
      body: 'body',
      category: 'system',
    };
    const read = markMessagesRead(ingestMessage(createInitialMessages(100000), message), ['live']);
    expect(ingestMessage(read, message)).toBe(read);
    expect(read[0].read).toBe(true);
  });
  it('combines translated search with unread, category and archive filters', () => {
    const rows = [
      {
        id: 'a',
        subject: '標題',
        body: '內容',
        category: 'system',
        read: false,
        archived: false,
        createdAt: 1,
      },
      {
        id: 'b',
        subject: '標題',
        body: '內容',
        category: 'system',
        read: true,
        archived: true,
        createdAt: 2,
      },
    ];
    expect(
      selectMessages(rows, { query: 'notice', category: 'system', read: 'unread' }, (s) =>
        s === '標題' ? 'notice' : s,
      ).map((x) => x.id),
    ).toEqual(['a']);
    expect(selectMessages(rows, { archived: true }).map((x) => x.id)).toEqual(['b']);
  });
});
describe('contract transitions', () => {
  it('requires return reasons and allows corrected resubmissions', () => {
    const c = createContract(form, 'test', 'now');
    expect(contractTotal(c)).toBe(7200);
    expect(() => reviewContract(c, '已退回', '')).toThrow('原因');
    const returned = reviewContract(c, '已退回', 'Correct quantity');
    expect(resubmitContract(returned, { ...form, quantity: 20 })).toMatchObject({
      id: 'test',
      status: '待審核',
      quantity: 20,
      note: '',
    });
    expect(() => reviewContract(reviewContract(c, '已核准', ''), '已退回', 'x')).toThrow();
  });
  it('rejects fractional quantity and invalid calendar dates', () => {
    expect(() => createContract({ ...form, quantity: 1.5 }, 'x', 'now')).toThrow();
    expect(() => createContract({ ...form, startDate: '2026-02-30' }, 'x', 'now')).toThrow();
  });
});
describe('receiving consistency', () => {
  it('requires a reason for shortages or damage and adds accepted units only', () => {
    expect(() =>
      applyReceipt(initialBusiness, stock, 'IN-2001', { received: 9, damaged: 1 }, 'now'),
    ).toThrow('原因');
    const next = applyReceipt(
      initialBusiness,
      stock,
      'IN-2001',
      { received: 9, damaged: 1, reason: 'Damage' },
      'now',
    );
    expect(next.stock[0].qty).toBe(stock[0].qty + 8);
    expect(initialBusiness.receipts[0].status).toBe('待驗收');
    expect(() =>
      applyReceipt(next.business, next.stock, 'IN-2001', { received: 10, damaged: 0 }, 'now'),
    ).toThrow('重複');
    expect(next.business.audit[0].quantity).toBe(8);
  });
  it('rolls stock back when the receiving record cannot be persisted', () => {
    const data = new Map([[STOCK_KEY, JSON.stringify(stock)]]);
    const storage = {
      getItem: (k) => data.get(k) ?? null,
      removeItem: (k) => data.delete(k),
      setItem: (k, v) => {
        if (k === BUSINESS_KEY) throw Error('Quota');
        data.set(k, v);
      },
    };
    expect(() => completeReceiving('IN-2001', { received: 10, damaged: 0 }, storage)).toThrow(
      '無法儲存',
    );
    expect(JSON.parse(data.get(STOCK_KEY))).toEqual(stock);
    expect(data.has(BUSINESS_KEY)).toBe(false);
  });
});
describe('delivery and promotion rules', () => {
  it('enforces eligibility, caps discounts and calculates shipping after discounts', () => {
    expect(() => calculateOrder([{ price: 980, qty: 1 }], { coupon: 'AXIS10' })).toThrow();
    expect(calculateOrder([{ price: 2100, qty: 1 }], { coupon: 'axis10' })).toMatchObject({
      discount: 200,
      shipping: 100,
      total: 2000,
    });
    expect(
      calculateOrder([{ price: 2100, qty: 1 }], { coupon: 'AXIS10', addOn: true }),
    ).toMatchObject({ shipping: 0, addonTotal: 290, total: 2190 });
    expect(calculateOrder([{ price: 1280, qty: 1 }], { delivery: '超商取貨' }).shipping).toBe(60);
  });
  it('rejects stale districts and malformed pickup codes', () => {
    expect(() =>
      validateDelivery({
        city: '臺北市',
        district: '板橋區',
        delivery: '宅配',
        address: '測試路一段',
      }),
    ).toThrow();
    expect(() =>
      validateDelivery({
        city: '臺北市',
        district: '內湖區',
        delivery: '超商取貨',
        storeCode: 'abc123',
      }),
    ).toThrow();
  });
  it('combines regular and add-on quantities before checking shared stock', () => {
    localStorage.setItem(
      STOCK_KEY,
      JSON.stringify(stock.map((p) => (p.id === 'P03' ? { ...p, qty: 1 } : p))),
    );
    expect(() =>
      placeOrder(
        { P02: 1, P03: 1 },
        {
          name: 'Test',
          email: 'test@example.com',
          delivery: '宅配',
          city: '臺北市',
          district: '內湖區',
          address: '測試街道一號',
        },
        localStorage,
        { addOn: true },
      ),
    ).toThrow('庫存不足');
  });
});
