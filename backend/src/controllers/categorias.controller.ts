// controllers/categorias.controller.ts — endpoints de Categorías (HU-006 · T-011)
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriasService } from '../services/categorias.service';
import { CrearCategoriaDto } from '../dto/crear-categoria.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { RolEnum } from '../common/rol.enum';
import { UsuarioActivo } from './decorators/usuario-activo.decorator';

@UseGuards(JwtAuthGuard)
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // GET /api/categorias — todos los roles
  @Get()
  listar() {
    return this.categoriasService.listar();
  }

  // POST /api/categorias — solo Administrador
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR)
  @Post()
  crear(@Body() dto: CrearCategoriaDto, @UsuarioActivo() user: { idUsuario: string }) {
    return this.categoriasService.crear(dto, user.idUsuario);
  }

  // PATCH /api/categorias/:id — solo Administrador
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: CrearCategoriaDto, @UsuarioActivo() user: { idUsuario: string }) {
    return this.categoriasService.actualizar(id, dto, user.idUsuario);
  }
}
