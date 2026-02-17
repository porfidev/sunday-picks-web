import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ej: https://api.tuapp.com
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
