// DTO: datos para crear una ubicación (HU-007 · T-011)
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearUbicacionDto {
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre: string;

  @IsOptional() @IsString() @MaxLength(255)
  descripcion?: string;
}
