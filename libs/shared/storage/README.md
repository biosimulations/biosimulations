# shared-storage

A wrapper module for the NestJS Configures the connection to the S3 bucket used across the apps.

## Configuration

The configuration is loaded via the config module, and uses the following environment variables

- STORAGE_ENDPOINT - A URL for an AWS S3 compatible s3 serverr
- STORAGE_ACCESS - The Access Key used for connecting to the bucket
- STORAGE_SECRET - The Secret key associated with the key
- STORAGE_BUCKET - The name of the storage bucket to use

## Limitations

The module is marked as global to limit the initial setup that is needed. This contains a limitation of only being able to use one service account across a given app. If multiple accounts are needed, the S3 module can be configured independently for the app.
See [the S3 module documentation](https://github.com/svtslv/nestjs-s3#readme) for setup instructions
