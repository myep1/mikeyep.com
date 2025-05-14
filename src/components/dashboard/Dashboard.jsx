import { Link, Routes, Route } from 'react-router-dom';
import '../dashboard/Dashboard.css';
import Weather from '../weather/Weather';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/dashboard/weather">Weather</Link>
      </nav>

      <Routes>
        <Route path="weather" element={<Weather />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
