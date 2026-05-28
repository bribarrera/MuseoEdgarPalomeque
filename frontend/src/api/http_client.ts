// api/http_client.ts — instancia Axios con interceptor JWT
import axios from 'axios';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api' });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  CATALOGADOR: 'Catalogador',
  CONSULTOR: 'Consultor',
} as const;

export const LIMITE_PAGINA = 10;
