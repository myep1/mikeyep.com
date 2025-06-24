import { Link, Routes, Route } from 'react-router-dom';
import '../dashboard/Dashboard.css';
import Weather from '../weather/Weather';
import Crypto from '../Crypto/Crypto';
import TestObj from '../Crypto/TestObj';

function Dashboard() {
  return (
    <div className="dashboard-container">      
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/dashboard/weather">Weather</Link>
        {' | '}
        <Link to="/dashboard/crypto">Crypto</Link>
        {' | '}
        <Link to="/dashboard/test">Testing</Link>
      </nav>
      <Routes>
        <Route path="weather" element={<Weather />} />
        <Route path="crypto" element={<Crypto />} />
        <Route path="test" element={<TestObj salt="12345" />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
