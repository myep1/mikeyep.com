// src/components/weather/Weather.jsx
import { useReducer, useState, useEffect, useCallback } from 'react';
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
  const [inputValue, setInputValue] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');

  // Debounce input value (wait 1 second after typing stops before making the request)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timeout on each render
  }, [inputValue]);

  // Memoize the loadCities function with useCallback
  const loadCities = useCallback(async (inputValue) => {
    if (!inputValue || inputValue.length < 4) return []; // Minimum 4 characters

    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&countryIds=US&namePrefix=${encodeURIComponent(inputValue)}`,
        {
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY, 
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const json = await res.json();
      return json.data.map((city) => ({
        value: city.id,
        label: `${city.name}, ${city.regionCode}`, // Show city and region
        lat: city.latitude,
        lon: city.longitude,
      }));
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: `City lookup failed: ${e.message}` });
      return [];
    }
  }, []);  // Empty array ensures loadCities is only created once

  // Use the debounced value of the input to trigger city lookup
  useEffect(() => {
    if (debouncedInput) {
      loadCities(debouncedInput); // Call loadCities when debouncedInput is ready
    }
  }, [debouncedInput, loadCities]);

  // Handle city selection
  const handleCitySelect = async (cityOption) => {
    dispatch({ type: 'START_LOADING' });
    dispatch({ type: 'SELECT_CITY', payload: cityOption });
    dispatch({ type: 'SET_COORDS', payload: { lat: cityOption.lat, lon: cityOption.lon } });

    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${cityOption.lat}`
        + `&longitude=${cityOption.lon}&current_weather=true&temperature_unit=fahrenheit`
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
        loadOptions={loadCities}  // This is used to handle city selection in AsyncSelect
        onChange={handleCitySelect}
        placeholder="Start typing a city..."
        isDisabled={state.loading}
        onInputChange={setInputValue} // Update inputValue as the user types
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
