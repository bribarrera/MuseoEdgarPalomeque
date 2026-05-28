// dto/crear-conservacion.dto.ts — Validación (HU-012)
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearConservacionDto {
  @IsEnum(['Excelente', 'Bueno', 'Regular', 'Malo'], { message: 'Nivel no válido' })
  nivel: string;

  @IsString() @MinLength(5) @MaxLength(500)
  descripcion: string;
}
