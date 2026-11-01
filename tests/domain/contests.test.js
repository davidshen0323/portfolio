import { describe, expect, it } from 'vitest';
import {
  createContest,
  seedContests,
  transition,
} from '../../src/features/contests/domain/contest';
import { applyContestAction } from '../../src/features/contests/domain/contestStore';
const now = 100000000;
describe('contest rules', () => {
  it('deducts points exactly once and keeps the original state immutable', () => {
    const state = { contests: seedContests(now), points: 100 };
    const next = applyContestAction(state, 'FB-1001', 'participate', {
      side: 'a',
      amount: 50,
      now,
    });
    expect(next.points).toBe(50);
    expect(state.points).toBe(100);
    expect(() =>
      applyContestAction(next, 'FB-1001', 'participate', { side: 'b', amount: 20, now }),
    ).toThrow('已參與');
    expect(() =>
      applyContestAction(state, 'FB-1001', 'participate', { side: 'a', amount: 101, now }),
    ).toThrow('不足');
  });
  it('enforces ownership, deadlines and whole-point limits', () => {
    const contest = seedContests(now)[0];
    expect(() =>
      transition(contest, 'participate', { user: 'owner', side: 'a', amount: 10, now }),
    ).toThrow('建立者');
    expect(() =>
      transition(contest, 'participate', { side: 'a', amount: 10, now: now + 86400001 }),
    ).toThrow('無法參與');
    expect(() => transition(contest, 'participate', { side: 'a', amount: 10.5, now })).toThrow(
      '整數',
    );
  });
  it('confirms a proposed result or enters the dispute state', () => {
    const contest = seedContests(now)[2];
    expect(transition(contest, 'approve').contest.status).toBe('ended');
    expect(transition(contest, 'dispute').contest.status).toBe('disputed');
    expect(contest.status).toBe('pending');
  });
  it('supports creator closure and result proposal', () => {
    let c = createContest(
      { title: 'Test', category: '生活', a: 'A', b: 'B', description: '', deadline: now + 1000 },
      now,
    );
    c = transition(c, 'close').contest;
    expect(c.status).toBe('awaiting');
    expect(transition(c, 'result', { side: 'a' }).contest.status).toBe('pending');
  });
});
