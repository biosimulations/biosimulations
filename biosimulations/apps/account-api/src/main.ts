/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
function setupOpenApi(app: INestApplication) {
  // TODO abstract this to shared library
  const oauthSchema: SecuritySchemeObject = {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl:
          'https://auth.biosimulations.org/authorize?audience=account.biosimulations.org',
        scopes: [],
      },
    },
  };

  const openIDSchema: SecuritySchemeObject = {
    type: 'openIdConnect',
    openIdConnectUrl:
      'https://auth.biosimulations.org/.well-known/openid-configuration',
  };
  const options = new DocumentBuilder()
    .setTitle('BioSimulations accounts API')
    .setDescription('The API to manage user accounts')
    .setVersion('0.1')
    .setContact('BioSimulations Team', 'https://biosimulations.org/help/about', 'info@biosimulations.org')
    .addSecurity('OpenIdc', openIDSchema)
    .addOAuth2(oauthSchema)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  setupOpenApi(app);

  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
  });
}

bootstrap();
