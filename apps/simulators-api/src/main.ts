/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import {
  ScopesObject,
  SecuritySchemeObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Resolver } from '@stoplight/json-ref-resolver';
import * as toJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import { json } from 'body-parser';
import { BiosimulationsValidationExceptionFactory } from '@biosimulations/shared/exceptions';

function setupOpenApi(
  app: INestApplication,
  documentBuilder: DocumentBuilder,
  authorizationUrl?: string,
  openIdConnectUrl?: string,
  clientId?: string,
  scopes?: ScopesObject,
  uiPath = '',
) {
  if (!scopes) {
    scopes = {};
  }
  const oauthSchema: SecuritySchemeObject = {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl: authorizationUrl,
        scopes: scopes,
      },
    },
  };
  if (authorizationUrl) {
    documentBuilder = documentBuilder.addOAuth2(oauthSchema);
  }
  const openIDSchema: SecuritySchemeObject = {
    type: 'openIdConnect',
    openIdConnectUrl: openIdConnectUrl,
  };
  if (openIdConnectUrl) {
    documentBuilder = documentBuilder.addSecurity('OpenIdc', openIDSchema);
  }

  const options = documentBuilder.build();
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

  const uiOptions = {
    oauth: {
      clientId: clientId,
    },
    //tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  };
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'BioSimulators API documentation',
    swaggerOptions: uiOptions,
    customfavIcon:
      'https://github.com/biosimulations/Biosimulations/raw/dev/libs/shared/assets/src/assets/icons/favicon-32x32.png',
    customCssUrl:
      'https://static.biosimulations.org/stylesheets/biosimulators_swagger.css',
  };
  SwaggerModule.setup(uiPath, app, document, customOptions);

  return document;
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('server.port');

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
      'https://biosimulators.org',
      'https://www.biosimulators.org',
      'https://biosimulators.dev',
      'https://www.biosimulators.dev',
      'https://run.biosimulations.dev',
      'https://run.biosimulations.org',
      'https://biosimulations.dev',
      'https://www.biosimulations.dev',
      'https://biosimulations.org',
      'https://www.biosimulations.org',
    ];

    const allow = allowedOrigins.includes(requestOrigin);
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });
  const doc = new DocumentBuilder()
    .setTitle('BioSimulators API')
    .setDescription('API for a registry of biosimulation software tools.')
    .setVersion('0.1')
    .setLicense(
      'MIT License',
      'https://github.com/biosimulations/Biosimulations/blob/dev/LICENSE',
    )
    .setTermsOfService('https://biosimulators.org/help/terms')
    .setExternalDoc(
      'API specifications (Open API JSON)',
      'https://api.biosimulators.org/openapi.json',
    )
    .setContact(
      'BioSimulators Team',
      'https://biosimulators.org/help/about',
      'info@biosimulators.org',
    );

  const tags = [
    {
      name: 'Simulators',
      description:
        'Operations for submitting, updating, retrieving, and deleting simulation tools.',
    },
    {
      name: 'Authentication testing',
      description:
        "Operations for checking whether a user is logged in and retrieving information about a user's privileges.",
    },
  ];
  for (const tag of tags) {
    doc.addTag(tag.name, tag.description);
  }

  const document = setupOpenApi(
    app,
    doc,
    'https://auth.biosimulations.org/authorize?audience=api.biosimulators.org',
    'https://auth.biosimulations.org/.well-known/openid-configuration',
    'WEPUMb2Jo28NdEt1Z7fhUx54Bff8MnKF',
    {
      'read:Simulators': 'Get information about simulators',
      'write:Simulators': 'Create or modify simulators',
      'delete:Simulators': 'Delete simulators',
    },
  );

  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/openapi.json', (req, res) => res.json(document));

  const resolver = new Resolver();
  const resolvedDocument = await resolver.resolve(document);
  const schema = resolvedDocument.result.components.schemas.Simulator;
  httpAdapter.get('/schema/Simulator.json', (req, res) =>
    res.json(toJsonSchema(schema)),
  );

  const limit = configService.get('server.limit');
  app.use(json({ limit }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: BiosimulationsValidationExceptionFactory,
      forbidNonWhitelisted: true,
      whitelist: true,
      validationError: {
        target: false,
      },
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
}

bootstrap();
