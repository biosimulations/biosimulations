# Creating simulation projects (COMBINE/OMEX archives with SED-ML files)

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

1. Create one or more simulations: Create a Simulation Experiment Description Markup Language (SED-ML) file which describes the simulation(s) that you would like to execute and the simulation results that you would like to record.
 
    Currently, all of the validated simulation tools support a subset of SED-ML L1V3 including:

    --8<--
    supportedSedml.md
    --8<--
    
1. Create an OMEX manifest file which describes your model and simulation files: OMEX manifest is a format for describing a collection of files, including the format (e.g., CellML, SBML) of each file. Several example COMBINE archives are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples#compatibility-of-the-example-archives-with-simulation-tools). More information about the OMEX manifest format is available at the COMBINE website.

1. Package your project into a COMBINE archive: A COMBINE archive is a zip file which contains an OMEX manifest file and all of the other files which comprise a project. Several example COMBINE archives are available [here](). More information about the OMEX and COMBINE formats is available at the [COMBINE website](https://combinearchive.org/). The COMBINE website lists several software tools for creating COMBINE archives, including [COMBINE Archive]() and [COMBINE Archive Web](https://cat.bio.informatik.uni-rostock.de/).

Interactive tutorials for creating projects can be found [here](https://tutorial.biosimulators.org). 

## Conventions for simulation projects

To make it easy for investigators to work with a broad range of model formats, modeling frameworks, simulation types, simulation algorithms, and simulation tools, BioSimulations uses existing community standards for creating and describing projects. BioSimulations uses the Simulation Experiment Description Markup Language (SED-ML) to describe [simulation experiments](#sed-ml) and COMBINE/OMEX archive formats for packaging and distributing simulation [projects](#combineomex-archives). Vega is used to describe charts, plots, and [visualizations](#visualizations) of simulation results.  The OMEX-Metadata format is used to describe the [metadata](#metadata) associated with a simulation project. More information about BioSimulation's use of these standards, and how to create and publish a project can be found below.

### SED-ML 

[SED-ML](https://sed-ml.org/) is used to describe simulation experiments. This includes:

- Which models to simulate
- How to modify models to simulate variants, such as alternative initial conditions
- What type of simulations to execute (e.g., steady-state, time course)
- Which algorithms to use (e.g., CVODE, SSA)
- Which observables to record
- How to reduce the recorded values of the observables
- How to plot the observables
- How to export the observables to reports (e.g., CSV, HDF5)

[runBioSimulations](https://run.biosimulations.org/utils/create-project) provides a simple web form for building COMBINE/OMEX archives with SED-ML files from model files (e.g., CellML, SBML). This tool supports all of the model languages supported by BioSimulations. 

The table below provides links to documentation about how to use SED-ML with specific model languages, and provides the URNs and URIs that should be used with SED-ML and OMEX manifests in COMBINE/OMEX archives.

| Language                                                                                                       | EDAM format    | SED-ML URN                    | COMBINE archive specification URI                       | MIME type                 | Extensions        |
| ---------------------------------------------------------------------------------------------------------------|----------------|-------------------------------|---------------------------------------------------------|---------------------------|-------------------|
| [BNGL](https://docs.biosimulators.org/Biosimulators_BioNetGen/tutorial.html)                                   | `format_3972`  | `urn:sedml:language:bngl`     | `http://purl.org/NET/mediatypes/text/bngl+plain`        | `text/bngl+plain`         | `.bngl`           |
| [CellML](http://sed-ml.org/specifications.html)                                                                | `format_3240`  | `urn:sedml:language:cellml`   | `http://identifiers.org/combine.specifications/cellml`  | `application/cellml+xml`  | `.xml`, `.cellml` |
| [(NeuroML)/LEMS](https://docs.neuroml.org/Userdocs/Paths.html)                                                 | `format_9004`  | `urn:sedml:language:lems`     | `http://purl.org/NET/mediatypes/application/lems+xml`   | `application/lems+xml`    | `.xml`            |
| [RBA](https://docs.biosimulators.org/Biosimulators_RBApy/tutorial.html)                                        | `format_9012`  | `urn:sedml:language:rba`      | `http://purl.org/NET/mediatypes/application/rba+zip`    | `application/rba+zip`     | `.zip`            |
| [SBML](http://sed-ml.org/specifications.html)                                                                  | `format_2585`  | `urn:sedml:language:sbml`     | `http://identifiers.org/combine.specifications/sbml`    | `application/sbml+xml`    | `.xml`, `.sbml`   |
| [Smoldyn](https://github.com/ssandrews/Smoldyn/blob/master/Using-Smoldyn-with-SED-ML-COMBINE-BioSimulators.md) | `format_9001`  | `urn:sedml:language:smoldyn`  | `http://purl.org/NET/mediatypes/text/smoldyn+plain`     | `text/smoldyn+plain`      | `.txt`            |
| [XPP](https://docs.biosimulators.org/Biosimulators_XPP/tutorial.html)                                          | `format_9010`  | `urn:sedml:language:xpp`      | `http://purl.org/NET/mediatypes/text/x-xpp`             | `text/x-xpp`              | `.xpp`            |

More detailed information about creating SED-ML files to work with BioSimulations can be found at [here](../concepts/conventions/simulation-experiments.md).

### Visualizations

BioSimulations recommends [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by combining the same graphical marks with results from multiple simulations. This features also makes the provenance of data visualizations transparent. As a result, Vega is ideal for collaboration and publication.

Vega files can be included in the COMBINE/OMEX archive of a simulation project to enable visualization on the [project view page](./viewing-projects.md#visualizations).

More information on how to create Vega files that can incorporate data from BioSimulations projects can be found at [here](./creating-vega-visualizations.md).

### Metadata 
BioSimulations uses the [OMEX Metadata](https://co.mbine.org/standards/omex-metadata) specification to capture metadata about the simulation project. BioSimulations has a list of recommended metadata fields that can be used to capture [metadata](./viewing-projects.md#metadata) about a simulation project. Information about how to use these fields can be found [here](../concepts/conventions/simulation-project-metadata.md).

### COMBINE/OMEX archives

BioSimulations uses COMBINE/OMEX archives to bundle the multiple files typically involved in modeling projects into a single archive. These files include, but are not limited to:

- Models (e.g., in CellML, SBML format)
- Simulation experiments (SED-ML files)
- Visualizations for visualizing simulation results (e.g., Vega files)
- Supplementary files, such as data used to calibrate the model
- Metadata about the simulation project (RDF-XML files that follow the OMEX Metadata guidelines)
