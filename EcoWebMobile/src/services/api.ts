import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://api-3r74.onrender.com',
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@ecoweb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;