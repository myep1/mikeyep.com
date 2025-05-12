// src/App.jsx
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import Game from './2048/Game'; // Original working game component
import HackerTyper from './components/HackerTyper/HackerTyper';

function App() {
  const deployTimestamp = import.meta.env.VITE_DEPLOY_TIMESTAMP; 
  const deployType = import.meta.env.VITE_DEPLOY_TYPE; 
  const year = new Date().getFullYear();
  const renderHackerTyper = import.meta.env.VITE_HACKER_TYPER; 
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
                  {renderHackerTyper}
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
          <Route path="/2048" element={<Game />} /> {/* Original Game */}          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
