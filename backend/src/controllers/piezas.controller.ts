// controllers/piezas.controller.ts — endpoints de inventario (HU-006…022)
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, UploadedFiles, UseGuards, UseInterceptors, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StreamableFile } from '@nestjs/common';
import { PiezasService } from '../services/piezas.service';
import { CrearPiezaDto } from '../dto/crear-pieza.dto';
import { ActualizarPiezaDto } from '../dto/actualizar-pieza.dto';
import { CrearConservacionDto } from '../dto/crear-conservacion.dto';
import { CrearMovimientoDto } from '../dto/crear-movimiento.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { RolEnum } from '../common/rol.enum';
import { UsuarioActivo } from './decorators/usuario-activo.decorator';

const uploadStorage = memoryStorage();

@UseGuards(JwtAuthGuard)
@Controller('piezas')
export class PiezasController {
  constructor(private readonly piezasService: PiezasService) {}

  // Listar piezas con filtros y paginación — HU-007
  @Get()
  listar(
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina = 1,
    @Query('limite', new ParseIntPipe({ optional: true })) limite = 20,
    @Query('busqueda') busqueda?: string,
    @Query('idCategoria') idCategoria?: string,
    @Query('idUbicacion') idUbicacion?: string,
    @Query('estado') estado?: string,
  ) {
    return this.piezasService.listar(pagina, limite, busqueda, idCategoria, idUbicacion, estado);
  }

  // Listar movimientos globales con filtro de fechas — HU-016
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Get('movimientos')
  listarMovimientos(
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina = 1,
    @Query('limite', new ParseIntPipe({ optional: true })) limite = 20,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.piezasService.listarMovimientos(pagina, limite, desde, hasta);
  }

  // estadísticas del dashboard (HU-019, HU-020)
  @Get('estadisticas')
  estadisticas() {
    return this.piezasService.estadisticas();
  }

  // reporte inventario completo en PDF (HU-021)
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Get('reporte/inventario')
  async reporteInventario(@Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const buffer = await this.piezasService.reporteInventario();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="inventario_${new Date().toISOString().slice(0, 10)}.pdf"`,
    });
    return new StreamableFile(buffer);
  }

  // reporte por estado de conservación en PDF (HU-022)
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Get('reporte/conservacion')
  async reporteConservacion(
    @Query('nivel') nivel: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.piezasService.reporteConservacion(nivel);
    const suffix = nivel ? `_${nivel.toLowerCase()}` : '_todos';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="conservacion${suffix}_${new Date().toISOString().slice(0, 10)}.pdf"`,
    });
    return new StreamableFile(buffer);
  }

  // Obtener detalle de una pieza — HU-008
  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.piezasService.obtener(id);
  }

  // Registrar pieza — HU-006
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Post()
  @UseInterceptors(FilesInterceptor('imagenes', 10, { storage: uploadStorage }))
  crear(
    @Body() dto: CrearPiezaDto,
    @UploadedFiles() files: Express.Multer.File[],
    @UsuarioActivo() user: { idUsuario: string },
  ) {
    return this.piezasService.crear(dto, files, user.idUsuario);
  }

  // Actualizar pieza — HU-009
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('imagenes', 10, { storage: uploadStorage }))
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarPiezaDto,
    @UploadedFiles() files: Express.Multer.File[],
    @UsuarioActivo() user: { idUsuario: string },
  ) {
    return this.piezasService.actualizar(id, dto, files, user.idUsuario);
  }

  // Dar de baja — HU-011
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR)
  @Delete(':id')
  darDeBaja(@Param('id') id: string, @UsuarioActivo() user: { idUsuario: string }) {
    return this.piezasService.darDeBaja(id, user.idUsuario);
  }

  // Registrar estado de conservación — HU-012
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Post(':id/conservacion')
  crearConservacion(
    @Param('id') id: string,
    @Body() dto: CrearConservacionDto,
    @UsuarioActivo() user: { idUsuario: string },
  ) {
    return this.piezasService.crearConservacion(id, dto, user.idUsuario);
  }

  // Historial de conservación — HU-013
  @Get(':id/conservacion')
  obtenerHistorialConservacion(@Param('id') id: string) {
    return this.piezasService.obtenerHistorialConservacion(id);
  }

  // Registrar movimiento — HU-014
  @UseGuards(RolesGuard) @Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)
  @Post(':id/movimientos')
  crearMovimiento(
    @Param('id') id: string,
    @Body() dto: CrearMovimientoDto,
    @UsuarioActivo() user: { idUsuario: string },
  ) {
    return this.piezasService.crearMovimiento(id, dto, user.idUsuario);
  }

  // Historial de movimientos — HU-015
  @Get(':id/movimientos')
  historialMovimientos(@Param('id') id: string) {
    return this.piezasService.historialMovimientos(id);
  }
}
