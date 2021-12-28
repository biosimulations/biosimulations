# Publishing simulation projects (COMBINE/OMEX archives)

## Overview

Authors can publish simulation projects (COMBINE/OMEX archives), their simulation results, and interactive visualizations of their simulation results in three simple steps:

1. Execute the simulation project with runBioSimulations.
2. Review the results of the simulation and their visualizations in runBioSimulations.
3. Use runBioSimulations to publish the run of the project to BioSimulations.

## Executing projects
First, execute your simulation project by uploading it to runBioSimulations and selecting a specific simulation tool. Information about how to use runBioSimulations is available [here](./simulating-projects.md).

## Reviewing the simulation results of projects
Second, once the simulation run has completed, use runBioSimulations to inspect its results. We recommend verifying the following aspects of runs: 

* The COMBINE/OMEX archive includes all relevant sources files. 
* The simulation behaved as expected and the results are visualized as expected.
* The simulation accurately reproduces biological behavior.
* The simulation project metadata is accurate and complete.
* The thumbnail image displays correctly.

More information about using runBioSimulations to review simulation results is available [here](./viewing-projects.md#visualizations).

## Publishing projects

![share-button](./images/share.png){align=right}

Third, once the simulation run has completed and its results have been reviewed, publish the run to BioSimulations by clicking the "Publish" button on the page for the run. Then select a unique id for the project, consent to BioSimulations' terms, and click the "Publish" button.

## Using BioSimulators to test projects prior to submission to BioSimulations

BioSimulations uses BioSimulators Docker containers to execute simulation projects. This allows authors to run simulation projects locally using the same simulator containers as runBioSimulations. The containerized simulation tools provide a consistent environment and interface that matches that provided on runBioSimulations. This consistency makes it easy for authors to debug problems by enabling authors to use their own machines to interactively run the same simulations as runBioSimulations. For more detailed information and alternative methods to simulating projects see the [simulating projects guide](./simulating-projects.md).

To run a project locally, pull the appropriate BioSimulators Docker image, and then run the simulator as follows:

```bash
docker run ghcr.io/biosimulators/tellurium:2.2.1 -v /path/to/project:/root -v /path/to/output:/root/out -i project.omex -o /root/out
```

!!!note
    Ensure that the directories containing the project.omex file and the output directory are mounted in the container. For more information, see the Docker documentation [here](https://docs.docker.com/storage/bind-mounts/).

## User accounts for owning projects

No login is required to access BioSimulations. However, users must have an account to manage projects. This allows for proper crediting of authors, and it allows authors to manage and edit their projects. BioSimulations provides a free account for users who wish to publish and manage projects.

!!!note
    User accounts are under development. If you are interested in submitting a project to BioSimulations, please contact us at info@biosimulations.org.

## Privately sharing resources with colleagues, peer reviewers, and editors before publication

![share-button](./images/share.png){align=right}

Before publishing a simulation run, you can share the run privately by providing colleagues the URL of the simulation run on runBioSimulations.org. This link can be retrieved by clicking on the "Share" button in the simulation run view page.
