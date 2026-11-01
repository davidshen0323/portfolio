export function ingestMessage(messages, incoming) {
  if (!incoming || typeof incoming.id !== 'string' || !Number.isFinite(incoming.createdAt))
    throw new Error('訊息格式不正確。');
  if (messages.some((message) => message.id === incoming.id)) return messages;
  return [{ ...incoming, read: false, archived: false }, ...messages].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}
export function selectMessages(
  messages,
  { query = '', category = 'all', read = 'all', archived = false },
  translate = (value) => value,
) {
  const search = query.trim().toLowerCase();
  return messages
    .filter(
      (message) =>
        Boolean(message.archived) === archived &&
        (category === 'all' || message.category === category) &&
        (read !== 'unread' || !message.read) &&
        `${translate(message.subject)} ${translate(message.body)} ${message.id}`
          .toLowerCase()
          .includes(search),
    )
    .sort((a, b) => b.createdAt - a.createdAt);
}
export function markMessagesRead(messages, ids) {
  const selected = new Set(ids);
  return messages.map((message) =>
    selected.has(message.id) ? { ...message, read: true } : message,
  );
}
