// models/pieza.entity.ts — Sprint 2 (HU-006…009)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PiezaDocument = Pieza & Document;

@Schema({
  collection: 'piezas',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      ret.idPieza = ret._id;
      // combina imagen legado con el arreglo imagenes para retro-compatibilidad
      const legacy = ret.imagen ? [ret.imagen] : [];
      ret.imagenes = [...legacy, ...(ret.imagenes ?? [])];
      delete ret.imagen;
      delete ret.__v;
      return ret;
    },
  },
})
export class Pieza {
  @Prop({ required: true, unique: true, maxlength: 50 })
  codigoInventario: string;

  @Prop({ required: true, maxlength: 200 })
  nombre: string;

  @Prop({ required: true, maxlength: 1000 })
  descripcion: string;

  @Prop({ required: true, maxlength: 200 })
  origen: string;

  @Prop({ required: true, maxlength: 200 })
  dimensiones: string;

  @Prop({ maxlength: 20 })
  anioAproximado?: string;

  @Prop({ default: 'Activa', maxlength: 20 })
  estado: string;

  @Prop({ default: 'Bueno', maxlength: 50 })
  estadoConservacion: string;

  @Prop({ type: Types.ObjectId, ref: 'Categoria', required: true })
  categoria: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ubicacion', required: true })
  ubicacion: Types.ObjectId;

  @Prop({ default: Date.now })
  fechaIngreso: Date;

  @Prop()
  imagen?: string; // campo legado — mantiene compatibilidad con registros anteriores

  @Prop({ type: [String], default: [] })
  imagenes: string[];
}

export const PiezaSchema = SchemaFactory.createForClass(Pieza);
