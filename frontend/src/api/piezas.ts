// api/piezas.ts — llamadas al backend de inventario (HU-006…022)
import http from './http_client';

export const listPiezas = async (pagina = 1, limite = 20, busqueda?: string, idCategoria?: string, idUbicacion?: string, estado?: string) => {
  const params = new URLSearchParams({ pagina: String(pagina), limite: String(limite) });
  if (busqueda)    params.set('busqueda', busqueda);
  if (idCategoria) params.set('idCategoria', idCategoria);
  if (idUbicacion) params.set('idUbicacion', idUbicacion);
  if (estado)      params.set('estado', estado);
  const { data } = await http.get(`/piezas?${params}`);
  return data;
};

export const readPieza = async (id: string) => {
  const { data } = await http.get(`/piezas/${id}`);
  return data;
};

export const createPieza = async (payload: FormData) => {
  const { data } = await http.post('/piezas', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const updatePieza = async (id: string, payload: FormData) => {
  const { data } = await http.patch(`/piezas/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const deletePieza = async (id: string) => {
  const { data } = await http.delete(`/piezas/${id}`);
  return data;
};

// conservación (HU-012, HU-013)
export const createConservacion = async (idPieza: string, payload: { nivel: string; descripcion: string }) => {
  const { data } = await http.post(`/piezas/${idPieza}/conservacion`, payload);
  return data;
};

export const getHistorialConservacion = async (idPieza: string) => {
  const { data } = await http.get(`/piezas/${idPieza}/conservacion`);
  return data;
};

// movimientos (HU-014, HU-015, HU-016)
export const createMovimiento = async (
  idPieza: string,
  payload: { tipoMovimiento: string; idUbicacionDestino: string; fechaSalida: string; motivo: string; responsable: string },
) => {
  const { data } = await http.post(`/piezas/${idPieza}/movimientos`, payload);
  return data;
};

export const getHistorialMovimientos = async (idPieza: string) => {
  const { data } = await http.get(`/piezas/${idPieza}/movimientos`);
  return data;
};

export const getMovimientosRecientes = async (pagina = 1, limite = 20, desde?: string, hasta?: string) => {
  const params = new URLSearchParams({ pagina: String(pagina), limite: String(limite) });
  if (desde) params.set('desde', desde);
  if (hasta) params.set('hasta', hasta);
  const { data } = await http.get(`/piezas/movimientos?${params}`);
  return data;
};

// estadísticas del dashboard (HU-019, HU-020)
export const getEstadisticas = async () => {
  const { data } = await http.get('/piezas/estadisticas');
  return data;
};

// reportes PDF (HU-021, HU-022)
export const descargarReporteInventario = async (): Promise<Blob> => {
  const { data } = await http.get('/piezas/reporte/inventario', { responseType: 'blob' });
  return data as Blob;
};

export const descargarReporteConservacion = async (nivel?: string): Promise<Blob> => {
  const params = nivel ? `?nivel=${encodeURIComponent(nivel)}` : '';
  const { data } = await http.get(`/piezas/reporte/conservacion${params}`, { responseType: 'blob' });
  return data as Blob;
};
