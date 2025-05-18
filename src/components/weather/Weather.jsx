// src/components/weather/Weather.jsx
import { useReducer, useCallback, useMemo } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
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
    case 'QUERY_TEMP':
      return { ...state, temp: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

function Weather() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadCities = useCallback(async (inputValue) => {
    if (!inputValue || inputValue.length < 4) return [];
    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?`
        + `sort=-population&limit=10&countryIds=US&namePrefix=${encodeURIComponent(inputValue)}`,
        {
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const json = await res.json();
      const cities = json?.data ?? [];
      return cities.map((city) => ({
        value: city.id,
        label: `${city.name}, ${city.regionCode}`,
        lat: city.latitude,
        lon: city.longitude,
      }));
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: `City lookup failed: ${e.message}` });
      return [];
    }
  }, []);

  const debouncedLoadCities = useMemo(() => {
    const fn = debounce((inputValue, resolve) => {
      loadCities(inputValue).then(resolve);
    }, 1000);
    return (inputValue) => new Promise((resolve) => fn(inputValue, resolve));
  }, [loadCities]);

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
      dispatch({ type: 'QUERY_TEMP', payload: data.current_weather.temperature });
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
        loadOptions={debouncedLoadCities}  // This is used to handle city selection in AsyncSelect
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
