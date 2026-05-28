// controllers/roles.controller.ts — GET /roles (para poblar selects en el frontend)
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rol, RolDocument } from '../models/rol.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>) {}

  @Get()
  listar() {
    return this.rolModel.find({ estado: true }).sort({ orden: 1 }).exec();
  }
}
