# Conventions for describing reproducible and reusable simulation experiments with SED-ML

## Overview

Simulators should support SED-ML L1V3 or later. To accommodate a wide range of modeling frameworks and simulation algorithms, BioSimulators embraces the additional conventions for SED-ML described below, as well as the conventions for executing SED-ML documents described with the standard that is used for [command-line interfaces of simulation tools](./simulator-interfaces.md).

## Model and data descriptor source paths

SED-ML can refer to model and data descriptor files in multiple ways, including via paths to local files, via URLs, via URL fragments to other models defined in the same SED-ML document, and via identifiers for an Identifiers.org namespace such as BioModels. When referencing files via local paths, SED-ML documents should use paths relative to the location of the SED-ML document.

To ensure that COMBINE/OMEX archives are self-contained, BioSimulators encourages SED-ML documents in COMBINE/OMEX archive to reference files via relative paths within archives.
## Concrete XPath targets for changes to CML-encoded models

SED-ML enables investigators to use XPaths to specify changes to models that are encoded in XML files. This encompasses models described using CellML, SBML, and other languages. SED-ML documents should use valid XPaths that resolve to XML elements. For example, `/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']/@initialConcentration` could be used to indicate a change to the initial condition of a species.

In addition, the namespace prefixes used in XPaths should be defined within the SED-ML document as illustrated below.

```xml


<sedML xmlns:sbml="http://www.sbml.org/sbml/level3/version1/core">
  <listOfDataGenerators>
    <dataGenerator>
      <listOfVariables>
        <variable target="/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']/@initialConcentration" />
      </listOfVariables>
    </dataGenerator>
  </listOfDataGenerators>
</sedML>
```

!!!note
    The SED-ML specifications suggest that incomplete XPaths such as `/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']` should be used to indicate changes to model elements. BioSimulators discourages this convention of partial XPaths because these XPaths do not point to the attribute that is intended to be changed

## Namespaced for New/XML elements of changes to XML-encoded models

SED-ML documents can use NewXML elements of AddXML and ChangeXML elements to specify objects that should be added to models or replaced in models. SED-ML documents should define the namespace(s) of the content of these NewXML elements. For example, a parameter that should be added to a SBML model could be described as `<sbml:parameter xmlns:sbml="http://www.sbml.org/sbml/level3/version1" id="NewParameter" value="10.0" />`.

!!!note 
    The SED-ML specifications suggest that namespaces don't need to be defined for the content of NewXML elements. BioSimulators discourages this convention because XML files which embrace this convention are not consistent with SED-ML's XML schema.

## Data Types for model attribute changes and algorithm parameters

SED-ML specifies that the new values of model attribute changes (`sedml:changeAttribute/@sedml:newValue`) and values of algorithm parameters (`sedml:algorithmParameter/@sedml:value`) must be encoded into strings. To ensure that SED-ML files are portable across simulation tools, BioSimulators defines several data types for model attribute changes and algorithm parameters, and outlines how each data type should be encoded into strings. The data type of each algorithm parameter should be defined in the specification of each simulation tool.

- **boolean:** Represents Boolean values. Should be encoded into strings as `true`/`false` or `0`/`1`.
- **integer:** Represents integers. Should be encoded in decimal notation (e.g., `1234`).
- **float:** Represents floating point numbers. Should be encoded in decimal (e.g., `1234.567`) or scientific (e.g., `1.234567e3`) notation.
- **string:** Represents strings. Requires no additional encoding.
- **kisaoId:** Represents a KiSAO term. Should be encoding using the id of the term (e.g., `KISAO_0000029`).
- **list:** Represents a list of scalar values. Should be encoding using JSON (e.g., `['a', 'b', 'c']` or `[1, 2, 3]`). For example, the value of the deterministic reactions partition (`KISAO_0000534`) of the Pahle hybrid discrete/continuous Fehlberg method (`KISAO_0000563`) is a list of the ids of the reactions which should be simulated by the Fehlberg sub-method. Its value should be encoded into SED-ML as `<algorithmParameter kisaoID="KISAO:0000534" value='["ReactionId-1", "ReactionId-1", ...]' />`.
- **object:** Represents key-value pairs. Should be encoding using JSON (e.g., `{a: 1, b: 2}` or `{a: 'x', b: 'y'}`).
- **any:** Represents any other data type. Should be encoding using JSON (e.g., `[{a: 1, b: 2}]`).

Enumerations of an algorithm parameter value can be defined in the specification of a simulator using the `recommendedRange` attribute. This can be combined with any of the above data types.

## Limit use of repeated tasks to the execution of independent simulation runs

In addition to capturing multiple independent simulation runs, `sedml:repeatedTask/@resetModel="False"` provides limited abilities to describe sets of dependent simulation runs, where each run begins from the end state of the previous run. This provides investigators limited abilities to describe meta simulation algorithms.

Simulation tools are encouraged to support a simpler subset of the features of `sedml:repeatedTask` that is sufficient to describe multiple independent simulation runs.

- **`sedml:repeatedTask`**: Simulation tools should support `resetModel="True"` as described in the SED specifications; the model specifications and initial conditions should be reset. Simulator state such as the states of random number generators should not be reset. When `resetModel="False"`, simulation tools should support limited preservation of the state of simulations between iterations. Simulation tools should accumulate changes to the specifications of the model(s) involved in the task. Simulation tools should not copy the final simulation state from the previous iteration to the initial state of the next iteration.

- **Sub-tasks**: Successive subtasks should be executed independently, including when they involve the same model. The final state of the previous sub-task should not be used to set up the initial state for the next sub-task.

- **Shape of model variables for the results of repeated tasks**: Repeated tasks should produce multi-dimensional results. The first dimension should represent the iterations of the main range of the repeated task. The second dimension should represent the sub-tasks of the repeated task. The results of sub-tasks should be ordered in the same order -- the order of their attributes -- that the sub-tasks were executed. The result of each sub-task should be reshaped to the largest shape of its sibling sub-tasks by padding smaller results with `NaN`. Each nesting of repeated tasks should contribute two additional dimensions for their ranges and sub-tasks. The final dimensions should be the dimensions of the atomic tasks of the repeated task (e.g., time for tasks of uniform time courses).

## Canonical order of execution of tasks

For reproducibility, simulation tools should execute tasks in the order in which they are defined in SED-ML files.

Furthermore, because the order of execution can affect the results of simulations in general, each task should be executed, even those which do not contribute to any output. This is particularly important for simulation tools that implement Monte Carlo algorithms. One exception is tasks whose results are invariant to their order of execution, such as most deterministic simulations, which can be executed in any order or in parallel.



## Limit use of symbols to variables of data generators

SED-ML uses symbols to reference implicit properties of simulations that are not explicitly defined in the specification of the model for the simulation. The most frequently used symbol for SBML-encoded models is `urn:sedml:symbol:time` for the variable time. Such symbols only have defined values for simulations of models and not for models themselves.

Consequently, symbols should only be used in contexts where simulations are defined. Specifically, symbols should only be used in conjunction with variables of `sedml:dataGenerator` to record predicted values of symbols. Symbols should not be used in conjunction with the variables of `sedml:computeChange`, `sedml:setValue`, or `sedml:functionalRange`. Symbols should also not be used with `sedml:setValue` to set the values of symbols.

## Variable targets for model objects that generate multiple predictions

Some algorithms such as flux balance analysis (FBA, [`KISAO_0000437`](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000437)) and flux variability analysis (FVA, [`KISAO_0000526`](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000526)) generate multiple predictions for each model object. For example, flux variability analysis predicts minimum and maximum fluxes for each reaction. Targets (`sedml:Variable/@sedml:target`) for such predictions should indicate the id of the desired prediction. To ensure portability of SED-ML files between simulation tools, BioSimulators defines the following ids. Please use [GitHub issues](https://github.com/biosimulators/Biosimulators/issues/new/choose) to suggest additional ids for additional predictions of other algorithms .

- FBA ([`KISAO_0000437`](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000437)), parsimonious FBA ([`KISAO_0000528`](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000528)), geometric FBA ([`KISAO_0000527`]https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000527):
    - Objective: `fbc:objective/@value`
    - Reaction flux: `sbml:reaction/@flux`
    - Reaction reduced cost: `sbml:reaction/@reducedCost`
    - Species shadow price: `sbml:species/@shadowPrice`
- FVA ([KISAO_0000526](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000526)):
    - Minimum reaction flux: `sbml:reaction/@minFlux`
    - Maximum reaction flux: `sbml:reaction/@maxFlux`

## Unique data set labels
To facilitate automated interpretation of simulation results, the data sets within a report should have unique labels (`sedml:dataSet/@label`). Note, the same label can be used within multiple reports.



## Guides for using SED-ML and the COMBINE archive format with specific model languages

Simulation tools should recognize the URNs and IRIs below to identify model languages described in SED-ML files and COMBINE archives. The link in the "Info" column below contain more information about how simulation tools should interpret SED-ML in combination with specific model languages.

| Language                                                              | EDAM id | SED-ML URN	               | COMBINE archive specification URI	                   | MIME type              | Extensions     |Info                                                                           |
| ---                                                                   | ---     | ---                        | ---                                                  |---                     | ---            |---                                                                            |
| [BNGL](https://bionetgen.org/)                                        | 3972    | urn:sedml:language:bngl    | http://purl.org/NET/mediatypes/text/bngl+plain	   | text/bngl+plain	    | .bngl	         | [:link:](https://docs.biosimulators.org/Biosimulators_BioNetGen/tutorial.html)| 
| [CellML](https://cellml.org/)                                         | 3240    | urn:sedml:language:cellml  | http://identifiers.org/combine.specifications/cellml | application/cellml+xml | .xml, .cellml	 | [:link:](https://sed-ml.org/specifications.html)                              | 
| ([NeuroML](https://neuroml.org/))/[LEMS](https://lems.github.io/LEMS/)| 9004    | urn:sedml:language:lems    | http://purl.org/NET/mediatypes/application/lems+xml  | application/lems+xml   | .xml	         |                                                                               |
| [SBML](http://sbml.org/)                                              | 2585    | urn:sedml:language:sbml	   | http://identifiers.org/combine.specifications/sbml   | application/sbml+xml   | .xml, .sbml	 | [:link:](https://sed-ml.org/specifications.html)                              |
| [Smoldyn](http://www.smoldyn.org/)                                    | 9001    | urn:sedml:language:smoldyn | http://purl.org/NET/mediatypes/text/smoldyn+plain	   | text/smoldyn+plain     | .txt	         | [:link:](https://github.com/ssandrews/Smoldyn/blob/master/Using-Smoldyn-with-SED-ML-COMBINE-BioSimulators.md)     |

Example SED-ML files and COMBINE archives for all of the languages listed above are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples).

## Recommended resources for implementing the execution of simulation experiments

Below are helpful tools for implementing and executing simulation experiments described with SED-ML:

 
- [BioSimulators utils ](https://docs.biosimulators.org/Biosimulators_utils/) is a Python library which provides functions implementing command-line interfaces to the above specifications, as well as functions for interpreting COMBINE/OMEX archives and SED-ML files, generating tables and plots of simulation data, and logging the execution of COMBINE/OMEX archives. BioSimulators utils provides high-level access to some of the lower-level libraries listed below.

- [libSED-ML](https://github.com/fbergmann/libSEDML)  is a library for serializing and deserializing SED documents to and from XML files. libSED-ML provides bindings for several languages.

- [jlibSED-ML](https://sourceforge.net/projects/jlibsedml/)  is a Java library for serializing and deserializing SED documents to and from XML files. The library also provides methods for resolving models, working with XPath targets for model elements, applying model changes, orchestrating the execution of tasks, calculating the values of data generators, and logging the execution of simulations.
