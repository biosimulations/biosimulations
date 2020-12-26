/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
function setupOpenApi(
  app: INestApplication,
  documentBuilder: DocumentBuilder,
  authorizationUrl?: string,
  openIdConnectUrl?: string,
  clientId?: string,
  scopes?: string[],
  uiPath = ''
) {
  if (!scopes) {
    scopes = [];
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

  const uiOptions = {
    oauth: {
      clientId: clientId,
    },
  };
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'BioSimulations API documentation',

    swaggerOptions: uiOptions,
    customCss: ' .swagger-ui .topbar { display: none }',
  };
  SwaggerModule.setup(uiPath, app, document, customOptions);
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/openapi.json', (req, res) => res.json(document));
}
async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('server.port');

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
      'https://biosimulators.org',
      'https://www.biosimulators.org',
      'https://run.biosimulations.dev',
      'https://run.biosimulations.org',
    ];

    const allow = allowedOrigins.includes(requestOrigin);
    const error = null;
    callback(error, allow);
  };
  app.enableCors({ origin: allowOrigin });
  const doc = new DocumentBuilder()
    .setTitle('BioSimulators API')
    .setDescription(
      'A collection of standardized Docker containers for executing biosimulations'
    )
    .setVersion('0.1')
    .setContact('BioSimulators Team', 'https://biosimulators.org/help/about', 'info@biosimulators.org');

  setupOpenApi(
    app,
    doc,
    'https://auth.biosimulations.org/authorize?audience=api.biosimulators.org',
    'https://auth.biosimulations.org/.well-known/openid-configuration',
    'mfZoukkw1NCTdltQ0KhWMn9KXVNq7gfT'
  );

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
}

bootstrap();
