// api/usuarios.ts — llamadas CRUD al backend de usuarios
import http, { LIMITE_PAGINA } from './http_client';

export interface UsuarioOpcion {
  idUsuario: string;
  nombres: string;
  apellidos: string;
  email: string;
}

export const listUsuarios = async (pagina = 1, limite = LIMITE_PAGINA) => {
  try {
    const { data } = await http.get(`/usuarios?pagina=${pagina}&limite=${limite}`);
    return Array.isArray(data?.datos) ? data.datos : [];
  } catch (err) {
    console.error('Error listando usuarios:', err);
    return [];
  }
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
