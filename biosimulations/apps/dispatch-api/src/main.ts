import { swaggerMaterialCss } from './app/swagger/swagger-theme';
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { createDocument } from './app/swagger/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT || 3333;

  // TODO intelligently allow origin based on production mode, abstract this
  const allowOrigin: CustomOrigin = (
    requestOrigin: string,
    callback: (err: Error | null, allow?: boolean | undefined) => void,
  ) => {
    if (!requestOrigin) {
      callback(null, true);
      return;
    }
    const allowedOrigins = [
      'http://127.0.0.1:4200',
      'http://localhost:4200',
      'https://biosimulations.dev',
      'https://biosimulations.org',
      'https://api.biosimulations.dev',
      'https://api.biosimulations.org',
      'https://submit.biosimulations.dev',
    ];
    console.log(requestOrigin);
    const allow = allowedOrigins.includes(requestOrigin);
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  SwaggerModule.setup('', app, createDocument(app), {
    customCss: swaggerMaterialCss
  });
  
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
