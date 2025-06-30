import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Wallet.css';

const Wallet = ({ userId, coins, setCoins, refreshBalance }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const txResponse = await axios.get(`http://localhost:5000/api/wallet/${userId}/transactions`);
        setTransactions(txResponse.data);
        await refreshBalance(); // Sync balance on mount
      } catch (err) {
        setError('Failed to fetch wallet data');
        console.error('Fetch wallet error:', err);
      }
    };
    fetchWalletData();
  }, [userId, refreshBalance]);

  const recharge = async (amount) => {
    try {
      const response = await axios.post('http://localhost:5000/api/wallet/recharge', { userId, amount });
      setCoins(response.data.newBalance);
      const txResponse = await axios.get(`http://localhost:5000/api/wallet/${userId}/transactions`);
      setTransactions(txResponse.data);
      await refreshBalance(); // Sync balance after recharge
      setError('');
      console.log(`Recharged ${amount} coins, new balance: ${response.data.newBalance}`);
    } catch (err) {
      setError('Recharge failed');
      console.error('Recharge error:', err);
    }
  };

  return (
    <div className="wallet">
      <h2>Wallet</h2>
      {error && <p className="error">{error}</p>}
      <p>Total Coins: {coins}</p>
      <div className="recharge-options">
        <button onClick={() => recharge(50)}>Add 50 Coins</button>
        <button onClick={() => recharge(100)}>Add 100 Coins</button>
      </div>
      <h3>Transaction History</h3>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>{tx.date} - {tx.type}: {tx.amount} coins</li>
        ))}
      </ul>
    </div>
  );
};

Wallet.propTypes = {
  userId: PropTypes.string.isRequired,
  coins: PropTypes.number.isRequired,
  setCoins: PropTypes.func.isRequired,
  refreshBalance: PropTypes.func.isRequired,
};

export default Wallet;