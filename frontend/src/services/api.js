// frontend/src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://licorera-app.onrender.com/api';

const API = axios.create({
  baseURL: baseURL.replace(/\/+$/, ''), // Elimina barras diagonales al final si las hubiera
});

// Interceptor para inyectar automáticamente el token JWT en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;