// DTO: datos para registrar una pieza (HU-006 · T-010, T-011)
import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearPiezaDto {
  @IsString() @IsNotEmpty() @MaxLength(50)
  codigoInventario: string;

  @IsString() @IsNotEmpty() @MaxLength(200)
  nombre: string;

  @IsString() @IsNotEmpty() @MaxLength(1000)
  descripcion: string;

  @IsString() @IsNotEmpty() @MaxLength(200)
  origen: string;

  @IsString() @IsNotEmpty() @MaxLength(200)
  dimensiones: string;

  @IsOptional() @IsString() @MaxLength(20)
  anioAproximado?: string;

  @IsOptional() @IsString() @IsIn(['Bueno', 'Regular', 'Malo', 'Restaurado'])
  estadoConservacion?: string;

  @IsMongoId()
  idCategoria: string;

  @IsMongoId()
  idUbicacion: string;
}
