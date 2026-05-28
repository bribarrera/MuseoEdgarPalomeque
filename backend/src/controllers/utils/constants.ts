// utils/constants.ts — constantes globales del backend
export const BCRYPT_SALT = 10;         // RNF-01

export const JWT_EXPIRES = '30m';      // RNF-03

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  CATALOGADOR:   'Catalogador',
  CONSULTOR:     'Consultor',
} as const;

export const ENTIDADES_AUDITORIA = {
  USUARIO:    'usuario',
  PIEZA:      'pieza',
  CATEGORIA:  'categoria',
  UBICACION:  'ubicacion',
  ROL:        'rol',
  MOVIMIENTO: 'movimiento',
} as const;
