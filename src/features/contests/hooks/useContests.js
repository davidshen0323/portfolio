import { useState } from 'react';
import { useStoredState } from '../../../shared/hooks/useStoredState';
import { seedContests, createContest } from '../domain/contest';
import { applyContestAction } from '../domain/contestStore';
const initial = () => ({ contests: seedContests(), points: 1000 });
export function useContests() {
  const [data, save, storageError] = useStoredState('david-freebet-v1', initial());
  const [message, setMessage] = useState('');
  const act = (id, action, options = {}) => {
    try {
      const updated = applyContestAction(data, id, action, { user: 'visitor', ...options });
      if (!save(updated)) return false;
      setMessage(
        {
          participate: '參與已記錄，體驗點數已扣除。',
          close: '參與已關閉，可以提出結果。',
          result: '結果已提出，等待參與者確認。',
          approve: '你的確認已記錄。',
          dispute: '爭議已記錄，競賽暫停確認。',
        }[action],
      );
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  };
  const create = (form) => {
    try {
      const contest = createContest(form);
      if (!save({ ...data, contests: [contest, ...data.contests] })) return null;
      setMessage('競賽已建立於此裝置。');
      return contest;
    } catch (error) {
      setMessage(error.message);
      return null;
    }
  };
  return {
    ...data,
    act,
    create,
    message: storageError || message,
    reset: () => {
      if (save(initial())) setMessage('已還原初始競賽與 1,000 體驗點數。');
    },
  };
}
