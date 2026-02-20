import axios from 'axios';
import { storage } from './utils/storage';
import { config } from './config';

const api = axios.create({
  baseURL: config.strapi.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Strapi JWT from local storage
api.interceptors.request.use(
  async (requestConfig) => {
    const token = await storage.get<string>(storage.keys.AUTH_TOKEN);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
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
      // Clear stored credentials on unauthorized response
      await storage.remove(storage.keys.AUTH_TOKEN);
      await storage.remove(storage.keys.USER_DATA);
    }
    return Promise.reject(error);
  }
);

export default api;
