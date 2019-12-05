![Logo](CRBM-Viz/src/assets/logo/logo-white.svg)

# BioSimulations
The front end for the [Center for Reproducible Biomedical Modeling's](https://reproduciblebiomodels.org/) simulation service

[![Tests](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Build,%20Lint,%20Test/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Docker image](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Docker%20Image%20CI/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Documentation](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Documentation/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Deploy](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Publish%20Docker/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)


[![codecov](https://codecov.io/gh/reproducible-biomedical-modeling/CRBM-Viz/branch/master/graph/badge.svg)](https://codecov.io/gh/reproducible-biomedical-modeling/CRBM-Viz)
[![CodeFactor](https://www.codefactor.io/repository/github/reproducible-biomedical-modeling/crbm-viz/badge)](https://www.codefactor.io/repository/github/reproducible-biomedical-modeling/crbm-viz)
[![GitHub issues](https://img.shields.io/github/issues/reproducible-biomedical-modeling/CRBM-Viz?logo=GitHub)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/issues)
[![Documentation Coverage](https://reproducible-biomedical-modeling.github.io/CRBM-Viz/images/coverage-badge-documentation.svg)](https://reproducible-biomedical-modeling.github.io/CRBM-Viz/)
[![License](https://img.shields.io/github/license/reproducible-biomedical-modeling/CRBM-Viz.svg)](LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B12818%2Fgit%40github.com%3Areproducible-biomedical-modeling%2FCRBM-Viz.git.svg?type=shield)](https://app.fossa.com/projects/custom%2B12818%2Fgit%40github.com%3Areproducible-biomedical-modeling%2FCRBM-Viz.git?ref=badge_shield)
![Analytics](https://ga-beacon.appspot.com/UA-86759801-1/CRBM-Viz/README.md?pixel)

## Current Build

https://crbm-viz.herokuapp.com/

## Installation and deployment

### Using the public deployment of the latest build

The latest build is automatically publicly deployed [here](https://crbm-viz.herokuapp.com/).

### Deploying the app locally

1. Install the latest long-term support release of Node.js (12.x) and NPM (6.x). Below are installation instructions for Ubuntu 18:

   ```
   curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
   apt-get install nodejs
   ```

2. Clone the application

   ```
   git clone https://github.com/reproducible-biomedical-modeling/CRBM-Viz.git
   ```

3. Install the application

   ```
   cd CRBM-Viz/CRBM-Viz
   npm install -g @angular/cli
   npm install .
   ```

4. Run the application

   ```
   ng serve
   ```

5. Open the application by navigating your browser to http://localhost:4200/

### Deploying a new production version

To deploy a new version into production:

1. Ensure that all tests have passed.

2. Visit the test deployment at the above link and check that the site is functional.

3. Create a release in GitHub and assign it an appropriate version tag.
   This will update the latest build image on DockerHub.

## Documentation

* [User guide](https://crbm-viz.herokuapp.com/help)
* [Code documentation](https://reproducible-biomedical-modeling.github.io/CRBM-Viz/)
* REST API documentation

## License

This package is released under the [MIT license](LICENSE).
## Dependencies
This package uses dependencies distributed under various licences. Please see the [dependencies report](https://app.fossa.com/attribution/ba821b8e-9edf-481b-a00a-eea0eb10bf63) for more information
## Development team

This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York and the [Center for Cell Analysis and Modeling](https://health.uconn.edu/cell-analysis-modeling/) at the University of Connecticut Health Center as part of the [Center for Reproducible Biomodeling Modeling](https://reproduciblebiomodels.org).

- [Bilal Shaikh](https://www.bshaikh.com)
- [Jonathan Karr](https://www.karrlab.org)
- Akhil Marupilla
- [Mike Wilson](https://www.linkedin.com/in/mike-wilson-08b3324/)
- [Ion Moraru](https://facultydirectory.uchc.edu/profile?profileId=Moraru-Ion)

## Funding

This package was developed with support from the National Institute for Bioimaging and Bioengineering (award P41EB023912).

## Questions and comments

Please contact [us](mailto:info@biosimulations.org) with any questions or comments.
