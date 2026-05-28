// api/ubicaciones.ts — llamadas al backend de ubicaciones (HU-007)
import http from './http_client';

export const listUbicaciones = async () => {
  const { data } = await http.get('/ubicaciones');
  return data as UbicacionOpcion[];
};

export const createUbicacion = async (payload: object) => {
  const { data } = await http.post('/ubicaciones', payload);
  return data;
};

export const updateUbicacion = async (id: string, payload: object) => {
  const { data } = await http.patch(`/ubicaciones/${id}`, payload);
  return data;
};

export interface UbicacionOpcion { idUbicacion: string; nombre: string; descripcion?: string; }
