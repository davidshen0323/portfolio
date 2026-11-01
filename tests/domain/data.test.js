import { describe, expect, it } from 'vitest';
import {
  fetchEarthquakes,
  normalizeEarthquakes,
} from '../../src/features/earthquakes/services/earthquakeApi';
import { estimateLoan } from '../../src/features/dealer/domain/loan';
import { createCsv } from '../../src/shared/lib/csv';
import { readStored } from '../../src/shared/lib/storage';
describe('data boundaries', () => {
  it('handles no-content API responses', async () => {
    expect(
      await fetchEarthquakes({ days: 7, magnitude: 2.5 }, async () => ({ status: 204 })),
    ).toEqual([]);
  });
  it('rejects invalid records and unsafe source URLs', () => {
    const entries = normalizeEarthquakes([
      { id: '1', properties: { time: 100, mag: 3, url: 'javascript:alert(1)' } },
      { id: '2', properties: { time: null } },
    ]);
    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBeNull();
    expect(() => normalizeEarthquakes({})).toThrow();
  });
  it('calculates zero-interest and amortized loans', () => {
    expect(estimateLoan({ price: 100, downPayment: 40, months: 60, annualRate: 0 }).monthly).toBe(
      10000,
    );
    expect(estimateLoan({ price: 100, downPayment: 40, months: 60, annualRate: 3 }).monthly).toBe(
      10781,
    );
    expect(() =>
      estimateLoan({ price: 100, downPayment: 101, months: 60, annualRate: 3 }),
    ).toThrow();
  });
  it('escapes CSV fields and neutralizes formula injection', () => {
    expect(createCsv([[' =SUM(A1)', 'x,"y']])).toBe('\ufeff"\' =SUM(A1)","x,""y"');
  });
  it('recovers gracefully from corrupt local data', () => {
    localStorage.setItem('test', '{bad');
    expect(readStored('test', [])).toEqual([]);
  });
});
