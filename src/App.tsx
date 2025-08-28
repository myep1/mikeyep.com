// src/App.tsx
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Game from './2048/Game';
import HackerTyper from './components/HackerTyper/HackerTyper';
import Dashboard from './components/dashboard/Dashboard';

function App(): JSX.Element {
  const deployTimestamp = import.meta.env.VITE_DEPLOY_TIMESTAMP as string | undefined;
  const deployType = import.meta.env.VITE_DEPLOY_TYPE as string | undefined;
  const renderHackerTyper = import.meta.env.VITE_HACKER_TYPER as string | undefined; // "true"/"false"
  const year = new Date().getFullYear();

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
                    <a href="/gpg.txt" target="_blank" rel="noreferrer">GPG Key</a>
                    <a href="https://www.linkedin.com/in/mike-yep" target="_blank" rel="noreferrer">Linkedin Profile</a>
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
