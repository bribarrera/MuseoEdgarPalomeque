// api/auditorias.ts — HU-023
import http from './http_client';

export const listAuditorias = async (
  pagina = 1,
  limite = 20,
  desde?: string,
  hasta?: string,
  entidad?: string,
  accion?: string,
) => {
  const params = new URLSearchParams({ pagina: String(pagina), limite: String(limite) });
  if (desde)   params.set('desde', desde);
  if (hasta)   params.set('hasta', hasta);
  if (entidad) params.set('entidad', entidad);
  if (accion)  params.set('accion', accion);
  const { data } = await http.get(`/auditorias?${params}`);
  return data;
};
