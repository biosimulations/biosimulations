# Running required backend services for local development

!!! tip 
    We recommend using [VsCode](https://code.visualstudio.com/) for developing BioSimulations. The BioSimulations git repository contains a [development container](https://code.visualstudio.com/docs/remote/containers) [configuration](https://github.com/biosimulations/biosimulations/blob/dev/.devcontainer/devcontainer.json) that simplifies the setup of the local environment.

The BioSimulations apps requires connecting to several infrastructure services for functions such as messaging, database, and storage. Developing BioSimulations locally requires access to the following services:

- Redis

    [Redis](https://redis.io/) is used for caching the results of the API and for managing queues for submitting, monitoring, and processing simulation runs.

    We recommend running a local redis container with the following command:

    ```bash
    docker run -d -p 6379:6379 --network host --name redis redis
    ```

- NATS messaging queue

    [NATS](https://docs.nats.io/) is used for messaging between the API and the backend services. Currently, the NATS connection does not support guaranteed message delivery semantics. The latest [NATS Jetstream](https://docs.nats.io/nats-concepts/jetstream) adds support for exactly-once delivery semantics, which will be can be for submission jobs in the future.

    We recommend running a local NATS container with the following command:

    ```bash
    docker run -d -p 4222:4222 --network host --name nats nats
    ```

- MongoDB

    [MongoDB](https://docs.mongodb.com/) is used as our primary database and contains information about the simulation runs, their logs, specifications, metadata, etc. It is accessed through the API.

    We recommend running a local MongoDB container with the following command:
    ```bash
    docker run -d -p 27017:27017 --network host --name mongodb mongo
    ```

    Alternatively, you can use a free MongoDB cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/).

    These methods will allow you to develop BioSimulations locally, but will not have access to simulation stored on the development server. If you would like to develop against the dev biosimulations database, please [contact us](/about/contact/) for access.

- S3

    We recommend using an [AWS S3](https://aws.amazon.com/s3/) or [Google Cloud Storage](https://cloud.google.com/storage/) bucket for local development. If you would like to develop against the dev biosimulations bucket, please [contact us](/about/contact/) for access.

    Alternatively, you can run a local S3 compatible instance with [Minio](https://hub.docker.com/r/minio/minio/)


- HPC
    
    Accessing the an appropriate HPC backend is the most bespoke part of setting up a local environment for development on the BioSimulations platform. If your development work does not require running simulations on the HPC, we recommend temporarily modifying the code to skip submitting jobs to the HPC or returning mock responses. This will allow you to continue to develop the API, and other aspects of the system without access to the HPC. For more information about which parts of the system interact with the HPC, see the [architecture deployment information](../architecture/deployment.md).

     If you specifically require access to the HPC, please [contact us](/about/contact/).


