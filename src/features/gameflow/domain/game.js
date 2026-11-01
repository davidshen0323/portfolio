export const initialState = () => ({
  connected: true,
  phase: 'lobby',
  room: null,
  balance: 1000,
  shots: 0,
  hits: 0,
  claims: [],
  pendingShots: [],
  cost: 10,
  auto: false,
  events: [],
});
export function dispatch(state, event) {
  let s = structuredClone(state);
  const log = (type, detail) => {
    s.events.unshift({ type, detail, time: Date.now() });
    s.events = s.events.slice(0, 50);
  };
  if (event.type === 'JOIN') {
    if (!s.connected) throw Error('目前離線，請先重新連線。');
    if (s.phase !== 'lobby') throw Error('請先返回大廳。');
    s.room = event.room;
    s.phase = 'playing';
    log('ROOM_JOINED', '已進入 ' + event.room);
  } else if (event.type === 'LEAVE') {
    s.phase = 'lobby';
    s.room = null;
    s.auto = false;
    s.pendingShots = [];
    log('ROOM_LEFT', '返回選房畫面，停止 AUTO');
  } else if (event.type === 'DISCONNECT') {
    s.connected = false;
    s.auto = false;
    log('CONNECTION_LOST', '連線中斷，停止 AUTO 與發射');
  } else if (event.type === 'RECONNECT') {
    s.connected = true;
    log('CONNECTION_READY', '連線已恢復，可繼續操作');
  } else if (event.type === 'AUTO') {
    if (!s.connected || s.phase !== 'playing') throw Error('請先連線並進入房間。');
    s.auto = !s.auto;
    log('AUTO_CHANGED', s.auto ? 'AUTO 開啟' : 'AUTO 停止');
  } else if (event.type === 'COST') {
    if (![10, 20, 50].includes(event.cost)) throw Error('不支援的發射點數。');
    s.cost = event.cost;
    log('COST_CHANGED', '單次發射 ' + event.cost + ' 點');
  } else if (event.type === 'FIRE') {
    if (!s.connected || s.phase !== 'playing') throw Error('目前狀態無法發射。');
    if (s.balance < s.cost) {
      s.auto = false;
      log('INSUFFICIENT_POINTS', '點數不足，停止 AUTO');
      return s;
    }
    s.balance -= s.cost;
    s.shots++;
    s.pendingShots.push(event.id);
    log('SHOT_REQUEST', '扣除 ' + s.cost + ' 點 / ' + event.id);
  } else if (event.type === 'HIT') {
    if (!s.connected || s.phase !== 'playing') throw Error('目前狀態無法提交命中。');
    if (s.claims.includes(event.id)) {
      log('DUPLICATE_IGNORED', '忽略已處理事件 ' + event.id);
      return s;
    }
    if (!s.pendingShots.includes(event.shotId)) throw Error('找不到對應的發射請求。');
    if (!Number.isFinite(event.reward) || event.reward < 0) throw Error('命中點數不正確。');
    s.claims.push(event.id);
    s.pendingShots = s.pendingShots.filter((id) => id !== event.shotId);
    s.hits++;
    s.balance += event.reward;
    log('HIT_CONFIRMED', '命中事件 ' + event.id + ' / 增加 ' + event.reward + ' 點');
  } else throw Error('未知事件。');
  return s;
}
