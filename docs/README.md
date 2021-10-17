![Logo](https://raw.githubusercontent.com/biosimulations/Biosimulations/dev/libs/shared/assets/src/assets/images/biosimulations-logo/logo-white.svg)


[![DOI](https://zenodo.org/badge/207730765.svg)](https://zenodo.org/badge/latestdoi/207730765) 
[![Continuous Integration](https://github.com/biosimulations/Biosimulations/workflows/Continuous%20Integration/badge.svg)](https://github.com/biosimulations/Biosimulations/actions?query=workflow%3A%22Continuous+Integration%22)
[![Continuous Deployment](https://github.com/biosimulations/Biosimulations/workflows/Continuous%20Deployment/badge.svg)](https://github.com/biosimulations/Biosimulations/actions?query=workflow%3A%22Continuous+Deployment%22)

[![App Status](https://deployment.biosimulations.org/api/badge?name=biosimulations-dev&revision=true)](https://deployment.biosimulations.org/applications/biosimulations-dev)
[![App Status](https://deployment.biosimulations.org/api/badge?name=biosimulations-prod&revision=true)](https://deployment.biosimulations.org/applications/biosimulations-prod)

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/5204/badge)](https://bestpractices.coreinfrastructure.org/projects/5204)

[![All Contributors](https://img.shields.io/github/all-contributors/biosimulations/biosimulations/HEAD)](#contributors-)

# BioSimulations

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse model components and simulations. Despite extensive efforts to develop standards such as [COMBINE/OMEX](https://combinearchive.org/), [SBML](http://sbml.org), and [SED-ML](https://sed-ml.org), it remains difficult to reuse many models and simulations. One challenge to reusing models and simulations is the diverse array of incompatible modeling formats and simulation tools.

This package provides three tools which address this challenge:

- [BioSimulators](https://biosimulators.org) is a registry of containerized simulation tools that provide consistent interfaces. BioSimulators makes it easier to find and run simulations.
- [runBioSimulations](https://run.biosimulations.org) is a simple web application for using the BioSimulators containers to run simulations. This tool makes it easy to run a broad range of simulations without having to install any software.
- [BioSimulations](https://biosimulations.org) is a platform for sharing and running modeling studies. BioSimulations provides a central place for investigators to exchange studies. BioSimulations uses the BioSimulators simulation tools, and builds on the functionality of runBioSimulations.

This package provides the code for the BioSimulations, runBioSimulations, and BioSimulations websites, as well as the code for the backend services for all three applications. The package is implemented in TypeScript using Angular, NestJS, MongoDB, and Mongoose.

## Getting started

### Users

Please use the hosted versions of BioSimulations, runBioSimulations, and BioSimulators at [https://biosimulations.org](https://biosimulations.org), [https://run.biosimulations.org](https://run.biosimulations.org), and [https://biosimulators.org](https://biosimulators.org).

Tutorials, help and information can be found at [https://docs.biosimulations.org](https://docs.biosimulations.org)

### Developers

We welcome contributions to BioSimulations, runBioSimulations, and BioSimulations! Please see the [developers guide](https://docs.biosimulations.org/developers) for information about how to get started including how to install this package and how to run BioSimulations, runBioSimulations, and BioSimulators locally.

## License

This package is released under the [MIT license](./License.md). This package uses a number of open-source third-party packages. Their licenses are summarized in [Dependencies](./about/Dependencies).

## Contributors

This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York and the [Center for Cell Analysis and Modeling](https://health.uconn.edu/cell-analysis-modeling/) at UConn Health as part of the [Center for Reproducible Biomodeling Modeling](https://reproduciblebiomodels.org).

Numerous individuals and groups have contributed to BioSimulations, including:     

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://hellix.com/Alan/"><img src="https://avatars.githubusercontent.com/u/602265?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alan Garny</b></sub></a><br /><a href="#ideas-agarny" title="Ideas, Planning, & Feedback">🤔</a> <a href="#data-agarny" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/ASinanSaglam"><img src="https://avatars.githubusercontent.com/u/11724447?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ali Sinan Saglam</b></sub></a><br /><a href="#data-ASinanSaglam" title="Data">🔣</a></td>
    <td align="center"><a href="https://research.pasteur.fr/en/member/anna-zhukova"><img src="https://avatars.githubusercontent.com/u/10465838?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anna Zhukova</b></sub></a><br /><a href="#data-annazhukova" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/AnneGoelzer"><img src="https://avatars.githubusercontent.com/u/32333634?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AnneGoelzer</b></sub></a><br /><a href="#data-AnneGoelzer" title="Data">🔣</a></td>
    <td align="center"><a href="http://aurelien.naldi.info/"><img src="https://avatars.githubusercontent.com/u/250984?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aurélien Naldi</b></sub></a><br /><a href="#data-aurelien-naldi" title="Data">🔣</a></td>
    <td align="center"><a href="http://bshaikh.com"><img src="https://avatars.githubusercontent.com/u/32490144?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bilal Shaikh</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=bilalshaikh42" title="Code">💻</a> <a href="https://github.com/biosimulations/biosimulations/commits?author=bilalshaikh42" title="Documentation">📖</a> <a href="#infra-bilalshaikh42" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://claudine-chaouiya.pedaweb.univ-amu.fr/index.html"><img src="https://avatars.githubusercontent.com/u/40125033?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Claudine Chaouiya</b></sub></a><br /><a href="#data-chaouiya" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://about.me/david.nickerson"><img src="https://avatars.githubusercontent.com/u/811244?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Nickerson</b></sub></a><br /><a href="#ideas-nickerso" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/DeepaMahm"><img src="https://avatars.githubusercontent.com/u/29662579?v=4?s=100" width="100px;" alt=""/><br /><sub><b>DeepaMahm</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/issues?q=author%3ADeepaMahm" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/fbergmann"><img src="https://avatars.githubusercontent.com/u/949059?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Frank Bergmann</b></sub></a><br /><a href="#ideas-fbergmann" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://gmarupilla.com"><img src="https://avatars.githubusercontent.com/u/53095348?v=4?s=100" width="100px;" alt=""/><br /><sub><b>GMarupilla</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=gmarupilla" title="Code">💻</a></td>
    <td align="center"><a href="http://www.sys-bio.org/"><img src="https://avatars.githubusercontent.com/u/1054990?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Herbert Sauro</b></sub></a><br /><a href="#ideas-hsauro" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/jhgennari"><img src="https://avatars.githubusercontent.com/u/2684850?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Gennari</b></sub></a><br /><a href="#ideas-jhgennari" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/joncison"><img src="https://avatars.githubusercontent.com/u/1506863?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jon Ison</b></sub></a><br /><a href="#data-joncison" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.karrlab.org"><img src="https://avatars.githubusercontent.com/u/2848297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Karr</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=jonrkarr" title="Code">💻</a> <a href="https://github.com/biosimulations/biosimulations/commits?author=jonrkarr" title="Documentation">📖</a> <a href="#design-jonrkarr" title="Design">🎨</a></td>
    <td align="center"><a href="http://loicpauleve.name/"><img src="https://avatars.githubusercontent.com/u/228657?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Loïc Paulevé</b></sub></a><br /><a href="#data-pauleve" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/luciansmith"><img src="https://avatars.githubusercontent.com/u/1736150?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucian Smith</b></sub></a><br /><a href="#ideas-luciansmith" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://uk.linkedin.com/in/manuelbernal"><img src="https://avatars.githubusercontent.com/u/8855107?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Manuel Bernal Llinares</b></sub></a><br /><a href="#data-mbdebian" title="Data">🔣</a></td>
    <td align="center"><a href="https://livermetabolism.com/"><img src="https://avatars.githubusercontent.com/u/900538?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matthias König</b></sub></a><br /><a href="#ideas-matthiaskoenig" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://orcid.org/0000-0002-1509-4981"><img src="https://avatars.githubusercontent.com/u/992660?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matúš Kalaš</b></sub></a><br /><a href="#data-matuskalas" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/vcellmike"><img src="https://avatars.githubusercontent.com/u/29076280?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Blinov</b></sub></a><br /><a href="#ideas-vcellmike" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://dumontierlab.com/"><img src="https://avatars.githubusercontent.com/u/993852?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michel Dumontier</b></sub></a><br /><a href="#data-micheldumontier" title="Data">🔣</a></td>
    <td align="center"><a href="https://hpc.uchc.edu"><img src="https://avatars.githubusercontent.com/u/400595?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mike Wilson</b></sub></a><br /><a href="#infra-mpw6" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://modeldb.yale.edu/"><img src="https://avatars.githubusercontent.com/u/38667483?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ModelDB</b></sub></a><br /><a href="#data-ModelDBRepository" title="Data">🔣</a></td>
    <td align="center"><a href="http://www.opensourcebrain.org/"><img src="https://avatars.githubusercontent.com/u/1556687?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Padraig Gleeson</b></sub></a><br /><a href="#data-pgleeson" title="Data">🔣</a></td>
    <td align="center"><a href="http://www.smoldyn.org/"><img src="https://avatars.githubusercontent.com/u/33039297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Steve Andrews</b></sub></a><br /><a href="#data-ssandrews" title="Data">🔣</a></td>
    <td align="center"><a href="http://systemsbiology.ucsd.edu/"><img src="https://avatars.githubusercontent.com/u/4237829?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Systems Biology Research Group</b></sub></a><br /><a href="#data-SBRG" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/abulovic"><img src="https://avatars.githubusercontent.com/u/1510530?v=4?s=100" width="100px;" alt=""/><br /><sub><b>abulovic</b></sub></a><br /><a href="#data-abulovic" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/cjmyers"><img src="https://avatars.githubusercontent.com/u/3507191?v=4?s=100" width="100px;" alt=""/><br /><sub><b>cjmyers</b></sub></a><br /><a href="#ideas-cjmyers" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/moraru"><img src="https://avatars.githubusercontent.com/u/7397814?v=4?s=100" width="100px;" alt=""/><br /><sub><b>moraru</b></sub></a><br /><a href="#infra-moraru" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-moraru" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
A key to the above emojis is available [here](https://allcontributors.org/docs/en/emoji-key).


## Contributing to BioSimulations
We enthusiastically welcome contributions to BioSimulations! Please see the [guide to contributing](docs/CONTRIBUTING.md) and the [developer's code of conduct](docs/CODE_OF_CONDUCT.md).

## Funding

This package was developed with support from the National Institute for Bioimaging and Bioengineering (award P41EB023912).

## Questions and comments

Please contact us at [info@biosimulations.org](mailto:info@biosimulations.org) with any questions or comments.
