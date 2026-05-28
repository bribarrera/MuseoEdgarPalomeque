// models/auditoria.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditoriaDocument = Auditoria & Document;

@Schema({ collection: 'auditorias', toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.__v; return ret; } } })
export class Auditoria {
  @Prop({ required: true })
  idUsuario: string;

  @Prop({ required: true, maxlength: 100 })
  entidad: string;

  @Prop({ required: true, maxlength: 50 })
  accion: string;

  @Prop()
  idRegistro?: string;

  @Prop()
  detalle?: string;

  @Prop({ default: Date.now })
  fechaEvento: Date;

  @Prop({ maxlength: 45 })
  ipOrigen?: string;
}

export const AuditoriaSchema = SchemaFactory.createForClass(Auditoria);
