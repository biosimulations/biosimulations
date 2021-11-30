# Developer guide: contributing simulation capabilities


## Developing a BioSimulators-compliant containerized biosimulation tool
We welcome contributions of additional simulation tools!

All simulation tools submitted for validation by BioSimulators should support at least one modeling language, SED-ML, KiSAO, and COMBINE/OMEX.

- **Modeling languages**. Containers should support at least a subset of at least one modeling language such as BNGL, CellML, Kappa, NeuroML/LEMS, pharmML, SBML, or Smoldyn.

- **SED-ML**. Currently, containers should support at least the following features of SED-ML L1V3:
    - Model and model attribute changes: ```sedml:model```, ```sedml:changeAttribute```.
    - At least one of steady-state, one step, or timecourse simulations: ```sedml:steadyState```, ```sedml:oneStep```, or ```sedml:uniformTimeCourse```.
    - Tasks for the execution of individual simulations of individual models: sedml:task.
    - Algorithms and algorithm parameters: ```sedml:algorithm```, ```sedml:algorithmParameter```.
    - Data generators for individual variables: ```sedml:dataGenerator```, ```sedml:variable```
    - Report outputs: ```sedml:report```.

- **KiSAO**. SED-ML documents interpreted by containers should use KiSAO terms to indicate algorithms and algorithm parameters. As necessary, create an [issue](https://github.com/SED-ML/KiSAO/issues/new?assignees=&labels=New+term&template=request-a-term.md&title=) on the KiSAO repository to request terms for additional algorithms and algorithm parameters.

**COMBINE/OMEX**. Containers should support the full COMBINE/OMEX specification.

Please follow the steps below to create a containerized simulation tool that adheres to the BioSimulators standards. Several examples are available from the [BioSimulators GitHub organization](https://github.com/biosimulations/). A template repository with template Python code for a command-line interface and a template for a Dockerfile is available [here](https://github.com/biosimulators/Biosimulators_simulator_template).

1. Optionally, create a Git repository for your command-line interface and Dockerfile.
1. Implement a BioSimulators-compliant command-line interface to your simulation tool. The interface should accept two keyword arguments:

    - ```-i, --archive```: A path to a COMBINE archive that contains descriptions of one or more simulation tasks.
    - ```-o, --out-dir```: A path to a directory where the outputs of the simulation tasks should be saved. Data for plots and reports should be saved in HDF5 format (see the [specifications for data sets](../concepts/Reports.md) for more information) and plots should be saved in Portable Document Format (PDF)  bundled into a single zip archive. Data for reports and plots should be saved to ```{ out-dir }/reports.h5``` and plots should be saved to ```{ out-dir/plots.zip }```. Within the HDF5 file and the zip file, reports and plots should be saved to paths equal to the relative path of their parent SED-ML documents within the parent COMBINE/OMEX archive and the id of the report/plot.

    For reports, the rows of the data tables should correspond to the data sets (```sedml:dataSet```) specified in the SED-ML definition of the report (e.g., time, specific species). The heading of each row should be the label of the corresponding data set.

    For plots, the rows of the data tables should correspond to the data generators (```sedml:dataGenerator```) specified in the SED-ML definition of each curve and surface of the plot (e.g., time, specific species). The heading of each row should be the id of the corresponding data generator.

    Data tables of steady-state simulations should have a single column of the steady-state predictions of each data set. Data tables of one step simulations should have two columns that represent the predicted start and end states of each data set. Data tables of time course simulations should have multiple columns that represent the predicted time course of each data set. Data tables of non-spatial simulations should not have additional dimensions. Data tables of spatial simulations should have additional dimensions that represent the spatial axes of the simulation.

    See the [specifications for interfaces](..././concepts/Interfaces) for more information.

    In addition, we recommend providing optional arguments for reporting help and version information about your simulator:

    - ```-h, --help```: This argument should instruct the command-line program to print help information about itself.
    - ```-v, --version```: This argument should instruct the command-line program to report version information about itself.
    The easiest way to create a BioSimulators-compliant command-line interface is to create a [BioSimulators-compliant Python API](../../concepts/Interfaces#conventions-for-python-apis) and then use methods in [BioSimulators-utils](https://github.com/biosimulators/Biosimulators_utils) to build a command-line interface from this API. Implementing a BioSimulators-compliant Python API primarily entails implementing a single method for executing a single simulation of a single model. Additional information about creating BioSimulators-compliant Python APIs, command-line interfaces, and Docker images, including templates, is available [here](https://github.com/biosimulators/Biosimulators_simulator_template).

1. **Create a Dockerfile** which describes how to build an image for your simulation tool.
    1. Use the ```FROM``` directive to choose a base operating system such as Ubuntu.
    1. Use the ```RUN``` directive to describe how to install your tool and any dependencies. Because Docker images are typically run as root, reserve /root for the home directory of the user which executes the image. Similarly, reserve /tmp for temporary files that must be created during the execution of the image. Install your simulation tool into a different directory than /root and /tmp such as /usr/local/bin.
    1. Ideally, the simulation tools inside images should be installed from internet sources so that the construction of an image is completely specified by its Dockerfile and, therefor, reproducible and portable. Additional files needed during the building of the image, such as licenses to commercial software, can be copied from a local directory such as assets/. These files can then be deleted and squashed out of the final image and injected again when the image is executed.
    1. Set the ```ENTRYPOINT``` directive to the path to your command-line interface.
    1. Set the ```CMD``` directive to ```[]```.
    1. Use the ```ENV``` directive to declare all [environment variables](../../concepts/Interfaces/#environment-variables) that your simulation tool supports.
    1. Do not use the USER directive to set the user which will execute the image so that the user can be set at execution time.
    1. Use the LABEL directive to provide the metadata about your simulation tool described below. This metadata is also necessary to submit your image to BioContainers , a broad registry of images for biological research.
    
        **Open Containers Initiative labels**:    

        - ```org.opencontainers.image.title```: Human-readable title of the image.
        
        - ```org.opencontainers.image.version```: Version of the software in the image.
        
        - ```org.opencontainers.image.revision```: Source control revision identifier of the software in the image.

        - ```org.opencontainers.image.description```: Human-readable description of the software in the image.

        - ```org.opencontainers.image.url```: URL to find more information about the image.

        - ```org.opencontainers.image.documentation```: URL to get documentation about the image.

        - ```org.opencontainers.image.source```: URL to get the Dockerfile for building the image.

        - ```org.opencontainers.image.authors```: Contact details of the people or organization responsible for the image.

        - ```org.opencontainers.image.vendor```: Name of the entity, organization or individual which distributes the image.

        - ```org.opencontainers.image.licenses```: SPDX expression that describes the license(s) under which the software in the image is distributed.

        - ```org.opencontainers.image.created```: Date and time when the image was built (RFC 3339).        
    
        **BioContainers labels**:

        - ```version```: Version of your image (e.g., 1.0.0)

        - ```software```: Simulation program wrapped into your image (e.g., BioNetGen).

        - ```software.version```: Version of the simulation program wrapped into your image (e.g., 2.5.0).

        - ```about.summary```: Short description of the simulation program (e.g., Package for rule-based modeling of complex biochemical systems).

        - ```about.home```: URL for the simulation program (e.g., https://bionetgen.org/).

        - ```about.documentation```: URL for documentation for the simulation program (e.g., https://bionetgen.org/).

        - ```about.license_file```: URL for the license for the simulation program (e.g., https://github.com/RuleWorld/bionetgen/blob/master/LICENSE).

        - ```about.license```: SPDX license id for the license for the simulation program (e.g., SPDX:MIT). See SPDX  for a list of licenses and their ids.

        - ```about.tags```: Comma-separated list of tags which describe the simulation program (e.g., rule-based modeling,dynamical simulation,systems biology,BNGL,BioSimulators). Please include the tag BioSimulators.
        
        - ```extra.identifiers.biotools```: Optionally, the bio.tools identifier for the simulation program (e.g., bionetgen). Visit bio.tools  to request an identifier for your simulation program.

        - ```maintainer```: Name and email of the person/team who developed the image (e.g., Jonathan Karr <karr@mssm.edu>).
        
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

1. **Use Docker and the Dockerfile to build an image for your simulation tool** by executing the following from your console:
```bash
docker build \
  --tag { dockerhub-user-id }/{ simulator-id }:{ simulator-version } \
  --tag { dockerhub-user-id }/{ simulator-id }:latest \
  --file { path-to-Dockerfile } \
```

1. **Create a JSON-encoded file that specifies the capabilities of your simulation tool**. This file should adhere to the schema described in the [BioSimulators API](https://api.biosimulators.org) .

    Use SBO, KiSAO, and EDAM to describe the modeling frameworks, simulation algorithms, and modeling formats that your simulation tool supports. As necessary, use the linked issue trackers to request additional [SBO](https://sourceforge.net/p/sbo/term-request/) , [KiSAO](https://github.com/SED-ML/KiSAO/issues/new?assignees=&labels=New+term&template=request-a-term.md&title=) , and [EDAM](https://github.com/edamontology/edamontology/issues/new?template=new-format.md) terms. As necessary, also use the [SED-ML issue tracker](https://github.com/SED-ML/sed-ml/issues/new) to request URNs for additional modeling languages. Currently, there is no process to request additional model format specification URLs for using COMBINE with additional model formats.

1. **Use the BioSimulators test suite to validate your image and its specifications.** This will check that the image provides a BioSimulators-compliant Docker structure and command-line interface, and that it provides all of the simulation algorithms described in its specifications.

    ```bash
    pip install biosimulators-test-suite
    biosimulators-test-suite validate { dockerhub-user-id }/{ image-id } { path-to-specifications.json }

    ```
    The command-line program for the test suite provides several helpful options such as for executing tasks directly through command-line interfaces and for executing individual test cases. More information is available [here](https://github.com/biosimulators/Biosimulators_test_suite)


## Contributing a biosimulation tool to BioSimulators

We welcome contributions of additional simulation tools! We encourage developers to submit tools that support BioSimulators' standard containerized command-line interface. Supporting these standards makes it easier for other investigators to use simulators. However, BioSimulators also accepts simulation tools that are not available via standardized Docker images.

Please follow these steps to contribute a tool to BioSimulators:

1. **Annotate the capabilities of your simulation tool** (e.g., supported modeling frameworks, simulation algorithms, model formats) using the BioSimulators format for the specifications of simulation tools.

1. **Optionally, build a standardized command-line interface for your simulator**. This interface should support the following standards and conventions:

    The command-line interface should support the arguments outlined in BioSimulators' [specifications for command-line interfaces](../../concepts/Interfaces) for simulation tools.
    
    - **COMBINE/OMEX archives** should be used as the format for inputs to your simulator.
    
    - **A standard modeling language** such as BNGL, CellML, NeuroML, or SBML should be used to describe models.
    
    - **SED-ML** and the BioSimulators [SED-ML conventions](../../concepts/Experiments) should be used to describe simulation experiments.
    
    - The process of executing COMBINE/OMEX archives should be logged using [BioSimulators' format for logs](../../concepts/Logs) of the execution of COMBINE/OMEX archives.
    
    - Reports of simulation results should be saved according to the [BioSimulators format for reports](../../concepts/Reports) of simulation results.
    
    [BioSimulators utils](https://github.com/biosimulators/Biosimulators_utils) provides tools for implementing these standards. A detailed template for using BioSimulators utils to build a command-line interface for a simulator is available here.

1. Optionally, containerize the command-line interface for your simulator. Such an image will make it easier for others to use your tool. Containerized simulation tools should follow BioSimulators' standard for Docker images for simulation tools.

1. Optionally, publish your image to a public repository such as Docker Hub , GitHub Container Registry , or Quay  by executing docker push { image-url }. Docker Hub, GitHub Container Registry, and Quay each provide free accounts for public images.

1. **[Submit an issue](https://github.com/biosimulators/Biosimulators/issues/new?assignees=&labels=Submit+simulator&template=contribute-a-simulator.md&title=)**  to the BioSimulators GitHub repository that describes briefly describes the URL to the specifications of your tool. This will initiate an automated workflow that will validate your simulation tool and either commit your tool to the BioSimulators registry or report problems with your simulation tool that must be addressed. The first version of each simulation tool submitted to the BioSimulators registry will also be manually reviewed by the BioSimulators Team prior to incorporation into the BioSimulators registry.

1. **Optionally, set up your continuous integration workflow to automatically push each release to BioSimulators**. Within your continuous integration workflow (e.g., CircleCI, GitHub actions, Jenkins, Travis), use the GitHub REST API to automatically create issues that submit versions of your simulator to BioSimulators.

    This requires a GitHub account and a personal access token with the public_repo scope. Instructions for creating an access token are available in the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).

    - Endpoint: ```http://api.github.com/repos/biosimulators/Biosimulators/issues```
    - Method: ```POST```
    - Auth: ```{ github-username }:{ github-person-access-token }```
    - Headers:
        - Accept: ```application/vnd.github.v3+json```
    - Body (JSON-encoded)
        - title: ```Submit { simulator-name } { simulator-version }```
        - body:

        ```
        ---
        name: { simulator-name }
        version: "{ simulator-version }"
        specificationsUrl: { specifications-url }
        specificationsPatch:
        version: "{ simulator-version }"
        image:
            url: { docker-image-repo-url }:{ simulator-version }
        validateImage: true

        ---
        ```

    To skip the validation of your Docker image, or to submit a simulation tool for which there is no Docker image that provides a BioSimulators-compliant command-line entrypoint, set ```validateImage``` to ```false```.
    curl code sample:

    ```bash
    curl \
    -X POST \
    -u jonrkarr:********* \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/biosimulators/Biosimulators/issues \
    -d '{"labels": ["Validate/submit simulator"], "title": "Submit tellurium 2.1.6", "body": "---\nname: tellurium\nversion: 2.1.6\nspecificationsUrl: https://raw.githubusercontent.com/biosimulators/Biosimulators_tellurium/2.1.6/biosimulators.json\nvalidateImage: true\ncommitSimulator: true\n\n---"}'
    ```
    
    The above is implemented by the Python method ```biosimulators_utils.simulator_registry.submit.submit_simulator_to_biosimulators_registry```. See the [documentation](https://docs.biosimulators.org/Biosimulators_utils)  for more information.

1. **Optionally, also publish the source code for your simulation tool to a repository** such as BitBucket , GitHub , or GitLab .
1. **Optionally, also publish your simulation tool to a software repository** such as CRAN  (R), NPM  (JavaScript), or PyPi  (Python).
1. **Optionally, also register your tool with bio.tools**. Visit [bio.tools](https://bio.tools/) to submit your tool to their regsitry of research tools.
1. **Optionally, also submit your Dockerfile to BioContainers**. BioContainers accepts contributions via pull requests. See the[ BioContainers image registry](https://github.com/BioContainers/containers/pulls) for more information.


A sample [continuous integration workflow](https://github.com/biosimulators/Biosimulators_simulator_template/blob/dev/.github/workflows/ci.yml.template)  for GitHub Actions is available in the template simulator repository. Instructions for setting up this workflow are in the [README](https://github.com/biosimulators/Biosimulators_simulator_template/blob/dev/README.md) .

Each time a commit is pushed to the repository, the workflow executes the following tasks:

1. Clones the repository.

1. Installs the simulator and its dependencies.

1. Lints the code for the simulator.

1. Builds the Docker image for the simulator and tags the image ``ghcr.io/<owner>/<repo>/<simulator_id>:<simulator_version`` and ``ghcr.io/<owner>/<repo>/<simulator_id>:latest``.

1. Runs the unit tests for the simulator and saves the coverage data for the tests.

1. Uploads the coverage results to [Codecov](https://codecov.io/).

1. Compiles the documentation for the simulator.

Each time the repository is tagged (git tag ...; git push --tags), the workflow also runs the above tasks. If the above tasks succeed, the workflow executes the follwing additional tasks:

1. Creates a GitHub release for the tag.
1. Pushes the compiled documentation to the repository (e.g., so it can be served by GitHub pages).
1. Builds the simulator and submits it to a software repository such as PyPI .
1. Pushes the Docker image to the GitHub Container Registry  with the above tags.
1. Pushes the simulator to the BioSimulators Registry by using the GitHub API to create an issue to add a new version of the simulator to the BioSimulators database. This issue will then automatically use the BioSimulators test suite to validate the simulator and add a new version of the simulator to the database once the simulator passes the test suite.