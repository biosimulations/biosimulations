![Logo](https://raw.githubusercontent.com/biosimulations/Biosimulations/dev/libs/shared/assets/src/assets/images/biosimulations-logo/logo-white.svg)


[![DOI](https://zenodo.org/badge/207730765.svg)](https://zenodo.org/badge/latestdoi/207730765) 
[![Continuous Integration](https://github.com/biosimulations/Biosimulations/workflows/Continuous%20Integration/badge.svg)](https://github.com/biosimulations/Biosimulations/actions?query=workflow%3A%22Continuous+Integration%22)
[![Continuous Deployment](https://github.com/biosimulations/Biosimulations/workflows/Continuous%20Deployment/badge.svg)](https://github.com/biosimulations/Biosimulations/actions?query=workflow%3A%22Continuous+Deployment%22)

[![App Status](https://deployment.biosimulations.org/api/badge?name=biosimulations-dev&revision=true)](https://deployment.biosimulations.org/applications/biosimulations-dev)
[![App Status](https://deployment.biosimulations.org/api/badge?name=biosimulations-prod&revision=true)](https://deployment.biosimulations.org/applications/biosimulations-prod)

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/5204/badge)](https://bestpractices.coreinfrastructure.org/projects/5204)

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

We welcome contributions to BioSimulations, runBioSimulations, and BioSimulations! Please see the [developers guide](https://docs.biosimulations.org/developers) for information about how to get started including how to install this package and how to run BioSimulations, runBioSimulations, and BioSimulators locally.

## License

This package is released under the [MIT license](./License.md). This package uses a number of open-source third-party packages. Their licenses are summarized in [Dependencies](./about/Dependencies).

## Contributors ✨

This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York and the [Center for Cell Analysis and Modeling](https://health.uconn.edu/cell-analysis-modeling/) at UConn Health as part of the [Center for Reproducible Biomodeling Modeling](https://reproduciblebiomodels.org).

Various people have contributed to this package, including:     

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.karrlab.org"><img src="https://avatars.githubusercontent.com/u/2848297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Karr</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=jonrkarr" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
A key for the contributions can be found here: ([emoji key](https://allcontributors.org/docs/en/emoji-key)).
This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
## Funding

This package was developed with support from the National Institute for Bioimaging and Bioengineering (award P41EB023912).

## Questions and comments

Please contact us at [info@biosimulations.org](mailto:info@biosimulations.org) with any questions or comments.
