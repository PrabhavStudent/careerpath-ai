import axios from 'axios';

// Detect whether running in production browser on a public domain
const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const envUrl = import.meta.env.VITE_API_URL;
// Deployed production Render backend URL
const PRODUCTION_BACKEND_URL = 'https://careerpath-ai-backend-yyax.onrender.com/api/v1';
const API_BASE_URL = envUrl || (isLocalhost ? 'http://localhost:8000/api/v1' : PRODUCTION_BACKEND_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerpath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if not logging in
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('careerpath_token');
        localStorage.removeItem('careerpath_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
