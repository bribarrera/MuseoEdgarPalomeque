// models/categoria.entity.ts — Sprint 2 (HU-006)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoriaDocument = Categoria & Document;

@Schema({
  collection: 'categorias',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.idCategoria = ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Categoria {
  @Prop({ required: true, unique: true, maxlength: 100 })
  nombre: string;

  @Prop({ maxlength: 255 })
  descripcion?: string;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
