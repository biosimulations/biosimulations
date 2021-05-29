![Logo](https://raw.githubusercontent.com/biosimulations/Biosimulations/dev/libs/shared/assets/src/assets/images/biosimulations-logo/logo-white.svg)

[![Continuous Integration](https://github.com/biosimulations/Biosimulations/workflows/Continuous%20Integration/badge.svg)](https://github.com/biosimulations/Biosimulations/actions?query=workflow%3A%22Continuous+Integration%22)
[![App Status](https://deployment.api.biosimulations.org/api/badge?name=biosimulations-dev&revision=true)](https://deployment.api.biosimulations.org/applications/biosimulations-dev)
[![Continuous Deployment](https://github.com/biosimulations/Biosimulations/workflows/Continuous%20Deployment/badge.svg)](https://github.com/biosimulations/Biosimulations/actions?query=workflow%3A%22Continuous+Deployment%22)
[![App Status](https://deployment.api.biosimulations.org/api/badge?name=biosimulations-prod&revision=true)](https://deployment.api.biosimulations.org/applications/biosimulations-prod)

# BioSimulations

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse model components and simulations. Despite extensive efforts to develop standards such as [COMBINE/OMEX](https://combinearchive.org/), [SBML](http://sbml.org), and [SED-ML](https://sed-ml.org), it remains difficult to reuse many models and simulations. One challenge to reusing models and simulations is the diverse array of incompatible modeling formats and simulation tools.

This package provides three tools which address this challenge:

- [BioSimulators](https://biosimulators.org) is a registry of containerized simulation tools that provide consistent interfaces. BioSimulators makes it easier to find and run simulations.
- [runBioSimulations](https://run.biosimulations.org) is a simple web application for using the BioSimulators containers to run simulations. This tool makes it easy to run a broad range of simulations without having to install any software.
- [BioSimulations](https://biosimulations.org) is a platform for sharing and running modeling studies. BioSimulations provides a central place for investigators to exchange studies. BioSimulations uses the BioSimulators simulation tools, and builds on the functionality of runBioSimulations.

This package provides the code for the BioSimulations, runBioSimulations, and BioSimulations websites, as well as the code for the backend services for all three applications. The package is implemented in TypeScript using Angular, NestJS, MongoDB, and Mongoose.

## Getting started

### Users

Please use the hosted versions of BioSimulations, runBioSimulations, and BioSimulators at https://biosimulations.org, https://run.biosimulations.org, and https://biosimulators.org.

### Developers

We welcome contributions to BioSimulations, runBioSimulations, and BioSimulations! Please see the [Guide to Contributing](CONTRIBUTING.md) for information about how to get started including how to install this package and how to run BioSimulations, runBioSimulations, and BioSimulators locally.

## License

This package is released under the [MIT license](LICENSE). This package uses a number of open-source third-party packages. Their licenses are summarized in [LICENSE-DEPENDENCIES](LICENSE-DEPENDENCIES).

## Development team

This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York and the [Center for Cell Analysis and Modeling](https://health.uconn.edu/cell-analysis-modeling/) at UConn Health as part of the [Center for Reproducible Biomodeling Modeling](https://reproduciblebiomodels.org).

- [Bilal Shaikh](https://www.bshaikh.com)
- [Jonathan Karr](https://www.karrlab.org)
- Akhil Marupilla
- [Mike Wilson](https://www.linkedin.com/in/mike-wilson-08b3324/)
- [Ion Moraru](https://facultydirectory.uchc.edu/profile?profileId=Moraru-Ion)

## Funding

This package was developed with support from the National Institute for Bioimaging and Bioengineering (award P41EB023912).

## Questions and comments

Please contact us at [info@biosimulations.org](mailto:info@biosimulations.org) with any questions or comments.

### Nx

This project uses [Nx](https://nx.dev). The below information should be sufficient for most development in the repository.

#### Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

##### Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

##### Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@biosimulations/mylib`.

##### Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

##### Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

##### Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

##### Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

##### Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

##### Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

##### Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

##### ☁ Nx Cloud

###### Computation Memoization in the Cloud

This project uses [Nx Cloud](https://nx.app/) to help developers save time when building and testing. Visit [Nx Cloud](https://nx.app/) to learn more.
