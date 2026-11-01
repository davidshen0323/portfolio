import { createId } from '../../../shared/lib/id';
import { messageTemplates } from '../data/messages';

/** Local transport boundary. Replace with WebSocket/SSE without changing message components. */
export function createLocalMessage() {
  const template = messageTemplates[Math.floor(Date.now() / 1000) % messageTemplates.length];
  return { ...template, id: `LIVE-${createId()}`, createdAt: Date.now() };
}
export function subscribeLocalMessages(onMessage, interval = 8000) {
  const timer = setInterval(() => onMessage(createLocalMessage()), interval);
  return () => clearInterval(timer);
}
export function requestNextPage({ offset, total, signal, size = 12 }) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve(Math.min(offset + size, total));
    }, 180);
    if (signal?.aborted) {
      abort();
      return;
    }
    signal?.addEventListener('abort', abort, { once: true });
  });
}
