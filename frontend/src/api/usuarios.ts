// api/usuarios.ts — llamadas CRUD al backend de usuarios
import http, { LIMITE_PAGINA } from './http_client';

export const listUsuarios = async (pagina = 1, limite = LIMITE_PAGINA) => {
  const { data } = await http.get(`/usuarios?pagina=${pagina}&limite=${limite}`);
  return data;
};

export const readUsuario = async (id: string) => {
  const { data } = await http.get(`/usuarios/${id}`);
  return data;
};

export const createUsuario = async (payload: object) => {
  const { data } = await http.post('/usuarios', payload);
  return data;
};

export const updateUsuario = async (id: string, payload: object) => {
  const { data } = await http.patch(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUsuario = async (id: string) => {
  const { data } = await http.delete(`/usuarios/${id}`);
  return data;
};
