## Contributing biosimulation tools to BioSimulators

We welcome contributions of additional simulation tools! We encourage developers to submit tools that support BioSimulators' standard containerized command-line interface. Supporting these standards makes it easier for other investigators to use simulators. However, BioSimulators also accepts simulation tools that are not available via standardized Docker images.

Please follow these steps to contribute a tool to BioSimulators:

1. Annotate the capabilities of your simulation tool (e.g., supported modeling frameworks, simulation algorithms, model formats) using the BioSimulators format for the specifications of simulation tools.

1. Optionally, build a standardized command-line interface for your simulator. This interface should support the following standards and conventions:

    The command-line interface should support the arguments outlined in BioSimulators' [specifications for command-line interfaces](../concepts/conventions/simulator-interfaces.md) for simulation tools.
    
    - COMBINE/OMEX archives should be used as the format for inputs to your simulator.
    
    - A standard modeling language such as BNGL, CellML, NeuroML, or SBML should be used to describe models.
    
    - SED-ML and the BioSimulators [SED-ML conventions](../concepts/conventions/simulation-experiments.md) should be used to describe simulation experiments.
    
    - The process of executing COMBINE/OMEX archives should be logged using [BioSimulators' format for logs](../concepts/conventions/simulation-run-logs.md) of the execution of COMBINE/OMEX archives.
    
    - Reports of simulation results should be saved according to the [BioSimulators format for reports](../concepts/conventions/simulation-run-reports.md) of simulation results.
    
    [BioSimulators utils](https://github.com/biosimulators/Biosimulators_utils) provides tools for implementing these standards. A detailed template for using BioSimulators utils to build a command-line interface for a simulator is available here.

1. Optionally, containerize the command-line interface for your simulator. Such an image will make it easier for others to use your tool. Containerized simulation tools should follow BioSimulators' standard for Docker images for simulation tools.

1. Optionally, publish your image to a public repository such as Docker Hub , GitHub Container Registry , or Quay  by executing `docker push { image-url }`. Docker Hub, GitHub Container Registry, and Quay each provide free accounts for public images.

1. [Submit an issue](https://github.com/biosimulators/Biosimulators/issues/new?assignees=&labels=Validate%2Fsubmit+simulator&template=ValidateOrSubmitASimulator.yml&title=%5BSimulation+capabilities%5D%3A+) to the BioSimulators GitHub repository that describes briefly describes the URL to the specifications of your tool. This will initiate an automated workflow that will validate your simulation tool and either commit your tool to the BioSimulators registry or report problems with your simulation tool that must be addressed. The first version of each simulation tool submitted to the BioSimulators registry will also be manually reviewed by the BioSimulators Team prior to incorporation into the BioSimulators registry.

1. Optionally, set up your continuous integration workflow to automatically push each release to BioSimulators. Within your continuous integration workflow (e.g., CircleCI, GitHub actions, Jenkins, Travis), use the GitHub REST API to automatically create issues that submit versions of your simulator to BioSimulators.

    This requires a GitHub account and a personal access token with the public_repo scope. Instructions for creating an access token are available in the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).

    - Endpoint: `http://api.github.com/repos/biosimulators/Biosimulators/issues`
    - Method: `POST`
    - Auth: `{ github-username }:{ github-person-access-token }`
    - Headers:
        - Accept: `application/vnd.github.v3+json`
    - Body (JSON-encoded)
        - title: `Submit { simulator-name } { simulator-version }`
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

    To skip the validation of your Docker image, or to submit a simulation tool for which there is no Docker image that provides a BioSimulators-compliant command-line entrypoint, set `validateImage` to `false`.
    curl code sample:

    ```bash
    curl \
    -X POST \
    -u jonrkarr:********* \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/biosimulators/Biosimulators/issues \
    -d '{"labels": ["Validate/submit simulator"], "title": "Submit tellurium 2.1.6", "body": "---\nname: tellurium\nversion: 2.1.6\nspecificationsUrl: https://raw.githubusercontent.com/biosimulators/Biosimulators_tellurium/2.1.6/biosimulators.json\nvalidateImage: true\ncommitSimulator: true\n\n---"}'
    ```
    
    The above is implemented by the Python method `biosimulators_utils.simulator_registry.submit.submit_simulator_to_biosimulators_registry`. See the [documentation](https://docs.biosimulators.org/Biosimulators_utils)  for more information.

1. Optionally, also publish the source code for your simulation tool to a repository such as BitBucket , GitHub , or GitLab .
1. Optionally, also publish your simulation tool to a software repository such as CRAN  (R), NPM  (JavaScript), or PyPi  (Python).
1. Optionally, also register your tool with bio.tools. Visit [bio.tools](https://bio.tools/) to submit your tool to their registry of research tools.
1. Optionally, also submit your Dockerfile to BioContainers. BioContainers accepts contributions via pull requests. See the[ BioContainers image registry](https://github.com/BioContainers/containers/pulls) for more information.


A sample [continuous integration workflow](https://github.com/biosimulators/Biosimulators_simulator_template/blob/dev/.github/workflows/ci.yml.template)  for GitHub Actions is available in the template simulator repository. Instructions for setting up this workflow are in the [README](https://github.com/biosimulators/Biosimulators_simulator_template/blob/dev/README.md) .

Each time a commit is pushed to the repository, the workflow executes the following tasks:

1. Clones the repository.

1. Installs the simulator and its dependencies.

1. Lints the code for the simulator.

1. Builds the Docker image for the simulator and tags the image `ghcr.io/<owner>/<repo>/<simulator_id>:<simulator_version` and `ghcr.io/<owner>/<repo>/<simulator_id>:latest`.

1. Runs the unit tests for the simulator and saves the coverage data for the tests.

1. Uploads the coverage results to [Codecov](https://codecov.io/).

1. Compiles the documentation for the simulator.

Each time the repository is tagged (`git tag ...; git push --tags`), the workflow also runs the above tasks. If the above tasks succeed, the workflow executes the following additional tasks:

1. Creates a GitHub release for the tag.
1. Pushes the compiled documentation to the repository (e.g., so it can be served by GitHub pages).
1. Builds the simulator and submits it to a software repository such as PyPI .
1. Pushes the Docker image to the GitHub Container Registry  with the above tags.
1. Pushes the simulator to the BioSimulators Registry by using the GitHub API to create an issue to add a new version of the simulator to the BioSimulators database. This issue will then automatically use the BioSimulators test suite to validate the simulator and add a new version of the simulator to the database once the simulator passes the test suite.