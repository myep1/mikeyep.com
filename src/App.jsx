// src/App.jsx
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import Game from './2048/Game'; // Original working game component
import GameTest from './2048/GameTest'; // New version with board size selector and swipe gestures
import HackerTyper from './components/HackerTyper/HackerTyper';

function App() {
  const deployTimestamp = import.meta.env.VITE_DEPLOY_TIMESTAMP; 
  const deployType = import.meta.env.VITE_DEPLOY_TYPE; 
  const year = new Date().getFullYear();
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page Route */}
          <Route 
            path="/" 
            element={
              <div>
                <div className="hacker-top-left">
                  <HackerTyper />
                </div>               
                <div>
                  {/* Updated link with HashRouter */}
                  <a href="#/2048" target="_self">
                    Play 2048 (Original)
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href="https://www.linkedin.com/in/mike-yep" target="_blank">Linkedin Profile</a>
                  <br />
                  <span>© {year} Mike Yep. All Rights Reserved.</span>
                  <p>{deployType}{deployTimestamp}</p>
                </div>
              </div>
            } 
          />  
          {/* Game Routes */}
          <Route path="/2048" element={<Game />} /> {/* Original Game */}          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
