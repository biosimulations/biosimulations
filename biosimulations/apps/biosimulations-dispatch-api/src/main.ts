/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
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
    ];
    console.log(requestOrigin);
    const allow = allowedOrigins.includes(requestOrigin);
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });

  // Swagger doc
  const options = new DocumentBuilder()
    .setTitle('Simulation dispatch example')
    .setDescription('Dispatch API allows dispatching of simulation jobs to UConn HPC')
    .setVersion('1.0')
    .addTag('dispatch')
    // .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);


  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
  
}

bootstrap();
