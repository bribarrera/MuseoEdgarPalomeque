// models/usuario.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({
  collection: 'usuarios',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      ret.idUsuario = ret._id;
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    },
  },
})
export class Usuario {
  @Prop({ required: true, maxlength: 100 })
  nombres: string;

  @Prop({ required: true, maxlength: 100 })
  apellidos: string;

  @Prop({ required: true, unique: true, maxlength: 150 })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ type: Types.ObjectId, ref: 'Rol', required: true })
  rol: Types.ObjectId;

  @Prop({ default: true })
  estado: boolean;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop()
  ultimoAcceso?: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
