let games = [
  { id: 1, name: 'Challenge & Connect', entryCoins: 10, players: 42 },
  { id: 2, name: 'Snake & Ladder', entryCoins: 15, players: 27 },
];

let users = {
  user123: { balance: 100, transactions: [
    { id: 1, type: 'Recharge', amount: 50, date: '2025-06-28' },
    { id: 2, type: 'Game Entry', amount: -10, date: '2025-06-29' },
  ]},
};

const getGames = () => games;

const joinGame = (userId, gameId, entryCoins) => {
  if (!users[userId]) {
    throw new Error('User not found');
  }
  if (users[userId].balance < entryCoins) {
    return { success: false, error: 'Insufficient coins' };
  }

  users[userId].balance -= entryCoins;
  const transaction = {
    id: users[userId].transactions.length + 1,
    type: 'Game Entry',
    amount: -entryCoins,
    date: new Date().toISOString().split('T')[0],
  };
  users[userId].transactions.push(transaction);

  return { success: true, newBalance: users[userId].balance };
};

const rechargeWallet = (userId, amount) => {
  if (!users[userId]) {
    users[userId] = { balance: 0, transactions: [] };
  }
  users[userId].balance += amount;
  const transaction = {
    id: users[userId].transactions.length + 1,
    type: 'Recharge',
    amount,
    date: new Date().toISOString().split('T')[0],
  };
  users[userId].transactions.push(transaction);
  return users[userId].balance;
};

const getWallet = (userId) => {
  return users[userId] || null;
};

const getTransactions = (userId) => {
  return users[userId]?.transactions || [];
};

module.exports = {
  getGames,
  joinGame,
  rechargeWallet,
  getWallet,
  getTransactions,
};