import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GameLobby.css';

const GameLobby = ({ userId, coins, setCoins, refreshBalance }) => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/game/games');
        setGames(response.data);
      } catch (err) {
        setError('Failed to load games');
        console.error('Fetch games error:', err);
      }
    };
    fetchGames();
  }, []);

  const joinGame = async (gameId, entryCoins) => {
    if (coins < entryCoins) {
      setError(`Insufficient coins! Need ${entryCoins} coins.`);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/game/join', { userId, gameId, entryCoins });
      setCoins(response.data.newBalance);
      console.log(`Joined game ${gameId}, new balance: ${response.data.newBalance}`);
      await refreshBalance(); // Ensure balance is synced
      setError('');
      navigate(`/game/${gameId}`); // Use navigate instead of window.location
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error joining game';
      setError(errorMsg);
      console.error('Join game error:', err);
    }
  };

  return (
    <div className="game-lobby">
      <h2>Game Lobby</h2>
      {error && <p className="error">{error}</p>}
      {games.length === 0 && !error && <p>Loading games...</p>}
      {games.map(game => (
        <div key={game.id} className="game-card">
          <h3>{game.name}</h3>
          <p>Entry: {game.entryCoins} coins</p>
          <p>Players: {game.players}</p>
          <button onClick={() => joinGame(game.id, game.entryCoins)}>
            Join ({game.entryCoins} coins)
          </button>
        </div>
      ))}
    </div>
  );
};

GameLobby.propTypes = {
  userId: PropTypes.string.isRequired,
  coins: PropTypes.number.isRequired,
  setCoins: PropTypes.func.isRequired,
  refreshBalance: PropTypes.func.isRequired,
};

export default GameLobby;