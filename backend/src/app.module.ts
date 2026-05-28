// Módulo raíz – registra conexión MongoDB y módulos del Sprint 1 y Sprint 2
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth.module';
import { UsuariosModule } from './modules/usuarios.module';
import { PiezasModule } from './modules/piezas.module';
import { AuditoriasModule } from './modules/auditorias.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión MongoDB con MONGODB_URI del .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGODB_URI'),
      }),
    }),

    // Sprint 1: autenticación y gestión de usuarios
    AuthModule,
    UsuariosModule,

    // Sprint 2: inventario de piezas etnográficas
    PiezasModule,

    // Sprint 6: auditoría (HU-023)
    AuditoriasModule,
  ],
})
export class AppModule {}
