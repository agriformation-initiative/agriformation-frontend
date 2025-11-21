/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - ONLY handle network/server errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't touch auth state here - just log for debugging
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - token may be invalid');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

export const createAdmin = (data: any) =>
  api.post('/auth/create-admin', data);

export default api;