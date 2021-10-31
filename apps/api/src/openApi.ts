import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Resolver } from '@stoplight/json-ref-resolver';
import * as toJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import {
  ScopesObject,
  SecuritySchemeObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { INestApplication } from '@nestjs/common';

export async function setupOpenApi(app: INestApplication): Promise<void> {
  const favIcon =
    'https://github.com/biosimulations/Biosimulations/raw/dev/libs/shared/assets/src/assets/icons/favicon-32x32.png';

  const cssUrl =
    'https://static.biosimulations.org/stylesheets/biosimulations_swagger.css';
  // Swagger doc
  const tags = [
    {
      name: 'Projects',
      description:
        'Operations for publishing simulation runs and modifying, getting, and deleting published projects.',
    },
    {
      name: 'Simulations',
      description:
        'Operations for submitting a simulation run, checking the status of a run, modifying the details of a run, and deleting a run.',
    },
    {
      name: 'Results',
      description:
        'Operations for viewing and retrieving the results of a simulation run.',
    },

    {
      name: 'Logs',
      description:
        'Operations for submitting and retrieving a log of the execution of a simulation run.',
    },
    {
      name: 'Metadata',
      description:
        'Operations for creating and retrieving the metadata associated with a simulation run',
    },
    {
      name: 'Files',
      description:
        'Operations for creating and retrieving metadata about the files in a simulation run',
    },
    {
      name: 'Specifications',
      description:
        'Operations for creating and retrieving simulation experiments (specifications of SED-ML files in COMBINE/OMEX archives) of simulation runs',
    },
    {
      name: 'Downloads',
      description:
        'Operations for downloading the files and results of a simulation run.',
    },
    {
      name: 'Ontologies',
      description:
        'Operations for getting a list of the supported ontologies, getting entire ontologies, and getting individual terms.',
    },
    {
      name: 'Internal',
      description:
        'Operations for the management of BioSimulations by the BioSimulations Team.',
    },
  ];
  const builder = new DocumentBuilder()
    .setTitle('BioSimulations API')
    .setDescription(
      'The BioSimulations API is a RESTful API for interacting with the BioSimulations web service and database.\
      It provides endpoints for submitting simulation projects to be executed on the BioSimulations backend, as well as\
      endpoints for retrieving the associated metadata, files, logs, results, and specifications of these projects.\
      It it also used for the publishing, sharing and retrieving projects from the BioSimulations database',
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
    .setExternalDoc('Documentation', 'https://docs.biosimulations.org')
    .setContact(
      'BioSimulations Team',
      'https://run.biosimulations.org/help/about',
      'info@biosimulations.org',
    );

  for (const tag of tags) {
    builder.addTag(tag.name, tag.description);
  }
  // TODO add all scopes/find a way to automate this from auth0 or atleast create a common library to keep consistent
  const scopes: ScopesObject = {
    'read:SimulationRuns': 'Get information about simulation runs',
    'write:SimulationRuns': 'Modify simulation runs, including their status',
    'delete:SimulationRuns': 'Delete simulation runs',
    'read:Results': 'Get the results of simulation runs',
    'write:Results': 'Modify the results of simulation runs',
    'delete:Results': 'Delete the results of simulation runs',
    'read:Logs': 'Get the logs of simulation runs',
    'write:Logs': 'Modify the logs of simulation runs',
    'delete:Logs': 'Delete the logs of simulation runs',
    'read:Metadata': 'Get the metadata for simulation runs',
    'write:Metadata': 'Modify the metadata for simulation runs',
    'delete:Metadata': 'Delete the metadata for simulation runs',
    'read:Projects': 'Get information about published projects',
    'create:Projects': 'Create published projects',
    'update:Projects': 'Modify published projects',
    'delete:Projects': 'Delete published projects',
    'proxyOwnership:Projects':
      'Create and modify projects on behalf of other accounts',
  };
  const authorizationUrl =
    'https://auth.biosimulations.org/authorize?audience=dispatch.biosimulations.org';
  const openIdConnectUrl =
    'https://auth.biosimulations.org/.well-known/openid-configuration';

  const clientId = 'WEPUMb2Jo28NdEt1Z7fhUx54Bff8MnKF';

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
    customSiteTitle: 'BioSimulations API',
    customCssUrl: cssUrl,
    swaggerOptions: {
      oauth: {
        clientId: clientId,
      },
      //tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/openapi.json', (req, res) => res.json(document));

  const resolver = new Resolver();
  const resolvedDocument = await resolver.resolve(document);
  const schema = resolvedDocument.result.components.schemas.CombineArchiveLog;
  httpAdapter.get('/schema/CombineArchiveLog.json', (req, res) =>
    res.json(toJsonSchema(schema)),
  );
}
