# Creating standardized interfaces to biosimulation tools
We welcome contributions of additional simulation tools!

All simulation tools submitted for validation by BioSimulators should support at least one modeling language, SED-ML, KiSAO, and COMBINE/OMEX.

- Modeling languages. Containers should support at least a subset of at least one modeling language such as BNGL, CellML, Kappa, NeuroML/LEMS, pharmML, SBML, or Smoldyn.

- SED-ML. Currently, containers should support at least the following features of SED-ML L1V3:
    - Model and model attribute changes: `sedml:model`, `sedml:changeAttribute`.
    - At least one of steady-state, one step, or timecourse simulations: `sedml:steadyState`, `sedml:oneStep`, or `sedml:uniformTimeCourse`.
    - Tasks for the execution of individual simulations of individual models: `sedml:task`.
    - Algorithms and algorithm parameters: `sedml:algorithm`, `sedml:algorithmParameter`.
    - Data generators for individual variables: `sedml:dataGenerator`, `sedml:variable`
    - Report outputs: `sedml:report`.

- KiSAO. SED-ML documents interpreted by containers should use KiSAO terms to indicate algorithms and algorithm parameters. As necessary, create an [issue](https://github.com/SED-ML/KiSAO/issues/new?assignees=&labels=New+term&template=request-a-term.md&title=) on the KiSAO repository to request terms for additional algorithms and algorithm parameters.

COMBINE/OMEX. Containers should support the full COMBINE/OMEX specification.

Please follow the steps below to create a containerized simulation tool that adheres to the BioSimulators standards. Several examples are available from the [BioSimulators GitHub organization](https://github.com/biosimulations/). A template repository with template Python code for a command-line interface and a template for a Dockerfile is available [here](https://github.com/biosimulators/Biosimulators_simulator_template).

1. Optionally, create a Git repository for your command-line interface and Dockerfile.
1. Implement a BioSimulators-compliant command-line interface to your simulation tool. The interface should accept two keyword arguments:

    - `-i, --archive`: A path to a COMBINE archive that contains descriptions of one or more simulation tasks.
    - `-o, --out-dir`: A path to a directory where the outputs of the simulation tasks should be saved. Data for plots and reports should be saved in HDF5 format (see the [specifications for data sets](../concepts/conventions/simulation-run-reports.md) for more information) and plots should be saved in Portable Document Format (PDF)  bundled into a single zip archive. Data for reports and plots should be saved to `{ out-dir }/reports.h5` and plots should be saved to `{ out-dir/plots.zip }`. Within the HDF5 file and the zip file, reports and plots should be saved to paths equal to the relative path of their parent SED-ML documents within the parent COMBINE/OMEX archive and the id of the report/plot.

    For reports, the rows of the data tables should correspond to the data sets (`sedml:dataSet`) specified in the SED-ML definition of the report (e.g., time, specific species). The heading of each row should be the label of the corresponding data set.

    For plots, the rows of the data tables should correspond to the data generators (`sedml:dataGenerator`) specified in the SED-ML definition of each curve and surface of the plot (e.g., time, specific species). The heading of each row should be the id of the corresponding data generator.

    Data tables of steady-state simulations should have a single column of the steady-state predictions of each data set. Data tables of one step simulations should have two columns that represent the predicted start and end states of each data set. Data tables of time course simulations should have multiple columns that represent the predicted time course of each data set. Data tables of non-spatial simulations should not have additional dimensions. Data tables of spatial simulations should have additional dimensions that represent the spatial axes of the simulation.

    See the [specifications for interfaces](../concepts/conventions/simulator-interfaces.md) for more information.

    In addition, we recommend providing optional arguments for reporting help and version information about your simulator:

    - `-h, --help`: This argument should instruct the command-line program to print help information about itself.
    - `-v, --version`: This argument should instruct the command-line program to report version information about itself.
    The easiest way to create a BioSimulators-compliant command-line interface is to create a [BioSimulators-compliant Python API](../concepts/conventions/simulator-interfaces.md#conventions-for-python-apis) and then use methods in [BioSimulators-utils](https://github.com/biosimulators/Biosimulators_utils) to build a command-line interface from this API. Implementing a BioSimulators-compliant Python API primarily entails implementing a single method for executing a single simulation of a single model. Additional information about creating BioSimulators-compliant Python APIs, command-line interfaces, and Docker images, including templates, is available [here](https://github.com/biosimulators/Biosimulators_simulator_template).

    Simulation tools can also utilize two environment variables to obtain information about the environment that runBioSimulations uses to execute simulations.

    * `HPC`: runBioSimulations sets this variable to `1` to indicate that the simulation tool is being executed in an HPC environment.
    * `CPUS`: runBioSimulations sets this variable to the number of CPUs allocated to the job in which the simulation tool is being executed.

1. Create a Dockerfile which describes how to build an image for your simulation tool.
    1. Use the `FROM` directive to choose a base operating system such as Ubuntu.
    1. Use the `RUN` directive to describe how to install your tool and any dependencies. Because Docker images are typically run as root, reserve `/root` for the home directory of the user which executes the image. Similarly, reserve `/tmp` for temporary files that must be created during the execution of the image. Install your simulation tool into a different directory than `/root` and `/tmp` such as `/usr/local/bin`.
    1. Ideally, the simulation tools inside images should be installed from internet sources so that the construction of an image is completely specified by its Dockerfile and, therefor, reproducible and portable. Additional files needed during the building of the image, such as licenses to commercial software, can be copied from a local directory such as assets/. These files can then be deleted and squashed out of the final image and injected again when the image is executed.
    1. Set the `ENTRYPOINT` directive to the path to your command-line interface.
    1. Set the `CMD` directive to `[]`.
    1. Use the `ENV` directive to declare all [environment variables](../concepts/conventions/simulator-interfaces.md#environment-variables) that your simulation tool supports.
    1. Do not use the `USER` directive to set the user which will execute the image so that the user can be set at execution time.
    1. Use the `LABEL` directive to provide the metadata about your simulation tool described below. This metadata is also necessary to submit your image to BioContainers , a broad registry of images for biological research.
    
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

        - `org.opencontainers.image.licenses`: SPDX expression that describes the license(s) under which the software in the image is distributed.

        - `org.opencontainers.image.created`: Date and time when the image was built (RFC 3339).        
    
        BioContainers labels:

        - `version`: Version of your image (e.g., `1.0.0`)

        - `software`: Simulation program wrapped into your image (e.g., `BioNetGen`).

        - `software.version`: Version of the simulation program wrapped into your image (e.g., `2.5.0`).

        - `about.summary`: Short description of the simulation program (e.g., `Package for rule-based modeling of complex biochemical systems`).

        - `about.home`: URL for the simulation program (e.g., `https://bionetgen.org/`).

        - `about.documentation`: URL for documentation for the simulation program (e.g., `https://bionetgen.org/`).

        - `about.license_file`: URL for the license for the simulation program (e.g., `https://github.com/RuleWorld/bionetgen/blob/master/LICENSE`).

        - `about.license`: SPDX license id for the license for the simulation program (e.g., `SPDX:MIT`). See SPDX  for a list of licenses and their ids.

        - `about.tags`: Comma-separated list of tags which describe the simulation program (e.g., `rule-based modeling,dynamical simulation,systems biology,BNGL,BioSimulators`). Please include the tag BioSimulators.
        
        - `extra.identifiers.biotools`: Optionally, the bio.tools identifier for the simulation program (e.g., `bionetgen`). Visit bio.tools  to request an identifier for your simulation program.

        - `maintainer`: Name and email of the person/team who developed the image (e.g., `Jonathan Karr <karr@mssm.edu>`).
        
    Below is an example of metadata for the BioNetGen image.
    ``` dockerfile
    LABEL \
    org.opencontainers.image.title="BioNetGen" \
    org.opencontainers.image.version="2.5.0" \
    org.opencontainers.image.description="Package for rule-based modeling of complex biochemical systems" \
    org.opencontainers.image.url="https://bionetgen.org/" \
    org.opencontainers.image.documentation="https://bionetgen.org/" \
    org.opencontainers.image.source="https://github.com/biosimulators/biosimulators_bionetgen" \
    org.opencontainers.image.authors="BioSimulators Team <info@biosimulators.org>" \
    org.opencontainers.image.vendor="BioSimulators Team" \
    org.opencontainers.image.licenses="MIT" \
    \
    base_image="ubuntu:18.04"
    version="1.0.0"
    software="BioNetGen"
    software.version="2.5.0"
    about.summary="Package for rule-based modeling of complex biochemical systems"
    about.home="https://bionetgen.org/"
    about.documentation="https://bionetgen.org/"
    about.license_file="https://github.com/RuleWorld/bionetgen/blob/master/LICENSE"
    about.license="SPDX:MIT"
    about.tags="rule-based modeling,dynamical simulation,systems biology,biochemical networks,BNGL,SED-ML,COMBINE,OMEX,BioSimulators"
    extra.identifiers.biotools="bionetgen"
    maintainer="Jonathan Karr <karr@mssm.edu>"
    ```

1. Use Docker and the Dockerfile to build an image for your simulation tool by executing the following from your console:
    ```bash
    docker build \
      --tag { dockerhub-user-id }/{ simulator-id }:{ simulator-version } \
      --tag { dockerhub-user-id }/{ simulator-id }:latest \
      --file { path-to-Dockerfile } \
    ```

1. Create a JSON-encoded file that specifies the capabilities of your simulation tool. This file should adhere to the schema described in the [BioSimulators API](https://api.biosimulators.org) .

    Use SBO, KiSAO, and EDAM to describe the modeling frameworks, simulation algorithms, and modeling formats that your simulation tool supports. As necessary, use the linked issue trackers to request additional [SBO](https://sourceforge.net/p/sbo/term-request/), [KiSAO](https://github.com/SED-ML/KiSAO/issues/new?assignees=&labels=New+term&template=request-a-term.md&title=), and [EDAM](https://github.com/edamontology/edamontology/issues/new?template=new-format.md) terms. As necessary, also use the [SED-ML issue tracker](https://github.com/SED-ML/sed-ml/issues/new) to request URNs for additional modeling languages. Currently, there is no process to request additional model format specification URLs for using COMBINE with additional model formats.

1. Use the BioSimulators test suite to validate your image and its specifications. This will check that the image provides a BioSimulators-compliant Docker structure and command-line interface, and that it provides all of the simulation algorithms described in its specifications.

    ```bash
    pip install biosimulators-test-suite
    biosimulators-test-suite validate { dockerhub-user-id }/{ image-id } { path-to-specifications.json }
    ```

    The command-line program for the test suite provides several helpful options such as for executing tasks directly through command-line interfaces and for executing individual test cases. More information is available [here](https://github.com/biosimulators/Biosimulators_test_suite)


