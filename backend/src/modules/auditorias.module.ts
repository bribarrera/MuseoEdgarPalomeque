// Módulo Auditorías — HU-023
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auditoria, AuditoriaSchema } from '../models/auditoria.entity';
import { AuditoriasController } from '../controllers/auditorias.controller';
import { AuditoriasService } from '../services/auditorias.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auditoria.name, schema: AuditoriaSchema },
    ]),
  ],
  controllers: [AuditoriasController],
  providers: [AuditoriasService],
})
export class AuditoriasModule {}
