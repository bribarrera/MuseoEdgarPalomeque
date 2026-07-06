// models/ubicacion.entity.ts — Sprint 2 (HU-007)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UbicacionDocument = Ubicacion & Document;

@Schema({
  collection: 'ubicaciones',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.idUbicacion = ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Ubicacion {
  @Prop({ required: true, unique: true, maxlength: 100 })
  nombre: string;

  @Prop({ maxlength: 255 })
  descripcion?: string;
}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);
