# Configuring endpoints for local environments
## Loading endpoints used by the applications
The endpoints for the front end and backend applications are located in the shared configuration library, located at `libs/config/shared`. The endpoints are loaded dynamically depending on the value of the `env` parameter provided when initializing the `Endpoints` class. 

The loading of the endpoints differs slightly depending on whether the application is running a frontend (browser) or backend (server) application.
### Frontend Applications
For front end applications, the default value of the `env` parameter is read from the `@biosimulations/config/shared` library, located at `libs/shared/environments`. This library contains several different environment definitions such as "development", "staging", "production", etc. The `environment.ts` file loads one of these definitions.  The `env` parameter that is loaded is then fed into the `Endpoints` class as described above.

To configure which endpoints are loaded, change the name of the file being loaded in the `environment.ts` file. For example, to load the endpoints for the "local" environment, change the name of the file to `environment.local`.

```typescript
import { environmentType } from './environment.type';
// Change the name of the file to environment.type.ts where type is the name of the environment you wish to load
import { environment as currentEnvironment } from './environment.dev';
export const environment: environmentType = currentEnvironment;
```

### Backend Applications

For back end applications, the developer must provide the value of the `env` parameter when initializing the `Endpoints` class. This value is then used to load the appropriate endpoints.

In most cases, the value of the `env` parameter should be loaded from the configuration service provided by the `@biosimulations/config/nest` library located at `libs/config/nest`. The following is an example of how to load the endpoints for the current environment.

```typescript
import { Injectable } from '@nestjs/common';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  private endpoints: Endpoints;

  public constructor(
    private configService: ConfigService,
  ) {
    const env = configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }
}
```
Unlike, the front end applications, the backend applications are capable of loading endpoints dynamically. The `Endpoints` class loads overrides the default endpoints for the current environment by loading environment variables. In order to override a specific endpoint, set the environment variable with the name of the endpoint to the value you wish to use. For example, to override the `combine-api` endpoint, set the environment variable `COMBINE_API_URL` to the value you wish to use.
A list of the environment variables that can be overridden is located in the `EndpointLoader` class of the `@biosimulations/config/shared` library.
### External Endpoints 

Due to the distributed architecture of the application, various endpoints may not be accessible from different locations. For example, if a developer is developing their application locally, they may set the `API_URL` environment to `http://localhost:3333` to allow the locally running `dispatch-service` to post data to their locally running API. However, the HPC cluster would not be able to download the simulation project to execute from a `localhost` address, since this is not accessible from the HPC cluster. 

For this reason, the `Endpoints` class provides an `external` variant of each endpoint. This is the endpoint that should be used when urls are being shared outside of the 'current local' environment. The application developers must be sure to load these endpoints from the `Endpoint` class at the appropriate points in the code. These endpoints can be overridden the same way as the default endpoints, but adding the `EXTERNAL` prefix. For example, to to address the above issue, the user would set the `EXTERNAL_API_URL` environment variable to an address that is accessible from the HPC cluster, such as `https://api.biosimulations.dev`, or a url provided by an tunneling service such as [localtunnel](http://localtunnel.github.io/www/).

!!! warning 
    Make sure you understand the security implications of exposing locally running applications on your machine to the world via public urls. In particular, make sure that these URLs are not accidentally committed to the repository.