# About 

## Motivation and Goals of BioSimulations

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse model components and simulations. Despite extensive efforts to develop standards such as COMBINE/OMEX , SBML , and SED-ML  and repositories such as BioModels, it is still often difficult to share and reuse models and simulations. One challenge to sharing and reusing models is the disparate formats, model repositories, and simulation tools for different types of models. The proliferation of numerous similar formats, repositories, and tools makes it difficult, especially for non-experts, to find models and to find an appropriate simulation tool for each model. In addition, the existing model repositories have limited capabilities for sharing associated resources such as training data, simulation experiments, and visualizations.

BioSimulations addresses these challenges by making it easier for researchers to share and reuse models. First, BioSimulations provides authors a central portal for sharing models, simulations, and visualizations. Importantly, authors can share models in any format, authors can share simulations that require any simulator, and authors can share arbitrarily complex visualizations. Second, BioSimulations provides researchers a central portal for finding models and a simple web interface for reusing any model, simulation, or visualization. This is achieved using BioSimulators, a collection of Docker images that abstract the details of multiple modeling frameworks, simulation algorithms, model formats, and simulation tools.

## Supported modeling frameworks, algorithms, formats and software tools

BioSimulations supports all modeling frameworks and model formats. However, currently BioSimulations can only simulate logical, Flux Balance Analysis (FBA), continuous kinetic (ordinary differential equations (ODE) and differential-algebraic equations (DAE)), and discrete kinetic (e.g., Stochastic Simulation Algorithms (SSA)) models that are described in using the [BioNetGen Language (BNGL)](https://bionetgen.org)  or the [Systems Biology Markup Language (SBML)](https://sbml.org) .

BioSimulations uses the BioSimulators collection of simulation tools to simulate models. Through BioSimulators, BioSimulations supports a numerous algorithms for simulating logical, FBA, and kinetic models. BioSimulators builds upon [Docker](https://docker.com)  and [BioContainers](https://biocontainers.pro) . Please see [BioSimulators](https://biosimulators.org)  for more information about supported modeling frameworks, simulation algorithms, model formats, and simulation software tools.

## Source Model Repositories

In addition to models, simulations, and visualizations contributed by investigators, BioSimulations contains models, simulations, and visualizations imported from BiGG , BioModels , and Cell Collective . BioSimulations provides a central place to find and reuse these models.


## Recommended tools for further exploring modeling projects
BioSimulations provides basic capabilities for reproducing and reusing a wide range of biomodeling projects. For further exploration, we encourage users to use the domain-specific online platforms, desktop programs, and libraries outlined below.

	
|**Framework**  |Online platforms| Desktop programs| Libraries  |
|---------|---------|---------|---------|
|Constraint-based	     |  Fluxer       |   CBMPy iBioSim       | CBMPy COBRApy        |
|Continuous kinetic	     |    JWS Online      |    BioNetGen (rule-based) COPASI iBioSim tellurium VCell      |      AMICI libRoadRunner PySCeS    |
|Discrete kinetic     |    StochSS      |    BioNetGen (rule-based) COPASI iBioSim tellurium VCell      |  GillesPy2 PySCeS libRoadRunner      |
|Logical	     | Cell Collective         |       CNORdt  |         |


 
## Technological foundation of BioSimulations
BioSimulations is implemented using several open-source tools and cloud platforms.
## Downloading the models, simulations, and visualizations in BioSimulations

The models, simulations, and visualizations in BioSimulations can be programmatically obtained using our REST API . Documentation for the API is available at the same URL.
## Obtaining the containerized simulation tools

The containerized simulation software tools are available from [BioSimulators](https://biosimulators.org). 

## Obtaining the BioSimulations source code

The BioSimulations source code is composed of the following open-source packages:

BioSimulations : Core functionality
BioSimulations utils : Utilities for encoding simulation experiments into SED-ML, encoding simulations studies in COMBINE/OMEX archives, and testing simulator images.
## License

The models, simulations, and visualizations in BioSimulations are provided under the license specified for each resource. The containerized simulators are provided under the open-source licenses documented for each image. Please see BioSimulators  for more information. The BioSimulations source code is provided under the MIT license . The licenses for BioSimulations' third-party dependencies are summarized here .

## BioSimulations Team

BioSimulations was developed by the Center for Reproducible Biomedical Modeling  including Bilal Shaikh  and Jonathan Karr  at the Icahn School of Medicine at Mount Sinai ; Akhil Marupilla, Mike Wilson , Michael Blinov , and Ion Moraru  at the Center for Cell Analysis and Modeling  at UConn Health; and Herbert Sauro  at the University of Washington.


## Contributing to BioSimulations

We welcome contributions to BioSimulations!

Models, simulations, and visualizations can be contributed through this website or our REST API. Please create an account to get started.
Containerized simulators can be contributed by submitting GitHub issues . Please see BioSimulators  for information about the required format, a guide to building simulator images, and examples.
BioSimulations software: We welcome contributions by GitHub pull requests . Please see the Guide to Contributing  for information about how to get started. Please also contact the developers  to coordinate potential contributions.
## Acknowledgements

BioSimulations was developed with support from the Center for Reproducible Biomodeling Modeling  from the National Institute of Bioimaging and Bioengineering  and the National Institute of General Medical Sciences  of the National Institutes of Health  and the National Science Foundation .

