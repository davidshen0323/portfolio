import { transition } from './contest';

export function applyContestAction(state, contestId, action, options = {}) {
  const index = state.contests.findIndex((contest) => contest.id === contestId);
  if (index < 0) throw new Error('找不到這場競賽。');
  if (action === 'participate' && options.amount > state.points) throw new Error('體驗點數不足。');
  const next = transition(state.contests[index], action, options);
  return {
    ...state,
    points: state.points + next.delta,
    contests: state.contests.map((contest, i) => (i === index ? next.contest : contest)),
  };
}
