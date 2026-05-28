// controllers/usuarios.controller.ts — endpoints CRUD de usuarios (HU-003…005)
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { RolEnum } from '../common/rol.enum';
import { UsuarioActivo } from './decorators/usuario-activo.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolEnum.ADMINISTRADOR)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // POST /api/usuarios — HU-003
  @Post()
  crear(@Body() dto: CrearUsuarioDto, @UsuarioActivo() user: { idUsuario: string }) {
    return this.usuariosService.crear(dto, user.idUsuario);
  }

  // GET /api/usuarios?pagina=1&limite=10 — HU-004
  @Get()
  listar(
    @Query('pagina', ParseIntPipe) pagina = 1,
    @Query('limite', ParseIntPipe) limite = 10,
  ) {
    return this.usuariosService.listar(pagina, limite);
  }

  // GET /api/usuarios/:id — HU-004
  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.usuariosService.obtener(id);
  }

  // PATCH /api/usuarios/:id — HU-005
  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarUsuarioDto,
    @UsuarioActivo() user: { idUsuario: string },
  ) {
    return this.usuariosService.actualizar(id, dto, user.idUsuario);
  }

  // DELETE /api/usuarios/:id — HU-005 (baja lógica)
  @Delete(':id')
  desactivar(@Param('id') id: string, @UsuarioActivo() user: { idUsuario: string }) {
    return this.usuariosService.desactivar(id, user.idUsuario);
  }
}
