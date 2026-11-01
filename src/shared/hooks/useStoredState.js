import { useCallback, useEffect, useRef, useState } from 'react';
import { readStored, STORAGE_EVENT, writeStored } from '../lib/storage';

/** Reuses legacy keys so existing visitor data survives the React migration. */
export function useStoredState(key, fallback) {
  const initial = useRef(fallback);
  const [value, setValue] = useState(() => readStored(key, initial.current));
  const [error, setError] = useState('');
  const current = useRef(value);
  useEffect(() => {
    const sync = (event) => {
      if (event.type === 'storage' && event.key !== key && event.key !== null) return;
      if (event.type === STORAGE_EVENT && event.detail.key !== key) return;
      const next = readStored(key, initial.current);
      current.current = next;
      setValue(next);
    };
    window.addEventListener('storage', sync);
    window.addEventListener(STORAGE_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(STORAGE_EVENT, sync);
    };
  }, [key]);
  const update = useCallback(
    (next) => {
      const resolved = typeof next === 'function' ? next(current.current) : next;
      try {
        writeStored(key, resolved);
        current.current = resolved;
        setValue(resolved);
        setError('');
        return true;
      } catch {
        setError('無法儲存資料，請確認瀏覽器儲存空間後重試。');
        return false;
      }
    },
    [key],
  );
  return [value, update, error];
}
