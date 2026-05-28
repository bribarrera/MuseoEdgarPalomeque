// Servicio Auth – lógica de sesión (HU-001, HU-002)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument } from '../models/usuario.entity';
import { Auditoria, AuditoriaDocument } from '../models/auditoria.entity';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Auditoria.name) private readonly auditoriaModel: Model<AuditoriaDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // T-002: validar credenciales y emitir JWT (HU-001)
  async login(dto: LoginDto) {
    const usuario = await this.usuarioModel
      .findOne({ email: dto.email, estado: true })
      .select('+passwordHash')
      .populate('rol')
      .exec();

    if (!usuario || !(await bcrypt.compare(dto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    await this.usuarioModel.findByIdAndUpdate(usuario._id, { ultimoAcceso: new Date() });

    const rol = usuario.rol as any;
    const token = this.jwtService.sign({
      sub: String(usuario._id),
      email: usuario.email,
      rol: rol?.nombre,
    });

    await this.auditar(String(usuario._id), 'LOGIN', String(usuario._id));

    return {
      accessToken: token,
      usuario: {
        idUsuario: String(usuario._id),
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rol: rol?.nombre,
      },
    };
  }

  // T-003: registrar cierre de sesión (HU-002)
  async logout(idUsuario: string) {
    await this.auditar(idUsuario, 'LOGOUT', idUsuario);
    return { mensaje: 'Sesión cerrada correctamente' };
  }

  private async auditar(idUsuario: string, accion: string, idRegistro: string) {
    await this.auditoriaModel.create({ idUsuario, entidad: 'usuario', accion, idRegistro });
  }
}
