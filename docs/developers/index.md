# Guide to contributing to the BioSimulations and BioSimulators platforms

We enthusiastically welcome contributions to BioSimulations and BioSimulators! This document describes how developers can contribute the BioSimulations and BioSimulators platforms (e.g., web applications, REST APIs, databases, and simulation services). Information for investigators about contributing simulation projects to BioSimulations is available [here](../users/publishing-projects.md). Information for simulation software tool developers about contributing simulation tools to BioSimulators is available at [here](../users/publishing-tools.md).

## Coordinating contributions

Before getting started, please contact the lead developers at [info@biosimulations.org](mailto:info@biosimulations.org) to coordinate your planned contributions with other ongoing efforts. Please also use GitHub issues to announce your plans to the community so that other developers can provide input into your plans and coordinate their own work. As the development community grows, we will institute additional infrastructure as needed, such as a leadership committee and regular online meetings.

## Repository organization

The repository is organized as a monorepo using tooling from [Nx](https://nx.dev/angular/getting-started/why-nx). A brief guide to working with Nx is available [here](./setup/nx-tutorial.md).

### Apps

The `apps` directory contains code for the high level applications that are a part of BioSimulations and BioSimulators. An application is code that is deployed independently, either as a website, API, or backend service. The applications are implemented using TypeScript, except the COMBINE API, which is implemented using Python. See the [README](https://github.com/biosimulations/biosimulations/blob/dev/apps/combine-api/README.md) for the COMBINE API for more information about installing, running, and editing the COMBINE API.

### Libraries

The `libs` directory contains code that can be used by multiple applications. Each library contains a `README.md` file that describes its purpose. The libraries are implemented using TypeScript. To enforce proper separation of concerns and manage dependency trees, BioSimulations and BioSimulators employ constraints on the libraries that can be used by each application. For more information, read the [Nx documentation](https://nx.dev/angular/workspace/structure/monorepo-tags), and look at the repository's [linting rules](https://github.com/biosimulations/biosimulations/blob/dev/.eslintrc.json). In general, BioSimulations and BioSimulators follow the [principles recommended by Nx](https://nx.dev/angular/guides/monorepo-nx-enterprise).

## Coding convention

BioSimulations and BioSimulators follow standard TypeScript style conventions:

- Module names: `lower-dash-case`
- Class names: `UpperCamelCase`
- Function names: `lowerCamelCase`
- Variable names: `lowerCamelCase`

Further information about style conventions can be found in the [lint rules definition](https://github.com/biosimulations/biosimulations/blob/dev/.eslintrc.json).

## Linting

We strive to create high-quality code. BioSimulations and BioSimulators use [ESLint](https://eslint.org/) to identify potential errors. ESLint can be executed by running `nx affected:lint` to lint all applications and libraries or `nx run {app-or-lib}:lint` to lint an individual application or library.

See the [README](https://github.com/biosimulations/biosimulations/blob/dev/apps/combine-api/README.md) for the COMBINE API for more information about linting the COMBINE API.

## Testing

We strive to have complete test coverage of BioSimulations and BioSimulators. As such, all contributions to BioSimulations and BioSimulators should be tested. In particular, each module should be accompanied by a specification test in the same directory with the extension `.spec.ts`. All applications and libraries can be tested by running `nx affected:test`. Individual applications or libraries can be tested by running `nx run {app-or-lib}:test`.

Upon each push and pull request to GitHub, GitHub will trigger actions to execute all of the tests.

See the [README](https://github.com/biosimulations/biosimulations/blob/dev/apps/combine-api/README.md) for the COMBINE API for more information about testing the COMBINE API.

## Submitting changes

Please use GitHub pull requests to submit changes. Each request should include a brief description of the new and/or modified features. Upon each pull request, GitHub will trigger actions to lint and test all of the applications and libraries. Pull requests will be approved once all tests are passing and the pull request is reviewed by one of the lead developers.

### Commit convention

BioSimulations and BioSimulators uses [conventional commits](https://www.conventionalcommits.org/) to enable changelog generation and versioning. Developers are encouraged to use [Commitizen](http://commitizen.github.io/cz-cli/) to easily create compliant commit messages. To use Commitizen, simply run `npm run commit` instead of ` git commit` to commit changes.

## Releasing and deploying new versions

Contact [info@biosimulations.org](mailto:info@biosimulations.org) to request release and deployment of changes.
