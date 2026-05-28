// Punto de entrada – NestJS (Sprint 1)
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureCloudinary } from './config/cloudinary';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inicializar Cloudinary con las variables de entorno
  configureCloudinary();

  // RNF-04: validación automática de DTOs en todas las rutas
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}/api`);
}
bootstrap();
