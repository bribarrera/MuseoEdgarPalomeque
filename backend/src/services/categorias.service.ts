// Servicio Categorías — lógica CRUD (HU-006 · T-011)
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria, CategoriaDocument } from '../models/categoria.entity';
import { Auditoria, AuditoriaDocument } from '../models/auditoria.entity';
import { CrearCategoriaDto } from '../dto/crear-categoria.dto';
import { ENTIDADES_AUDITORIA } from '../controllers/utils/constants';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel(Categoria.name) private readonly categoriaModel: Model<CategoriaDocument>,
    @InjectModel(Auditoria.name) private readonly auditoriaModel: Model<AuditoriaDocument>,
  ) {}

  async listar() {
    return this.categoriaModel.find().sort({ nombre: 1 }).exec();
  }

  async crear(dto: CrearCategoriaDto, idAccion: string) {
    if (await this.categoriaModel.findOne({ nombre: dto.nombre })) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
    const categoria = await this.categoriaModel.create(dto);
    await this.auditar(idAccion, 'CREATE', String(categoria._id));
    return categoria;
  }

  async actualizar(id: string, dto: CrearCategoriaDto, idAccion: string) {
    const categoria = await this.categoriaModel.findById(id);
    if (!categoria) throw new NotFoundException(`Categoría ${id} no encontrada`);
    if (dto.nombre && dto.nombre !== categoria.nombre) {
      if (await this.categoriaModel.findOne({ nombre: dto.nombre })) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
      categoria.nombre = dto.nombre;
    }
    if (dto.descripcion !== undefined) categoria.descripcion = dto.descripcion;
    await categoria.save();
    await this.auditar(idAccion, 'UPDATE', id);
    return categoria;
  }

  private async auditar(idUsuario: string, accion: string, idRegistro: string) {
    await this.auditoriaModel.create({ idUsuario, entidad: ENTIDADES_AUDITORIA.CATEGORIA, accion, idRegistro });
  }
}
