import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../backend/src/app.module';
import { configureCloudinary } from '../backend/src/config/cloudinary';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    configureCloudinary();
    app.enableCors({ origin: '*', credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api');
    await app.init();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  const nestApp = await bootstrap();
  nestApp.getHttpAdapter().getInstance()(req, res);
}
