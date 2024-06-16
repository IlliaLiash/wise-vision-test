import { useState } from 'react';
import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from './public/search-icon.svg?react';
import { IWeatherItem } from './types';
import { getWeatherByCity } from './weather.api';
import axios from 'axios';

const App = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<IWeatherItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await getWeatherByCity(searchQuery);

      const data = {
        city: response.name,
        temperature: response.main.temp,
        main: response.weather[0].main,
        icon: response.weather[0].icon,
      };
      setData(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '60%' }}>
          <InputBase
            className="ml-1"
            sx={{ flex: 1 }}
            placeholder="Enter city name"
            inputProps={{ 'aria-label': 'Enter city name' }}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch} disabled={!searchQuery}>
            <SearchIcon className="w-4 h-4" />
          </IconButton>
        </Paper>
      </div>
      <div>
        {error && <div className="text-center text-red-500">{error}</div>}
        {loading && <div className="text-center">Loading...</div>}
        {data ? (
          <div className="flex items-center m-4 flex-col">
            <div className="text-center">{data.city}</div>
            <div className="text-center">{data.temperature}°C</div>
            <div className="text-center">{data.main}</div>
            <img src={`http://openweathermap.org/img/w/${data.icon}.png`} alt={data.main} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default App;
