# Getting Started with Development

## Developing Locally
### Prerequisites
Before starting, make sure you have the following requirements:

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Installation

From the root of the repository, run the following command:

```
npm ci
```
This will install all the dependencies and allow running the applications locally.

### Setting up the environment variables
In the `config/` directory, create a copy of the `config.env.sample` file, named `config.env`. Replace the placeholders with the appropriate values. For more information on the environment variables, see the [environment documentation](./environment.md).

### Starting backend services

The applications need to connect to the following services:

- MongoDB
- Redis
- NATS
- HPC

Information on setting up these services can be found in the [services documentation](./services.md).

## Repository organization

The repository is organized as a monorepo using tooling from [Nx](https://nx.dev/angular/getting-started/why-nx). A brief overview of the repository structure and using Nx is presented here.

### Applications

The `apps` directory contains code for the high level applications that are a part of BioSimulations and BioSimulators. An application is code that is deployed independently, either as a website, API, or backend service. The applications are implemented using TypeScript, except the COMBINE API, which is implemented using Python. See the [README](https://github.com/biosimulations/biosimulations/blob/dev/apps/combine-api/README.md) for the COMBINE API for more information about installing, running, and editing the COMBINE API.

The applications in the repository are:

- platform: The web application for BioSimulations
- dispatch: The web application for runBioSimulations
- simulators: The web application for BioSimulators
- account: The web application for BioSimulations account management (not currently functional)
- account-api: The API for BioSimulations account management (not yet implemented)
- api: The BioSimulations API
- simulators-api: The BioSimulators API
- combine-api: The COMBINE API (Implemented in Python)
- dispatch-service: The backend service for running simulations
- mail-service: The backend service for sending email notifications to users

### Libraries

The `libs` directory contains code that can be used by multiple applications. Each library contains a `README.md` file that describes its purpose. The libraries are implemented using TypeScript.

To view the organization of the apps and libraries, run the following command:

```
nx dep-graph
```



### Library dependency restrictions
To enforce proper separation of concerns and manage dependency trees, BioSimulations and BioSimulators employ constraints on the libraries that can be used by each application. 
In the `project.json` file for each application and library, there are tags that are used to categorize the scope and type of the libraries. In general, the following tags are used:

- `platform`: This tag can be one of `web`, `server` or `any`. The `web` tag indicates that the app or library is designed to run in browsers, and contains code that is specific to the web, such as Angular libraries, or code that makes use of Web APIs. These libraries can only be imported by apps and libraries that have the `web` tag. The `server` tag indicates that the app or library is designed to run on the server, and contains code that is specific to the server, such as file system interaction, interaction with the database, or imports of backend libraries. These libraries can only be imported by apps and libraries that have the `server` tag. The `any` tag indicates that the app or library can be used by both the web and server, and contains platform-agnostic code, such as utilities or data model definitions. 
- `scope`: This tag is used to enforce separation of concerns between applications. Each application is assigned a scope and can only import libraries that are in the same scope. The scope 'shared' indicates that the library can be imported by any application. Libraries can also be assigned a specific scope to ensure that helper libraries are encapsulated by the parent library and cannot be imported directly by an application. 
- `type`: This tag can be used to enforce proper library organization. For example, a library that has a `type` of `ui` is intended to provide generic UI components that can be used by multiple applications. Therefore, libraries with a type of `ui` can be restricted from importing libraries with a `type` of `datamodel` which defines data models, to ensure that the UI components do not depend on the data models.
The possibles types of libraries are 
    
    - `feature`: Libraries that implement specific features or smart UI (ui that is aware of the data model)
    - `ui`: Libraries that provide generic UI components (not aware of the data model)
    - `datamodel`: Libraries that define data models
    - `data-access`: Libraries that connect to backend services, or manage state
    - `util`: Libraries that provide utility functions across applications


Additional tags can be added to the `project.json` files for each application and library. These rules are enforced by the linting rules defined in the [eslint rules](https://github.com/biosimulations/biosimulations/blob/dev/.eslintrc.json). For more information on how to use tags, see the [Nx documentation](https://nx.dev/structure/monorepo-tags).

## Using the Nx CLI

This project uses [Nx](https://nx.dev). Below is a brief introduction to using Nx with this project.

### Generate a skeleton for an application

Run `nx g @nrwl/angular:app my-app` to generate an Angular application (front-end).

Run `nx g @nrwl/nest:app my-nest-app` to generate a NestJS application (back-end).


### Generate a skeleton for a library

Run `nx g @nrwl/angular:lib my-lib` to generate an Angular library.

Run `nx g @nrwl/nest:lib my-nest-lib` to generate a NestJS library.

Run `nx g @nrwl/node:lib my-node-lib` to generate a NodeJS library.

Run `nx g @nrwl/js:library --name=my-ts-lib --buildable` to generate a platform agnostic typescript library

Libraries are sharable across libraries and applications. They can be imported as `@biosimulations/mylib`.

### Generate skeletons for application components

Nx can be used to generate skeletons for components as well. This includes front-end components, backend-end controllers, services, and various Angular and NesJS structures. For more information on generating components, see the [Nx documentation]https://nx.dev/generators/using-schematics).
  
### Run a development server

Run `ng serve my-app` to run a development server for the application. 

To run an front end application that connects to a locally running backend service, run both applications in two different terminals. The [endpoints documentation](./endpoints.md) describes how the applications determine which endpoints to connect to.

### Lint an application or library
Run `nx lint my-app` to lint an application or library.

Run `nx affected:lint` to lint all projects affected by your recent changes.
### Run unit tests for an application or library

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by your recent changes.

### Run end-to-end tests for an application

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by your recent changes.

### Build an application

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Mapping the dependencies of the applications and libraries

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
