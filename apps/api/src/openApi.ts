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
      name: 'Published projects',
      description:
        'Operations for publishing simulation runs and modifying, getting, and deleting published projects.',
    },
    {
      name: 'Simulation runs',
      description:
        'Operations for submitting a simulation run, checking the status of a run, modifying the details of a run, and deleting a run.',
    },
    {
      name: 'Simulation run results',
      description:
        'Operations for viewing and retrieving the results of a simulation run.',
    },

    {
      name: 'Logs of simulation runs',
      description:
        'Operations for submitting and retrieving a log of the execution of a simulation run.',
    },
    {
      name: 'Metadata for projects (COMBINE/OMEX archive) of simulation runs',
      description:
        'Operations for creating and retriving the metadata associated with a simulation run',
    },
    {
      name: 'Files (contents of COMBINE/OMEX archive) of simulation runs',
      description:
        'Operations for creating and retrieving metadata about the files in a simulation run',
    },
    {
      name: 'Simulation experiments (specifications of SED-ML files in COMBINE/OMEX archives) of simulation runs',
      description:
        'Operations for creating and retrieving the specifications of a simulation run',
    },
    {
      name: 'Simulation run downloads',
      description:
        'Operations for downloading the files and results of a simulation run.',
    },
    {
      name: 'Ontologies',
      description:
        'Operations for getting a list of the supported ontologies, getting entire ontologies, and getting individual terms.',
    },
    {
      name: 'Internal management',
      description:
        'Operations for the management of BioSimulations by the BioSimulations Team.',
    },
  ];
  const builder = new DocumentBuilder()
    .setTitle('BioSimulations API')
    .setDescription(
      'API for submiting and managing simulation jobs to the BioSimulations simulation service.',
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
      'BioSimulations Team',
      'https://run.biosimulations.org/help/about',
      'info@biosimulations.org',
    );

  for (const tag of tags) {
    builder.addTag(tag.name, tag.description);
  }
  // TODO add all scopes/find a way to automate this from auth0 or atleast create a common library to keep consistent
  const scopes: ScopesObject = {
    'read:SimulationRuns': 'Get information about a submitted run',
    'write:SimulationRuns': 'Modify a run, including status',
    'delete:SimulationsRuns': 'Delete runs from the database',
    'read:Results': 'Get the results of a run',
    'write:Results': 'Modify the results of a run',
    'delete:Results': 'Delete the results of a run',
    'read:Logs': 'Get the log of a run',
    'write:Logs': 'Modify the log of a run',
    'delete:Logs': 'Delete the log of a run',
    'read:Metadata': 'Get the metadata for a run',
    'write:Metadata': 'Modify the metadata for a run',
    'delete:Metadata': 'Delete the metadata for a run',
    'read:Projects': 'Get information about a published projects',
    'write:Projects': 'Modify projects, including making them public',
    'delete:Projects': 'Delete projects from the database',
  };
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
