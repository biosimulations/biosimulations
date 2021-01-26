/**
 * @file  The main file to run the server. Largley based on the template. Contains the express middlewares that need to be loaded such as CORS. Also provides the Open API document base that is filled in by the NestJS/swagger module.
 * @author Bilal Shaikh
 * @author Akhil Marupilla
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';

async function bootstrap() {
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
      'https://biosimulations.dev',
      'https://biosimulations.org',
      'https://run.biosimulations.dev',
      'https://run.biosimulations.org',
    ];
    const allow = allowedOrigins.includes(requestOrigin);
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });
  const favIcon =
    'https://github.com/biosimulations/Biosimulations/raw/dev/biosimulations/libs/shared/assets/src/assets/icons/favicon-32x32.png';
  const removeIcon = ' .swagger-ui .topbar { display: none }';
  // Swagger doc
  const tags = [
    {
      name: 'Simulation Runs',
      description:
        'Operations for submitting a Simulation Run, checking its status, modifying details, and canceling the run.',
    },
    {
      name: 'Results',
      description:
        ' Operations for viewing and retrieving the results of a Simulation Run',
    },
  ];
  const builder = new DocumentBuilder()
    .setTitle('runBioSimulations API')
    .setDescription(
      'API to submit and manage simulations jobs to the runBioSimulations service',
    )
    .setVersion('0.1')
    .setLicense(
      'MIT License',
      'https://github.com/biosimulations/Biosimulations/blob/dev/LICENSE',
    )
    .setTermsOfService('https://run.biosimulations.org/help/terms')
    .setExternalDoc(
      'API specifications (Open API JSON)',
      'https://run.api.biosimulations.org/openapi.json',
    )
    .setContact(
      'runBioSimulations Team',
      'https://run.biosimulations.org/help/about',
      'info@biosimulations.org',
    );

  for (const tag of tags) {
    builder.addTag(tag.name, tag.description);
  }

  const scopes = [
    'read:SimulationRuns',
    'write:SimulationRuns',
    'delete:SimulationsRuns',
  ];
  const authorizationUrl =
    'https://auth.biosimulations.org/authorize?audience=dispatch.biosimulations.org';
  const openIdConnectUrl =
    'https://auth.biosimulations.org/.well-known/openid-configuration';
  const clientId = 'pMatIe0TqLPbnXBn6gcDjdjnpIrlKG3a';

  const oauthSchema: SecuritySchemeObject = {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl: authorizationUrl,
        scopes: scopes,
      },
    },
  };

  builder.addOAuth2(oauthSchema);

  const openIDSchema: SecuritySchemeObject = {
    type: 'openIdConnect',
    openIdConnectUrl: openIdConnectUrl,
  };

  builder.addSecurity('OpenIdc', openIDSchema);

  const options = builder.build();
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

  SwaggerModule.setup('', app, document, {
    customfavIcon: favIcon,
    customSiteTitle: 'runBioSimulations API',
    customCss: removeIcon,
    swaggerOptions: {
      oauth: {
        clientId: 'pMatIe0TqLPbnXBn6gcDjdjnpIrlKG3a',
      },
      //tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/openapi.json', (req, res) => res.json(document));

  // const resolver = new Resolver();
  // const resolvedDocument = await resolver.resolve(document);
  // const schema = resolvedDocument.result.components.schemas.CombineArchiveLog;
  // httpAdapter.get('/schema/CombineArchiveLog.json', (req, res) => res.json(toJsonSchema(schema)));

  const configService = app.get(ConfigService);
  const limit = configService.get('server.limit');
  app.use(json({ limit }));

  await app.listen(port, () => {
    logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
