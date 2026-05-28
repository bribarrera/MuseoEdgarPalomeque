// Módulo Usuarios – Sprint 1 (HU-003, HU-004, HU-005)
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from '../controllers/usuarios.controller';
import { RolesController } from '../controllers/roles.controller';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario, UsuarioSchema } from '../models/usuario.entity';
import { Rol, RolSchema } from '../models/rol.entity';
import { Auditoria, AuditoriaSchema } from '../models/auditoria.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Rol.name, schema: RolSchema },
      { name: Auditoria.name, schema: AuditoriaSchema },
    ]),
  ],
  controllers: [UsuariosController, RolesController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
