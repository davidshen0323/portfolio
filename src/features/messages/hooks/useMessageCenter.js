import { useEffect, useRef, useState } from 'react';
import { useStoredState } from '../../../shared/hooks/useStoredState';
import { createInitialMessages } from '../data/messages';
import { ingestMessage, markMessagesRead } from '../domain/messages';
import { createLocalMessage, subscribeLocalMessages } from '../services/localMessageSource';
const seed = createInitialMessages();
export function useMessageCenter() {
  const [messages, save, error] = useStoredState('david-message-center-v1', seed);
  const [connected, setConnected] = useState(true);
  const [automatic, setAutomatic] = useState(false);
  const lastEvent = useRef(null);
  const receive = (incoming) => {
    lastEvent.current = incoming;
    save((current) => ingestMessage(current, incoming));
  };
  useEffect(() => {
    if (!connected || !automatic) return;
    return subscribeLocalMessages((incoming) => {
      lastEvent.current = incoming;
      save((current) => ingestMessage(current, incoming));
    });
  }, [connected, automatic, save]);
  return {
    messages,
    error,
    connected,
    automatic,
    setAutomatic,
    setConnected,
    receive: () => {
      if (connected) receive(createLocalMessage());
    },
    replay: () => {
      if (connected && lastEvent.current) receive(lastEvent.current);
    },
    canReplay: Boolean(lastEvent.current),
    markRead: (ids) => save((current) => markMessagesRead(current, ids)),
    archive: (id, archived) =>
      save((current) =>
        current.map((message) => (message.id === id ? { ...message, archived } : message)),
      ),
  };
}
