// api/categorias.ts — llamadas al backend de categorías (HU-006)
import http from './http_client';

export const listCategorias = async () => {
  const { data } = await http.get('/categorias');
  return data as CategoriaOpcion[];
};

export const createCategoria = async (payload: object) => {
  const { data } = await http.post('/categorias', payload);
  return data;
};

export const updateCategoria = async (id: string, payload: object) => {
  const { data } = await http.patch(`/categorias/${id}`, payload);
  return data;
};

export interface CategoriaOpcion { idCategoria: string; nombre: string; descripcion?: string; }
