export const states = {
  ongoing: '開放參與',
  awaiting: '等待結果',
  pending: '結果確認中',
  disputed: '結果有爭議',
  ended: '已結束',
};
export function seedContests(now = Date.now()) {
  return [
    {
      id: 'FB-1001',
      title: '週末籃球友誼賽，哪一隊會獲勝？',
      category: '運動',
      a: '北城藍隊',
      b: '南岸白隊',
      description: '用點數記錄你的預測，賽後由建立者提出結果。',
      owner: 'owner',
      status: 'ongoing',
      deadline: now + 86400000,
      votes: [
        { user: 'sample-a', side: 'a', amount: 120 },
        { user: 'sample-b', side: 'b', amount: 80 },
      ],
      result: null,
      approvals: [],
      confirmBy: null,
    },
    {
      id: 'FB-1002',
      title: '本週讀書挑戰，哪一組先完成？',
      category: '生活',
      a: '晨讀組',
      b: '夜讀組',
      description: '參與時間已結束，等待建立者提交結果。',
      owner: 'owner',
      status: 'awaiting',
      deadline: now - 3600000,
      votes: [
        { user: 'visitor', side: 'a', amount: 50 },
        { user: 'sample-b', side: 'b', amount: 80 },
      ],
      result: null,
      approvals: [],
      confirmBy: null,
    },
    {
      id: 'FB-1003',
      title: '遊戲友誼賽，紅隊還是綠隊？',
      category: '遊戲',
      a: '紅隊',
      b: '綠隊',
      description: '已提出紅隊勝出，等待參與者確認。',
      owner: 'owner',
      status: 'pending',
      deadline: now - 7200000,
      votes: [
        { user: 'visitor', side: 'a', amount: 100 },
        { user: 'sample-b', side: 'b', amount: 60 },
      ],
      result: 'a',
      approvals: ['sample-b'],
      confirmBy: now + 3600000,
    },
    {
      id: 'FB-1004',
      title: '週末攝影挑戰，哪一組作品勝出？',
      category: '生活',
      a: '街景組',
      b: '自然組',
      description: '參與者提出不同意見，先保留點數並等待釐清。',
      owner: 'owner',
      status: 'disputed',
      deadline: now - 10800000,
      votes: [
        { user: 'visitor', side: 'a', amount: 60 },
        { user: 'sample-b', side: 'b', amount: 60 },
      ],
      result: 'b',
      approvals: [],
      confirmBy: null,
    },
    {
      id: 'FB-1005',
      title: '桌遊夜決賽，哪一桌先達成目標？',
      category: '遊戲',
      a: '一號桌',
      b: '二號桌',
      description: '結果已確認，競賽流程結束。',
      owner: 'owner',
      status: 'ended',
      deadline: now - 86400000,
      votes: [{ user: 'visitor', side: 'b', amount: 80 }],
      result: 'b',
      approvals: ['visitor'],
      confirmBy: null,
    },
  ];
}
export function transition(
  contest,
  action,
  { user = 'visitor', side, amount, now = Date.now() } = {},
) {
  let c = structuredClone(contest),
    delta = 0;
  if (action === 'participate') {
    if (c.status !== 'ongoing' || c.deadline <= now) throw Error('此競賽目前無法參與。');
    if (c.owner === user) throw Error('建立者不能參與自己的競賽。');
    if (c.votes.some((v) => v.user === user)) throw Error('你已參與過這場競賽。');
    if (!['a', 'b'].includes(side) || !Number.isInteger(amount) || amount < 10 || amount > 500)
      throw Error('請選擇一方並輸入 10–500 整數點數。');
    c.votes.push({ user, side, amount });
    delta = -amount;
  } else if (action === 'close') {
    if (c.owner !== user || c.status !== 'ongoing') throw Error('只有建立者能關閉開放中的競賽。');
    c.status = 'awaiting';
  } else if (action === 'result') {
    if (c.owner !== user || c.status !== 'awaiting' || !['a', 'b'].includes(side))
      throw Error('目前無法提交結果。');
    c.status = 'pending';
    c.result = side;
    c.confirmBy = now + 3600000;
    c.approvals = [];
  } else if (action === 'approve') {
    if (c.status !== 'pending' || !c.votes.some((v) => v.user === user))
      throw Error('只有參與者能確認結果。');
    if (c.approvals.includes(user)) throw Error('你已確認過結果。');
    c.approvals.push(user);
    if (c.votes.every((v) => c.approvals.includes(v.user))) c.status = 'ended';
  } else if (action === 'dispute') {
    if (c.status !== 'pending' || !c.votes.some((v) => v.user === user))
      throw Error('只有參與者能提出爭議。');
    c.status = 'disputed';
    c.confirmBy = null;
  } else throw Error('不支援的操作。');
  return { contest: c, delta };
}
export function createContest({ title, category, a, b, description, deadline }, now = Date.now()) {
  if (
    !title?.trim() ||
    !a?.trim() ||
    !b?.trim() ||
    a.trim() === b.trim() ||
    !Number.isFinite(deadline) ||
    deadline <= now
  )
    throw Error('請填寫不同的兩方名稱與未來的截止時間。');
  return {
    id: 'FB-' + now.toString(36).toUpperCase(),
    title: title.trim(),
    category,
    a: a.trim(),
    b: b.trim(),
    description: description.trim(),
    owner: 'visitor',
    status: 'ongoing',
    deadline,
    votes: [],
    result: null,
    approvals: [],
    confirmBy: null,
  };
}
