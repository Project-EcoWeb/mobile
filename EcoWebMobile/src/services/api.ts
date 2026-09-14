import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? process.env.API_URL;

// eslint-disable-next-line import/no-named-as-default-member -- Axios exposes `create` on its default export.
const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    if (!baseURL) {
      return Promise.reject(
        new Error('A API não foi configurada. Defina EXPO_PUBLIC_API_URL no arquivo .env.')
      );
    }

    const token = await AsyncStorage.getItem('@ecoweb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
