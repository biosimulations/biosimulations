# S3 Bucket Configuration

## Development Bucket

## Production Bucket

## Lifecycle Rules

The configuration for the retention policies and the lifecycle management is contained in the retention.py file.

### Generated Combine Archives

Generated combine archives are created to help users get valid omex archvies for use in runBiosimulations. The users upload a modelfile and then provide some information through a webform. We will delete these objects after 1 day to prevent any accidental retention of personal information.
If the omex archive is then used to run a simulation/create some resource, a copy will be saved through that process according to those policies.
