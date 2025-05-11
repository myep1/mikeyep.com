// src/App.jsx
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Keep your original CSS intact
//import reactLogo from './assets/react.svg'; // React logo path
//import viteLogo from '/vite.svg'; // Vite logo path from public
//import { useState } from 'react';
import Game from './2048/Game'; // Original working game component
import GameTest from './2048/GameTest'; // New version with board size selector and swipe gestures

function App() {
  console.log('Vite mode:', import.meta.env.MODE);
  const deployTimestamp = import.meta.env.VITE_DEPLOY_TIMESTAMP; 
  const deployType = import.meta.env.VITE_DEPLOY_TYPE; 


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
                  {/* Updated link with HashRouter */}
                  <a href="#/2048" target="_self">
                    Play 2048 Game (Original)
                  </a>
                  <br />
                  <p>{deployType}{deployTimestamp}</p>
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
