/**
 * @file  The main file to run the server. Largley based on the template. Contains the express middlewares that need to be loaded such as CORS. Also provides the Open API document base that is filled in by the NestJS/swagger module.
 * @author Bilal Shaikh
 * @author Akhil Marupilla
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import { setupOpenApi } from './openApi';
import { BiosimulationsValidationExceptionFactory } from '@biosimulations/shared/exceptions';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
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
      'http://127.0.0.1:4201',
      'http://127.0.0.1:4202',
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:4202',
      'http://localhost:4203',
      'https://biosimulations.dev',
      'https://biosimulations.org',
      'https://patch.biosimulations.dev',
      'https://patch.biosimulations.org',
      'https://run.biosimulations.dev',
      'https://run.biosimulations.org',
      'https://biosimulators.org',
      'https://biosimulators.dev',
      'https://bio.libretexts.org', // Libre text
      'https://vega.github.io', // Vega editor
      'http://idl.cs.washington.edu', // Lyra Vega visual editor
    ];
    const allow = allowedOrigins.includes(requestOrigin);
    if (!allow) {
      logger.error('Origin not allowed: ' + requestOrigin);
    }
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });

  const configService = app.get(ConfigService);
  const limit = configService.get('server.limit');
  app.use(json({ limit }));

  setupOpenApi(app);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: BiosimulationsValidationExceptionFactory,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(port, () => {
    logger.log('Listening at http://localhost:' + port);
  });
}
bootstrap();
