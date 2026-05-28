// Estrategia JWT: extrae y valida el token en cada petición (RNF-03)
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  // Payload disponible en req.user para guards y controladores
  validate(payload: { sub: string; email: string; rol: string }) {
    return { idUsuario: payload.sub, email: payload.email, rol: payload.rol };
  }
}
