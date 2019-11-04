# CRBM-Viz

[![Deployment](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Publish%20Docker/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Docker image](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Docker%20Image%20CI/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Tests](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Build,%20Lint,%20Test/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Documentation](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Documentation/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![Deploy](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/workflows/Publish%20Docker/badge.svg)](https://github.com/reproducible-biomedical-modeling/CRBM-Viz/actions)
[![codecov](https://codecov.io/gh/reproducible-biomedical-modeling/CRBM-Viz/branch/master/graph/badge.svg)](https://codecov.io/gh/reproducible-biomedical-modeling/CRBM-Viz)
[![Maintainability](https://api.codeclimate.com/v1/badges/56fb43ab9057c3121830/maintainability)](https://codeclimate.com/github/reproducible-biomedical-modeling/CRBM-Viz/maintainability)
[![License](https://img.shields.io/github/license/reproducible-biomedical-modeling/CRBM-Viz.svg)](LICENSE)
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

Please contact the [Karr Lab](mailto:info@karrlab.org) with any questions or comments.
