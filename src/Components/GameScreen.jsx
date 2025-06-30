
import { useParams, useNavigate } from 'react-router-dom';
import './GameScreen.css';

const GameScreen = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const gameName = gameId === '1' ? 'Challenge & Connect' : gameId === '2' ? 'Snake & Ladder' : 'Unknown Game';

  return (
    <div className="game-screen">
      <div className={`game-content ${gameId === '1' ? 'challenge-connect' : 'snake-ladder'}`}>
        <header className="game-header">
          <h1>{gameName}</h1>
          <div className="game-status">
            <span>Status: Active</span>
            <span>Players: {gameId === '1' ? '42' : '27'}</span>
          </div>
        </header>
        <main className="game-area">
          {gameId === '1' ? (
            <div className="challenge-visual">
              <div className="network-node"></div>
              <div className="network-node node-2"></div>
              <div className="network-node node-3"></div>
              <div className="network-line"></div>
              <p className="game-info">Connect with players in this social challenge!</p>
            </div>
          ) : (
            <div className="ladder-visual">
              <div className="dice"></div>
              <div className="ladder"></div>
              <p className="game-info">Roll the dice and climb to victory!</p>
            </div>
          )}
          <button className="play-button">Play Now</button>
        </main>
        <footer className="game-footer">
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Lobby
          </button>
        </footer>
      </div>
    </div>
  );
};

GameScreen.propTypes = {
  // No props required since useParams is used
};

export default GameScreen;