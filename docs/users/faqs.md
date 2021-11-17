# Frequently asked questions

## Projects

**Can I search for projects by wild cards?**

Yes. The [search engine](https::/biosimulations.org/projects) supports wild cards such as `sys*`, `*tems`, and `sy*ems`.

**Can I search for projects by specific attributes?**

Yes. The [search engine](https::/biosimulations.org/projects) supports searching over individual attributes by prepending search queries with the key for the attribute, such as `title:xyz` to search for "xyz" in the title attribute of each project. The key for each attribute is the name of each attribute, lower cased, with spaces replaced by dashes, and without units (e.g., `project-size` for "Project size (MB)"). The table below summarizes the attributes that the search engine currently supports.

| Field                 | Description            | Units | Key                     | Typical ids                                                                   |
|-----------------------| -----------------------|-------|-------------------------|-------------------------------------------------------------------------------|
| Id                    | BioSimulations id      |       | `id`                    |                                                                               |
| Title                 | Tag line               |       | `title`                 |                                                                               |
| Abstract              | Brief summary          |       | `abstract`              |                                                                               |
| Description           | Extended summary       |       | `description`           |                                                                               |
| Biology               | Genes, pathways        |       | `biology`               | [GO](http://geneontology.org/), [UniProt](https://www.uniprot.org/)           |
| Taxa                  |                        |       | `taxa`                  | [Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy)                             |
| Keywords              |                        |       | `keywords`              |                                                                               |
| Model formats         |                        |       | `model-formats`         | [EDAM](https://edamontology.org/), [SED-ML URN](https://sed-ml.org/urns.html) |
| Simulation types      |                        |       | `simulation-types`      |                                                                               |
| Simulation algorithms |                        |       | `simulation-algorithms` | [KiSAO](https://github.com/SED-ML/KiSAO)                                      |
| Simulation tool       |                        |       | `simulator`             | [BioSimulators](https://biosimulators.org)                                    |
| Reports               | Report formats         |       | `reports`               |                                                                               |
| Visualizations        | Visualization formats  |       | `visualizations`        |                                                                               |
| Project size          | COMBINE archive size   | MB    | `project-size`          |                                                                               |
| CPUs                  | Requested CPUs         |       | `cpus`                  |                                                                               |
| Memory                | Requested memory       | GB    | `memory`                |                                                                               |
| Results size          | Size of outputs        | MB    | `results-size`          |                                                                               |
| Runtime               |                        | min   | `runtime`               |                                                                               |
| Organizations         |                        |       | `organizations`         | BioSimulations organization ids                                               |
| Owner                 |                        |       | `owner`                 | BioSimulations account ids                                                    |
| Creators              | Authors                |       | `creators`              | [ORCID](https://orcid.org/)                                                   |
| Contributors          | Curators               |       | `contributors`          | [ORCID](https://orcid.org/)                                                   |
| Funders               | Funding agencies       |       | `funders`               | [Funder Registry](https://www.crossref.org/services/funder-registry/)         |
| Citations             | Publications           |       | `citations`             | [DOI](https://www.doi.org/), [PubMed](https://pubmed.ncbi.nlm.nih.gov/)       |
| Identifiers           |                        |       | `identifiers`           | [Identifiers.org](https://identifiers.org/)                                   |
| Additional metadata   |                        |       | `additional-metadata`   |                                                                               |
| License               |                        |       | `license`               | [SPDX](https://spdx.org/)                                                     |
| created               | Date archived created  |       | `created`               |                                                                               |
| published             | Date project published |       | `published`             |                                                                               |
| updated               | Date project updated   |       | `updated`               |                                                                               |

**Which formats for projects does BioSimulations support?**

BioSimulations supports the [COMBINE/OMEX archive](https://combinearchive.org/) format. COMBINE/OMEX archives are zip files that contain an additional manifest file that indicates the format (e.g., CellML, CSV, SBML, SED-ML, PNG, etc.) of each file in the archive. This simple format can capture a broad range of projects. The format also provides authors the flexibility to organize their projects as appropriate.

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

**Where can I find example COMBINE/OMEX archives?**

BioSimulations provides many archives. In addition, several example archives are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples).

**How can I validate a COMBINE/OMEX archive?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for validating COMBINE/OMEX archives. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for validating COMBINE/OMEX archives.

**How can I find a simulation tool for executing similar simulations on my machine?**

[runBioSimulations](https://run.biosimulations.org) provides a tool for recommending simulation tools for specific simulation projects. In addition, [BioSimulators](https://biosimulators.org) provides tools for searching and filtering for simulation tools that support particular modeling frameworks, model formats, and simulation algorithms.

**How can I execute similar simulations on my machine for further investigation?**

BioSimulations executes projects using simulation tools validated by [BioSimulators](https://biosimulators.org). Each simulation tool is available as a Docker image that provides a consistent command-line interface. In addition, most simulation tools provide consistent Python APIs. More information and tutorials are available from BioSimulators.

**How can I execute a project before publication to BioSimulations?**

BioSimulations executes projects using [runBioSimulations](https://run.biosimulations.org), which uses the simulation tools validated by [BioSimulators](https://biosimulators.org). Investigators can directly use runBioSimulations to execute projects. In addition, each simulation tool is available as a Docker image that provides a consistent command-line interface, and most simulation tools provide consistent Python APIs. These tools can be used to perform the same simulations that BioSimulations will when it publishes your project. More information and tutorials are available from BioSimulators and runBioSimulations.

**Is there a limit to the size of simulation projects that can be published through BioSimulations?**

Simulation projects (COMBINE/OMEX archives) are limited to 5 TB each. However, archives submitted by web form uploads are limited 1 GB. Archives greater than 1 GB must be submitted via URLs. In addition, simulation results are currently limited to 5 TB per project. Furthermore, simulation runs are currently limited to 24 cores, 192 GB RAM, and 20 days of wall time.

**How can I share projects privately with colleagues and peer reviewers without publishing them?**

[runBioSimulations](https://run.biosimulations.org) provides a unique link for each project. These links can be shared with colleagues, peer reviewers, and editors. These links are not publicly advertised.

**How can I use BioSimulations in conjunction with journal articles?**

We recommend embedding hyperlinks to interactive versions of static figures in figure captions, availability sections, and/or supplementary materials. During peer review, private runBioSimulations hyperlinks can be used as described above. We recommend using Identifiers.org hyperlinks (<code>https://identifiers.org/biosimulations/{project-id}</code>, <code>https://identifiers.org/runbiosimulations/{run-id}</code>).

**Do I need to create an account to publish a project?**

No. Projects can be published anonymously without an account or registration. However, to be able to later edit a project, you must create an account and use that account to publish the project. Once the project is created, only that account will be able to edit the project.

**How can I edit a project that I published?**

The owner of a project can associate the project with new simulation runs. This can be used to correct mistakes and/or provide improved versions. First, use runBioSimulations to create a simulation run. Second, use BioSimulations' [REST API](https://api.biosimulations.org) to modify the project by replacing the old simulation run associated with the project with the new run. The online documentation for the API includes a simple web interface for using the API.

!!! info

    The runBioSimulations currently website only enables investigators to publish simulation runs anonymously. To be able to edit a project, currently, users must initially publish the project using BioSimulations' [REST API](https://api.biosimulations.org). 

Please contact the BioSimulations Team via [email](mailto:info@biosimulations.org) for additional assistance.

**How can I delete a project that I published?**

To ensure projects remain accessible to the community, authors cannot delete projects once they have been published.

Please contact the BioSimulations Team via [email](mailto:info@biosimulations.org) for additional assistance.

**How long does BioSimulations store projects?**

BioSimulations stores projects permanently, including their source files and simulation results.

**How is each project licensed?**

Each project is provided under the license chosen by its authors. These licenses are displayed on the landing pages for each project. We encourage authors to contribute projects under licenses that permit their reuse, such as the [Creative Commons Universal License (CC0)](https://creativecommons.org/share-your-work/public-domain/cc0/).

**How can I create a badge to embed a project into my website?**

We recommend using Shields.io to generate badges for projects. For example, `https://img.shields.io/badge/BioSimulations-published-green` can be used to generate the badge below.

![Badge](https://img.shields.io/badge/BioSimulations-published-green)

## Models

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

## Simulations 

**Which simulation formats does BioSimulations support?**

BioSimulations supports these [conventions](https://biosimulators.org/conventions/simulation-experiments) for the [Simulation Experiment Description Markup Language (SED-ML)](https://sed-ml.org). SED-ML can be used to describe a broad range of simulations involving a broad range of modeling frameworks, model formats, simulation algorithms, and simulation tools.

**Which versions of SED-ML does BioSimulations support?**

BioSimulations all versions of SED-ML. However, BioSimulations does not yet support the new features added to the latest version (L1V4) released this summer. We aim to support these new features soon.

**How can I create a SED-ML file?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for creating SED-ML documents. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for creating SED-ML documents.

**How can I validate a SED-ML file?**

[runBioSimulations](https://run.biosimulations.org) provides a simple web-based tool for validating SED-ML documents. [BioSimulators-utils](https://github.com/Biosimulators/Biosimulators_utils) provides a command-line tool and a Python API for validating SED-ML documents.

**Which simulation algorithms does BioSimulations support?**

BioSimulations supports all simulation algorithms validated by BioSimulators. Currently, this includes over 60 algorithms. BioSimulations is extensible to additional simulation tools. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org). More information, tutorials, and examples are available from BioSimulators.

**How can I contribute an additional simulation algorithm?**

BioSimulations is extensible to additional simulation algorithms. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org). More information, tutorials, and examples are available from BioSimulators.

**How can I request an additional simulation algorithm?**

Please [submit an issue](https://github.com/biosimulators/Biosimulators/issues/new/choose) to request support for another simulation algorithm.

**Can I upload simulation results?**

To ensure the provenance of simulation results, simulation results can only be generated by BioSimulations.

**Can I execute simulations without publishing them?**

Yes. [runBioSimulations](https://run.biosimulations.org/) provides a web application for executing simulations. runBioSimulations does not require an account or registration. Simulations executed with runBioSimulations are private until shared or published.

## Simulation software tools

**Which simulation tools does BioSimulations support?**

BioSimulations supports all simulation tools validated by [BioSimulators](https://biosimulators.org). Currently, this includes over 20 simulation tools. BioSimulations is extensible to additional simulation tools. The community can extend BioSimulations' capabilities by contributing simulation tools to BioSimulators. More information, tutorials, and examples are available from BioSimulators.

**How frequently are these tools updated?**

For most tools, BioSimulators immediately incorporates new versions upon their release. These new versions are then immediately available for running and publishing projects.

**Does BioSimulations support old versions of tools?**

Yes. BioSimulations uses BioSimulators to run simulations. BioSimulators stores each version of each tool so that in the future, if needed, old models can be rerun with old versions of tools.

**How can I contribute an additional simulation tool?**

BioSimulations is extensible to additional simulation tools. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org). More information, tutorials, and examples are available from BioSimulators.

**How can I request an additional simulation tool?**

Please [submit an issue](https://github.com/biosimulators/Biosimulators/issues/new/choose) to request support for another simulation tool.

**How is each simulation tool licensed?**

The simulation tools available through BioSimulations are provided under the licenses documented for each tool. Please see [BioSimulators](https://biosimulators.org) for more information.

## Visualizations

**Which data visualization formats does BioSimulations support?**

Currently, BioSimulations supports the [Simulation Experiment Description Markup Language (SED-ML)](https://sed-ml.org) and [Vega](https://vega.github.io/vega/) formats. The SED-ML format supports basic line charts. Vega is a powerful format that can be used to describe a broad range of data visualizations, including interactive visualizations that brush complex diagrams with results from multiple individual simulations.

BioSimulations follows these [conventions](https://biosimulators.org/conventions/data-viz) for incorporating Vega visualizations into COMBINE/OMEX archives for simulation projects. These conventions enable authors to describe how the outputs of simulation experiments (simulation results) should be linked to the inputs (data sets) of Vega data visualizations. Importantly, these conventions enable Vega data visualizations to be reused across multiple simulations, such as with different initial conditions, simulation algorithms, simulation tools, models, or modeling frameworks.

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

The minimum metadata required for publication is described [here](https://biosimulators.org/conventions/metadata).

**Which formats for metadata does BioSimulations support?**

BioSimulations supports the [RDF-XML format](https://www.w3.org/TR/rdf-syntax-grammar/) and the predicates described [here](https://biosimulators.org/conventions/metadata).

**What tools can be used to create RDF-XML files?**

Several tools are available for creating RDF-XML files:

* [libOmexMeta](https://sys-bio.github.io/libOmexMeta/): creates RDF-XML from metadata in SBML files
* [OpenLink Structured Data Editor](https://osde.openlinksw.com/)
* [RDF Editor](https://dotnetrdf.org/docs/stable/user_guide/Tools-rdfEditor.html)
* [RDF Studio](http://www.linkeddatatools.com/rdf-studio)

## Primary model repositories

**Which model repositories does BioSimulations integrate models from?**

Currently, BioSimulations incorporates models from the [BiGG](http://bigg.ucsd.edu/), [BioModels](http://biomodels.net/), [ModelDB](http://modeldb.science/), and [Physiome](https://models.physiomeproject.org/) model repositories. BioSimulations pulls updates each week.

**How can I contribute models from a model repository?**

The [API](https://api.biosimulations.org) can be used to programmatically contribute projects. Please contact the BioSimulations Team via [email](mailto:info@biosimulations.org) for additional assistance.

## API

**How can I programmatically retrieve projects and their simulation results?**

BioSimulations' [REST API](https://api.biosimulations.org) can be used to programmatically retrieve projects and their simulation results. Extensive documentation is available online.

The OpenAPI [specification](https://api.biosimulations.org/openapi.json) for the API can be used to create libraries for the API for a broad range of languages. Multiple tools for generating client libraries are available, including [OpenAPI Generator](https://openapi-generator.tech/) and [Swagger Codegen](https://swagger.io/tools/swagger-codegen/).

**How can I programmatically search projects?**

BioSimulations' [REST API](https://api.biosimulations.org) provides an endpoint which returns summaries of each project. This can be used to programmatically search for projects. We plan provide a SPARQL endpoint to support more flexible querying.

## User accounts

**Is a user account or registration needed to use BioSimulations?**

No account or registration is needed to browse or publish projects to BioSimulations. However, to be able to later edit a project, users must create an account and use that account to publish the project.
