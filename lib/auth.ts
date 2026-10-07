/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or revoked token on a signed-in session sends the user back to sign in,
// instead of leaving every dashboard call failing silently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = String(error.config?.url ?? '').includes('/auth/login');
    if (error.response?.status === 401 && !isLoginCall && typeof window !== 'undefined') {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/auth?expired=1');
      }
    }
    return Promise.reject(error);
  }
);

export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

export const createAdmin = (data: any) => api.post('/auth/register-admin', data);

export default api;
