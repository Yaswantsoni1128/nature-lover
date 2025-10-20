import axios from 'axios';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      
      // Only redirect if not already on login page, not during login/register requests,
      // and not during the initial auth check
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath === '/login' || currentPath === '/register';
      const isAuthRequest = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
      const isAuthCheck = error.config?.url?.includes('/user/me');
      
      // Don't redirect if it's the initial auth check or if we're on auth routes
      // if (!isAuthRoute && !isAuthRequest && !isAuthCheck) {
      //   // Use a small delay to prevent rapid redirects
      //   setTimeout(() => {
      //     window.location.href = '/login';
      //   }, 100);
      // }
    }
    return Promise.reject(error);
  }
);

// Async/await wrapper functions for common HTTP methods
export const apiRequest = {
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async patch(url, data = {}, config = {}) {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;