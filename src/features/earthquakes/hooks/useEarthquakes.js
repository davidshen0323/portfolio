import { useEffect, useState } from 'react';
import { fetchEarthquakes } from '../services/earthquakeApi';
export function useEarthquakes(days, magnitude) {
  const [state, setState] = useState({ entries: [], loading: true, error: '', updatedAt: null });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState((old) => ({ ...old, loading: true, error: '' }));
    fetchEarthquakes({ days, magnitude, signal: controller.signal })
      .then((entries) => {
        if (active) setState({ entries, loading: false, error: '', updatedAt: Date.now() });
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError')
          setState({ entries: [], loading: false, error: error.message, updatedAt: null });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [days, magnitude, revision]);
  return { ...state, refresh: () => setRevision((n) => n + 1) };
}
