import { describe, it, expect } from 'vitest';
import {
  availableOrderStatuses,
  transitionOrder,
  orderExportRows,
} from '../../src/features/operations/domain/orderWorkflow';
import { createCsv } from '../../src/shared/lib/csv';
describe('order processing', () => {
  it('validates transitions, records history and preserves the checkout snapshot', () => {
    const order = {
      id: 'test',
      status: '待處理',
      total: 1542,
      pricing: { total: 1542 },
      deliveryInfo: { address: 'Test address' },
      items: [],
    };
    expect(() => transitionOrder(order, '已完成', '2026-11-01T00:00:00Z')).toThrow();
    const processing = transitionOrder(order, '處理中', '2026-11-01T01:00:00Z');
    const completed = transitionOrder(processing, '已完成', '2026-11-01T02:00:00Z');
    expect(completed.statusHistory).toEqual([
      { from: '處理中', to: '已完成', at: '2026-11-01T02:00:00Z' },
      { from: '待處理', to: '處理中', at: '2026-11-01T01:00:00Z' },
    ]);
    expect(completed.pricing).toBe(order.pricing);
    expect(completed.deliveryInfo).toBe(order.deliveryInfo);
    expect(order.status).toBe('待處理');
    expect(order.statusHistory).toBeUndefined();
    expect(availableOrderStatuses(completed.status)).toEqual(['已完成']);
    expect(() => transitionOrder(completed, '待處理', 'now')).toThrow();
  });
  it('treats cancellation as final and unchanged status as a no-op', () => {
    const cancelled = transitionOrder({ status: '待處理' }, '已取消', 'now');
    expect(transitionOrder(cancelled, '已取消', 'later')).toBe(cancelled);
    expect(() => transitionOrder(cancelled, '處理中', 'later')).toThrow();
  });
  it('exports only supplied rows without inventing missing historical fees and escapes user text', () => {
    const rows = orderExportRows([
      { id: 'old', name: '=SUM(1,1)', total: 980, status: '已完成', created: '2026-01-01' },
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[1].slice(8, 12)).toEqual(['', '', '', '']);
    expect(rows[1][12]).toBe(980);
    expect(createCsv(rows)).toContain('"\'=SUM(1,1)"');
  });
});
