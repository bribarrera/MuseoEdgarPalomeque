// controllers/ubicaciones.controller.ts — endpoints de Ubicaciones (HU-007 · T-011)
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UbicacionesService } from '../services/ubicaciones.service';
import { CrearUbicacionDto } from '../dto/crear-ubicacion.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { RolEnum } from '../common/rol.enum';
import { UsuarioActivo } from './decorators/usuario-activo.decorator';

@UseGuards(JwtAuthGuard)
@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  // GET /api/ubicaciones — todos los roles
  @Get()
  listar() {
    return this.ubicacionesService.listar();
  }

  // POST /api/ubicaciones — solo Administrador
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR)
  @Post()
  crear(@Body() dto: CrearUbicacionDto, @UsuarioActivo() user: { idUsuario: string }) {
    return this.ubicacionesService.crear(dto, user.idUsuario);
  }

  // PATCH /api/ubicaciones/:id — solo Administrador
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: CrearUbicacionDto, @UsuarioActivo() user: { idUsuario: string }) {
    return this.ubicacionesService.actualizar(id, dto, user.idUsuario);
  }
}
