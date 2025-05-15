// src/components/weather/Weather.jsx
import { useReducer } from 'react';
import AsyncSelect from 'react-select/async';
import '../weather/Weather.css';

const initialState = {
  city: null,
  lat: null,
  lon: null,
  temp: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true, error: null };
    case 'SELECT_CITY':
      return { ...state, city: action.payload };
    case 'SET_COORDS':
      return { ...state, lat: action.payload.lat, lon: action.payload.lon };
    case 'SET_TEMP':
      return { ...state, temp: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

function Weather() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadCities = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&countryIds=US&namePrefix=${encodeURIComponent(inputValue)}`,
        {
          headers: {
            'X-RapidAPI-Key': 'e18c3a420amshcb93b5ed2c060dap1a7b49jsnbd9a6f0bf369',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const json = await res.json();
      return json.data.map((city) => ({
        value: city.id,
        label: `${city.name}, ${city.regionCode}`,
        lat: city.latitude,
        lon: city.longitude,
      }));
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: `City lookup failed: ${e.message}` });
      return [];
    }
  };

  const handleCitySelect = async (option) => {
    dispatch({ type: 'START_LOADING' });
    dispatch({ type: 'SELECT_CITY', payload: option });
    dispatch({ type: 'SET_COORDS', payload: { lat: option.lat, lon: option.lon } });

    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${option.lat}&longitude=${option.lon}&current_weather=true&temperature_unit=fahrenheit`
      );
      const data = await res.json();
      dispatch({ type: 'SET_TEMP', payload: data.current_weather.temperature });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: `Weather fetch failed: ${e.message}` });
    }
  };

  return (
    <div className="weather-container">
      <h3>City Weather Lookup</h3>
      {state.loading && <p>Loading...</p>}
      {state.error && <p className="error">{state.error}</p>}
      <AsyncSelect
        cacheOptions
        loadOptions={loadCities}
        onChange={handleCitySelect}
        placeholder="Start typing a city..."
        isDisabled={state.loading}
      />
      {state.temp !== null && state.city && (
        <p>
          Current temp in {state.city.label}: {state.temp}°F
        </p>
      )}
    </div>
  );
}

export default Weather;
