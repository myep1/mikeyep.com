import { useEffect, useState } from 'react';
import '../weather/Weather.css';

function Weather() {
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=41.88&longitude=-87.63&current_weather=true&temperature_unit=fahrenheit'
        );
        //console.dir(res);
        const data = await res.json();
        setTemp(data.current_weather.temperature);
      } catch (e) {
        console.error('Weather fetch failed', e);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) return <p>Loading weather...</p>;

  return (
    <div className="weather-container">
      <h3>Current Temp in Chicago: {temp}°F</h3>
    </div>
  );
}

export default Weather;
