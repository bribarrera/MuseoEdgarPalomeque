// Servicio Ubicaciones — lógica CRUD (HU-007 · T-011)
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ubicacion, UbicacionDocument } from '../models/ubicacion.entity';
import { Auditoria, AuditoriaDocument } from '../models/auditoria.entity';
import { CrearUbicacionDto } from '../dto/crear-ubicacion.dto';
import { ENTIDADES_AUDITORIA } from '../controllers/utils/constants';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectModel(Ubicacion.name) private readonly ubicacionModel: Model<UbicacionDocument>,
    @InjectModel(Auditoria.name) private readonly auditoriaModel: Model<AuditoriaDocument>,
  ) {}

  async listar() {
    return this.ubicacionModel.find().sort({ nombre: 1 }).exec();
  }

  async crear(dto: CrearUbicacionDto, idAccion: string) {
    if (await this.ubicacionModel.findOne({ nombre: dto.nombre })) {
      throw new ConflictException('Ya existe una ubicación con ese nombre');
    }
    const ubicacion = await this.ubicacionModel.create(dto);
    await this.auditar(idAccion, 'CREATE', String(ubicacion._id));
    return ubicacion;
  }

  async actualizar(id: string, dto: CrearUbicacionDto, idAccion: string) {
    const ubicacion = await this.ubicacionModel.findById(id);
    if (!ubicacion) throw new NotFoundException(`Ubicación ${id} no encontrada`);
    if (dto.nombre && dto.nombre !== ubicacion.nombre) {
      if (await this.ubicacionModel.findOne({ nombre: dto.nombre })) {
        throw new ConflictException('Ya existe una ubicación con ese nombre');
      }
      ubicacion.nombre = dto.nombre;
    }
    if (dto.descripcion !== undefined) ubicacion.descripcion = dto.descripcion;
    await ubicacion.save();
    await this.auditar(idAccion, 'UPDATE', id);
    return ubicacion;
  }

  private async auditar(idUsuario: string, accion: string, idRegistro: string) {
    await this.auditoriaModel.create({ idUsuario, entidad: ENTIDADES_AUDITORIA.UBICACION, accion, idRegistro });
  }
}
