# Guidelines for Docker images for biosimulation tools

## Overview
The BioSimulators standard for Docker images of biosimulation software tools outlines the syntax and semantics of the entry points of Docker images of biosimulators. This standard ensures that containerized simulation tools can be consistently executed with the same input arguments (a path to a COMBINE/OMEX archive that defines models and simulations and a path to save the outputs of the simulation experiments defined in the archive) and that simulation tools produce consistent outputs (reports and plots at consistent paths in consistent formats). The standard also specifies how images of biosimulation software tools should use Docker labels to capture metadata about themselves.


## Specifications of entry points 

Simulation tools which implement the BioSimulators Docker image standard should provide an entry point that maps to a command-line interface that implements the [BioSimulators standard for command-line interfaces for biosimulation tools](./Interfaces.md):

The entry point should map to a command-line interface for a biosimulator (`ENTRYPOINT ["simulator-standard-interface"]`).
The default arguments for the entry point should be an empty list (`CMD []`).

## Specifications of Docker labels

Simulation tools which implement the BioSimulators Docker image standard should use labels to provide metadata consistent with the [Open Containers Initiative](https://opencontainers.org/)  and [BioContainers](https://biocontainers.pro/).

Specifically, images should provide the following labels:

Open Containers Initiative labels:

- `org.opencontainers.image.title`: Human-readable title of the image.
- `org.opencontainers.image.version`: Version of the software in the image.
- `org.opencontainers.image.revision`: Source control revision identifier of the software in the image.
- `org.opencontainers.image.description`: Human-readable description of the software in the image.
- `org.opencontainers.image.url`: URL to find more information about the image.
- `org.opencontainers.image.documentation`: URL to get documentation about the image.
- `org.opencontainers.image.source`: URL to get the Dockerfile for building the image.
- `org.opencontainers.image.authors`: Contact details of the people or organization responsible for the image.
- `org.opencontainers.image.vendor`: Name of the entity, organization or individual which distributes the image.
- `org.opencontainers.image.licenses`: [SPDX](https://spdx.org/) expression which describes the license(s) under which the software in the image is distributed.
- `org.opencontainers.image.created`: Date and time when the image was built (RFC 3339).

BioContainers labels:

- `version`: Version of the image (e.g., 1.0.0)

- `software`: Simulation program wrapped into the image (e.g., `BioNetGen`).
- `software.version`: Version of the simulation program wrapped into the image (e.g., `2.5.0`).
- `about.summary`: Short description of the simulation program (e.g., `Package for rule-based modeling of complex biochemical systems`).
- `about.home`: URL for the simulation program (e.g., `https://bionetgen.org/`).
- `about.documentation`: URL for documentation for the simulation program (e.g., `https://bionetgen.org/`).
- `about.license_file`: URL for the license for the simulation program (e.g., `https://github.com/RuleWorld/bionetgen/blob/master/LICENSE`).
- `about.license`: SPDX license id for the license for the simulation program (e.g., `SPDX:MIT`). See [SPDX](https://spdx.org/)  for a list of licenses and their ids.
- `about.tags`: Comma-separated list of tags which describe the simulation program (e.g., `rule-based modeling`,`dynamical simulation`,`systems biology`,`BNGL`,`BioSimulators`). Please include the tag `BioSimulators`.
- `extra.identifiers.biotools`: Optionally, the bio.tools identifier for the simulation program (e.g., `bionetgen`). Visit [bio.tools](https://bio.tools/)  to request identifiers for simulation programs.
- `maintainer`: Name and email of the person/team who developed the image (e.g., `Jonathan Karr <karr@mssm.edu>`).'


## Additional Recommendations for best practices

To ensure that containerized simulation tools can be executed inside high-performance computing clusters where root access is typically not allowed and conversion to Singularity images is necessary, we recommend that developers also follow the best practices below for Dockerfiles. For more discussion, we recommend [Syslab's best practice guide](https://sylabs.io/guides/3.7/user-guide/singularity_and_docker.html#best-practices) for Singularity images .

- **Sources of containerized simulation tools and their dependencies**: To ensure that the construction of Docker images is reproducible and portable, the simulation tools inside images should be installed from internet sources rather than the local file system. One exception is licenses that are needed to install commercial software. These can be copied from a local directory such as assets/, deleted and squashed out of the final image, and injected again when the image is executed.
- **Installation locations of containerized simulation tools and their dependencies**: Because Docker images are typically run as root, /root should be be reserved for the home directory of the user which executes the image. Similarly, /tmp should be reserved for temporary files that must be created during the execution of the image. Consequently, the simulation tools inside containers and their dependencies should be installed to different directories other than /root and /tmp.
- **Environment variables**: All environment variables that the containerized simulation tool supports should be explicitly defined using the ENV directive.
User privileges: Do not use the USER directive.

## Example

An example Dockerfile for [tellurium](http://tellurium.analogmachine.org/)

```Dockerfile
# Base OS
FROM python:3.9-slim-buster

# metadata
LABEL \
    org.opencontainers.image.title="tellurium" \
    org.opencontainers.image.version="2.1.5" \
    org.opencontainers.image.description="Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology" \
    org.opencontainers.image.url="http://tellurium.analogmachine.org/" \
    org.opencontainers.image.documentation="https://tellurium.readthedocs.io/" \
    org.opencontainers.image.source="https://github.com/biosimulators/Biosimulators_tellurium" \
    org.opencontainers.image.authors="BioSimulators Team <info@biosimulators.org>" \
    org.opencontainers.image.vendor="BioSimulators Team" \
    org.opencontainers.image.licenses="Apache-2.0" \
    \
    base_image="python:3.9-slim-buster" \
    version="0.0.1" \
    software="tellurium" \
    software.version="2.1.6" \
    about.summary="Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology" \
    about.home="http://tellurium.analogmachine.org/" \
    about.documentation="https://tellurium.readthedocs.io/" \
    about.license_file="https://github.com/sys-bio/tellurium/blob/develop/LICENSE.txt" \
    about.license="SPDX:Apache-2.0" \
    about.tags="kinetic modeling,dynamical simulation,systems biology,biochemical networks,SBML,SED-ML,COMBINE,OMEX,BioSimulators" \
    maintainer="BioSimulators Team <info@biosimulators.org>"

# Install requirements
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        libxml2 \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Copy code for command-line interface into image and install it
COPY . /root/Biosimulators_tellurium
RUN pip install /root/Biosimulators_tellurium

# Entrypoint
ENTRYPOINT ["tellurium"]
CMD []
```