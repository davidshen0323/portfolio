import { useEffect, useState } from 'react';
export function useNow(enabled = true, interval = 1000) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(timer);
  }, [enabled, interval]);
  return now;
}
