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
  const logger = new Logger('bootstrap');
  const port = process.env.PORT || 3333;

  // TODO intelligently allow origin based on production mode, abstract this
  const allowOrigin: CustomOrigin = (
    requestOrigin: string,
    callback: (err: Error | null, allow?: boolean | undefined) => void
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
      'https://biosimulations.dev',
      'https://biosimulations.org',
      'https://run.biosimulations.dev',
      'https://run.biosimulations.org',
    ];
    // console.log(requestOrigin);
    const allow = allowedOrigins.includes(requestOrigin);
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });
  const favIcon =
    'https://github.com/biosimulations/Biosimulations/raw/dev/biosimulations/libs/shared/assets/src/assets/icons/favicon-32x32.png';
  const removeIcon = ' .swagger-ui .topbar { display: none }';
  // Swagger doc
  const tags = ['Dispatch', 'Simulators', 'Database'];
  const builder = new DocumentBuilder()
    .setTitle('Simulation dispatch')
    .setDescription(
      'Dispatch API allows dispatching of simulation jobs to UConn HPC'
    )
    .setVersion('0.1');
  for (const tag of tags) {
    builder.addTag(tag);
  }
  const options = builder.build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document, {
    customfavIcon: favIcon,
    customSiteTitle: 'Dispatch API BioSimulations',
    customCss: removeIcon,
  });

  await app.listen(port, () => {
    logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
