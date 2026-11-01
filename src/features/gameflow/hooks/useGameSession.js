import { createId } from '../../../shared/lib/id';
import { useEffect, useReducer, useRef } from 'react';
import { dispatch, initialState } from '../domain/game';
const rewards = [20, 30, 50];

function reducer(current, action) {
  if (action.type === 'RESET') return { session: initialState(), lastClaim: null, error: '' };
  if (action.type === 'CLEAR_LOG')
    return { ...current, session: { ...current.session, events: [] } };
  try {
    if (action.type === 'FIRE_TARGET') {
      const shot = { type: 'FIRE', id: action.id };
      const next = dispatch(current.session, shot);
      if (next.shots === current.session.shots) return { ...current, session: next };
      const claim = {
        type: 'HIT',
        id: 'HIT-' + action.id,
        shotId: action.id,
        reward: rewards[action.target],
      };
      return { session: dispatch(next, claim), lastClaim: claim, error: '' };
    }
    const event = action.type === 'REPEAT_HIT' ? current.lastClaim : action;
    if (!event) return current;
    return {
      session: dispatch(current.session, event),
      lastClaim: action.type === 'LEAVE' ? null : current.lastClaim,
      error: '',
    };
  } catch (error) {
    return { ...current, error: error.message };
  }
}

export function useGameSession(target) {
  const [state, send] = useReducer(reducer, null, () => ({
    session: initialState(),
    lastClaim: null,
    error: '',
  }));
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);
  useEffect(() => {
    if (!state.session.auto) return;
    const timer = setInterval(
      () => send({ type: 'FIRE_TARGET', target: targetRef.current, id: createId() }),
      1200,
    );
    return () => clearInterval(timer);
  }, [state.session.auto]);
  return {
    ...state,
    send,
    fire: () => send({ type: 'FIRE_TARGET', target, id: createId() }),
  };
}
