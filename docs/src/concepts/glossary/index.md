# Glossary

## Core concepts

### Mathematical or computational **model** (e.g., BNGL, CellML, SBML)
A specification of a mathematical or computational description of a system, such as a set of ODEs. Models are captured using formats such as BNGL, CellML, and SBML. Model formats are specified using the [EDAM ontology](#embrace-data-and-methods-edam).

### **Simulation** or simulation experiment (SED-ML)
A specification of how to execute a model, such as the interval over which to integrate a set of ODEs and which algorithm to integrate the ODEs. Simulations are captured using the [SED-ML format](#simulation-experiment-description-markup-language-sed-ml).

### Simulation **algorithm**
A method for executing a simulation, such as a method for integrating a set of ODEs such as Euler's method. Algorithms are specified using the [KiSAO ontology](#kinetic-simulation-and-algorithms-ontology-kisao).

### **Simulator** or simulation tool
A software application for executing a simulation project (COMBINE/OMEX archive) and exporting its outputs (HDF5 file).

### Simulation **run**
An execution of a simulation project (COMBINE/OMEX archive).

### Simulation **output** or results (HDF5)
The outcome of a simulation, such as the predicted trajectory of the value of one or more variables. Simulation results are captured using the [HDF5 format](#hierarchical-data-format-version-5-hdf5). The dimensions of simulation outputs are specified using the [SIO ontology](#semanticscience-integrated-ontology-sio).

### Data **visualization** of simulation results (Vega)
A specification of a diagram for depicting the results of a simulation. Data visualizations are captured using the [Vega format](#vega).

### **Metadata** (OMEX Metadata)
A specification of the semantic meaning and/or provenance of a modeling project or a component of a modeling project. Metadata is captured using the [OMEX Metadata format](#omex-metadata).

### Modeling or simulation **project** or study (COMBINE/OMEX archive)
A collection of one or more models (e.g., BNGL, CellML, SBML files) and one or more simulations (SED-ML files), as well as visualizations for the results of the simulations (Vega files), and metadata about these files (OMEX Metadata files). Projects are captured using the [COMBINE/OMEX archive format](#combineomex-archive).


## Modeling and simulation formats

### COMBINE/OMEX archive
Format used to capture the specifications of simulation projects including
* Models (e.g., SBML files)
* Simulations (e.g., SED-ML files)
* Visualizations of simulation results (e.g., Vega files)
* Metadata (e.g., OMEX metadata files)
* Other associated information.

More info: [combinearchive.org](https://combinearchive.org/)

### Hierarchical Data Format version 5 (HDF5)
Format used to store simulation results. Stores simulation results as sets of multidimensional matrices.

More info: [HDF Group](https://www.hdfgroup.org/solutions/hdf5/)

### Simulation Experiment Description Markup Language (SED-ML)
Format used to capture the specifications of simulations such as 
* Which models to simulate
* How to create variants of those models
* What types of simulation to run (e.g., steady-state, time course)
* When to start simulation and how long to run them
* Which algorithms to use to run simulations
* The parameters that algorithms should be executed with

More info: [sed-ml.org](http://sed-ml.org/)

### OMEX Manifest
Format used to capture the formats of the contents of COMBINE/OMEX archives.

More info: [combinearchive.org](https://combinearchive.org/)

### OMEX Metadata
Format used to capture metadata about simulation projects.

More info: [sys-bio.github.io](https://sys-bio.github.io/libOmexMeta)

### Vega
Declarative grammar used to describe diagrams for interactively visualizing the results of simulations.

More info: [vega.github.io](https://vega.github.io/vega/)

## Modeling frameworks and simulation algorithms

### Differential Algebraic Equations (DAE)
Modeling framework for describing a system as a set of differential and algebraic equations.

More info: [Wikipedia](https://en.wikipedia.org/wiki/Differential-algebraic_system_of_equations)

### Flux Balance Analysis (FBA)
Modeling framework for analyzing the optimal steady state flux distribution of a system, such as metabolic network.

More info: [Wikipedia](https://en.wikipedia.org/wiki/Flux_balance_analysis)

### Ordinary Differential Equations (ODE)
Modeling framework for describing a system in terms of the rate of each variable.

More info: [Wikipedia](https://en.wikipedia.org/wiki/Ordinary_differential_equation)

### Resource Balance Analysis (RBA)
Modeling framework analyzing the optimal steady state resource allocation of a system, such as metabolic network.

More info: [INRAE](https://rba.inrae.fr/)

### Stochastic Simulation Algorithm (SSA)
Simulation algorithm for generating a statistically correct trajectory of a system of stochastic equations.

More info: [Wikipedia](https://en.wikipedia.org/wiki/Gillespie_algorithm)

## Ontologies

### EMBRACE Data and Methods (EDAM)
Ontology used to specify model and simulation formats such as SBML and SED-ML.

More info: [edamontology.org](https://edamontology.org/)

### Kinetic Simulation and Algorithms Ontology (KiSAO)
Ontology used to specify simulation algorithms and their parameters.

More info: [github.com/SED-ML](https://github.com/SED-ML/KiSAO)

### Linguist
Dataset used to specify programming languages.

More info: [GitHub](https://github.com/github/linguist)

### Semanticscience Integrated Ontology (SIO)
Ontology used to specify the dimensions of the outputs of simulations.

More info: [github.com/MaastrichtU-IDS](https://github.com/MaastrichtU-IDS/semanticscience)

### Software Package Data Exchange (SPDX)
Ontology used to specify licenses.

More info: [spdx.org](https://spdx.org/licenses/)

### Systems Biology Ontology (SBO)
Ontology used to specify modeling frameworks.

More info: [github.com/EBI-BioModels](https://github.com/EBI-BioModels/SBO)