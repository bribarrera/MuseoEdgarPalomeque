// api/roles.ts — obtiene la lista de roles desde el backend
import http from './http_client';

export interface RolOpcion { idRol: string; nombre: string; orden: number; }

export const listRoles = async (): Promise<RolOpcion[]> => {
  const { data } = await http.get('/roles');
  return data;
};
