import { Link, Routes, Route } from 'react-router-dom';
import '../dashboard/Dashboard.css';
import Weather from '../weather/Weather';
import Crypto from '../Crypto/Crypto';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/dashboard/weather">Weather</Link>
        {' | '}
        <Link to="/dashboard/crypto">Crypto</Link>
      </nav>

      <Routes>
        <Route path="weather" element={<Weather />} />
        <Route path="crypto" element={<Crypto />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
