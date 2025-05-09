// src/App.jsx
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Keep your original CSS intact
import reactLogo from './assets/react.svg'; // React logo path
import viteLogo from '/vite.svg'; // Vite logo path from public
import { useState } from 'react';
import Game from './2048/Game'; // Original working game component
import GameTest from './2048/GameTest'; // New version with board size selector and swipe gestures

function App() {
  const deployTimestamp = import.meta.env.VITE_DEPLOY_TIMESTAMP;
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page Route */}
          <Route 
            path="/" 
            element={
              <div>
                <div>
                  <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                  </a>
                  <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                  </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                  <button onClick={() => setCount(count + 1)}>
                    count is {count}
                  </button>
                  <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                  </p>
                </div>
                <p className="read-the-docs">
                  Click on the Vite and React logos to learn more
                </p>
                <div>
                  <a href="/2048" target="_self">
                    Play 2048 Game (Original)
                  </a>
                  <br />
                  <p>Deployed on: {deployTimestamp}</p>
                </div>
              </div>
            } 
          />

          {/* Game Routes */}
          <Route path="/2048" element={<Game />} /> {/* Original Game */}
          <Route path="/2048test" element={<GameTest />} /> {/* New Version with board size selector and swipe gestures */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
