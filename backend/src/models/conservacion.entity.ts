// conservacion.entity.ts — Estado de conservación de piezas (HU-012, HU-013)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConservacionDocument = Conservacion & Document;

@Schema({ timestamps: true })
export class Conservacion {
  @Prop({ type: Types.ObjectId, ref: 'Pieza', required: true }) idPieza: Types.ObjectId;
  @Prop({ required: true, enum: ['Excelente', 'Bueno', 'Regular', 'Malo'] }) nivel: string;
  @Prop({ required: true }) descripcion: string;
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true }) registradoPor: Types.ObjectId;
  @Prop({ default: Date.now }) fechaRegistro: Date;
}

export const ConservacionSchema = SchemaFactory.createForClass(Conservacion);
