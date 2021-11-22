# Simulation Tools

BioSimulations uses the [BioSimulators](https://biosimulators.org) simulation tools to execute simulation projects. The BioSimulators tools follow a set of standards and conventions that allow for consistent execution of simulations across a variety of tools, formats, languages and frameworks.

The BioSimulators standards are a set of formats and conventions for (a) describing the specifications of simulation tools (e.g., supported modeling frameworks, simulation algorithms, and modeling formats) and (b) the syntax and semantics of the inputs and outputs of biosimulation software tools. Collectively, the standards ensure that (a) investigators can communicate the specifications of simulation tools, (b) investigators can use this information to find simulation tools that have specific capabilities, (c) investigators can consistently use the same syntax to execute simulations with multiple simulation tools (e.g., same paths to the same files in the same formats), and (d) simulation tools produce consistent outputs (reports and plots at consistent paths in consistent formats).

The BioSimulators standards encompass multiple standards:

- [Format for describing the specifications of simulation tools](./Specifications.md): This format enables investigators to describe the modeling frameworks, simulation algorithms, and modeling formats supported by each simulation tool. The format also enables investigators to describe the parameters of each algorithm, their data types, and their default values.

- [Conventions for command-line applications and APIs for simulation tools](./Interfaces.md): These conventions ensure that (a) simulation tools support consistent syntax for executing simulations and (b) simulation tools produce outputs at consistent locations in consistent formats.

- [Conventions for Docker images for simulation tools](./Images.md): These conventions ensure that the entry points of containerized simulation tools support consistent syntax for executing simulations and that containerized simulation tools provide consistent metadata.

- [Conventions for simulation experiments with SED-ML](./Experiments.md): These conventions ensure that the community consistently encodes simulation experiments into SED-ML. This includes conventions for targets for implicit elements of models which are not directly defined in models (e.g., reduced costs of FBA reactions, shadow prices of FBA species). This also delineates how to encode the values of model attribute changes and algorithm parameters into SED-ML, including encoding enumerated values, lists, dictionaries, and other complex data structures.

- [Format for data for reports](./Reports.md) (`sedml:report`) and plots (`sedml:plot2D`, `sedml:plot3D`) of simulation results: This format ensures that simulation tools produce data for reports and plots in a consistent format (e.g., HDF5) with consistent shapes (e.g., rows: data set (`sedml:dataSet`), `columns: time`) that can be consistently visualized and interpreted.

- [Guidelines for data visualizations with Vega](./Visualizations.md): Vega format  is a powerful format for describing interactive, two-dimensional data visualizations which make visualizations re-usable by separately capturing the visual marks of a visualization and how they should be painted with data. These guidelines provide recommendations for how to use Vega to visualize the results of simulation experiments captured by SED-ML reports.


- [ Guidelines for using the OMEX Metadata format to annotate COMBINE/OMEX archives](./Metadata.md): BioSimulators recommends using the OMEX Metadata RDF-XML format to annotate the meaning, provenance, and credibility of COMBINE/OMEX archives and their contents. These guidelines recommend specific predicates and objects.

- [Format for logs of the execution of COMBINE/OMEX archives](./Logs.md): This format enables simulation tools to communicate their progress in the execution of COMBINE/OMEX archives, such as which tasks have been executed, which tasks are queued for execution, and which tasks will be skipped because, for example, they require features of SED-ML that the simulation tool does not support.
    This format enables simulation tools to communicate the following information:

    - The status and outcome of the COMBINE archive and each SED document, task, and output (queued, running, succeeded, skipped, or failed).
    - Information about the simulation function that was used and the arguments that were used.
    - The standard output/error produced by the COMBINE archive and each SED document, task, and output.
    - The duration of the execution of the COMBINE archive and each SED document, task, and output.
    - The reason for each SED document, task or output that was skipped.
    - The reason for any failed SED documents, tasks, or outputs.
     