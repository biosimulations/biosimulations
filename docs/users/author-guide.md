# Author guide: creating and publishing projects

## Overview

Authors can publish simulation projects to BioSimulations in four easy steps. Importantly, this workflow supports a broad range of simulations involving a broad range of modeling frameworks, simulation algorithms, model formats, and simulation tools.

1. Create a simulation project (COMBINE/OMEX archive).
   - Create one or more models (e.g., BNGL, CellML, SBML files).
   - Create one or more simulations (SED-ML files).
   - Create zero or more visualizations of the results of the simulations (SED-ML plots or Vega data visualizations).
   - Capture metadata about the project (e.g., taxa, citations, license in an OMEX Metadata RDF-XML file).
2. Execute the project using runBioSimulations.
3. Use runBioSimulations to verify that the project executed as intended.
4. Use runBioSimulations to publish the project.

## Creating projects

BioSimulations uses COMBINE/OMEX archives to encapsulate the files and metadata associated with a project. The guide below summarizes the steps required to create a project. More information about the necessary files, such as the formats, conventions, standards, and organization is provided in the subsequent sections. 

1. Create a directory for the simulation project.

1. Create one or more models: Create files that describe the models that you would like to simulate and save these files to the directory for the project. Alternatively, download a model file from a repository such as BioModels.
    --8<-- "supportedLanguages.md"

1. Create one or more simulations: Create a Simulation Experiment Description Markup Language  (SED-ML) file which describes the simulation(s) that you would like to execute and the simulation results that you would like to record.
 
    Currently, all of the validated simulation tools support a subset of SED-ML L1V3 including:

    --8<--
    supportedSedml.md
    --8<--
    

1. Create an OMEX manifest file which describes your model and simulation files: OMEX manifest is a format for describing a collection of files, including the format (e.g., CellML, SBML) of each file. Several example COMBINE archives are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples). More information about the OMEX manifest format is available at the COMBINE website.

1. Package your project into a COMBINE archive: A COMBINE archive is a zip file which contains an OMEX manifest file and all of the other files which comprise a project. Several example COMBINE archives are available [here](). More information about the OMEX and COMBINE formats is available at the [COMBINE website](). The COMBINE website lists several software tools for creating COMBINE archives, including [COMBINE Archive]() and [COMBINE Archive Web]().


Interactive tutorials for creating projects can be found [here](https://tutorial.biosimulators.org). 


## Conventions for simulation projects
To make it easy for investigators to work with a broad range of model formats, modeling frameworks, simulation types, simulation algorithms, and simulation tools, BioSimulations uses existing community standards for creating and describing projects. BioSimulations uses the Simulation Experiment Description Markup Language (SED-ML) to describe [simulation experiments](#sed-ml) and COMBINE/OMEX archive formats for packaging and distribution of simulation [projects](#combineomex-archives). Vega is used to describe charts, plots and [visualizations](#visualizations) of simulation results.  The OMEX-Meta format is used to describe the [metadata](#metadata) associated with a simulation project. More information about BioSimulation's use of these standards, and how to create and publish a project can be found below.

### SED-ML 

[SED-ML](https://sed-ml.org/) is used to describe simulation experiments. This includes:

- Which models to simulate
- How to modify models to simulate variants such as alternative initial conditions
- What type of simulations to execute (e.g., steady-state, time course)
- Which algorithms to use (e.g., CVODE, SSA)
- Which observables to record
- How to reduce the recorded values of the observables
- How to plot the observables
- How to export the observables to reports (e.g., CSV, HDF5)

[runBioSimuations](https://run.biosimulations.org/create) provides a simple web form for building COMBINE/OMEX archives with SED-ML files from model files (e.g., CellML, SBML). This tool support all of the model languages supported by BioSimulations. 

More detailed information about creating SED-ML files to work with BioSimulations can be found at [here](../concepts/Experiments.md).

### Visualizations

BioSimulations recommends [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by combining the same graphical marks with results from multiple simulations. This features also makes the provenance of data visualizations transparent. As a result, Vega is ideal for collaboration and publication.

Vega files can be included in the COMBINE/OMEX archive of a simulation project to enable visualization on the [project view page](./user-guide.md#visualizations).

More information on how to create Vega files that can incorporate data from BioSimulations projects can be found at [here](../concepts/Visualizations.md).

### Metadata 
BioSimulations uses the [OMEX Meta](https://co.mbine.org/standards/omex-metadata) specification to capture metadata about the simulation project. BioSimulations has a list of recommended metadata fields that can be used to capture [metadata](./user-guide.md#metadata) about a simulation project. Information about how to use theses fields can be found [here](../concepts/Metadata.md).

### COMBINE/OMEX archives

BioSimulations uses COMBINE/OMEX archives to bundle the multiple files typically involved in modeling projects into a single archive. These files include, but are not limited to:

- Models (e.g., in CellML, SBML format)
- Simulation experiments (SED-ML files)
- Visualizations for visualizing simulation results (e.g., Vega files)
- Supplementary files, such as data used to calibrate the model
- Metadata about the simulation project (RDF-XML files that follow the OMEX Metadata guidelines)
 
## Validating projects

BioSimulations provides a validation tool for validating the contents of a COMBINE/OMEX archive. This tool is available on [runBioSimulations](https://run.biosimulations.org/utils/validate-project). The user can upload a COMBINE/OMEX archive or provide a URL to a COMBINE/OMEX archive. Optionally, the user can select a subset of the archive to validate (e.g., only SED-ML files). The tool will validate the contents of the archive and report any errors. The interface provides a report of the validation results, including validation of the model file, SED-ML file, metadata, archive manifest, and any images presented in the archive.

![validation-tool](../images/validate.png)

!!!warning
    This application can only validate targets for simulation observables for unchanged models. Targets for modified models cannot be validated statically, independently from executing the associated SED-ML document. Simulation tools validate such targets when they execute their parent SED-ML document. For the same reason, this application cannot validate targets for model changes. Simulation tools validate such model change targets during their execution.



This validation can also be accessed programmatically from the [BioSimulations API](https://combine.api.biosimulations.org).


## Using BioSimulators to test projects prior to submission to BioSimulations

BioSimulations uses BioSimulators Docker containers to execute simulations. This allows authors to run simulation projects locally using the same simulator containers as runBioSimulations. The containerized simulation tools provide a consistent environment and interface that matches that provided on runBioSimulations. This consistency makes it easy for authors to debug problems by enabling authors to use their own machines to interactively run the same simulations as runBioSimulations.

To run a project locally, pull the appropriate BioSimulators Docker image, and then run the simulator as follows:

```bash
docker run ghcr.io/biosimulators/tellurium:2.2.1 -v /path/to/project:/root -v /path/to/output:/root/out -i project.omex -o /root/out
```

!!!note
    Ensure that the directories containing the project.omex file and the output directory are mounted in the container. For more information, see the Docker documentation [here](https://docs.docker.com/storage/bind-mounts/).

## Executing projects

Before submitting a project, the simulation must be executed using runBioSimulations. This tool provides a web interface for executing a simulation project. The user can upload a COMBINE/OMEX archive or provide a URL to a COMBINE/OMEX archive. The tool will execute the simulation, report any errors, and display the results and log of the simulation. 


## Reviewing simulation results before publication

Before publishing a simulation project, the user should review the simulation results. The author should verify the following: 

1. The simulation files are present and accessible. 
2. No extra files that are not intended to be published are present.
3. The simulation ran successfully and all expected outputs are present.
4. The simulation behaved as expected and the results are visualized as expected.
5. The simulation accurately reproduces biological behavior.
6. The simulation project metadata is accurate and complete.
    1. The thumbnail image displays correctly.
    1. The metadata includes a title, description, and information about the authors of the project.
    1. The metadata includes a citation, license, and associated identifiers of the project.

## Publishing projects

![share-button](./images/share.png){align=right}

Once a simulation project has been submitted, and reviewed by the author, it can be published to BioSimulations. To publish a simulation project, the author must click on the "Publish" button on the project view page. The author can then select a unique id for the project and then submit the project to BioSimulations.

## User accounts for owning projects

No login is required to access BioSimulations. However, users must have an account to manage projects. This allows for proper crediting of authors and allows authors to manage and edit their projects. BioSimulations provides a free account for users who wish to publish and manage projects.

!!!note
    User accounts are under development. If you are interested in submitting a project to BioSimulations, please contact us at info@biosimulations.org.

## Privately sharing resources with colleagues, peer reviewers, and editors before publication

![share-button](./images/share.png){align=right}

Before publishing a simulation run, you can share the project privately, by providing colleagues the URL of the simulation run on runBioSimulations.org. This link can be retrieved by clicking on the "Share" button in the simulation run view page.
