import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from '../src/app.module';
import { configureCloudinary } from '../src/config/cloudinary';

const server = express();
let initialized = false;

async function bootstrap() {
  if (initialized) return;
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { logger: false });
  configureCloudinary();
  app.enableCors({ origin: process.env.FRONTEND_URL || '*', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api');
  await app.init();
  initialized = true;
}

export default async function handler(req: express.Request, res: express.Response) {
  await bootstrap();
  server(req, res);
}
