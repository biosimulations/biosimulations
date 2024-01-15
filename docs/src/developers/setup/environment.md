# Setting the environment values for backend services

!!! tip
    If you are unsure about which values to use, see the [services documentation](./services.md) or [contact us](/about/contact) for help.

In the `config/` directory, create a copy of the `config.env.sample` file, named `config.env`. Replace the placeholders for the following variables:

## Database

- `MONGODB_URI`: Provide the [URI](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-mongodb-uri) of your MongoDB database.

## S3 Storage

- `STORAGE_ENDPOINT`: Provide the endpoint of your S3-compatible storage bucket.
- `STORAGE_EXTERNAL_ENDPOINT`: Provide the public url to access files in your S3-compatible storage bucket.
- `STORAGE_BUCKET`: Provide the name of your S3-compatible storage bucket.
- `STORAGE_ACCESS_KEY_ID`: Provide the access key id of your S3-compatible storage bucket.
- `STORAGE_SECRET_ACCESS_KEY`: Provide the secret access key of your S3-compatible storage bucket.

## Redis connection

- `REDIS_HOST`: Provide the host of your Redis server.
- `REDIS_PORT`: Provide the port of your Redis server.

## NATS connection
- `NATS_URL`: Provide the url of your [NATS message](https://docs.nats.io) server.

## HPC
Several environment variables are needed to run simulations on an HPC. If you are developing portions of the system that do not require submitting jobs to the HPC, you can skip this section.

### HPC Connection
- `HPC_HOME_DIR`: Provide the path to the HPC user's home directory.
- `HPC_BASE_DIR`: Provide the base path for the simulations to be stored on the HPC
- `HPC_SSH_PRIVATE_KEY`: Provide the private key for SSH access to the HPC.
- `HPC_SSH_HOST`: Provide the hostname of the HPC login node
- `HPC_SSH_PORT`: Provide the port of the HPC login node
- `HPC_SSH_USER`: Provide the username of the HPC user

### SLURM script template
These variables are used to generate the SLURM script that is submitted to the HPC.

- `HPC_EXECUTABLES_PATH`: Provide the path to the HPC executables
- `HPC_MODULE_PATH`: Provide the path to the HPC modules
- `HPC_MODULE_INIT_SCRIPT`: Provide the module load commands for the HPC
- 'HPC_SLURM_PARTITION`: Provide the SLURM partition to use
- `HPC_SLURM_QOS`: Provide the SLURM QOS to use

### Singularity
These variables configure the Singularity application on the HPC
- `HPC_SINGULARITY_MODULE`: Provide the name of the module that loads singularity
- `HPC_SINGULARITY_CACHE_DIR`: Provide the path to the Singularity cache directory
- `HPC_SINGULARITY_PULL_FOLDER`: Provide the path to the Singularity pull folder

## Authentication Service
BioSimulations uses [Auth0](https://auth0.com/) for authentication. Please see the [Auth0 documentation](https://auth0.com/docs/quickstart/backend/nodejs) for more information on setting up an Auth0 instance.

Alternatively, any OAuth2 provider should be compatible with the BioSimulations codebase, with the exception of portions of the system that rely on information stored on the Auth0 database. Currently, this includes information about user profiles, and organization profiles. 

For local development, you can also disable authentication by commenting out the `@permissions` decorator from the API methods. For example, see the following section of the API source code: 

```typescript
  @permissions(scopes.files.create.id) //Comment out this line to disable authentication
  public async addThumbnailUrls(
    @Param('runId') runId: string,
    @Param('fileLocation') fileLocation: string,
    @Body() thumbnailUrls: ProjectFileThumbnailInput,
  ): Promise<void> {
    return this.service.addThumbnailUrls(runId, fileLocation, thumbnailUrls);
  }
```

- `AUTH0_DOMAIN`: Provide the domain of your authentication service
- `AUTH0_ISSUER`: Provide the issuer of your  authentication tokens
- `API_AUDIENCE`: Provide the audience of your authentication tokens
- `CLIENT_ID`: Provide the client id of the application authenticating against the authentication service
- `CLIENT_SECRET`: Provide the client secret of the application authenticating against the authentication service


## Mail Service
BioSimulations uses [SendGrid](https://sendgrid.com/) for sending email notifications to users. If you are not working directly with the mail-service, you can skip this section.

- `SENDGRID_TOKEN`: Provide the API key for your SendGrid account.
- `SUCCESS_TEMPLATE`: Provide the template id for the email sent to the user when a simulation is successfully completed.
- `FAILURE_TEMPLATE`: Provide the template id for the email sent to the user when a simulation fails.
