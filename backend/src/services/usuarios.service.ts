// Servicio Usuarios – lógica de negocio CRUD (HU-003…005)
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument } from '../models/usuario.entity';
import { Rol, RolDocument } from '../models/rol.entity';
import { Auditoria, AuditoriaDocument } from '../models/auditoria.entity';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto';
import { BCRYPT_SALT, ENTIDADES_AUDITORIA } from '../controllers/utils/constants';
import { buildPaginado } from '../controllers/utils/pagination';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)   private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Rol.name)       private readonly rolModel: Model<RolDocument>,
    @InjectModel(Auditoria.name) private readonly auditoriaModel: Model<AuditoriaDocument>,
  ) {}

  // T-005: crear usuario con contraseña hasheada (HU-003)
  async crear(dto: CrearUsuarioDto, idAccion: string) {
    if (await this.usuarioModel.findOne({ email: dto.email })) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }
    const rol = await this.rolModel.findById(dto.idRol);
    if (!rol) throw new NotFoundException(`Rol ${dto.idRol} no encontrado`);

    const usuario = await this.usuarioModel.create({
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, BCRYPT_SALT),
      rol: rol._id,
      estado: true,
    });
    await this.auditar(idAccion, 'CREATE', String(usuario._id));
    return usuario.populate('rol');
  }

  // T-006, T-007: listar usuarios con paginación (HU-004)
  async listar(pagina = 1, limite = 10) {
    const skip = (pagina - 1) * limite;
    const [datos, total] = await Promise.all([
      this.usuarioModel.find({ estado: true }).populate('rol').sort({ nombres: 1 }).skip(skip).limit(limite).exec(),
      this.usuarioModel.countDocuments({ estado: true }),
    ]);
    return buildPaginado(datos, total, pagina, limite);
  }

  // T-007: obtener un usuario por id (HU-004)
  async obtener(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Usuario ${id} no encontrado`);
    const u = await this.usuarioModel.findById(id).populate('rol').exec();
    if (!u) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return u;
  }

  // T-008: actualizar datos con auditoría (HU-005)
  async actualizar(id: string, dto: ActualizarUsuarioDto, idAccion: string) {
    const usuario = await this.obtener(id);

    if (dto.email && dto.email !== usuario.email) {
      if (await this.usuarioModel.findOne({ email: dto.email })) {
        throw new ConflictException('Ya existe un usuario con ese email');
      }
      usuario.email = dto.email;
    }
    if (dto.nombres   !== undefined) usuario.nombres   = dto.nombres;
    if (dto.apellidos !== undefined) usuario.apellidos = dto.apellidos;
    if (dto.estado    !== undefined) usuario.estado    = dto.estado;
    if (dto.password) usuario.passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT);
    if (dto.idRol) {
      const rol = await this.rolModel.findById(dto.idRol);
      if (!rol) throw new NotFoundException(`Rol ${dto.idRol} no encontrado`);
      usuario.rol = rol._id as Types.ObjectId;
    }
    await usuario.save();
    await this.auditar(idAccion, 'UPDATE', id);
    return usuario.populate('rol');
  }

  // HU-005: baja lógica
  async desactivar(id: string, idAccion: string) {
    const usuario = await this.obtener(id);
    usuario.estado = false;
    await usuario.save();
    await this.auditar(idAccion, 'DELETE', id);
    return { mensaje: 'Usuario desactivado' };
  }

  private async auditar(idUsuario: string, accion: string, idRegistro: string) {
    await this.auditoriaModel.create({ idUsuario, entidad: ENTIDADES_AUDITORIA.USUARIO, accion, idRegistro });
  }
}

