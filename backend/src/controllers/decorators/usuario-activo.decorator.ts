// decorators/usuario-activo.decorator.ts — extrae el usuario del JWT en el controlador
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActivo = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user; // { idUsuario, email, rol }
  },
);
