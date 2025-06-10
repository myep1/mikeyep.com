// src/App.jsx
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import Game from './2048/Game'; // Original working game component
import HackerTyper from './components/HackerTyper/HackerTyper';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const deployTimestamp = import.meta.env.VITE_DEPLOY_TIMESTAMP; 
  const deployType = import.meta.env.VITE_DEPLOY_TYPE; 
  const year = new Date().getFullYear();
  const renderHackerTyper = import.meta.env.VITE_HACKER_TYPER; 

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <div className="hacker-top-left">
                  {renderHackerTyper === 'true' && <HackerTyper />}
                </div>
                <div className="footer-block">
                  <div className="footer-links">
                    <a href="#/2048">2048</a>
                    <a href="#/dashboard">Dashboard</a>
                    <a href="/gpg.txt" target="_blank">GPG Key</a>
                    <a href="https://www.linkedin.com/in/mike-yep" target="_blank">Linkedin Profile</a>
                  </div>
                  <span>© {year} Mike Yep. All Rights Reserved.</span>
                  <p>{deployType}{deployTimestamp}</p>
                </div>
              </>
            }
          />
          <Route path="/2048" element={<Game />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
