// Módulo Piezas — Sprint 2-4 (HU-006…017)
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Pieza, PiezaSchema } from '../models/pieza.entity';
import { Categoria, CategoriaSchema } from '../models/categoria.entity';
import { Ubicacion, UbicacionSchema } from '../models/ubicacion.entity';
import { Auditoria, AuditoriaSchema } from '../models/auditoria.entity';
import { Conservacion, ConservacionSchema } from '../models/conservacion.entity';
import { Movimiento, MovimientoSchema } from '../models/movimiento.entity';
import { PiezasController } from '../controllers/piezas.controller';
import { CategoriasController } from '../controllers/categorias.controller';
import { UbicacionesController } from '../controllers/ubicaciones.controller';
import { PiezasService } from '../services/piezas.service';
import { CategoriasService } from '../services/categorias.service';
import { UbicacionesService } from '../services/ubicaciones.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pieza.name,         schema: PiezaSchema },
      { name: Categoria.name,     schema: CategoriaSchema },
      { name: Ubicacion.name,     schema: UbicacionSchema },
      { name: Auditoria.name,     schema: AuditoriaSchema },
      { name: Conservacion.name,  schema: ConservacionSchema },
      { name: Movimiento.name,     schema: MovimientoSchema },
    ]),
    MulterModule.register({ dest: './uploads/piezas' }),
  ],
  controllers: [PiezasController, CategoriasController, UbicacionesController],
  providers: [PiezasService, CategoriasService, UbicacionesService],
})
export class PiezasModule {}
