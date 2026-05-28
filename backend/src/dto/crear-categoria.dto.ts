// DTO: datos para crear una categoría (HU-006 · T-011)
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearCategoriaDto {
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre: string;

  @IsOptional() @IsString() @MaxLength(255)
  descripcion?: string;
}
