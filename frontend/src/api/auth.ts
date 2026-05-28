// api/auth.ts — llamadas al backend de autenticación
import http from './http_client';
import type { Sesion } from '../context/auth_context';

export async function loginRequest(email: string, password: string) {
  const { data } = await http.post('/auth/login', { email, password });
  return data as { accessToken: string; usuario: Sesion };
}

export async function logoutRequest() {
  await http.post('/auth/logout').catch(() => {});
}
