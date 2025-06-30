import { useState, Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import GameLobby from './Components/GameLobby';
import Wallet from './Components/Wallet';
import GameScreen from './Components/GameScreen';
import './App.css';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [coins, setCoins] = useState(100);
  const userId = 'user123';

  // Function to refresh balance from backend
  const refreshBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/wallet/${userId}`);
      setCoins(response.data.balance);
      console.log(`Refreshed balance: ${response.data.balance}`);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={
                <div className="app-column">
                  <GameLobby userId={userId} coins={coins} setCoins={setCoins} refreshBalance={refreshBalance} />
                  <Wallet userId={userId} coins={coins} setCoins={setCoins} refreshBalance={refreshBalance} />
                </div>
              }
            />
            <Route path="/game/:gameId" element={<GameScreen />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

App.propTypes = {};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;