import { describe, expect, it } from 'vitest';
import { dispatch, initialState } from '../../src/features/gameflow/domain/game';
describe('game event integrity', () => {
  it('requires a correlated shot and ignores duplicate hit claims', () => {
    let state = dispatch(initialState(), { type: 'JOIN', room: '近岸海域' });
    expect(() => dispatch(state, { type: 'HIT', id: 'H1', shotId: 'missing', reward: 20 })).toThrow(
      '找不到',
    );
    state = dispatch(state, { type: 'FIRE', id: 'S1' });
    state = dispatch(state, { type: 'HIT', id: 'H1', shotId: 'S1', reward: 20 });
    expect(state.balance).toBe(1010);
    const repeat = dispatch(state, { type: 'HIT', id: 'H1', shotId: 'S1', reward: 20 });
    expect(repeat.balance).toBe(1010);
    expect(repeat.hits).toBe(1);
  });
  it('stops AUTO when disconnected, leaving or out of points', () => {
    let state = dispatch(initialState(), { type: 'JOIN', room: '近岸海域' });
    state = dispatch(state, { type: 'AUTO' });
    expect(dispatch(state, { type: 'DISCONNECT' }).auto).toBe(false);
    expect(dispatch(state, { type: 'LEAVE' }).auto).toBe(false);
    const poor = dispatch({ ...state, balance: 5 }, { type: 'FIRE', id: 'S1' });
    expect(poor.auto).toBe(false);
    expect(poor.balance).toBe(5);
  });
});
