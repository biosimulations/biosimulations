/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
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
    .setLicense(
      'MIT License',
      'https://github.com/biosimulations/Biosimulations/blob/dev/LICENSE',
    )
    .setTermsOfService('https://biosimulations.org/help/terms')
    .setExternalDoc(
      'API specifications (Open API JSON)',
      'https://account.api.biosimulations.org/openapi.json',
    )
    .setContact(
      'BioSimulations Team',
      'https://biosimulations.org/help/about',
      'info@biosimulations.org',
    )
    .addSecurity('OpenIdc', openIDSchema)
    .addOAuth2(oauthSchema)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const components = document.components as any;
  const unsortedSchemas = components.schemas;
  if (unsortedSchemas) {
    const schemaNames = Object.keys(unsortedSchemas).sort();

    const schemas: { [name: string]: any } = {};
    for (const schemaName of schemaNames) {
      schemas[schemaName] = unsortedSchemas?.[schemaName];
    }
    components.schemas = schemas;
  }

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'BioSimulations accounts API documentation',
    swaggerOptions: {
      // oauth: {
      //   clientId: clientId,
      // },
      //tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customfavIcon:
      'https://github.com/biosimulations/Biosimulations/raw/dev/libs/shared/assets/src/assets/icons/favicon-32x32.png',
    customCssUrl: 'https://static.biosimulations.org/stylesheets/biosimulations_swagger.css',
  };

  SwaggerModule.setup('', app, document, customOptions);

  return document;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const document = setupOpenApi(app);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/openapi.json', (req, res) => res.json(document));

  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
  });
}

bootstrap();
