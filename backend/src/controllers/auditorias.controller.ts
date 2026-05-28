// controllers/auditorias.controller.ts — HU-023: registro de auditoría (solo Administrador)
import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuditoriasService } from '../services/auditorias.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { RolEnum } from '../common/rol.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolEnum.ADMINISTRADOR)
@Controller('auditorias')
export class AuditoriasController {
  constructor(private readonly auditoriasService: AuditoriasService) {}

  // T-055: consultar auditoría con filtros — HU-023
  @Get()
  listar(
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina = 1,
    @Query('limite', new ParseIntPipe({ optional: true })) limite = 20,
    @Query('desde')   desde?: string,
    @Query('hasta')   hasta?: string,
    @Query('entidad') entidad?: string,
    @Query('accion')  accion?: string,
  ) {
    return this.auditoriasService.listar(pagina, limite, desde, hasta, entidad, accion);
  }
}
