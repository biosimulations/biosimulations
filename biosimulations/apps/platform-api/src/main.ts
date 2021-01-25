import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { json } from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

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
    'https://api.biosimulations.dev',
    'https://api.biosimulations.org',
  ];

  const allow = allowedOrigins.includes(requestOrigin);
  const error = null;
  callback(error, allow);
};

function setupOpenApi(app: INestApplication) {
  // TODO abstract this to common library, use env variables
  const oauthSchema: SecuritySchemeObject = {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl:
          'https://auth.biosimulations.org/authorize?audience=api.biosimulations.org',
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
    .setTitle('BioSimulations resource API')
    .setDescription('The API to interact with the BioSimulations database')
    .setVersion('0.1')
    .setLicense("MIT License", "https://github.com/biosimulations/Biosimulations/blob/dev/LICENSE")
    .setTermsOfService("https://biosimulations.org/help/terms")
    .setExternalDoc('API specifications (Open API JSON)', 'https://api.biosimulations.org/openapi.json')
    .setContact('BioSimulations Team', 'https://biosimulations.org/help/about', 'info@biosimulations.org')
    .addTag('Models')
    .addTag('Projects')
    .addTag('Simulations')
    .addTag('Charts')
    .addTag('Visualizations')
    .addSecurity('OpenIdc', openIDSchema)
    .addOAuth2(oauthSchema)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const components = document.components as any;
  const unsortedSchemas = components.schemas;
  if (unsortedSchemas) {
    const schemaNames = Object.keys(unsortedSchemas).sort();

    const schemas: {[name: string]: any} = {};
    for (const schemaName of schemaNames) {
      schemas[schemaName] = unsortedSchemas?.[schemaName];
    }
    components.schemas = schemas;
  }

  const uiOptions = {
    oauth: {
      clientId: 'mfZoukkw1NCTdltQ0KhWMn9KXVNq7gfT',
    },
    //tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  };
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'BioSimulations API Documentation',

    swaggerOptions: uiOptions,
    customCss: ' .swagger-ui .topbar { display: none }',
  };
  SwaggerModule.setup('', app, document, customOptions);
  
  return document;
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('server.port');
  const host = configService.get('server.host');
  const limit = configService.get('server.limit');

  // TODO intelligently allow origin based on production mode, abstract this
  app.enableCors({ origin: allowOrigin });
  app.use(json({ limit }));
  const document = setupOpenApi(app);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/openapi.json', (req, res) => res.json(document));

  await app.listen(port, () => {
    console.log('Listening at ' + host);
  });
}

bootstrap();
