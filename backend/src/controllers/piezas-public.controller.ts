// controllers/piezas-public.controller.ts — endpoints públicos de piezas (sin JWT)
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PiezasService } from '../services/piezas.service';

@Controller('piezas/public')
export class PiezasPublicController {
  constructor(private readonly piezasService: PiezasService) {}

  // GET /api/piezas/public/:id — Obtener pieza sin autenticación
  @Get(':id')
  async obtenerPublico(@Param('id') id: string) {
    return this.piezasService.obtener(id);
  }

  // GET /api/piezas/public/:id/qr — Generar QR de la pieza (retorna PNG)
  @Get(':id/qr')
  async generarQR(@Param('id') id: string, @Res() res: Response) {
    try {
      const QRCode = await import('qrcode');
      const urlQR = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/piezas/public/${id}`;
      const qrImage = await QRCode.toDataURL(urlQR, { width: 300, margin: 2 });

      // Retorna como data URL para que el frontend lo pueda descargar
      res.setHeader('Content-Type', 'application/json');
      res.json({ qr: qrImage, url: urlQR });
    } catch (error) {
      res.status(500).json({ error: 'Error al generar QR' });
    }
  }
}
