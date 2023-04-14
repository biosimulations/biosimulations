![Logo](https://raw.githubusercontent.com/biosimulations/biosimulations/dev/libs/shared/assets/src/assets/images/biosimulations-logo/logo-white.svg)

[![App Status](https://deployment.biosimulations.org/api/badge?name=biosimulations-dev&revision=true)](https://deployment.biosimulations.org/applications/biosimulations-dev)
[![App Status](https://deployment.biosimulations.org/api/badge?name=biosimulations-prod&revision=true)](https://deployment.biosimulations.org/applications/biosimulations-prod)
[![Continuous Integration](https://github.com/biosimulations/biosimulations/actions/workflows/cd.yml/badge.svg)](https://github.com/biosimulations/biosimulations/actions/workflows/cd.yml)
[![Continuous Deployment](https://github.com/biosimulations/biosimulations/actions/workflows/deploy.yml/badge.svg)](https://github.com/biosimulations/biosimulations/actions/workflows/deploy.yml)

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/5204/badge)](https://bestpractices.coreinfrastructure.org/projects/5204)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=bugs)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=biosimulations_biosimulations&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=biosimulations_biosimulations)



[![All Contributors](https://img.shields.io/github/all-contributors/biosimulations/biosimulations/HEAD)](#contributors-)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-1.4-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![DOI](https://zenodo.org/badge/207730765.svg)](https://zenodo.org/badge/latestdoi/207730765) 

# BioSimulations 🧬

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse model components and simulations. Despite extensive efforts to develop standards such as [COMBINE/OMEX](https://combinearchive.org/), [SBML](http://sbml.org), and [SED-ML](https://sed-ml.org), it remains difficult to reuse many models and simulations. One challenge to reusing models and simulations is the diverse array of incompatible modeling formats and simulation tools.

This package provides three tools which address this challenge:

- [BioSimulators](https://biosimulators.org) is a registry of containerized simulation tools that provide consistent interfaces. BioSimulators makes it easier to find and run simulations.
- [BioSimulations](https://biosimulations.org) is a platform for sharing and running modeling studies. BioSimulations provides a central place for investigators to exchange studies. BioSimulations uses the BioSimulators simulation tools, and builds on the functionality of runBioSimulations.

This package provides the code for the BioSimulations, runBioSimulations, and BioSimulations websites, as well as the code for the backend services for all three applications. The package is implemented in TypeScript using Angular, NestJS, MongoDB, and Mongoose.

## Getting started ▶️

### Users 💻

Please use the hosted versions of BioSimulations, and BioSimulators at [https://biosimulations.org](https://biosimulations.org) and [https://biosimulators.org](https://biosimulators.org).

Tutorials, help and information can be found at [https://docs.biosimulations.org](https://docs.biosimulations.org)

### Developers 🖥️

We welcome contributions to BioSimulations, runBioSimulations, and BioSimulations! Please see the [developer guide](https://docs.biosimulations.org/developers) for information about how to get started including how to install this package and how to run BioSimulations, runBioSimulations, and BioSimulators locally.

## License ⚖️

This package is released under the [MIT license](./License.md). This package uses a number of open-source third-party packages. Their licenses are summarized in [Dependencies](./about/Dependencies).

## Show your support 🤝

If you find this project interesting or useful, please give our repo a ⭐ and share with others that may benefit. If you use the code and tools in this repository as a part of an academic work, please cite us using the following bibtex entry. 

```
@software{Shaikh_BioSimulations,
author = {Shaikh, Bilal and Marupilla, Gnaneswara and Wilson, Mike and Michael, Blinov L. and Moraru, Ion I. and Karr, Jonathan R.},
doi = {10.5281/zenodo.5057108},
license = {MIT},
title = {{BioSimulations}},
url = {https://github.com/biosimulations/biosimulations}
}
```

## Contributors 🧑‍🤝‍🧑

This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York and the [Center for Cell Analysis and Modeling](https://health.uconn.edu/cell-analysis-modeling/) at UConn Health as part of the [Center for Reproducible Biomodeling Modeling](https://reproduciblebiomodels.org).

Numerous individuals and groups have contributed to BioSimulations, including:     

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/AMICI-dev"><img src="https://avatars.githubusercontent.com/u/68919097?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AMICI</b></sub></a><br /><a href="#tool-AMICI-dev" title="Tools">🔧</a></td>
    <td align="center"><a href="https://fun.bio.keio.ac.jp/"><img src="https://avatars.githubusercontent.com/u/1589676?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Akira Funahashi</b></sub></a><br /><a href="#tool-funasoul" title="Tools">🔧</a></td>
    <td align="center"><a href="https://hellix.com/Alan/"><img src="https://avatars.githubusercontent.com/u/602265?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alan Garny</b></sub></a><br /><a href="#ideas-agarny" title="Ideas, Planning, & Feedback">🤔</a> <a href="#data-agarny" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/ajelenak"><img src="https://avatars.githubusercontent.com/u/7267124?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aleksandar Jelenak</b></sub></a><br /><a href="#tool-ajelenak" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/ASinanSaglam"><img src="https://avatars.githubusercontent.com/u/11724447?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ali Sinan Saglam</b></sub></a><br /><a href="#data-ASinanSaglam" title="Data">🔣</a></td>
    <td align="center"><a href="https://uni-tuebingen.de/en/127116"><img src="https://avatars.githubusercontent.com/u/1740827?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andreas Dräger</b></sub></a><br /><a href="#tool-draeger" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/AnkitaxPriya"><img src="https://avatars.githubusercontent.com/u/44089458?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ankita</b></sub></a><br /><a href="#data-AnkitaxPriya" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ankursinha.in/"><img src="https://avatars.githubusercontent.com/u/102575?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ankur Sinha</b></sub></a><br /><a href="#tool-sanjayankur31" title="Tools">🔧</a></td>
    <td align="center"><a href="https://research.pasteur.fr/en/member/anna-zhukova"><img src="https://avatars.githubusercontent.com/u/10465838?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anna Zhukova</b></sub></a><br /><a href="#data-annazhukova" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/AnneGoelzer"><img src="https://avatars.githubusercontent.com/u/32333634?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AnneGoelzer</b></sub></a><br /><a href="#data-AnneGoelzer" title="Data">🔣</a></td>
    <td align="center"><a href="https://www.mountsinai.org/profiles/arthur-p-goldberg"><img src="https://avatars.githubusercontent.com/u/33882?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arthur P Goldberg</b></sub></a><br /><a href="#ideas-artgoldberg" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://aurelien.naldi.info/"><img src="https://avatars.githubusercontent.com/u/250984?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aurélien Naldi</b></sub></a><br /><a href="#data-aurelien-naldi" title="Data">🔣</a> <a href="#tool-aurelien-naldi" title="Tools">🔧</a></td>
    <td align="center"><a href="http://bshaikh.com"><img src="https://avatars.githubusercontent.com/u/32490144?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bilal Shaikh</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=bilalshaikh42" title="Code">💻</a> <a href="https://github.com/biosimulations/biosimulations/commits?author=bilalshaikh42" title="Documentation">📖</a> <a href="#infra-bilalshaikh42" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://www.ebi.ac.uk/biomodels"><img src="https://avatars.githubusercontent.com/u/74367888?v=4?s=100" width="100px;" alt=""/><br /><sub><b>BioModels</b></sub></a><br /><a href="#data-EBI-BioModels" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://teusinkbruggemanlab.nl/brett-olivier/"><img src="https://avatars.githubusercontent.com/u/5011985?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brett Olivier</b></sub></a><br /><a href="#tool-bgoli" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/briandrawert"><img src="https://avatars.githubusercontent.com/u/1413538?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brian Drawert</b></sub></a><br /><a href="#tool-briandrawert" title="Tools">🔧</a></td>
    <td align="center"><a href="https://briansimulator.org/"><img src="https://avatars.githubusercontent.com/u/2292949?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brian simulator</b></sub></a><br /><a href="#tool-brian-team" title="Tools">🔧</a></td>
    <td align="center"><a href="http://www.copasi.org/"><img src="https://avatars.githubusercontent.com/u/1854399?v=4?s=100" width="100px;" alt=""/><br /><sub><b>COPASI</b></sub></a><br /><a href="#tool-copasi" title="Tools">🔧</a></td>
    <td align="center"><a href="https://reproduciblebiomodels.org"><img src="https://avatars.githubusercontent.com/u/70044163?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Center for Reproducible Biomedical Modeling</b></sub></a><br /><a href="#financial-reproducible-biomedical-modeling" title="Financial">💵</a> <a href="#fundingFinding-reproducible-biomedical-modeling" title="Funding Finding">🔍</a> <a href="#projectManagement-reproducible-biomedical-modeling" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/CiaranWelsh"><img src="https://avatars.githubusercontent.com/u/19502680?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ciaran Welsh</b></sub></a><br /><a href="#tool-CiaranWelsh" title="Tools">🔧</a></td>
    <td align="center"><a href="https://claudine-chaouiya.pedaweb.univ-amu.fr/index.html"><img src="https://avatars.githubusercontent.com/u/40125033?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Claudine Chaouiya</b></sub></a><br /><a href="#data-chaouiya" title="Data">🔣</a> <a href="#tool-chaouiya" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/danv61"><img src="https://avatars.githubusercontent.com/u/29076329?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dan Vasilescu</b></sub></a><br /><a href="#tool-danv61" title="Tools">🔧</a></td>
    <td align="center"><a href="https://www.helmholtz-muenchen.de/icb/institute/staff/staff/ma/5122/index.html"><img src="https://avatars.githubusercontent.com/u/18048784?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Weindl</b></sub></a><br /><a href="#tool-dweindl" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/dbrnz"><img src="https://avatars.githubusercontent.com/u/239220?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Brooks</b></sub></a><br /><a href="#tool-dbrnz" title="Tools">🔧</a></td>
    <td align="center"><a href="http://about.me/david.nickerson"><img src="https://avatars.githubusercontent.com/u/811244?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Nickerson</b></sub></a><br /><a href="#ideas-nickerso" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/DeepaMahm"><img src="https://avatars.githubusercontent.com/u/29662579?v=4?s=100" width="100px;" alt=""/><br /><sub><b>DeepaMahm</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/issues?q=author%3ADeepaMahm" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/jdieg0"><img src="https://avatars.githubusercontent.com/u/6570972?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Diego</b></sub></a><br /><a href="#tool-jdieg0" title="Tools">🔧</a></td>
    <td align="center"><a href="https://dilawars.me/"><img src="https://avatars.githubusercontent.com/u/895681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dilawar Singh</b></sub></a><br /><a href="#tool-dilawar" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/edkerk"><img src="https://avatars.githubusercontent.com/u/7326655?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Eduard Kerkhoven</b></sub></a><br /><a href="#tool-edkerk" title="Tools">🔧</a></td>
    <td align="center"><a href="https://eagmon.github.io/"><img src="https://avatars.githubusercontent.com/u/6809431?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Eran Agmon</b></sub></a><br /><a href="#ideas-eagmon" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Ermentrout"><img src="https://avatars.githubusercontent.com/u/7952422?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ermentrout</b></sub></a><br /><a href="#tool-Ermentrout" title="Tools">🔧</a></td>
    <td align="center"><a href="https://escher.github.io/"><img src="https://avatars.githubusercontent.com/u/9327950?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Escher</b></sub></a><br /><a href="#tool-escher" title="Tools">🔧</a></td>
    <td align="center"><a href="https://scholar.harvard.edu/fabianfroehlich/home"><img src="https://avatars.githubusercontent.com/u/14923969?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fabian Fröhlich</b></sub></a><br /><a href="#tool-FFroehlich" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/zhangfengkai"><img src="https://avatars.githubusercontent.com/u/38113699?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fengkai Zhang</b></sub></a><br /><a href="#tool-zhangfengkai" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/fbergmann"><img src="https://avatars.githubusercontent.com/u/949059?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Frank Bergmann</b></sub></a><br /><a href="#ideas-fbergmann" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/GINsim"><img src="https://avatars.githubusercontent.com/u/32065286?v=4?s=100" width="100px;" alt=""/><br /><sub><b>GINsim</b></sub></a><br /><a href="#tool-GINsim" title="Tools">🔧</a></td>
    <td align="center"><a href="http://gmarupilla.com"><img src="https://avatars.githubusercontent.com/u/53095348?v=4?s=100" width="100px;" alt=""/><br /><sub><b>GMarupilla</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=gmarupilla" title="Code">💻</a></td>
    <td align="center"><a href="http://helikarlab.org/"><img src="https://avatars.githubusercontent.com/u/17307008?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Helikar Lab Personal</b></sub></a><br /><a href="#tool-HelikarLabPersonal" title="Tools">🔧</a></td>
    <td align="center"><a href="http://www.sys-bio.org/"><img src="https://avatars.githubusercontent.com/u/1054990?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Herbert Sauro</b></sub></a><br /><a href="#ideas-hsauro" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/hsorby"><img src="https://avatars.githubusercontent.com/u/778048?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hugh Sorby</b></sub></a><br /><a href="#tool-hsorby" title="Tools">🔧</a></td>
    <td align="center"><a href="http://identifiers.org/"><img src="https://avatars.githubusercontent.com/u/18701545?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Idenfitiers.org</b></sub></a><br /><a href="#data-identifiers-org" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/JanHasenauer"><img src="https://avatars.githubusercontent.com/u/12297214?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jan Hasenauer</b></sub></a><br /><a href="#tool-JanHasenauer" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://bionetgen.org/"><img src="https://avatars.githubusercontent.com/u/8277248?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jim Faeder</b></sub></a><br /><a href="#tool-jrfaeder" title="Tools">🔧</a> <a href="#data-jrfaeder" title="Data">🔣</a></td>
    <td align="center"><a href="http://vcell.org"><img src="https://avatars.githubusercontent.com/u/20616724?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jim Schaff</b></sub></a><br /><a href="#ideas-jcschaff" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/jmrohwer"><img src="https://avatars.githubusercontent.com/u/502289?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johann Rohwer</b></sub></a><br /><a href="#tool-jmrohwer" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/jmdetloff"><img src="https://avatars.githubusercontent.com/u/1418389?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Detloff</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=jmdetloff" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jhgennari"><img src="https://avatars.githubusercontent.com/u/2684850?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Gennari</b></sub></a><br /><a href="#ideas-jhgennari" title="Ideas, Planning, & Feedback">🤔</a> <a href="#tool-jhgennari" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/jreadey"><img src="https://avatars.githubusercontent.com/u/7785492?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Readey</b></sub></a><br /><a href="#tool-jreadey" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/johnsekar"><img src="https://avatars.githubusercontent.com/u/1610689?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Sekar</b></sub></a><br /><a href="#ideas-johnsekar" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/joncison"><img src="https://avatars.githubusercontent.com/u/1506863?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jon Ison</b></sub></a><br /><a href="#data-joncison" title="Data">🔣</a></td>
    <td align="center"><a href="https://www.karrlab.org"><img src="https://avatars.githubusercontent.com/u/2848297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Karr</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=jonrkarr" title="Code">💻</a> <a href="https://github.com/biosimulations/biosimulations/commits?author=jonrkarr" title="Documentation">📖</a> <a href="#design-jonrkarr" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/jtcooper10"><img src="https://avatars.githubusercontent.com/u/42880781?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joshua Cooper</b></sub></a><br /><a href="#tool-jtcooper10" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/starboerg"><img src="https://avatars.githubusercontent.com/u/5522086?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jörn Starruß</b></sub></a><br /><a href="#tool-starboerg" title="Tools">🔧</a></td>
    <td align="center"><a href="http://juergen.pahle.de/"><img src="https://avatars.githubusercontent.com/u/5473011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jürgen Pahle</b></sub></a><br /><a href="#tool-jpahle" title="Tools">🔧</a></td>
    <td align="center"><a href="https://www.karrlab.org/"><img src="https://avatars.githubusercontent.com/u/13785824?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Karr whole-cell modeling lab</b></sub></a><br /><a href="#ideas-KarrLab" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/0u812"><img src="https://avatars.githubusercontent.com/u/7402146?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kyle Medley</b></sub></a><br /><a href="#tool-0u812" title="Tools">🔧</a> <a href="#ideas-0u812" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://lems.github.io/LEMS"><img src="https://avatars.githubusercontent.com/u/3033237?v=4?s=100" width="100px;" alt=""/><br /><sub><b>LEMS</b></sub></a><br /><a href="#tool-LEMS" title="Tools">🔧</a></td>
    <td align="center"><a href="http://loicpauleve.name/"><img src="https://avatars.githubusercontent.com/u/228657?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Loïc Paulevé</b></sub></a><br /><a href="#data-pauleve" title="Data">🔣</a> <a href="#tool-pauleve" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/luciansmith"><img src="https://avatars.githubusercontent.com/u/1736150?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucian Smith</b></sub></a><br /><a href="#ideas-luciansmith" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/lutzbrusch"><img src="https://avatars.githubusercontent.com/u/13622401?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lutz Brusch</b></sub></a><br /><a href="#tool-lutzbrusch" title="Tools">🔧</a></td>
    <td align="center"><a href="https://uk.linkedin.com/in/manuelbernal"><img src="https://avatars.githubusercontent.com/u/8855107?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Manuel Bernal Llinares</b></sub></a><br /><a href="#data-mbdebian" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/MarcDinh"><img src="https://avatars.githubusercontent.com/u/50445930?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MarcDinh</b></sub></a><br /><a href="#tool-MarcDinh" title="Tools">🔧</a></td>
    <td align="center"><a href="https://livermetabolism.com/"><img src="https://avatars.githubusercontent.com/u/900538?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matthias König</b></sub></a><br /><a href="#ideas-matthiaskoenig" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://orcid.org/0000-0002-1509-4981"><img src="https://avatars.githubusercontent.com/u/992660?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matúš Kalaš</b></sub></a><br /><a href="#data-matuskalas" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/vcellmike"><img src="https://avatars.githubusercontent.com/u/29076280?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Blinov</b></sub></a><br /><a href="#ideas-vcellmike" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://dumontierlab.com/"><img src="https://avatars.githubusercontent.com/u/993852?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michel Dumontier</b></sub></a><br /><a href="#data-micheldumontier" title="Data">🔣</a></td>
    <td align="center"><a href="http://www.cds.caltech.edu/~mhucka"><img src="https://avatars.githubusercontent.com/u/1450019?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mike Hucka</b></sub></a><br /><a href="#tool-mhucka" title="Tools">🔧</a></td>
    <td align="center"><a href="https://hpc.uchc.edu"><img src="https://avatars.githubusercontent.com/u/400595?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mike Wilson</b></sub></a><br /><a href="#infra-mpw6" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://modeldb.yale.edu/"><img src="https://avatars.githubusercontent.com/u/38667483?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ModelDB</b></sub></a><br /><a href="#data-ModelDBRepository" title="Data">🔣</a></td>
    <td align="center"><a href="https://unseenbio.com/"><img src="https://avatars.githubusercontent.com/u/135653?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Moritz E. Beber</b></sub></a><br /><a href="#tool-Midnighter" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.nibib.nih.gov/"><img src="https://avatars.githubusercontent.com/u/12418167?v=4?s=100" width="100px;" alt=""/><br /><sub><b>National Institute of Biomedical Imaging and Bioengineering</b></sub></a><br /><a href="#financial-NIBIB" title="Financial">💵</a></td>
    <td align="center"><a href="https://nih.gov/"><img src="https://avatars.githubusercontent.com/u/52710462?v=4?s=100" width="100px;" alt=""/><br /><sub><b>National Institutes of Health</b></sub></a><br /><a href="#financial-NIHGOV" title="Financial">💵</a></td>
    <td align="center"><a href="https://nsf.gov/"><img src="https://avatars.githubusercontent.com/u/23663503?v=4?s=100" width="100px;" alt=""/><br /><sub><b>National Science Foundation</b></sub></a><br /><a href="#financial-NSF-open" title="Financial">💵</a></td>
    <td align="center"><a href="https://docs.neuroml.org/"><img src="https://avatars.githubusercontent.com/u/2727519?v=4?s=100" width="100px;" alt=""/><br /><sub><b>NeuroML</b></sub></a><br /><a href="#tool-NeuroML" title="Tools">🔧</a></td>
    <td align="center"><a href="http://neurosimlab.org/"><img src="https://avatars.githubusercontent.com/u/14202113?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Neurosim lab</b></sub></a><br /><a href="#tool-Neurosim-lab" title="Tools">🔧</a></td>
    <td align="center"><a href="https://opencor.ws/"><img src="https://avatars.githubusercontent.com/u/754570?v=4?s=100" width="100px;" alt=""/><br /><sub><b>OpenCOR</b></sub></a><br /><a href="#tool-opencor" title="Tools">🔧</a></td>
    <td align="center"><a href="https://models.physiomeproject.org/"><img src="https://avatars.githubusercontent.com/u/1114929?v=4?s=100" width="100px;" alt=""/><br /><sub><b>PMR2 - the software behind the Auckland Physiome Repository</b></sub></a><br /><a href="#data-PMR2" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.opensourcebrain.org/"><img src="https://avatars.githubusercontent.com/u/1556687?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Padraig Gleeson</b></sub></a><br /><a href="#data-pgleeson" title="Data">🔣</a> <a href="#tool-pgleeson" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/Paytonco"><img src="https://avatars.githubusercontent.com/u/7064808?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Payton Thomas</b></sub></a><br /><a href="#tool-Paytonco" title="Tools">🔧</a></td>
    <td align="center"><a href="http://www.comp-sys-bio.org/"><img src="https://avatars.githubusercontent.com/u/2159130?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pedro Mendes</b></sub></a><br /><a href="#tool-pmendes" title="Tools">🔧</a></td>
    <td align="center"><a href="http://pedromonteiro.org/"><img src="https://avatars.githubusercontent.com/u/2027375?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pedro T. Monteiro</b></sub></a><br /><a href="#tool-ptgm" title="Tools">🔧</a></td>
    <td align="center"><a href="http://pysces.sourceforge.net/"><img src="https://avatars.githubusercontent.com/u/6103247?v=4?s=100" width="100px;" alt=""/><br /><sub><b>PySCeS: The Python Simulator for Cellular Systems, provides a variety of tools for the analysis of cellular systems</b></sub></a><br /><a href="#tool-PySCeS" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/Ragzz1995"><img src="https://avatars.githubusercontent.com/u/16513966?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Raghul Kannan</b></sub></a><br /><a href="#tool-Ragzz1995" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/rsmsheriff"><img src="https://avatars.githubusercontent.com/u/7849690?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rahuman Sheriff</b></sub></a><br /><a href="#data-rsmsheriff" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://raashika03.github.io/rashika.rathi/"><img src="https://avatars.githubusercontent.com/u/45493793?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rashika Rathi</b></sub></a><br /><a href="#data-raashika03" title="Data">🔣</a></td>
    <td align="center"><a href="http://allencell.org/"><img src="https://avatars.githubusercontent.com/u/9079?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryan Spangler</b></sub></a><br /><a href="#ideas-prismofeverything" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Ryannjordan"><img src="https://avatars.githubusercontent.com/u/86376602?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryann Jordan</b></sub></a><br /><a href="#data-Ryannjordan" title="Data">🔣</a></td>
    <td align="center"><a href="http://sbml.org/About"><img src="https://avatars.githubusercontent.com/u/1799692?v=4?s=100" width="100px;" alt=""/><br /><sub><b>SBML Team</b></sub></a><br /><a href="#tool-sbmlteam" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/SED-ML"><img src="https://avatars.githubusercontent.com/u/29736746?v=4?s=100" width="100px;" alt=""/><br /><sub><b>SED-ML</b></sub></a><br /><a href="#tool-SED-ML" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/skeating"><img src="https://avatars.githubusercontent.com/u/1736558?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sarah Keating</b></sub></a><br /><a href="#tool-skeating" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/shoops"><img src="https://avatars.githubusercontent.com/u/1760522?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stefan Hoops</b></sub></a><br /><a href="#tool-shoops" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.smoldyn.org/"><img src="https://avatars.githubusercontent.com/u/33039297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Steve Andrews</b></sub></a><br /><a href="#data-ssandrews" title="Data">🔣</a> <a href="#tool-ssandrews" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/StochSS"><img src="https://avatars.githubusercontent.com/u/3344600?v=4?s=100" width="100px;" alt=""/><br /><sub><b>StochSS</b></sub></a><br /><a href="#tool-StochSS" title="Tools">🔧</a></td>
    <td align="center"><a href="https://maiage.inrae.fr/en/biosys"><img src="https://avatars.githubusercontent.com/u/32363627?v=4?s=100" width="100px;" alt=""/><br /><sub><b>SysBioINRAe</b></sub></a><br /><a href="#tool-SysBioInra" title="Tools">🔧</a> <a href="#data-SysBioInra" title="Data">🔣</a></td>
    <td align="center"><a href="https://science.vu.nl/en/research/molecular-cell-biology/systems-bioinformatics/index.aspx"><img src="https://avatars.githubusercontent.com/u/12168054?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Systems Biology Lab, Vrije Universiteit Amsterdam</b></sub></a><br /><a href="#tool-SystemsBioinformatics" title="Tools">🔧</a></td>
    <td align="center"><a href="http://systemsbiology.ucsd.edu/"><img src="https://avatars.githubusercontent.com/u/4237829?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Systems Biology Research Group</b></sub></a><br /><a href="#data-SBRG" title="Data">🔣</a></td>
    <td align="center"><a href="https://www.hdfgroup.org/"><img src="https://avatars.githubusercontent.com/u/8572050?v=4?s=100" width="100px;" alt=""/><br /><sub><b>The HDF Group</b></sub></a><br /><a href="#tool-HDFGroup" title="Tools">🔧</a></td>
    <td align="center"><a href="http://neuron.yale.edu/"><img src="https://avatars.githubusercontent.com/u/38567601?v=4?s=100" width="100px;" alt=""/><br /><sub><b>The NEURON Simulator</b></sub></a><br /><a href="#tool-neuronsimulator" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://cellml.org/"><img src="https://avatars.githubusercontent.com/u/2141414?v=4?s=100" width="100px;" alt=""/><br /><sub><b>The home of CellML on Github</b></sub></a><br /><a href="#tool-cellml" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/metatoaster"><img src="https://avatars.githubusercontent.com/u/372914?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tommy Yu</b></sub></a><br /><a href="#data-metatoaster" title="Data">🔣</a></td>
    <td align="center"><a href="https://www.itersdesktop.com/"><img src="https://avatars.githubusercontent.com/u/663341?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tung Nguyen</b></sub></a><br /><a href="#data-ntung" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/sys-bio"><img src="https://avatars.githubusercontent.com/u/5590646?v=4?s=100" width="100px;" alt=""/><br /><sub><b>UW Sauro Lab</b></sub></a><br /><a href="#tool-sys-bio" title="Tools">🔧</a></td>
    <td align="center"><a href="https://vega.github.io/"><img src="https://avatars.githubusercontent.com/u/11796929?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vega</b></sub></a><br /><a href="#tool-vega" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/veitveit"><img src="https://avatars.githubusercontent.com/u/15800709?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Veit Schwämmle</b></sub></a><br /><a href="#data-veitveit" title="Data">🔣</a></td>
    <td align="center"><a href="http://vcell.org/"><img src="https://avatars.githubusercontent.com/u/29076025?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Virtual Cell</b></sub></a><br /><a href="#tool-virtualcell" title="Tools">🔧</a> <a href="#data-virtualcell" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://genome.jouy.inra.fr/~wliebermeis/index_en.html"><img src="https://avatars.githubusercontent.com/u/3976679?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wolfram Liebermeister</b></sub></a><br /><a href="#tool-liebermeister" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/YinHoon"><img src="https://avatars.githubusercontent.com/u/11270172?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yin Hoon Chew</b></sub></a><br /><a href="#ideas-YinHoon" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/zakandrewking/"><img src="https://avatars.githubusercontent.com/u/1250400?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Zachary A. King</b></sub></a><br /><a href="#tool-zakandrewking" title="Tools">🔧</a> <a href="#data-zakandrewking" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/abulovic"><img src="https://avatars.githubusercontent.com/u/1510530?v=4?s=100" width="100px;" alt=""/><br /><sub><b>abulovic</b></sub></a><br /><a href="#data-abulovic" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/cjmyers"><img src="https://avatars.githubusercontent.com/u/3507191?v=4?s=100" width="100px;" alt=""/><br /><sub><b>cjmyers</b></sub></a><br /><a href="#ideas-cjmyers" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/dczielinski"><img src="https://avatars.githubusercontent.com/u/4442307?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dczielinski</b></sub></a><br /><a href="#tool-dczielinski" title="Tools">🔧</a></td>
    <td align="center"><a href="https://thesustainablevegan.org/"><img src="https://avatars.githubusercontent.com/u/60083977?v=4?s=100" width="100px;" alt=""/><br /><sub><b>freiburgermsu</b></sub></a><br /><a href="https://github.com/biosimulations/biosimulations/commits?author=freiburgermsu" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/jtyurkovich"><img src="https://avatars.githubusercontent.com/u/5396263?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jtyurkovich</b></sub></a><br /><a href="#tool-jtyurkovich" title="Tools">🔧</a></td>
    <td align="center"><a href="http://fun.bio.keio.ac.jp/software/libsbmlsim/"><img src="https://avatars.githubusercontent.com/u/16151392?v=4?s=100" width="100px;" alt=""/><br /><sub><b>libsbmlsim</b></sub></a><br /><a href="#tool-libsbmlsim" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/moraru"><img src="https://avatars.githubusercontent.com/u/7397814?v=4?s=100" width="100px;" alt=""/><br /><sub><b>moraru</b></sub></a><br /><a href="#infra-moraru" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-moraru" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/obodeit"><img src="https://avatars.githubusercontent.com/u/38722594?v=4?s=100" width="100px;" alt=""/><br /><sub><b>obodeit</b></sub></a><br /><a href="#tool-obodeit" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/opencobra"><img src="https://avatars.githubusercontent.com/u/2708410?v=4?s=100" width="100px;" alt=""/><br /><sub><b>openCOBRA</b></sub></a><br /><a href="#tool-opencobra" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/RuleWorld"><img src="https://avatars.githubusercontent.com/u/11491841?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ruleworld</b></sub></a><br /><a href="#tool-RuleWorld" title="Tools">🔧</a> <a href="#data-RuleWorld" title="Data">🔣</a></td>
    <td align="center"><a href="https://github.com/yexilein"><img src="https://avatars.githubusercontent.com/u/30040612?v=4?s=100" width="100px;" alt=""/><br /><sub><b>yexilein</b></sub></a><br /><a href="#tool-yexilein" title="Tools">🔧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/z-haiman"><img src="https://avatars.githubusercontent.com/u/29131681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>z-haiman</b></sub></a><br /><a href="#tool-z-haiman" title="Tools">🔧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
A key to the above emojis is available [here](https://allcontributors.org/docs/en/emoji-key).


## Contributing to BioSimulations 🛠️
We enthusiastically welcome contributions to BioSimulations! Please see the [guide to contributing](https://docs.biosimulations.org/developers) and the [developer's code of conduct](https://docs.biosimulations.org/developers/conduct).

## Funding 💰

This package was developed with support from the National Institute for Bioimaging and Bioengineering (award P41EB023912).

## Questions and comments ❓

We welcome any comments, questions, or discussion about the project. Please create a discussion or question in our [discussion forum](https://github.com/biosimulations/biosimulations/discussions).

To privately contact the BioSimulations team, you can send us an email at [info@biosimulations.org](mailto:info@biosimulations.org).
