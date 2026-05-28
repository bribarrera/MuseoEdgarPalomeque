// movimiento.entity.ts — Trazabilidad de piezas (HU-014, HU-015, HU-016)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MovimientoDocument = Movimiento & Document;

@Schema({ timestamps: true })
export class Movimiento {
  @Prop({ type: Types.ObjectId, ref: 'Pieza', required: true })
  idPieza: Types.ObjectId;

  @Prop({ required: true, enum: ['Préstamo', 'Traslado', 'Exposición', 'Restauración', 'Devolución'] })
  tipoMovimiento: string;

  @Prop({ type: Types.ObjectId, ref: 'Ubicacion', required: true })
  ubicacionOrigen: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ubicacion', required: true })
  ubicacionDestino: Types.ObjectId;

  @Prop({ required: true })
  fechaSalida: Date;

  @Prop({ required: true, maxlength: 500 })
  motivo: string;

  @Prop({ required: true, maxlength: 200 })
  responsable: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  registradoPor: Types.ObjectId;
}

export const MovimientoSchema = SchemaFactory.createForClass(Movimiento);
