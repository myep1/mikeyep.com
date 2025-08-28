// Weather.tsx
import { useEffect, useState } from 'react';
import '../weather/Weather.css';

interface WeatherResponse {
  current_weather: {
    temperature: number;
  };
}

function Weather() {
  const [temp, setTemp] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=41.88&longitude=-87.63&current_weather=true&temperature_unit=fahrenheit'
        );
        const data: WeatherResponse = await res.json();
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
