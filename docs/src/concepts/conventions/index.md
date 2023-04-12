# Conventions

BioSimulators and BioSimulations follow a set of conventions designed to foster consistent representation and interpretation of simulation projects across modeling frameworks, simulation algorithms, modeling formats, and simulation tools. In particular, these conventions ensure that simulation tools produce consistent outputs (reports and plots at consistent paths in consistent formats) from consistent inputs (descriptions of models and simulations). These conventions also help investigators (a) communicate the semantic meaning of simulation projects and the capabilities of simulation tools, (b) find simulation projects that represent specific biology and simulation tools that have specific capabilities, and (c) reproduce and reuse simulation projects with alternative software tools.

These conventions encompass multiple formats and guidelines:

- [Format for describing the specifications of simulation tools](./simulator-capabilities.md): This format enables investigators to describe the modeling frameworks, simulation algorithms, and modeling formats supported by a simulation tool. The format also enables investigators to describe the parameters of each algorithm, their data types, and their default values.

- [Conventions for command-line applications and APIs for simulation tools](./simulator-interfaces.md): These conventions ensure that simulation tools (a) support consistent syntax for executing simulations and (b) produce outputs at consistent locations in consistent formats.

- [Conventions for Docker images for simulation tools](./simulator-images.md): These conventions ensure that the entry points of containerized simulation tools support consistent syntax for executing simulations and that containerized simulation tools provide consistent metadata.

- [Conventions for simulation experiments with SED-ML](./simulation-experiments.md): These conventions ensure that the community consistently encodes simulation experiments into SED-ML. This includes conventions for targets for implicit elements of models, or symbols, which are not directly defined in models (e.g., reduced costs of FBA reactions, shadow prices of FBA species). This also delineates how to encode the values of model attribute changes and algorithm parameters into SED-ML, including encoding enumerated values, lists, dictionaries, and other data structures.

- [Format for reports of simulation results](./simulation-run-reports.md) (`sedml:report`): This format ensures that simulation tools produce reports and plots in a consistent format (e.g., [HDF5](https://www.hdfgroup.org/solutions/hdf5/)) with consistent shapes (e.g., rows: data set (`sedml:dataSet`), columns: simulation step) that can be consistently visualized and interpreted.

- [Guidelines for data visualizations with Vega](./simulation-run-visualizations.md): [Vega](https://vega.github.io/vega/) is a powerful format for describing interactive, two-dimensional, data visualizations. Vega makes visualizations re-usable by separately capturing visual marks and how they should be painted with data. These guidelines outline how to use Vega to visualize the results of simulation experiments captured by SED-ML reports.

- [Guidelines for using the OMEX Metadata format to annotate the meaning and provenance of simulation projects](./simulation-project-metadata.md) (COMBINE/OMEX archives): We recommend using the OMEX Metadata RDF-XML format to annotate the meaning, provenance, and credibility of simulation projects. These guidelines recommend specific predicates and objects for annotating simulation projects and their components.

- [Format for logs of the execution of simulation projects](./simulation-run-logs.md) (COMBINE/OMEX archives): This format enables simulation tools to communicate the status and outcome of the execution of simulation projects. This format enables simulation tools to communicate information such as the following:

    - The status and outcome of the project and each individual SED-ML document, task, and output (e.g., succeeded, failed, skipped, queued).
    - The function and arguments used to execute each individual simulation step.
    - The standard output/error produced by the execution of the project and each SED-ML document, task, and output.
    - The reason why each SED-ML document, task or output could not be executed.
     
--8<-- "glossary.md"