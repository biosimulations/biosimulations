# Guide to contributing to the BioSimulations and BioSimulators platforms

We enthusiastically welcome contributions to BioSimulations and BioSimulators! This document describes how developers can contribute the BioSimulations and BioSimulators platforms (e.g., web applications, REST APIs, databases, and simulation services). Modelers can contributing models, simulations, and visualizations to BioSimulations via the web application at https://biosimulations.org. Information for simulation software tool developers about contributing containerized simulation tools to BioSimulators is available at https://biosimulators.org/help.

## Coordinating contributions

Before getting started, please contact the lead developers at [info@biosimulations.org](mailto:info@biosimulations.org) to coordinate your planned contributions with other ongoing efforts. Please also use GitHub issues to announce your plans to the community so that other developers can provide input into your plans and coordinate their own work. As the development community grows, we will institute additional infrastructure as needed such as a leadership committee and regular online meetings.

## Repository organization

The repository is organized as a monorepo using tooling from [Nx](https://nx.dev/angular/getting-started/why-nx). The [biosimulations](/biosimulations/README.md) folder contains the Nx workspace and top level source code.

### Apps

The apps folder contains code for the high level applications that are a part of Biosimulations. An application is code that is deployed independently, either as a website, API, or backend service.

Each app contains a Readme file that is used to describe its purpose and internal organization.

### Libraries

The libraries folder contains code that can be used by multiple apps. To enforce proper separation of concerns and manage dependency trees, Nx provides constraints on the libraries that can be used by each app. For more information, read the [Nx documentation](https://nx.dev/angular/workspace/structure/monorepo-tags), and look at the repository's [linting rules](/.eslintrc). In general, libraries should be organized by the principles recommended [here](https://nx.dev/angular/guides/monorepo-nx-enterprise).

## Coding convention

BioSimulations and BioSimulators follow standard TypeScript style conventions:

- Module names: `lower-dash-case`
- Class names: `UpperCamelCase`
- Function names: `lowerCamelCase`
- Variable names: `lowerCamelCase`

Further information about style conventions can be found in the [lint rules definition](/.eslintrc)

## Linting

We strive to create high-quality code. BioSimulations and BioSimulators use ESLint to identify potential errors. ESLint can be executed by running `nx affected:lint`.

## Testing

We strive to have complete test coverage of BioSimulations and BioSimulators. As such, all contributions to BioSimulations and BioSimulators should be tested. In particular, each module should be accompanied by a specification test in the same directory with the extension `.spec.ts`. The tests can be executed by running `nx affected:test`.

Upon each push and pull request to GitHub, GitHub will trigger actions to execute all of the tests.

## Submitting changes

Please use GitHub pull requests to submit changes. Each request should include a brief description of the new and/or modified features. Upon each pull request, GitHub will trigger actions to execute all of the tests. Pull requests will be approved once all tests are passing and the pull request is reviewed by one of the lead developers.

## Releasing and deploying new versions

Contact [info@biosimulations.org](mailto:info@biosimulations.org) to request release and deployment of new changes.
