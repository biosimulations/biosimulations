# Standard command-line applications and Python APIs for biosimulation tools

## Overview

The BioSimulators conventions for command-line applications and Python APIs for biosimulation tools are sets of requirements for the syntax and semantics of the inputs and outputs of biosimulation software tools. The conventions ensure that simulation tools can be consistently executed with the same input arguments (a path to a COMBINE/OMEX archive that defines models and simulations, and a path to save the outputs of the simulation experiments defined in the archive), and that the simulation tools produce consistent outputs (reports and plots at consistent paths in consistent formats).

BioSimulators encourages developers to provide two interfaces for two purposes:

- **Command-line entrypoints to Docker images:** These interfaces provide developers a wide degree of flexibility (e.g., to use different programming languages and dependencies), make it easy for BioSimulators to archive each version of each tool, and make it easy for investigators to use tools to execute COMBINE/OMEX archives. However, these entrypoints are not optimally efficient for all use cases, and they provide investigators limited flexibility.
- **Python APIs:** APIs provide investigators additional flexibility, such as to develop higher-performance simulation services or to co-simulate models using multiple tools. However, for optimal efficiency, these APIs require developers to use a specific programming language and to package their tools for easy installation or provide straightforward installation instructions. Furthermore, these APIs are typically more complex for investigators to install and use.


In most cases, we recommend that developers create BioSimulators-compliant interfaces in three steps:

1. Use [BioSimulators-utils](https://github.com/biosimulators/Biosimulators_utils) to develop a compliant Python API.
2. Use `biosimulators_utils.simulator.cli.build_cli` to construct a command-line application from their Python API.
3. Construct a Docker image by attaching their command-line application to the entrypoint of an image.
4. For validation, simulation tools MUST provide Docker images whose entrypoints are BioSimulators-compliant command-line applications. Simulation tools are also OPTIONALLY encouraged to provide BioSimulators-compliant APIs.

## Convention for Command line applications

Simulation tools should support the following command-line arguments:

- `-i, --archive:` A path to a COMBINE/OMEX archive which contains descriptions of one or more simulation tasks.
- `-o, --out-dir:` The path where the outputs (reports and plots) of the simulation tasks should be saved.
- `-h, --help:` An optional argument that instructs the command-line application to print help information about itself.
- `-v, --version:` An optional argument that instructs the command-line application to report its version and the versions of any critical dependencies.
As an example, below is the documentation for the command-line application for the [tellurium](https://biosimulators.org/simulators/tellurium)  biochemical simulation program.

```bash


usage: tellurium [-h] [-d] [-q] -i ARCHIVE [-o OUT_DIR] [-v]

BioSimulators-compliant command-line interface to the tellurium simulation program <http://tellurium.analogmachine.org>.

optional arguments:
  -h, --help            show this help message and exit
  -d, --debug           full application debug mode
  -q, --quiet           suppress all console output
  -i ARCHIVE, --archive ARCHIVE
                        Path to a COMBINE/OMEX archive file which contains one or more SED-ML-
                        encoded simulation experiments
  -o OUT_DIR, --out-dir OUT_DIR
                        Directory to save outputs
  -v, --version         show program's version number and exit

```
## Conventions for Python APIs

Python APIs should be Python modules which provide the following attributes and methods:

- `__version__ (str)`: Version of the API (e.g., `0.1.0`).
- `get_simulator_version (() -> str)`: Get the version of the underlying simulation tool (e.g., `1.0.0`).
- `preprocess_sed_task ((task: Task, variables: list[Variable]) -> Any)`: Preprocess the information required to execute a SED-ML task. This method enables users to efficiently execute multiple simulation steps (using exec_sed_task) without unnecessary duplicate computations, such as to import models from files, validate models, and identify suitable algorithms.

- `exec_sed_task ((task: Task, variables: list[Variable], preprocessed_task:Any=None) -> Tuple[VariableResults, TaskLog])`: Execute a single SED-ML task involving a single simulation of a single model and return the predicted value of each requested output variable and a log of the execution of the simulation.

- `exec_sed_doc ((doc: SedDocument, variables: list[Variable]) -> Tuple[ReportResults, SedDocumentLog])`: Execute a single SED-ML document involving one or more simulations of one or more models, return data for each SED-ML report and plot, and return a log of the execution of the simulations, reports, and plots.

- `exec_sedml_docs_in_combine_archive ((archive_filename: str, out_dir: str, return_results: bool = False) -> Tuple[SedDocumentResults, CombineArchiveLog])`: Execute all of the tasks in all of the SED-ML files in a COMBINE/OMEX archive, export all of the requested reports and plots, optionally return the result of each output, and return a log of the execution of the archive.

More information about the required method signatures is available in the [simulator template](https://github.com/biosimulators/Biosimulators_simulator_template/blob/dev/my_simulator/__init__.py).

## Execution Behavior

Both command-line interfaces and Python APIs should also support the following conventions:

- **Support at least one "standard" modeling language**. Interfaces to simulation tools should support at least a subset of at least one community modeling language such as BNGL, CellML, Kappa, NeuroML/LEMS, HOC, pharmML, SBML, Smoldyn, VCML, or XPP.
- **Support the SED-ML format for describing simulation experiments**. Interfaces to simulation tools should support at least the following features of SED-ML:
    - Models and model attribute changes: `sedml:model`, `sedml:changeAttribute`
    - At least one of steady-state, one step, or timecourse simulations: `sedml:steadyState`, `sedml:oneStep`, or `sedml:uniformTimeCourse`.
    - Tasks to execute a single simulation of a single model: `sedml:task`.
    - Algorithms and their parameters: `sedml:algorithm`, `sedml:algorithmParameter`.
    - Data generators for individual variables: `sedml:dataGenerator`
    - Report outputs: `sedml:report`.
- **Use KiSAO to describe simulation algorithms and their parameters**. Interfaces to simulation tools should use KiSAO terms to indicate specific algorithms and algorithm parameters.
- **Support the COMBINE/OMEX format for collections of models and simulations**. Interfaces to simulation tools should support the full COMBINE/OMEX specification.
- **Execute all tasks described in the master file of the COMBINE/OMEX archive**: When a COMBINE/OMEX archive file contains a master SED-ML document, simulation tools should execute all tasks defined inside the master file. When an archive doesn't contain a master SED-ML file, simulation tools should execute all of the tasks defined in each SED-ML file in the archive.
- **Support the BioSimulators format for reports of simulation results**: Interfaces to simulation tools should save reports in the [BioSimulators HDF5 format](./simulation-run-reports.md) for simulation data from reports and plots. Within the HDF5 file, each report and plot should be saved to a path equal to the combination of the relative path of its parent SED-ML file in the COMBINE/OMEX archive and the id of the report.
- **Save plots in Portable Document Format (PDF) bundled into a zip archive**. Within the zip archive, each plot should be saved to a path equal to the combination of the relative path of its parent SED-ML file in the COMBINE/OMEX archive, the id of the plot, and the extension .pdf
- **Save simulation outputs to standard file paths**: Data for reports and plots should be saved to `{ out-dir }/reports.h5`. Plots should be saved to `{ out-dir }/plots.zip`.

## Environment Variables
To further support consistent execution of simulations with other simulation tools, command-line interfaces and Python APIs are also encouraged to implement the following environment variables. The Docker files for simulation tools should use the `ENV` directive to indicate the variables they support and their default values.

`ALGORITHM_SUBSTITUTION_POLICY`: This environment variable enables users to control if and how the simulator substitutes algorithms with other mathematically-equivalent or similar algorithms.

BioSimulators recognizes the increasing levels of substitution listed below. Simulation tools are encouraged to use `SIMILAR_VARIABLES` as the default value for `ALGORITHM_SUBSTITUTION_POLICY`.

A recommended matrix of algorithm substitutions is available from the [KiSAO](https://github.com/SED-ML/KiSAO/blob/dev/libkisao/python/docs/algorithm-substitutability.csv) ontology . A [Python package](https://github.com/SED-ML/KiSAO/blob/dev/libkisao/python/) is also available for implementing this matrix.

When alternate algorithms are substituted, BioSimulators recommends that simulation tools ignore SED algorithm parameters as algorithm parameters can have different meanings in the context of different algorithms.

For algorithm substitution level `NONE`, BioSimulators recommends that simulation tools raise errors for unsupported algorithm parameters and unsupported values of algorithm parameters. For higher substitution levels, BioSimulators recommends that simulation tools skip unsupported parameters and unsupported values and raise warnings when parameters are skipped.

`0.` `NONE`: Tools should strictly interpret SED-ML simulations, and raise errors on the execution of SED-ML files that involve unsupported algorithms. For example, a simulation tool that only supports the Stochastic Simulation Algorithm (SSA, KISAO_0000029) should raise errors on SED-ML files that request simulations with the Next Reaction Method (NRM, KISAO_0000027). In many cases, this level will effectively constrain the execution of a SED-ML document to a specific implementation of an algorithm by a specific simulation tool.

`1.` `SAME_METHOD`: Algorithms can be substituted with different realizations of the same method. For example, GLPK's implementation of the Simplex method could be substituted with SciPy's implementation.

`2.` `SAME_MATH`: Tools should execute simulations with alternative mathematically-equivalent algorithms, and raise errors on the execution of SED-ML files which request algorithms that are mathematically distinct from those implemented by the tool. When tools execute alternative mathematically-equivalent algorithms, they should issue warnings to this effect. For example, a simulation tool that only supports SSA should execute simulations that request NRM with a warning, and raise an error on SED-ML files that request the tau-leaping method (KISAO_0000039).

`3.` `SIMILAR_APPROXIMATIONS`: Algorithms can be substituted with others that make similar approximations to the same mathematics. For example, CVODE could be substituted with LSODA or the Fehlberg method. Tau leaping could be substituted with partitioned tau leaping.

`4.` `DISTINCT_APPROXIMATIONS`: Algorithms can be substituted with others that make distinct approximations to the same math. For example, SSA could be substituted with tau leaping or the Pahle hybrid method.

`5.` `DISTINCT_SCALES`: Algorithms can be substituted with others that make distinct approximations to the same math that substantially differ in their scales. For example, SSA could be substituted with CVODE.

`6.` `SAME_VARIABLES`: Algorithms that predict the same output variables can be substituted. For example, FBA could be substituted with parsimonious FBA.

`7.` `SIMILAR_VARIABLES` (recommended default): Algorithms that predict similar output variables can be substituted. For example, FBA could be substituted with geometric FBA.

`8.` `SAME_FRAMEWORK`: Tools should execute simulations with alternative algorithms, including algorithms that are not mathematically equivalent, and issue warnings when alternative algorithms are executed.

`9.` `ANY`: Tools can execute simulations with any alternative algorithm. Note, switching to any other algorithm can substantially change the interpretation of a simulation (e.g., switching SSA to CVODE loses all information about the variance of a simulation).

`VERBOSE`: Indicates whether a simulator should display detailed information about the execution of each task.

BioSimulators recognizes the following values.

`0`, `false` (any case)
`1`, `true` (any case)

## Execution of modeling projects encoded as COMBINE/OMEX archives

To ensure consistent execution of simulation experiments, command-line applications and Python APIs should adopt the conventions described below for the execution of COMBINE/OMEX archives.

- **Identification of SED-ML files**. SED-ML files should be identified as `omex:content` whose `format` attribute starts with `http://identifiers.org/combine.specifications/sed-ml`.
 
- **Preferential execution of "master" files**. The OMEX format supports the declaration of a single "master" file (`omex:content[@master='true']`). When a COMBINE/OMEX archive contains a single master file, simulation tools should only execute this file. Note, if the master file is not a SED-ML document, then no simulations should be executed. When a COMBINE/OMEX archive doesn't have a master file, all SED-ML documents should be executed.

## Execution of simulation experiments encoded in SED-ML

To ensure consistent execution of simulation experiments, command-line applications and Python APIs should adopt the conventions described below for the execution of SED-ML files.

**Substitution of alternative simulation algorithms.**

Because no simulation tool implements every simulation algorithm, simulation tools are encouraged to execute SED-ML simulations with alternative algorithms (close KiSAO terms) when the tool does not support the requested algorithm (sedml:algorithm/@kisaoID). For example, a tool which only implements the Stochastic Simulation Algorithm (SSA, KISAO_0000029) could choose to execute simulations that request the Next Reaction Method (NRM, KISAO_0000027), a mathematically-equivalent method, with SSA.

Simulation tools are encouraged to use the KiSAO ontology to systematically identify related simulation algorithms.

When a tool uses an alternative algorithm, the tool should issue a warning message to the user that indicates that an alternative algorithm was used.

Tools which choose to execute alternative algorithms should support the `ALGORITHM_SUBSTITUTION_POLICY` environment variable (see [above](#environment-variables)).
## Recommended resources for implementing command-line applications and APIs

Below are helpful tools for implementing command-line applications and Python APIs to the above specifications:

- [BioSimulators utils](https://docs.biosimulators.org/Biosimulators_utils/)  is a Python library which provides functions implementing command-line applications to the above specifications, as well as functions for interpreting COMBINE/OMEX archives and SED-ML files, generating tables and plots of simulation plots, and logging the execution of COMBINE/OMEX archives. BioSimulators utils provides high-level access to some of the lower-level libraries listed below.
- [libCOMBINE](https://github.com/sbmlteam/libCombine)  is a library for creating and unpacking COMBINE/OMEX archives. libCOMBINE provides bindings for several languages.
- [libSED-ML](https://github.com/fbergmann/libSEDML)  is a library for serializing and deserializing SED documents to and from XML files. libSED-ML provides bindings for several languages.
- [libOmexMeta](https://github.com/sys-bio/libOmexMeta)  is a library for reading and querying OMEX Metadata files. libOmexMeta provides bindings for several languages.
- [argparse](https://docs.python.org/3/library/argparse.html)  is a Python module for implementing command-line applications.
- [Cement](https://builtoncement.com/)  is a higher-level Python library for implementing more complex command-line applications.
