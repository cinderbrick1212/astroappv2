import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { config } from './config';

const api = axios.create({
  baseURL: config.strapi.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Firebase ID token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh and retry
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        error.config.headers.Authorization = `Bearer ${token}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
