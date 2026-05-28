// DTO: datos para actualizar una pieza (HU-009 · T-016, T-017)
// El código de inventario NO es modificable (criterio HU-009 CA-2)
import { IsIn, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarPiezaDto {
  @IsOptional() @IsString() @MaxLength(200)
  nombre?: string;

  @IsOptional() @IsString() @MaxLength(1000)
  descripcion?: string;

  @IsOptional() @IsString() @MaxLength(200)
  origen?: string;

  @IsOptional() @IsString() @MaxLength(200)
  dimensiones?: string;

  @IsOptional() @IsString() @MaxLength(20)
  anioAproximado?: string;

  @IsOptional() @IsString() @IsIn(['Bueno', 'Regular', 'Malo', 'Restaurado'])
  estadoConservacion?: string;

  @IsOptional() @IsMongoId()
  idCategoria?: string;

  @IsOptional() @IsMongoId()
  idUbicacion?: string;
}
