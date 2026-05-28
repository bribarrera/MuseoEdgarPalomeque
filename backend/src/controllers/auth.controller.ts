// controllers/auth.controller.ts — endpoints de sesión (HU-001, HU-002)
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsuarioActivo } from './decorators/usuario-activo.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login — HU-001
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST /api/auth/logout — HU-002
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@UsuarioActivo() user: { idUsuario: string }) {
    return this.authService.logout(user.idUsuario);
  }
}
