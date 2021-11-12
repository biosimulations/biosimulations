# Tutorial

## Guide for users: Finding, simulating, and visualizing published models

Finding models
Finding simulation experiment
Note, simulation results will be stored permanently
Creating variants of simulations
Finding visualizations
Configuring visualizations

### Recommended tools for further exploring simulation projects
BioSimulations provides basic capabilities for reproducing and reusing a wide range of biomodeling projects. For further exploration, we encourage users to use the domain-specific online platforms, desktop programs, and libraries outlined below.

    
|**Framework**  |Online platforms| Desktop programs| Libraries  |
|---------|---------|---------|---------|
|Constraint-based        |  Fluxer       |   CBMPy iBioSim       | CBMPy COBRApy        |
|Continuous kinetic      |    JWS Online      |    BioNetGen (rule-based) COPASI iBioSim tellurium VCell      |      AMICI libRoadRunner PySCeS    |
|Discrete kinetic     |    StochSS      |    BioNetGen (rule-based) COPASI iBioSim tellurium VCell      |  GillesPy2 PySCeS libRoadRunner      |
|Logical         | Cell Collective         |       CNORdt  |         |



<div class="logos">
<div class="logos-row">
    <a
    href="https://cellcollective.org/"
    target="_blank"
    title="Cell Collective"
    >
    <img
        class="zoom"
        src="/assets/images/about/partners/cell-collective.png"
    />
    </a>

    <a href="https://fluxer.umbc.edu/" target="_blank" title="Fluxer">
    <img class="zoom" src="/assets/images/about/partners/fluxer.svg" />
    </a>

    <a
    href="https://jjj.biochem.sun.ac.za/"
    target="_blank"
    title="JWS Online"
    >
    <img class="zoom" src="/assets/images/about/partners/jws.svg" />
    </a>

    <a href="https://stochss.org/" target="_blank" title="StochSS">
    <img class="zoom" src="/assets/images/about/partners/stochss.svg" />
    </a>

    <a
    href="https://vivarium-collective.github.io"
    target="_blank"
    title="Vivarium"
    >
    <img class="zoom" src="/assets/images/about/partners/vivarium.svg" />
    </a>
</div>
</div>

### Downloading the models, simulations, and visualizations in BioSimulations

The models, simulations, and visualizations in BioSimulations can be programmatically obtained using our [REST API](https://api.biosimulations.org). Documentation for the API is available at the same URL.

### Obtaining the containerized simulation tools

The containerized simulation software tools are available from [BioSimulators](https://biosimulators.org). 




## Guide for authors: Publishing models, simulations, and visualizations

Uploading models
Uploading simulation experiments
Note, simulation results will be stored permanently
Uploading visualizations
Sharing resources reviewers and editors

## Guide for reviewers and editors: Evaluating models, simulations, and visualizations

Accessing resources

## Guide for simulation software developers: Contributing an additional simulation tool
BioSimulations uses the BioSimulators collection of simulation tools. Please see BioSimulators  for information about contributing an additional simulation tool.


## User accounts

Signing up
Signing in
Editing profile

## Programmatically working with BioSimulations via the REST API

A comprehensive API is available for submitting and retrieving projects, models, simulations, charts, and visualizations and executing simulations and retrieving their results. Please see the documentation for the REST API  for more information.


## Executing simulations with the stand-alone simulation web application and REST API

In addition to this full-featured web application, runBioSimulations  provides a simpler web application and REST API for executing simulations. runBioSimulations simply enables users to execute COMBINE archives using a variety of simulation tools and generate time series plots of their results. This application does not require an account.


## Contributing to the BioSimulations platform

We welcome contributions to the BioSimulations platform (e.g., web application, REST API, database, simulation services)! Please see the Guide to Contributing  for information about how to contribute to the platform.

