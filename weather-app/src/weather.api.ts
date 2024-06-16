import axios from 'axios';
import { IWeatherData } from './types';

const weatherApi = axios.create({
  baseURL: import.meta.env.VITE_OPEN_WEATHER_API,
});

const token = import.meta.env.VITE_OPEN_WEATHER_TOKEN;

const getWeatherByCity = async (cityName: string): Promise<IWeatherData> => {
  const url = `/data/2.5/weather?q=${cityName}&units=metric&appid=${token}`;

  const response = await weatherApi.get(url);

  return response.data;
};

export { getWeatherByCity };
