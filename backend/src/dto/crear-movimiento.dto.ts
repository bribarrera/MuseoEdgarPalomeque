// dto/crear-movimiento.dto.ts — Validación (HU-014)
import { IsDateString, IsEnum, IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearMovimientoDto {
  @IsEnum(['Préstamo', 'Traslado', 'Exposición', 'Restauración', 'Devolución'], { message: 'Tipo de movimiento no válido' })
  tipoMovimiento: string;

  @IsMongoId({ message: 'Ubicación destino no válida' })
  idUbicacionDestino: string;

  @IsDateString({}, { message: 'Fecha de salida no válida' })
  fechaSalida: string;

  @IsString() @MinLength(5) @MaxLength(500)
  motivo: string;

  @IsString() @MinLength(3) @MaxLength(200)
  responsable: string;
}
