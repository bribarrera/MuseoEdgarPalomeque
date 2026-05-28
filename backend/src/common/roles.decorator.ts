// Decorador: asigna roles requeridos a una ruta (Sprint 1 · RF-03)
import { SetMetadata } from '@nestjs/common';
import { RolEnum } from './rol.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolEnum[]) => SetMetadata(ROLES_KEY, roles);
