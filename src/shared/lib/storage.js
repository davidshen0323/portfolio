export const STORAGE_EVENT = 'portfolio-storage-change';

export function readStored(key, fallback, storage) {
  try {
    const raw = (storage ?? window.localStorage).getItem(key);
    if (raw === null) return structuredClone(fallback);
    const value = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(value)) return structuredClone(fallback);
    if (value === null || typeof value !== typeof fallback) return structuredClone(fallback);
    return value;
  } catch {
    return structuredClone(fallback);
  }
}

export function writeStored(key, value, storage) {
  (storage ?? window.localStorage).setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}
