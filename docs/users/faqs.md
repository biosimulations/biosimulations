# Frequently asked questions

## Simulation projects (COMBINE/OMEX archive)

**Can I search for projects by wild cards?**

Yes. The [search engine](https::/biosimulations.org/projects) supports wild cards such as `sys*`, `*tems`, and `sy*ems`.

**Can I search for projects by specific attributes?**

Yes. The [search engine](https::/biosimulations.org/projects) supports searching over individual attributes by prepending search queries with the key for the attribute, such as `title:xyz` to search for "xyz" in the title attribute of each project. The key for each attribute is the name of each attribute, lower cased, with spaces replaced by dashes, and without units (e.g., `project-size` for "Project size (MB)"). The table below summarizes the attributes that the search engine currently supports.

| Field                 | Description                                                                                | Units | Key                     | Typical ids                                                                   |
|-----------------------| -------------------------------------------------------------------------------------------|-------|-------------------------|-------------------------------------------------------------------------------|
| Id                    | BioSimulations id                                                                          |       | `id`                    |                                                                               |
| Title                 | Tag line                                                                                   |       | `title`                 |                                                                               |
| Abstract              | Brief summary                                                                              |       | `abstract`              |                                                                               |
| Description           | Extended summary                                                                           |       | `description`           |                                                                               |
| Biology               | Genes, pathways                                                                            |       | `biology`               | [GO](http://geneontology.org/), [UniProt](https://www.uniprot.org/)           |
| Taxa                  |                                                                                            |       | `taxa`                  | [Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy)                             |
| Keywords              |                                                                                            |       | `keywords`              |                                                                               |
| Model formats         |                                                                                            |       | `model-formats`         | [EDAM](https://edamontology.org/), [SED-ML URN](https://sed-ml.org/urns.html) |
| Simulation types      |                                                                                            |       | `simulation-types`      |                                                                               |
| Simulation algorithms |                                                                                            |       | `simulation-algorithms` | [KiSAO](https://github.com/SED-ML/KiSAO)                                      |
| Simulation tools      |                                                                                            |       | `simulation-tools`      | [BioSimulators](https://biosimulators.org)                                    |
| Reports               | Report formats                                                                             |       | `reports`               |                                                                               |
| Visualizations        | Visualization formats                                                                      |       | `visualizations`        |                                                                               |
| Project size          | COMBINE archive size                                                                       | MB    | `project-size`          |                                                                               |
| CPUs                  | Requested CPUs                                                                             |       | `cpus`                  |                                                                               |
| Memory                | Requested memory                                                                           | GB    | `memory`                |                                                                               |
| Results size          | Size of outputs                                                                            | MB    | `results-size`          |                                                                               |
| Runtime               |                                                                                            | min   | `runtime`               |                                                                               |
| Simulation provenance | Whether the simulation experiment (SED-ML) was computationally generated from a model file |       | `simulation-provenance` |                                                                               |
| Organizations         |                                                                                            |       | `organizations`         | BioSimulations organization ids                                               |
| Owner                 |                                                                                            |       | `owner`                 | BioSimulations account ids                                                    |
| Creators              | Authors                                                                                    |       | `creators`              | [ORCID](https://orcid.org/)                                                   |
| Contributors          | Curators                                                                                   |       | `contributors`          | [ORCID](https://orcid.org/)                                                   |
| Funders               | Funding agencies                                                                           |       | `funders`               | [Funder Registry](https://www.crossref.org/services/funder-registry/)         |
| Citations             | Publications                                                                               |       | `citations`             | [DOI](https://www.doi.org/), [PubMed](https://pubmed.ncbi.nlm.nih.gov/)       |
| Identifiers           |                                                                                            |       | `identifiers`           | [Identifiers.org](https://identifiers.org/)                                   |
| Additional metadata   |                                                                                            |       | `additional-metadata`   |                                                                               |
| License               |                                                                                            |       | `license`               | [SPDX](https://spdx.org/)                                                     |
| created               | Date archived created                                                                      |       | `created`               |                                                                               |
| published             | Date project published                                                                     |       | `published`             |                                                                               |
| updated               | Date project updated                                                                       |       | `updated`               |                                                                               |

**Which formats for projects does BioSimulations support?**

BioSimulations supports the [COMBINE/OMEX archive](https://combinearchive.org/) format. COMBINE/OMEX archives are zip files that contain an additional manifest file that indicates the format (e.g., CellML, CSV, SBML, SED-ML, PNG, etc.) of each file in the archive. This simple format can capture a broad range of projects. The format also provides authors the flexibility to organize their projects as appropriate.

**Are there any limitations to the COMBINE/OMEX archives and SED-ML files that runBioSimulations can execute?**

runBioSimulations is designed to be able to execute any COMBINE/OMEX archive and the SED-ML files they contain. In practice, runBioSimulations cannot execute every possible COMBINE/OMEX archive and SED-ML file for three main reasons.

First, currently runBioSimulations focuses on the latest version of SED-ML (L1V3) and has limited ability to execute simulation experiments encoded using older versions of SED-ML. Going forward, runBioSimulations will support new versions of SED-ML through new versions of simulation tools submitted to BioSimulators that support these new versions of SED-ML. Because BioSimulators stores old versions of simulation tools, runBioSimulations will also maintain the ability to execute simulations that involve the current version of SED-ML.

Second, runBioSimulations can only execute SED-ML files that involve model formats, modeling frameworks, and simulation algorithms that are supported by at least one of the standardized simulation tools in the BioSimulators registry. Presently, the standardized simulation tools support multiple formats, multiple frameworks, and over 40 algorithms. Going forward, we aim to expand this by working with the community to develop standardized interfaces for additional simulation tools and submitting them to BioSimulators.

Third, runBioSimulations has limited ability to execute SED-ML documents that deviate from the specifications of the COMBINE/OMEX archive and SED-ML formats. In practice, this is the most significant limitation because some simulation tools produce SED-ML files which deviate from the specifications of SED-ML and because most of the existing SED-ML files at SED-ML.org and in model repositories such as BioModels deviate from the specifications of SED-ML. Below is a list of known issues which prevent runBioSimulations from executing many SED-ML files.

- Broken model references: The model sources in SED-ML files in some repositories such as BioModels are different from the actual locations of the model files.
- Missing namespace definitions: Most simulation tools do not define URIs for the namespace prefixes used in XPath targets for model variables. Most existing SED-ML files at SED-ML.org and in model repositories also lack definitions of these namespace prefixes.
- Missing attributes: Some simulation tools produce SED-ML files that are missing required attributes.
- Invalid attribute values: Some simulation tools produce SED-ML files that have invalid values of some attributes.
- Non-unique identifiers: Some simulation tools produce SED-ML files that have multiple elements with the same identifier. In such cases, references to these elements cannot be resolved.
- Broken references: Some simulation tools produce SED-ML files that have broken references (e.g., no instance of sed:model has an id attribute equal to the value of the modelReference attribute of a sed:task).
- Invalid XPaths to model variables: Some simulation tools produce SED-ML files that do not have correct XPaths to variables in models. Most frequently, this is because some simulation tools confuse the ids and names of model elements.
- Incorrect KiSAO ids for algorithms: Some simulation tools produce SED-ML files that indicate different algorithms than what the simulation tool actually used to execute the simulation.
- Inconsistent plot axes: Some simulation tools produces SED-ML files where curves in the same plot have mixed (linear and log) x, y, and/or z axes.

runBioSimulations provides two web applications for [validating SED-ML files](https://run.biosimulations.org/utils/validate-simulation) and [COMBINE archives](https://run.biosimulations.org/utils/validate-project). [BioSimulators-utils](https://github.com/biosimulators/biosimulators_utils) provides a command-line program and Python API for validating SED-ML files and COMBINE archives.

We are working with the SED-ML community to clarify the specifications of SED-ML and resolve these inconsistencies. To drive consistency, we also developed the [BioSimulators test suite](https://github.com/biosimulators/Biosimulators_test_suite) for verifying whether simulation tools execute COMBINE/OMEX archives and SED-ML files consistently with the specifications of these formats. In addition, we developed [BioSimulators utils](https://github.com/biosimulators/Biosimulators_utils), a Python package which provides methods for more deeply validating COMBINE/OMEX archives and SED-ML files.

**How can I create a COMBINE/OMEX archive?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for creating COMBINE/OMEX archives from model files. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for creating COMBINE/OMEX archives.

Below are several additional tools for creating SED-ML files and COMBINE/OMEX archives. 

* [CombineArchiveWeb](https://cat.bio.informatik.uni-rostock.de/)
* [COPASI](http://copasi.org/)
* [iBioSim](http://www.async.ece.utah.edu/ibiosim)
* [JWS Online](http://jjj.mib.ac.uk/)
* [tellurium](http://tellurium.analogmachine.org/)
* [VCell](http://vcell.org/)

!!! warning

    Most of these tools are not fully compliant with the SED-ML and COMBINE/OMEX archive standards.


**Can projects include multiple models, simulations, and/or visualizations?**

Yes. Projects can include one or more models, one or more simulations of those models, and zero or more visualizations of the results of those simulations.

**Can I use runBioSimulations to execute simulations involving confidential data (e.g., sensitive patient information)?**

runBioSimulations should not be used for simulations involving confidential data such as information about individual patients. We recommend that investigators who wish to execute simulations involving confidential data use the simulation tools provided by [BioSimulators](https://biosimulators.org/) to execute simulations using their own hardware or contact the [BioSimulators Team](mailto:info@biosimulators.org) to discuss other options.

**Where can I find example COMBINE/OMEX archives?**

BioSimulations provides many archives. In addition, several example archives are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples).

**How can I quickly run a sample set of simulations?**

Click [here](https://run.biosimulations.org/simulations?try=1) to load several example simulation projects from the [BioSimulators test suite](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/).

**How can I validate a COMBINE/OMEX archive?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for validating COMBINE/OMEX archives. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for validating COMBINE/OMEX archives.

**How can I find a simulation tool for executing similar simulations on my machine?**

[runBioSimulations](https://run.biosimulations.org) provides a tool for recommending simulation tools for specific simulation projects. In addition, [BioSimulators](https://biosimulators.org) provides tools for searching and filtering for simulation tools that support particular modeling frameworks, model formats, and simulation algorithms.

**How can I execute similar simulations on my machine for further investigation?**

BioSimulations executes projects using simulation tools validated by [BioSimulators](https://biosimulators.org). Each simulation tool is available as a Docker image that provides a consistent command-line interface. In addition, most simulation tools provide consistent Python APIs. More information and tutorials are available from BioSimulators.

**How can I execute a project before publication to BioSimulations?**

BioSimulations executes projects using [runBioSimulations](https://run.biosimulations.org), which uses the simulation tools validated by [BioSimulators](https://biosimulators.org). Investigators can directly use runBioSimulations to execute projects. In addition, each simulation tool is available as a Docker image that provides a consistent command-line interface, and most simulation tools provide consistent Python APIs. These tools can be used to perform the same simulations as BioSimulations when it publishes your project. More information and tutorials are available from BioSimulators and runBioSimulations.

**Where does runBioSimulations execute simulations and store their outputs?**

runBioSimulations executes simulations using a high-performance computing cluster at UConn Health. The runBioSimulations user interface is deployed using Netlify. runBioSimulations' APIs are deployed using Google Cloud. runBioSimulations stores simulation projects (COMBINE/OMEX archives) and their results in MongoDB Atlas.

**Which other tools can I use to execute COMBINE/OMEX archives? Are there any limitations executing archives with other tools?**

runBioSimulations is designed to be compatible with the COMBINE/OMEX archive and SED-ML formats. In principle, this means that other tools such as [COPASI](http://copasi.org/) and [VCell](https://vcell.org/) that support these same formats should be able to execute the same simulations that can be executed with runBioSimulations. In practice, there are two main factors which limit the ability of such tools to execute COMBINE/OMEX archives and SED-ML files.

First, each tool can only execute simulations involving a limited number of model formats, modeling frameworks, and simulation algorithms.

Second, some simulation tools only support a subset of SED-ML. For example, some tools do not support model resolution via URI fragments, some do not support model changes, some do not support repeated tasks, and some do not support 3D plots. Going forward, we hope to use BioSimulators to keep finer-grained track of the capabilities of each tool.

Third, some of the inconsistencies in the implementation of COMBINE and SED-ML described above prevent some simulation tools from consistently executing some COMBINE/OMEX archives and SED-ML files. In particular, some tools cannot execute COMBINE/OMEX archives that organize files into subdirectories.

**Is there a limit to the size of simulation projects that can be published through BioSimulations?**

Simulation projects (COMBINE/OMEX archives) are limited to 1 GB each. In addition, simulation results are currently limited to 5 TB per project. Please contact [runBioSimulations Team](mailto:info@biosimulations.org) to arrange larger projects.

**How much resources are available to each simulation?**

runBioSimulations currently allows users to request up the following amounts of resources for each simulation project:

- Projects: 1 GB
- Cores: 24
- RAM: 192 GB
- Time: 20 days
- Results: 5 TB (The produced HDF5 file and zip archive with HDF5 and plots each must be less than 5 TB)

These limits are easily configurable. Please contact [runBioSimulations Team](mailto:info@biosimulations.org) to arrange additional resources.

**How much resources are available to runBioSimulations?**

runBioSimulations has access to over 50 TFLOPs from 2,168 CPU cores, 11 TB RAM, and 8 PB of storage. Of this, 48 CPU cores and 384 GB RAM are dedicated to runBioSimulations. The remainder is shared with other users of the HPC system at UConn Health. More information about the infrastructure available to runBioSimulations is available from the [UConn Health HPC facility](https://health.uconn.edu/high-performance-computing/resources/).

**How many users can use runBioSimulations simultaneously?**

runBioSimulations is architected to accomodate many simultaneous users. There is no specific limit on the number of users that can use runBioSimulations simultaneously. If users submit many simulations simultaneously, their simulations will be queued and processed in the order in which they were submitted.

The runBioSimulations Team strives to make runBioSimulations' resources are fairly available to all users. If necessary, the runBioSimulations will implement a job priority policy to ensure this.

**Is there a limit to the size of simulation results that runBioSimulations can generate?**

The total size of results output is limited to 5 TB

In addition, the format that runBioSimulations relies on for reports is limited to 32 dimensions. For a non-spatial time course, this means that runBioSimulations can accomodate up to 15 layers of nested repeated tasks. For a 3D spatial time course, this means that runBioSimulations can accomodate up to 13 layers of nested repeated tasks.

The total size of all plots generated from an archive is limited to 5 TB.

**How does runBioSimulations store a list of my simulations?**

The list of simulations that you have submitted is only stored in your local browser. The runBioSimulations server does not maintain user accounts. Unless you optionally provided your email address, the runBioSimulations server has no record of which simulations you requested. As a result, if you clear your browser's cache, you will lose the list of your simulations, and it will not be possible to re-create this list.

**How long does runBioSimulations store simulations?**

runBioSimulations stores simulations and their results permanently. For special cases, contact the [BioSimulators Team](mailto:infor@biosimulators.org) to request deleting simulations and results.

**How can I share projects privately with colleagues and peer reviewers without publishing them?**

[runBioSimulations](https://run.biosimulations.org) provides a unique link for each project. These links can be shared with colleagues, peer reviewers, and editors. These links are not publicly advertised.

**How can I use BioSimulations in conjunction with journal articles?**

We recommend embedding hyperlinks to interactive versions of static figures in figure captions, availability sections, and/or supplementary materials. During peer review, private runBioSimulations hyperlinks can be used as described above. We recommend using Identifiers.org hyperlinks (<code>https://identifiers.org/biosimulations/{project-id}</code>, <code>https://identifiers.org/runbiosimulations/{run-id}</code>).

**Do I need to create an account to publish a project?**

No. Projects can be published anonymously without an account or registration. However, to be able to later edit a project, you must create an account and use that account to publish the project. Once the project is created, only that account will be able to edit the project.

**How can I edit a project that I published?**

The owner of a project can associate the project with new simulation runs. This can be used to correct mistakes and/or provide improved versions. First, use runBioSimulations to create a simulation run. Second, use BioSimulations' [REST API](https://api.biosimulations.org) to modify the project by replacing the old simulation run associated with the project with the new run. The online documentation for the API includes a simple web interface for using the API.

!!! info

    The runBioSimulations website currently only enables investigators to publish simulation runs anonymously. To be able to edit a project, currently, users must initially publish the project using BioSimulations' [REST API](https://api.biosimulations.org). 

Please contact the BioSimulations Team via [email](mailto:info@biosimulations.org) for additional assistance.

**How can I delete a project that I published?**

To ensure projects remain accessible to the community, authors cannot delete projects once they have been published.

Please contact the BioSimulations Team via [email](mailto:info@biosimulations.org) for additional assistance.

**How long does BioSimulations store projects?**

BioSimulations stores projects permanently, including their source files and simulation results.

**How long does runBioSimulations store simulations?**

runBioSimulations stores simulations and their results permanently. For special cases, contact the [BioSimulators Team](mailto:info@biosimulators.org) to request deleting simulations and results.

**How long does runBioSimulations store COMBINE archives created via the online webform?**

Archives created with the webform are temporarily stored for 1 day.

**Why did my simulation fail? How can I get my simulation to succeed?**

There are several reasons why simulations can fail including:

- The simulator that you selected is not capable of executing your archive. Because each simulator supports different modeling frameworks, simulation algorithms, and model formats, any given archive is only compatible with a subset of simulation tools. BioSimulators describes the modeling frameworks, simulation algorithms, and model formats that each simulation tool supports. We recommend using BioSimulators to determine which simulation tools are compatible with your archive. Note, BioSimulators does not capture every detail about the capabilities of each simulation tool, in part, because BioSimulators relies on the community to curate simulation tools. For example, BioSimulators has limited information about which SBML elements (e.g., delays, events) most simulation tools support. As a result, to determine which tools are compatible with your archive, it may also be necessary to read the documentation for several potentially compatible simulation tools.
- Your archive or one of the models or simulations inside your archive is invalid. In particular, because many modeling tools are just beginning to support SED-ML, and some tools do not yet produce valid SED-ML files. We recommend creating simulations with tools that faithfully support SED-ML such as tellurium and VCell.
- Your archive describes one or more simulations that can't be solved. For example, many algorithms may not be able to solve a stiff model up to the desired tolerance in the specified number of execution steps. In this case, we recommend using an alternative algorithm such as CVODE or LSODA for continuous kinetic models or restructuring your model.
- Your archive generates very large outputs. runBioSimulations is architected to support arbitrarily large models and simulations. However, because runBioSimulations hasn't yet been hardened from years of use, users may still discover bugs in runBioSimulations. In this case, please help us improve runBioSimulations by using [GitHub issues](https://github.com/biosimulators/Biosimulators/issues/new/choose) to report problems to the BioSimulators team.

**How can I execute the same simulators as runBioSimulations on my own machine?**
runBioSimulations uses the BioSimulators collection of standardized simulation software tools. BioSimulators containers standardized Docker images for each simulation tool that make it easy to execute simulations. These Docker images are easy to install and run on your own machine. The images can be used on top of any operating system. Please see https://biosimulators.org for more information about how to install and run these images.

Most of the standardized simulation tools in BioSimulators also provide standardized Python APIs. These APIs provide additional flexibility such as combining simulation tools together. A single Docker image with most of the Python APIs is also available. Please see https://biosimulators.org for more information.

**How is each project licensed?**

Each project is provided under the license chosen by its authors. These licenses are displayed on the landing pages for each project. We encourage authors to contribute projects under licenses that permit their reuse, such as the [Creative Commons Universal License (CC0)](https://creativecommons.org/share-your-work/public-domain/cc0/).

**How can I create a badge to embed a project into my website?**

We recommend using Shields.io to generate badges for projects. For example, `https://img.shields.io/badge/BioSimulations-published-green` can be used to generate the badge below.

![Badge](https://img.shields.io/badge/BioSimulations-published-green)

**How can I embed capabilities to create COMBINE/OMEX archives into my website?**

Developers can use runBioSimulations to provide their users capabilities to execute their simulations. Developers can achieve this simply by adding hyperlinks to the create simulation project page, https://run.biosimulations.org/create.

This page supports several query arguments:

- `modelUrl`: URL for a model file that will be configured in a COMBINE archive. This argument instructs the web form to prefill the model file input with this URL.
- `modelFormat`: EDAM id of the format of the models to execute (e.g., `format_2585` for SBML). This argument instructs the web form select this format.
- `modelingFramework`: SBO id of the modeling framework of the simulations to execute (e.g., `SBO_0000293` for continuous kinetic framework). This argument instructs the web form to select this modeling framework.
- `simulationType`: Name of the type of simulation to create (`OneStep`, `SteadyState`, `UniformTimeCourse`). This argument instructs the web form to select this simulation type.
- `simulationAlgorithm`: KiSAO id of the simulation algorithm to execute (e.g., KISAO_0000019 for CVODE). This argument instructs the web form to select this algorithm.

For example, the URL `https://run.biosimulations.org/run?modelUrl=https%3A%2F%2Fwww.ebi.ac.uk%2Fbiomodels%2Fmodel%2Fdownload%2FBIOMD0000000878.4%3Ffilename%3DLenbury2001.xml&modelFormat=format_2585&modelingFramework=SBO_0000293` can be used to link to the capability to create a COMBINE/OMEX archive for BioModels entry `BIOMD0000000878`.

**How can I embed execution capabilities for my simulations into my website?**

Developers can use runBioSimulations to provide capabilities of execute simulations to their users, by simply adding a hyperlink: https://run.biosimulations.org/run.

The run simulations page supports several query arguments:

- `projectUrl`: URL for a COMBINE/OMEX archive to simulate. This argument instructs the web form to prefill the COMBINE/OMEX archive input with this URL.
- `simulator`: Id of the recommended simulator for executing the COMBINE/OMEX archive (e.g., `tellurium`). This argument instructs the web form to preselect this simulator.
- `simulatorVersion`: Recommended version of the simulator for executing the COMBINE/OMEX archive (e.g., `2.2.1`). This argument instructs the web form to preselect this version.
- `cpus`: Recommended number of CPU cores needed to execute the COMBINE/OMEX archive. This argument instructs the web form to preset the requested number of CPU cores.
- `memory`: Recommended amount of RAM in GB needed to execute the COMBINE/OMEX archive. This argument instructs the web form to preset the requested amount of RAM.
- `maxTime`: Recommended amount of time in minutes needed to execute the COMBINE/OMEX archive. This argument instructs the web form to preset the requested maximum execution time.
- `runName`: Recommended name for the simulation run. This argument instructs the web form to preset the name of the simulation run.

For example, the URL `https://run.biosimulations.org/run?projectUrl=https%3A%2F%2Fwww.ebi.ac.uk%2Fbiomodels%2Fmodel%2Fdownload%2FBIOMD0000000878` can be used to link to the capability to simulate BioModels entry BIOMD0000000878.

**Does runBioSimulations provide an additional service for lower-latent simulation?**

Yes! An endpoint for lower-latent simulation is available [here](https://combine.api.biosimulations.org/). This endpoint is intended for interactive execution of computationally-cheap simulations.

This endpoint runs simulations more quickly by executing simulations in an active Python environment rather than submitting jobs to an HPC queue that use Singularity images to execute simulations.

This endpoint returns simulation results rather than returning an id for later retrieving simulation results. This endpoint can return the outputs of projects in three ways:

- JSON document: includes the results of each SED-ML report and plot
- HDF file: includes the results of each SED-ML report and plot
- Zip file: by default, includes an HDF5 file with the data for each SED-ML report and plot, a PDF file for each plot, a YAML-formatted log of the simulation run, and any additional files produced by the simulation tool

Note, this endpoint has several limitations:

- This endpoint has not been tested as extensively as the main runBioSimulations queue. Please contact the [runBioSimulations Team](mailto:info@biosimulations.org) if you experience issues using this endpoint.
- Currently, only a limited amount of computational resources are dedicated to this endpoint. As a result, this endpoint may be overloaded by frequent simulation.
- This endpoint has access to a limited amount of CPU, memory, and disk.
- Runs are limited to 30 seconds. Longer runs are terminated with timeout errors.
- Only one version of each simulation tool is available. We aim to provide the latest version of each simulation tool possible within a shared Python environment. In cases of conflicting dependencies, this endpoint will be behind the latest version of one or more tools. We aim to avoid this problem by encouraging simulation software developers to update their tools to use recent versions of common dependencies.
- Some validated simulation tools are not available. Because the endpoint is executed within a single Python environment, simulation tools which cannot be installed into a mutual Python environment cannot be executed through this endpoint. Currently, 90% of validated tools are available through the endpoint.
- The endpoint cannot save simulation runs to the runBioSimulations database for later retrieval or sharing.

**Can I use the runBioSimulations API to develop an interactive web application for running simulations?**

Yes! The low-latent simulation endpoint described above is designed to support interactive web applications. Please contact the [runBioSimulations Team](mailto:info@biosimulations.org) to enable CORS access for your application and discuss the computational resources needed for your application.

## Models (e.g., CellML, SBML)

**Which modeling frameworks does BioSimulations support?**

Currently BioSimulations supports constraint-based ([Flux Balance Analysis (FBA)](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000004) and [Resource Balance Analysis (RBA)](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000692)), [continuous kinetic](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000293) (ordinary differential equations (ODE) and differential-algebraic equations (DAE)), [discrete kinetic](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000295) (e.g., Stochastic Simulation Algorithms (SSA)), [logical](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000234), and various [hybrid](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000681) models, including non-spatial, spatial, population-based, and particle-based models. More information about the available simulation methods is available at [BioSimulators](https://biosimulators.org).

**Which model formats does BioSimulations support?**

Currently BioSimulations supports several languages including the [BioNetGen Language (BNGL)](https://bionetgen.org), [CellML](https://cellml.org), the [GINsim](http://ginsim.org/) Markup Language, [NeuroML](https://neuroml.org/)/[Low Entropy Model Specification Langauge (LEMS)](https://lems.github.io/LEMS/), the [RBA XML format](https://sysbioinra.github.io/RBApy/), the [Systems Biology Markup Language (SBML)](https://sbml.org) including the Flux Balance Constraints and Qualitative Models Packages, the [Smoldyn](http://www.smoldyn.org/) simulation configuration format, and the XPP [ODE](http://www.math.pitt.edu/~bard/xpp/help/xppodes.html) format. 

**Which SBML packages does BioSimulations support?**

Currently, BioSimulations supports the core, [Flux Balance Constraints (fbc)](http://sbml.org/Documents/Specifications/SBML_Level_3/Packages/fbc), and [Qualitative Models (qual)](http://sbml.org/Documents/Specifications/SBML_Level_3/Packages/qual) packages.

**How can I contribute an additional modeling framework or model format?**

BioSimulations is extensible to additional modeling frameworks and formats. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org). More information, tutorials, and examples are available from BioSimulators.

**How can I request an additional modeling framework or model format?**

Please [submit an issue](https://github.com/biosimulators/Biosimulators/issues/new/choose) to request support for another modeling framework and/or model format.

## Simulation experiments (SED-ML) 

**Which simulation formats does BioSimulations support?**

BioSimulations supports these [conventions](../concepts/conventions/simulation-experiments.md) for the [Simulation Experiment Description Markup Language (SED-ML)](https://sed-ml.org). SED-ML can be used to describe a broad range of simulations involving a broad range of modeling frameworks, model formats, simulation algorithms, and simulation tools.

**Which versions of SED-ML does BioSimulations support?**

BioSimulations all versions of SED-ML. However, BioSimulations does not yet support the new features added to the latest version (L1V4) released this summer. We aim to support these new features soon.

**Which SED-ML features does BioSimulators support?**

All of the simulation tools support the following features:

- Models and model attribute changes: `sedml:model`, `sedml:changeAttribute`.
- At least one of steady-state, one step, and uniform time course simulations: `sedml:steadyState`, `sedml:oneStep`, or `sedml:uniformTimeCourse`.
- Algorithms and their parameters: `sedml:algorithm`, `sedml:algorithmParameter`.
- Tasks for the execution of individual simulations of individual models: `sedml:task`.
- Data generators for individual variables: `sedml:DataGenerator`
- Report outputs: `sedml:Report`.

Some of the simulation tools, such as tellurium, support the full SED-ML specification.

**How can I create a SED-ML file?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for creating SED-ML documents. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for creating SED-ML documents.

**How should SED-ML be used with specific model languages?**

Information about how to use SED-ML with specific model languages is available [here](../concepts/conventions/simulation-experiments.md).

**Where can I obtain example COMBINE/OMEX archives and SED-ML files?**

Several examples files are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples). These examples are verified to work with runBioSimulations. This page lists that simulation tools that are compatible with each example.

**What tools can I use to create SED-ML files?**

runBioSimulations provides an [online tool](https://run.biosimulations.org/utils/create-project) for building SED-ML files. Similar functionality is available as a command-line program and Python API through the [BioSimulators-utils Python package](https://github.com/biosimulators/Biosimulators_utils).

**How can I validate a SED-ML file?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for validating SED-ML documents. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for validating SED-ML documents.

**Which simulation algorithms does BioSimulations support?**

BioSimulations supports all simulation algorithms that are validated by BioSimulators. Currently, this includes over 60 algorithms. See below for contributing an additional simulation algorithm.

**How can I contribute an additional simulation algorithm?**

BioSimulations is extensible to additional simulation algorithms. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org). More information, tutorials, and examples are available from BioSimulators.

**How can I request an additional simulation algorithm?**

Please [submit an issue](https://github.com/biosimulators/Biosimulators/issues/new/choose) to request support for another simulation algorithm.

**Can I upload simulation results?**

To ensure the provenance of simulation results, simulation results can only be generated by BioSimulations.

**Can I execute simulations without publishing them?**

Yes. [runBioSimulations](https://run.biosimulations.org/) provides a web application for executing simulations. runBioSimulations does not require an account or registration. Simulations executed with runBioSimulations are private until shared or published.

## Simulation results

**Which formats does BioSimulators support?**

Data for reports and plots are saved in HDF5 format. See the [specifications for data sets](../concepts/conventions/simulation-run-reports.md) for more information.

**How are results encoded into HDF5 files?**

Within HDF5 files, the results of each report (`sedml:report`) and plot (`sedml:plot2D`, `sedml:plot3D`) are saved to paths that are a combination of the relative path of the parent SED-ML document within the parent COMBINE/OMEX archive and the id of the report or plot.

For reports, the rows of these data tables correspond to the data sets (`sedml:dataSet`) specified in the SED-ML definition of the report. The heading of each row is the label of the corresponding data set. For plots, the rows of these data tables correspond to the data generators (`sedml:dataGenerator`) specified in the SED-ML definition of the curves and surfaces of the plot. The heading of each row is the id of the corresponding data generator.

For time course simulations, the columns of these data tables correspond to the predicted time points. Below is a sample data table for a report.

See the [specifications for data tables](../concepts/conventions/simulation-run-reports.md) for more information and examples.

## Data visualizations of simulation results

**Which data visualization formats does BioSimulations support?**

Currently, BioSimulations supports the [Simulation Experiment Description Markup Language (SED-ML)](https://sed-ml.org) and [Vega](https://vega.github.io/vega/) formats. The SED-ML format supports basic line charts. Vega is a powerful format that can be used to describe a broad range of data visualizations, including interactive visualizations that brush complex diagrams with results from multiple individual simulations.

BioSimulations follows these [conventions](../concepts/conventions/simulation-run-visualizations/) for incorporating Vega visualizations into COMBINE/OMEX archives for simulation projects. These conventions enable authors to describe how the outputs of simulation experiments (simulation results) should be linked to the inputs (data sets) of Vega data visualizations. Importantly, these conventions enable Vega data visualizations to be reused across multiple simulations, such as with different initial conditions, simulation algorithms, simulation tools, models, or modeling frameworks.

**What types of plots does BioSimulations support?**

The SED-ML format supports basic statistical charts. The Vega format supports a broad range of charts, including all canonical statistical charts such as bar and line charts, as well as domain-specific diagrams such as activity flow diagrams, processing description maps, and reaction flux maps.

**What tools are available for creating Vega data visualizations?**

Several tools are available for creating Vega data visualizations, including the [Altair](https://altair-viz.github.io/) Python package, the [Lyra](http://idl.cs.washington.edu/projects/lyra/app/) visual editor, and the Vega [text editor](https://vega.github.io/editor/).

**How can I convert existing diagrams into Vega data visualizations?**

In addition, [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides tools for creating Vega data visualizations from several model visualization formats including [Escher](https://escher.github.io/) metabolic flux maps, [GINsim](http://ginsim.org/) activity flow diagrams, and [Systems Biology Graphical Notation (SGBN)](https://sbgn.github.io/) process description maps.

**How can BioSimulations render additional visualization formats?**

One way to use BioSimulations with additional formats is to convert them to Vega. This can be achieved by writing scripts to convert alternative formats into Vega.

Additional rendering tools could be incorporated into BioSimulations. Please contact the [BioSimulations Team](https://biosimulations.org) to discuss how to integrate additional tools with SED-ML files, COMBINE/OMEX archives, and BioSimulations.

## Metadata about simulation projects

**What metadata is required to publish a project?**

The minimum metadata required for publication is described [here](../concepts/conventions/simulation-project-metadata/).

**Which formats for metadata does BioSimulations support?**

BioSimulations supports the [RDF-XML format](https://www.w3.org/TR/rdf-syntax-grammar/) and the predicates described [here](../concepts/conventions/simulation-project-metadata/).

**What tools can be used to create RDF-XML files?**

Several tools are available for creating RDF-XML files:

* [libOmexMeta](https://sys-bio.github.io/libOmexMeta/): creates RDF-XML from metadata in SBML files
* [OpenLink Structured Data Editor](https://osde.openlinksw.com/)
* [RDF Editor](https://dotnetrdf.org/docs/stable/user_guide/Tools-rdfEditor.html)
* [RDF Studio](http://www.linkeddatatools.com/rdf-studio)

## Simulation software tools

**Which simulation tools does BioSimulations support?**

BioSimulations supports all simulation tools validated by [BioSimulators](https://biosimulators.org). Currently, this includes over 20 simulation tools. BioSimulations is extensible to additional simulation tools. The community can extend BioSimulations' capabilities by contributing simulation tools to BioSimulators. More information, tutorials, and examples are available from BioSimulators.

**Do all of the simulators provide consistent Docker images?**

Only the simulators that have a curation status of 5 stars provide Docker images that support the BioSimulators conventions. Going forward, we aim to encourage the community to provide additional standardized Docker images.

**Do all of the simulators provide consistent Python APIs?**

Only the simulators that have a curation status of 5 stars provide Python APIs images that support the BioSimulators conventions. Going forward, we aim to encourage the community to provide additional standardized Docker images.

**How frequently are these tools updated?**

For most tools, BioSimulators immediately incorporates new versions upon their release. These new versions are then immediately available for running and publishing projects.

**Does BioSimulations support old versions of tools?**

Yes. BioSimulations uses BioSimulators to run simulations. BioSimulators stores each version of each tool so that in the future, if needed, old models can be rerun with old versions of tools.

**How can I contribute an additional simulation tool?**

BioSimulations is extensible to additional simulation tools. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org). More information, tutorials, and examples are available from BioSimulators.

**Can I submit a simulation tool to the BioSimulators registry for which there is no Docker image, or for which there is a Docker image that is not consistent with the BioSimulators conventions?**
Yes! We encourage the community to submit all simulation tools, even if they do not support the BioSimulators interface and Docker image structure conventions.

Note, BioSimulators can only validate simulation tools that support these conventions. Consequently, when creating GitHub issues to submit simulation tools that do not support the BioSimulators conventions, set `validateImage` to `false` to decline validation of the Docker image (or lack thereof) for your simulation tool. The validation status of your simulation tool (passed or skipped) will be communicated to BioSimulators users.

**Can I submit a simulation tool to the BioSimulators registry for which there is no Python API, or for which there is a Python API image that is not consistent with the BioSimulators conventions?**
Yes! We encourage the community to submit all simulation tools, even if they do not support the BioSimulators conventions.

**How does BioSimulators manage ownership of BioSimulators entries for simulation tools?**
BioSimulators uses GitHub teams to manage ownership of simulation tools.

When a simulator is first submitted to BioSimulators, BioSimulators creates a GitHub Team to own the simulator and Biosimulators adds the submitter as a maintainer of that team. The team will have the name `@biosimulators/{ simulator-id }`. Once the team is created, the submitter will be able to manage the team and add collaborators through [GitHub](https://github.com/orgs/biosimulators/teams/simulator-developers/teams).

Only members of these teams can submit issues to edit the specifications of tools and post new versions of tools. If you are not a member of the team for your simulator, you will need to request access from the maintainers of the GitHub team for your tool.

**How can I request an additional simulation tool?**

Please [submit an issue](https://github.com/biosimulators/Biosimulators/issues/new/choose) to request support for another simulation tool.

**How is each simulation tool licensed?**

The simulation tools available through BioSimulations are provided under the licenses documented for each tool. Please see [BioSimulators](https://biosimulators.org) for more information.

**How can I use a simulator Docker image to execute a simulation?**

Instructions for using simulator Docker images to execute simulations are available [here](../users/simulating-projects.md).

**How can I use a command-line interface image to execute a simulation?**
Instructions for using command-line interfaces to execute simulations are available [here](../users/simulating-projects.md).

**How can I use a Python API to execute a simulation?**
Instructions for using simulator Python APIs to execute simulations are available [here](../users/simulating-projects.md).

In addition, several interactive tutorials are available from [Binder](https://tutorial.biosimulators.org/).

**Is a Docker image available with all of the Python APIs available?**
Yes! `The ghcr.io/biosimulators/biosimulators` image contains most of the Python APIs (90% as of 2021-09-23). More information about the image is available [here](https://github.com/biosimulators/Biosimulators/pkgs/container/biosimulators).

The Dockerfile for this image is available [here](https://github.com/biosimulators/Biosimulators/blob/dev/Dockerfile). To the extent possible, this Docker image uses Pipenv to manage the Python environment inside the image. The `Pipfile` and `Pipfile.lock` files for this environment are available [here](https://github.com/biosimulators/Biosimulators/tree/dev/Dockerfile-assets).

The goal of this image is to provide the latest mutually-compatible versions of the Python APIs for simulation tools. When simulation tools require conflicting versions of dependencies, this image may not have the latest version of each simulation tool. In such cases, individual simulation tools can be updated by running `pipenv install --system --selective-upgrade ...` or `pip install --upgrade ....`. Note, such upgrading may break the functionality of other tools.

In addition, the `ghcr.io/biosimulators/biosimulators-base` image contains the non-Python dependencies for these the Python APIs. More information about the image is available [here](https://github.com/biosimulators/Biosimulators/pkgs/container/biosimulators-base).

**Can the Docker images be run on high-performance computing systems without root access?**
Yes! The Docker images can be run on high-performance computing (HPC) systems where root access is not available by first converting the images to [Singularity](https://sylabs.io/) images. All of the validated images are compatible with Singularity.

**Can the Docker images for simulators be converted to Singularity images for use for high-performance computing systems?**
Yes! All of the validated images are compatible with Singularity. As part of the validation process, we check that each Docker image can be converted into a Singularity image.

**Do any of the simulation tools need commercial licenses?**
No! Currently, no validated simulation tool requires a commercial license. However, some tools can execute simulations more quickly with commercial libraries such as [Gurobi](https://www.gurobi.com/products/gurobi-optimizer/) and [IBM CPLEX](https://www.ibm.com/analytics/cplex-optimizer). Gurobi and IBM both provide free licenses for academic research.

Currently, runBioSimulations can execute COBRApy and RBApy with Gurobi.

**How can I use a commercial license with a simulation tool on my own machine?**
Currently, COBRApy and RBApy can read license keys for Gurobi through environment variables which start with the prefix GRB_. For example, COBRApy and RBApy can use Gurobi (using keys for Gurobi's [Web License Service for Container Environments Only](https://www.gurobi.com/web-license-service/)) inside Docker containers as illustrated below.

```
docker run -it --rm \
  --env \
    GRB_WLSACCESSID=********-****-****-****-************ \
    GRB_WLSSECRET=********-****-****-****-************ \
    GRB_LICENSEID=****** \
  ghcr.io/biosimulators/cobrapy
```

**Can I combine multiple BioSimulators tools together into hybrid or multi-algorithmic simulations?**

Yes! Multiple BioSimulators tools could be used to co-simulate multiple models (potentially involving multiple model languages) using multiple simulation algorithms. We recommend using the Python APIs because they are more flexibile than the command-line interfaces. Specifically, we recommend using the [Vivarium framework](https://vivarium-collective.github.io/) to combine multiple simulation tools and/or models. Vivarium also provides tooling to use BioSimulators.

**Which fields are available for search over simulation tools?**

The [simulation tool search](https://biosimulators.org/simulators) supports search over the following fields:
- `id`
- `name`
- `latest-version`
- `description`
- `frameworks`
- `algorithms`
- `algorithm-parameters`
- `model-formats`
- `simulation-formats`
- `archive-formats`
- `image`
- `cli`
- `python-api`
- `interfaces`
- `operating-systems`
- `programming-languages`
- `curation-status`
- `license`
- `dependencies`
- `authors`
- `citations`
- `identifiers`
- `funding`
- `updated`
- `more-info-url`

**How can I create a badge for a simulation tool to embed into my website?**

We recommend using Shields.io to generate shields for simulators. Several examples are below.

Indicate that a simulator is registered:
Use `https://img.shields.io/badge/BioSimulators-registered-green` to generate the badge below.
![Latest badge](https://img.shields.io/badge/BioSimulators-registered-green)

Indicate that a simulator is valid:
Use `https://img.shields.io/badge/BioSimulators-valid-green` to generate the badge below.
![Latest badge](https://img.shields.io/badge/BioSimulators-valid-green)

Indicate the latest registered version of a simulator:
Use `https://img.shields.io/badge/BioSimulators-{ latest-version }-green` to generate the badge below.
![Latest badge](https://img.shields.io/badge/BioSimulators-2.2.1-green)

## Primary model repositories

**Which model repositories does BioSimulations integrate models from?**

Currently, BioSimulations incorporates models from the [BiGG](http://bigg.ucsd.edu/), [BioModels](http://biomodels.net/), [ModelDB](http://modeldb.science/), and [Physiome](https://models.physiomeproject.org/) model repositories. BioSimulations pulls updates each week.

**How can I contribute models from a model repository?**

The [API](https://api.biosimulations.org) can be used to programmatically contribute projects. Please contact the BioSimulations Team via [email](mailto:info@biosimulations.org) for additional assistance.

## Docker images/containers

**What is a Docker image?**

A Docker image is a template for creating a Docker container. Typically, Docker images are containers for an operating system and additional programs. Docker images enable developers to encapsulate programs and their dependencies into a format that can be shared through online repositories such as Docker Hub or the GitHub Container Registry and run on top of any operating system.

**What is a Docker container?**

A Docker container is a virtual machine. Typically Docker containers are created by instantiating Docker images.

## API

**How can I programmatically retrieve projects and their simulation results?**

BioSimulations' [REST API](https://api.biosimulations.org) can be used to programmatically retrieve projects and their simulation results. Extensive documentation is available online.

The OpenAPI [specification](https://api.biosimulations.org/openapi.json) for the API can be used to create libraries for the API for a broad range of languages. Multiple tools for generating client libraries are available, including [OpenAPI Generator](https://openapi-generator.tech/) and [Swagger Codegen](https://swagger.io/tools/swagger-codegen/).

**How can I programmatically search projects?**

BioSimulations' [REST API](https://api.biosimulations.org) provides an endpoint which returns summaries of each project. This can be used to programmatically search for projects. We plan provide a SPARQL endpoint to support more flexible querying.

## User accounts and organizations

**Is a user account or registration needed to use BioSimulations?**

No account or registration is needed to browse or publish projects to BioSimulations. However, to be able to later edit a project, users must create an account and use that account to publish the project.

**Does runBioSimulations maintain user accounts?**

No. runBioSimulations does not have user accounts. No account or registration is necessary to use runBioSimulations. Optionally, you can provide your email to receive notification of the completion of your simulations.

**How can I create an organization?**

Organizations are groups of users and/or machine accounts. Currently, organizations are used to indicate projects submitted by primary model repositories such as BioModels and consortia. Please contact the [BioSimulations Team](mailto:info@biosimulations.org) to request an organization. In your request, please include the following information:

- Desired id for the organization (lower case letters, numbers, dashes, and underscores)
- Name of the organization
- URL for more information about the organization
- List of need user accounts
  - Desired id (e.g., john-doe)
  - Name (e.g., John Doe)
  - (Optional) URL for more information about the user
- List of needed machine accounts (tokens for programmatically submitting projects)
  - Desired id (e.g., biomodels-bot)
  - Name (e.g., BioModels bot)
  - (Optional) URL for more information about the account

**How does runBioSimulations store a list of my simulations without user accounts?**

The list of your simulations is stored in your local browser. Unless you provided your email address, the runRioSimulations server does not know which simulations you submitted. As a result, if your clear your browser's cache, you will lose the list of your simulations, and it will not be possible to recover this list.
