// DTO: campos opcionales para actualizar un usuario (HU-005 · T-008)
import { IsBoolean, IsEmail, IsMongoId, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsOptional() @IsString()
  nombres?: string;

  @IsOptional() @IsString()
  apellidos?: string;

  @IsOptional() @IsEmail({}, { message: 'Email no válido' })
  email?: string;

  // RNF-01: misma política de seguridad
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])(?=.*\d)/, { message: 'Debe incluir mayúscula y número' })
  password?: string;

  @IsOptional() @IsMongoId()
  idRol?: string;

  @IsOptional() @IsBoolean()
  estado?: boolean;
}
