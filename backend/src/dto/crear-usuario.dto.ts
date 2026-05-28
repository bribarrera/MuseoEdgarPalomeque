// DTO: datos para registrar un usuario (HU-003 · T-004, T-005)
import { IsEmail, IsMongoId, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @IsString() @IsNotEmpty()
  nombres: string;

  @IsString() @IsNotEmpty()
  apellidos: string;

  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  // RNF-01: mínimo 8 caracteres, una mayúscula y un número
  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  @Matches(/(?=.*[A-Z])(?=.*\d)/, { message: 'Debe incluir mayúscula y número' })
  password: string;

  @IsMongoId()
  idRol: string;
}
