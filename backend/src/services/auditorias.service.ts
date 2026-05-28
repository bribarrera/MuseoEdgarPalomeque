// services/auditorias.service.ts — HU-023: consultar registro de auditoría
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auditoria, AuditoriaDocument } from '../models/auditoria.entity';
import { buildPaginado } from '../controllers/utils/pagination';

@Injectable()
export class AuditoriasService {
  constructor(
    @InjectModel(Auditoria.name) private readonly auditoriaModel: Model<AuditoriaDocument>,
  ) {}

  // T-055: listar auditoría con filtros y resolución de nombre de usuario (HU-023)
  async listar(pagina = 1, limite = 20, desde?: string, hasta?: string, entidad?: string, accion?: string) {
    const match: Record<string, unknown> = {};

    if (desde || hasta) {
      match.fechaEvento = {} as Record<string, unknown>;
      if (desde) (match.fechaEvento as Record<string, unknown>).$gte = new Date(desde);
      if (hasta) {
        const fin = new Date(hasta);
        fin.setHours(23, 59, 59, 999);
        (match.fechaEvento as Record<string, unknown>).$lte = fin;
      }
    }
    if (entidad) match.entidad = entidad;
    if (accion)  match.accion  = accion;

    const skip = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.auditoriaModel.aggregate([
        { $match: match },
        { $sort: { fechaEvento: -1 } },
        { $skip: skip },
        { $limit: limite },
        {
          $lookup: {
            from: 'usuarios',
            let: { uid: { $toObjectId: '$idUsuario' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
              { $project: { nombres: 1, apellidos: 1 } },
            ],
            as: 'usuarioData',
          },
        },
        {
          $addFields: {
            nombreUsuario: {
              $cond: {
                if: { $gt: [{ $size: '$usuarioData' }, 0] },
                then: {
                  $concat: [
                    { $arrayElemAt: ['$usuarioData.nombres', 0] },
                    ' ',
                    { $arrayElemAt: ['$usuarioData.apellidos', 0] },
                  ],
                },
                else: 'Usuario eliminado',
              },
            },
          },
        },
        { $project: { usuarioData: 0, __v: 0 } },
      ]),
      this.auditoriaModel.countDocuments(match),
    ]);

    return buildPaginado(datos, total, pagina, limite);
  }
}
