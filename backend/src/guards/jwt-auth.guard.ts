// Guard: protege rutas que requieren JWT válido (RNF-03 · Sprint 1)
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
