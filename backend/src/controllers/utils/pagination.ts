// utils/pagination.ts — helper para paginación en servicios
export interface PaginadoResult<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export function buildPaginado<T>(
  datos: T[],
  total: number,
  pagina: number,
  limite: number,
): PaginadoResult<T> {
  return {
    datos,
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
  };
}
