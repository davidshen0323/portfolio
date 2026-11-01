import { useState } from 'react';
import { useStoredState } from '../../../shared/hooks/useStoredState';
import { createId } from '../../../shared/lib/id';
import { initialBusiness } from '../data/business';
import { createContract, reviewContract, resubmitContract } from '../domain/business';
import { BUSINESS_KEY, completeReceiving } from '../services/receivingRepository';
export function useBusiness() {
  const [business, save, storageError] = useStoredState(BUSINESS_KEY, initialBusiness);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const commit = (makeState, feedback) => {
    try {
      const next = makeState();
      if (!save(next)) return false;
      setMessage(feedback);
      setFailed(false);
      return true;
    } catch (error) {
      setMessage(error.message);
      setFailed(true);
      return false;
    }
  };
  const audit = (entity, action, detail = '') => ({
    id: createId(),
    entity,
    action,
    detail,
    at: new Date().toISOString(),
  });
  return {
    business,
    message: storageError || message,
    failed: Boolean(storageError) || failed,
    submit: (form, existingId) =>
      commit(() => {
        const existing = business.contracts.find((entry) => entry.id === existingId);
        const contract = existing
          ? resubmitContract(existing, form)
          : createContract(form, `CT-${createId().slice(0, 8)}`, new Date().toISOString());
        return {
          ...business,
          contracts: existing
            ? business.contracts.map((entry) => (entry.id === existingId ? contract : entry))
            : [contract, ...business.contracts],
          audit: [
            audit(contract.id, existing ? '合約重新送審' : '建立合約'),
            ...business.audit,
          ].slice(0, 100),
        };
      }, '合約已送交審核。'),
    review: (id, status, note) =>
      commit(
        () => {
          const entry = business.contracts.find((contract) => contract.id === id);
          if (!entry) throw new Error('找不到這筆合約。');
          const contract = reviewContract(entry, status, note);
          return {
            ...business,
            contracts: business.contracts.map((row) => (row.id === id ? contract : row)),
            audit: [
              audit(id, status === '已核准' ? '合約核准' : '合約退回', note.trim()),
              ...business.audit,
            ].slice(0, 100),
          };
        },
        status === '已核准' ? '合約已核准。' : '合約已退回。',
      ),
    receive: (id, values) => {
      try {
        completeReceiving(id, values);
        setMessage('入庫完成，良品數量已加入商品庫存。');
        setFailed(false);
        return true;
      } catch (error) {
        setMessage(error.message);
        setFailed(true);
        return false;
      }
    },
  };
}
