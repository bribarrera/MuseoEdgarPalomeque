// Servicio Piezas — lógica de inventario (HU-006…022)
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { pdfInventario, pdfConservacion } from '../controllers/utils/pdf';
import { Pieza, PiezaDocument } from '../models/pieza.entity';
import { Auditoria, AuditoriaDocument } from '../models/auditoria.entity';
import { Conservacion, ConservacionDocument } from '../models/conservacion.entity';
import { Movimiento, MovimientoDocument } from '../models/movimiento.entity';
import { CrearPiezaDto } from '../dto/crear-pieza.dto';
import { ActualizarPiezaDto } from '../dto/actualizar-pieza.dto';
import { CrearConservacionDto } from '../dto/crear-conservacion.dto';
import { CrearMovimientoDto } from '../dto/crear-movimiento.dto';
import { ENTIDADES_AUDITORIA } from '../controllers/utils/constants';
import { buildPaginado } from '../controllers/utils/pagination';
import { subirImagenCloudinary } from '../config/cloudinary';

@Injectable()
export class PiezasService {
  constructor(
    @InjectModel(Pieza.name)         private readonly piezaModel: Model<PiezaDocument>,
    @InjectModel(Auditoria.name)     private readonly auditoriaModel: Model<AuditoriaDocument>,
    @InjectModel(Conservacion.name)  private readonly conservacionModel: Model<ConservacionDocument>,
    @InjectModel(Movimiento.name)     private readonly movimientoModel: Model<MovimientoDocument>,
  ) {}

  // T-011: registrar pieza con código único (HU-006)
  async crear(dto: CrearPiezaDto, files: Express.Multer.File[], idAccion: string) {
    if (await this.piezaModel.findOne({ codigoInventario: dto.codigoInventario })) {
      throw new ConflictException('Ya existe una pieza con ese código de inventario');
    }
    const urls = await Promise.all((files ?? []).map((f) => subirImagenCloudinary(f.buffer)));
    const pieza = await this.piezaModel.create({
      codigoInventario: dto.codigoInventario,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      origen: dto.origen,
      dimensiones: dto.dimensiones,
      anioAproximado: dto.anioAproximado,
      estadoConservacion: dto.estadoConservacion ?? 'Bueno',
      categoria: new Types.ObjectId(dto.idCategoria),
      ubicacion: new Types.ObjectId(dto.idUbicacion),
      imagenes: urls,
    });
    await this.auditar(idAccion, 'CREATE', String(pieza._id));
    return pieza.populate(['categoria', 'ubicacion']);
  }

  // T-013: listar con búsqueda, filtros y paginación de 20 (HU-007)
  async listar(pagina = 1, limite = 20, busqueda?: string, idCategoria?: string, idUbicacion?: string, estado?: string) {
    const filtro: Record<string, unknown> = {};
    if (busqueda) filtro.$or = [
      { nombre: { $regex: busqueda, $options: 'i' } },
      { codigoInventario: { $regex: busqueda, $options: 'i' } },
    ];
    if (idCategoria) filtro.categoria = new Types.ObjectId(idCategoria);
    if (idUbicacion) filtro.ubicacion = new Types.ObjectId(idUbicacion);
    if (estado) filtro.estado = estado;
    else filtro.estado = { $ne: 'Baja' };

    const skip = (pagina - 1) * limite;
    const [datos, total] = await Promise.all([
      this.piezaModel.find(filtro).populate(['categoria', 'ubicacion']).sort({ fechaIngreso: -1 }).skip(skip).limit(limite).exec(),
      this.piezaModel.countDocuments(filtro),
    ]);
    return buildPaginado(datos, total, pagina, limite);
  }

  // T-015: obtener detalle completo de una pieza (HU-008)
  async obtener(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Pieza ${id} no encontrada`);
    const p = await this.piezaModel.findById(id).populate(['categoria', 'ubicacion']).exec();
    if (!p) throw new NotFoundException(`Pieza ${id} no encontrada`);
    return p;
  }

  // T-017: actualizar pieza — código NO modificable (HU-009 CA-2)
  async actualizar(id: string, dto: ActualizarPiezaDto, files: Express.Multer.File[], idAccion: string) {
    const pieza = await this.obtener(id);
    if (dto.nombre              !== undefined) pieza.nombre              = dto.nombre;
    if (dto.descripcion         !== undefined) pieza.descripcion         = dto.descripcion;
    if (dto.origen              !== undefined) pieza.origen              = dto.origen;
    if (dto.dimensiones         !== undefined) pieza.dimensiones         = dto.dimensiones;
    if (dto.anioAproximado      !== undefined) pieza.anioAproximado      = dto.anioAproximado;
    if (dto.estadoConservacion  !== undefined) pieza.estadoConservacion  = dto.estadoConservacion;
    if (dto.idCategoria) pieza.categoria = new Types.ObjectId(dto.idCategoria);
    if (dto.idUbicacion) pieza.ubicacion = new Types.ObjectId(dto.idUbicacion);
    if (files && files.length > 0) {
      const nuevas = await Promise.all(files.map((f) => subirImagenCloudinary(f.buffer)));
      pieza.imagenes = [...(pieza.imagenes ?? []), ...nuevas];
    }
    await pieza.save();
    await this.auditar(idAccion, 'UPDATE', id);
    return pieza.populate(['categoria', 'ubicacion']);
  }

  // HU-006 baja lógica (solo Administrador)
  async darDeBaja(id: string, idAccion: string) {
    const pieza = await this.obtener(id);
    pieza.estado = 'Baja';
    await pieza.save();
    await this.auditar(idAccion, 'DELETE', id);
    return { mensaje: 'Pieza dada de baja' };
  }

  private async auditar(idUsuario: string, accion: string, idRegistro: string) {
    await this.auditoriaModel.create({ idUsuario, entidad: ENTIDADES_AUDITORIA.PIEZA, accion, idRegistro });
  }

  // estadísticas para el dashboard (HU-019, HU-020)
  async estadisticas() {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const [totalActivas, movimientosMes, porConservacion, alertas, porCategoria] =
      await Promise.all([
        this.piezaModel.countDocuments({ estado: { $ne: 'Baja' } }),
        this.movimientoModel.countDocuments({ fechaSalida: { $gte: inicioMes } }),
        this.piezaModel.aggregate([
          { $match: { estado: { $ne: 'Baja' } } },
          { $group: { _id: '$estadoConservacion', total: { $sum: 1 } } },
        ]),
        this.piezaModel
          .find({ estadoConservacion: { $in: ['Regular', 'Malo'] }, estado: { $ne: 'Baja' } })
          .populate('ubicacion', 'nombre')
          .select('codigoInventario nombre estadoConservacion ubicacion')
          .limit(10)
          .lean()
          .exec(),
        this.piezaModel.aggregate([
          { $match: { estado: { $ne: 'Baja' } } },
          { $group: { _id: '$categoria', total: { $sum: 1 } } },
          { $lookup: { from: 'categorias', localField: '_id', foreignField: '_id', as: 'cat' } },
          { $unwind: '$cat' },
          { $project: { nombre: '$cat.nombre', total: 1, _id: 0 } },
          { $sort: { total: -1 } },
          { $limit: 6 },
        ]),
      ]);

    const malEstado = porConservacion.find((p) => p._id === 'Malo')?.total ?? 0;

    // Normalizar _id de alertas a idPieza para el frontend
    const alertasNorm = alertas.map((a: any) => ({ ...a, idPieza: String(a._id) }));

    return { totalActivas, movimientosMes, malEstado, porConservacion, alertas: alertasNorm, porCategoria };
  }

  // reporte PDF inventario completo (HU-021)
  async reporteInventario(): Promise<Buffer> {
    const piezas = await this.piezaModel
      .find({ estado: { $ne: 'Baja' } })
      .populate('categoria', 'nombre')
      .populate('ubicacion', 'nombre')
      .sort({ codigoInventario: 1 })
      .lean()
      .exec();

    return pdfInventario(piezas);
  }

  // reporte PDF por estado de conservación (HU-022)
  async reporteConservacion(nivel?: string): Promise<Buffer> {
    const filtro: Record<string, unknown> = { estado: { $ne: 'Baja' } };
    if (nivel) filtro.estadoConservacion = nivel;

    const piezas = await this.piezaModel
      .find(filtro)
      .populate('categoria', 'nombre')
      .populate('ubicacion', 'nombre')
      .sort({ estadoConservacion: 1, codigoInventario: 1 })
      .lean()
      .exec();

    return pdfConservacion(piezas, nivel);
  }

  // conservación (HU-012)
  async crearConservacion(idPieza: string, dto: CrearConservacionDto, idUsuario: string) {
    if (!Types.ObjectId.isValid(idPieza)) throw new NotFoundException(`Pieza ${idPieza} no encontrada`);
    const pieza = await this.piezaModel.findById(idPieza).exec();
    if (!pieza) throw new NotFoundException(`Pieza ${idPieza} no encontrada`);
    
    const conservacion = await this.conservacionModel.create({
      idPieza: new Types.ObjectId(idPieza),
      nivel: dto.nivel,
      descripcion: dto.descripcion,
      registradoPor: new Types.ObjectId(idUsuario),
    });
    
    pieza.estadoConservacion = dto.nivel;
    await pieza.save();
    
    return conservacion.populate('registradoPor', 'nombres apellidos');
  }

  // historial de conservación (HU-013)
  async obtenerHistorialConservacion(idPieza: string) {
    if (!Types.ObjectId.isValid(idPieza)) throw new NotFoundException(`Pieza ${idPieza} no encontrada`);
    const registros = await this.conservacionModel
      .find({ idPieza: new Types.ObjectId(idPieza) })
      .populate('registradoPor', 'nombres apellidos')
      .sort({ fechaRegistro: -1 })
      .exec();
    return registros;
  }

  // registrar movimiento (HU-014)
  async crearMovimiento(idPieza: string, dto: CrearMovimientoDto, idUsuario: string) {
    if (!Types.ObjectId.isValid(idPieza)) throw new NotFoundException(`Pieza ${idPieza} no encontrada`);
    const pieza = await this.piezaModel.findById(idPieza).exec();
    if (!pieza) throw new NotFoundException(`Pieza ${idPieza} no encontrada`);

    const movimiento = await this.movimientoModel.create({
      idPieza:          new Types.ObjectId(idPieza),
      tipoMovimiento:   dto.tipoMovimiento,
      ubicacionOrigen:  pieza.ubicacion,
      ubicacionDestino: new Types.ObjectId(dto.idUbicacionDestino),
      fechaSalida:      new Date(dto.fechaSalida),
      motivo:           dto.motivo,
      responsable:      dto.responsable,
      registradoPor:    new Types.ObjectId(idUsuario),
    });

    pieza.ubicacion = new Types.ObjectId(dto.idUbicacionDestino);
    await pieza.save();
    await this.auditar(idUsuario, 'CREATE', String(movimiento._id));
    return movimiento.populate(['ubicacionOrigen', 'ubicacionDestino', 'registradoPor']);
  }

  // historial de trazabilidad (HU-015)
  async historialMovimientos(idPieza: string) {
    if (!Types.ObjectId.isValid(idPieza)) throw new NotFoundException(`Pieza ${idPieza} no encontrada`);
    return this.movimientoModel
      .find({ idPieza: new Types.ObjectId(idPieza) })
      .populate('ubicacionOrigen', 'nombre')
      .populate('ubicacionDestino', 'nombre')
      .populate('registradoPor', 'nombres apellidos')
      .sort({ fechaSalida: -1 })
      .exec();
  }

  // movimientos recientes globales (HU-016)
  async listarMovimientos(pagina = 1, limite = 20, desde?: string, hasta?: string) {
    const filtro: Record<string, unknown> = {};
    if (desde || hasta) {
      filtro.fechaSalida = {};
      if (desde) (filtro.fechaSalida as Record<string, unknown>).$gte = new Date(desde);
      if (hasta) (filtro.fechaSalida as Record<string, unknown>).$lte = new Date(hasta);
    }
    const skip = (pagina - 1) * limite;
    const [datos, total] = await Promise.all([
      this.movimientoModel
        .find(filtro)
        .populate('idPieza', 'nombre codigoInventario')
        .populate('ubicacionOrigen', 'nombre')
        .populate('ubicacionDestino', 'nombre')
        .sort({ fechaSalida: -1 })
        .skip(skip)
        .limit(limite)
        .exec(),
      this.movimientoModel.countDocuments(filtro),
    ]);
    return buildPaginado(datos, total, pagina, limite);
  }
}

