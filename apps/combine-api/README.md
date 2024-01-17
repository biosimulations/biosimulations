# COMBINE-API 

COMBINE-API is an HTTP API for working with COMBINE/OMEX archives and other COMBINE formats, such as the OMEX manifest, OMEX metadata, and SED-ML formats and several model formats such as BNGL, CellML, LEMS, NeuroML, RBA XML, SBML, Smoldyn, and XPP. This API is specified using OpenAPI and implemented in Python using [connexion](https://github.com/zalando/connexion). This API is currently deployed at https://combine.api.biosimulations.org and https://combine.api.biosimulations.dev.

## Editing the specifications of the API
The [specifications](combine_api/spec/spec.yml) of the API were developed using [Apicurio studio](https://www.apicur.io/studio/), a free web-based application for building [OpenAPI](https://swagger.io/specification/)-compliant specifications for HTTP APIs. The specifications of the API should be edited using Apicurio studio, exported from Apicurio in YAML format, and saved to [`combine_api/spec/spec.yml`](combine_api/spec/spec.yml) in this repository. The Apicurio project for the API is owned by Bilal Shaikh. Contact Bilal for priviledges to edit the project.

Please follow these steps to edit the specifications of the API:
1. Login to [Apicurio studio](https://www.apicur.io/studio/).
2. Use Apicurio studio to edit the API as needed.
3. Navigate to the [Apicurio landing page page for the API](https://studio.apicur.io/apis/45980).
4. Click the '...' button at the top-right of the box for the API.
5. Click the 'Download' menu option.
6. Select 'Format' 'YAML'.
7. Select 'References' 'Deference All External $refs'.
8. Click the 'Download' button.
9. Save the exported YAML file to [`combine_api/spec/spec.yml`](combine_api/spec/spec.yml) in this repository.
10. Commit the modified specifications file to this repository.

## Editing the implementation of the API
The API is implemented in Python using [connexion](https://github.com/zalando/connexion). To edit the operation for a path, open the Python function for the path in your favorite Python editor and edit the function. The specifications of the API indicate the Python functions which handle each path (`operationId` of each HTTP method of each path). For example, the `operationId` for the `/health` path is `combine_api.handlers.health.handler`, which corresponds to the `handler` function in the [`combine_api.handlers.health`](combine_api/handlers/health.py) Python module. connexion automatically maps each path to the functions indicated by the `operationId` attributes in the specifications of the API.

## Installation and execution
As described below, the COMBINE API is deployed as a Docker image. The [`Dockerfile`](Dockerfile) for this image is the authoritative description of how to install and execute the API. The `Dockerfile` uses [pipenv](https://pipenv.pypa.io/) to install the required Python packages outlined in the [`Pipfile`](Dockerfile-assets/Pipfile) and [`Pipfile.lock`](Dockerfile-assets/Pipfile.lock) files. Note, this `Pipfile` does not completely describe the requirements for the API. The `Dockerfile` includes additional operations which cannot be achieved using pipenv because some of the required Python packages for the API require additional OS packages and because bugs in pipenv currently prevent pipenv from installing one of the required Python packages for the API.

#### TODO: Update this information.
### Recommended local installation
Below is an outline of how to install the API into a local Python environment managed with pipenv in a Linux machine.

1. Change to this directory (`apps/combine-api` subdirectory of this repository).
2. Install the OS packages outlined in `Dockerfile`:
    ```bash
    apt-get install default-jre perl r-base ...
    ```
3. Use pipenv to create a Python environment with the required Python packages:
    ```bash
    apt-get install python3 python3-pip
    pip3 install pipenv
    cd Dockerfile-assets
    pipenv install
    ```
4. Install the additional Python packages outlined at the end of the `Dockerfile` (steps after the `pipenv install ...` step). These packages must be installed separately from pipenv because a bug in pipenv currently prevents pipenv from installing them.

### Adding additional requirements for the API
1. Follow the recommended installation steps above.
2. Change to this directory (`apps/combine-api` subdirectory of this repository).
3. Use `apt` or other methods to install any additional required OS packages.
4. Add these additional required OS packages to `Dockerfile`.
5. Change to the directory for the Python environment for the API (`apps/combine-api/Dockerfile-assets` subdirectory of this repository).
6. Run `pipenv install ...` to install any additional required Python packages.
7. Commit the modified `Dockerfile`, `Pipefile`, and `Pipfile.lock` files to this repository.

### Recommended execution of a local development server
1. Follow the recommended installation steps above.
2. Change to the directory for the Python environment for the API (`apps/combine-api/Dockerfile-assets` subdirectory of this repository).
3. Activate this Python environment by running `pipenv shell`.
4. Change to the root directory for this API by running (`cd ..`).
5. Execute a server for the API by running `python -m combine_api`.
6. Navigate your browser to the URL printed to your console (the default is currently http://0.0.0.0:3333/).

### Building a Docker image for the API
1. Change to this directory (`apps/combine-api` subdirectory of this repository).
2. Run `docker build --tag ghcr.io/biosimulations/combine-api .`.

### Pulling a published Docker image for the API
As described below, Docker images for the API are available from the GitHub Container Registry ([`ghcr.io/biosimulations/combine-api`](https://github.com/biosimulations/biosimulations/pkgs/container/combine-api)). These images can be pulled by running `docker pull ghcr.io/biosimulations/combine-api`.

### Executing a Docker image for the API
Follow these steps to run an image for the API:
1. Execute the image on local port `3333` by running `docker run -it --rm -p 127.0.0.1:3333:3333 ghcr.io/biosimulations/combine-api`. The second `3333` must match the port which the API is running at in the image (the default is currently `3333`).
2. Navigate your browser to `http://127.0.0.1:3333`.

### Using Poetry 
The `combine-api` in `biosimulations` uses a `pyproject.toml` file with [Poetry](https://python-poetry.org/docs/#installation) as the primary 
setup method. Please remember to clear your local poetry cache prior to installing the environment on your machine.

## Linting the API
The API can be linted using [flake8](https://flake8.pycqa.org/en/latest/). 

### Linting the API locally
1. Follow the recommended installation steps above.
2. Change to the directory for the Python environment for the API (`apps/combine-api/Dockerfile-assets` subdirectory of this repository).
3. Activate this Python environment by running `pipenv shell`.
4. Change to the root directory for this repository (`cd ../../..`).
5. Run `flake8`.

### Linting execution by the CI system
The CI system lints the API by running `nx run combine-api:lint` from the root directory of this repository.

## Testing the API
The tests for the API are located in the [`tests`](tests) subdirectory of this directory. The tests can be executed using [pytest](https://docs.pytest.org/). Coverage can be accessed using [pytest-cov](https://pytest-cov.readthedocs.io/). 

### Testing the API locally
1. Follow the recommended installation steps above.
2. Change to the directory for the Python environment for the API (`apps/combine-api/Dockerfile-assets` subdirectory of this repository).
3. Activate this Python environment by running `pipenv shell`.
4. Change to the root directory for this API by running (`cd ..`).
5. Run `python -m pytest tests/`.
   a. To measure the coverage of the tests, add the `--cov combine_api` option.
   b. To compile the coverage report to HTML, run `coverage html`.
   c. To view the coverage report, navigate your browser to the `htmlcov/` subdirectory of the directory for the Python environment for the API (`apps/combine-api/Dockerfile-assets/htmlcov/index.html`).

### Test execution by the CI system
The CI system executes these tests by running `nx run combine-api:test` from the root directory of this repository.

## Deployment
The COMBINE API is deployed as a Docker image. [`Dockerfile`](Dockerfile) is the Dockerfile for this image. This Dockerfile uses several files in the [`Dockerfile-assets`](Dockerfile-assets) subdirectory of this directory. This includes [pipenv](https://pipenv.pypa.io/) [`Pipfile`](Dockerfile-assets/Pipfile) and [`Pipfile.lock`](Dockerfile-assets/Pipfile.lock) files which describe most of the Python packages required for the API. Note, this `Pipfile` does not completely describe the requirements for the API. The `Dockerfile` includes additional operations which cannot be achieved using pipenv because some of the required Python packages for the API require additional OS packages and because bugs in pipenv currently prevent pipenv from installing one of the required Python packages for the API.

The CI/CD system builds this image by running `nx docker combine-api` from the root directory of this repository and pushes it to the GitHub Container Registry.
