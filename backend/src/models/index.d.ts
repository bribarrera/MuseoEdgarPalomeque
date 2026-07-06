// models/index.d.ts — tipos e interfaces globales del sistema · Museo Etnográfico

// Respuesta genérica de la API
export type ResponseData = {
  message?: string;
  data?: unknown;
  success: boolean;
};

// Roles del sistema
export type UserRole = 'Administrador' | 'Catalogador' | 'Consultor';

// Payload del JWT
export type JwtPayload = {
  idUsuario: string;
  email: string;
  rol: UserRole;
};

// Login
export type LoginData = {
  email: string;
  password: string;
};

// Usuario
export type UsuarioData = {
  idUsuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: { idRol: string; nombre: string };
  estado: boolean;
  fechaCreacion: string;
  ultimoAcceso: string | null;
};

export type CrearUsuarioData = {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  idRol: string;
};

export type ActualizarUsuarioData = {
  nombres?: string;
  apellidos?: string;
  email?: string;
  idRol?: string;
  estado?: boolean;
};

// Paginación genérica
export type Paginado<T> = {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
};

// Auditoría
export type AuditoriaData = {
  idAuditoria: number;
  idUsuario: number;
  entidad: string;
  accion: string;
  idRegistro: number | null;
  detalle: string | null;
  fechaEvento: string;
  ipOrigen: string | null;
};

// Pieza / Inventario (Sprint 2)
export type PiezaData = {
  idPieza: number;
  codigoInventario: string;
  nombre: string;
  descripcion: string | null;
  procedencia: string | null;
  anioAproximado: string | null;
  estado: string;
  categoria: { idCategoria: number; nombre: string };
  ubicacion: { idUbicacion: number; nombre: string };
  fechaIngreso: string;
  imagen: string | null;
};

export type CrearPiezaData = {
  codigoInventario: string;
  nombre: string;
  descripcion?: string;
  procedencia?: string;
  anioAproximado?: string;
  estado?: string;
  idCategoria: number;
  idUbicacion: number;
};

// Categoría y Ubicación (Sprint 2)
export type CategoriaData = {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
};

export type UbicacionData = {
  idUbicacion: number;
  nombre: string;
  descripcion: string | null;
};
