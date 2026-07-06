// models/rol.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RolDocument = Rol & Document;

@Schema({
  collection: 'roles',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.idRol = ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Rol {
  @Prop({ required: true, maxlength: 50 })
  nombre: string;

  @Prop({ maxlength: 255 })
  descripcion?: string;

  @Prop({ default: 0 })
  orden: number;

  @Prop({ default: true })
  estado: boolean;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
