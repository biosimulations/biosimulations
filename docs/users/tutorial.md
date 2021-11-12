# Tutorial

## Guide for users: finding, simulating, and visualizing published models

Finding models
Finding simulation experiment
Note, simulation results will be stored permanently
Creating variants of simulations
Finding visualizations
Configuring visualizations

### Recommended tools for further exploring simulation projects
BioSimulations provides basic capabilities for reproducing and reusing a wide range of biomodeling projects. For further exploration, we encourage users to use the domain-specific online platforms, desktop programs, and libraries outlined below.

    
| Framework          | Language | Online programs                                | Desktop programs                         | Libraries  |
|--------------------|----------|------------------------------------------------|------------------------------------------|------------|
| Continuous kinetic | BNGL     |                                                | [BioNetGen](https://bionetgen.org/)      | [pyBioNetGen](https://pybionetgen.readthedocs.io/)    |
| Continuous kinetic | CellML   |                                                | [OpenCOR](https://opencor.ws/)           | [OpenCOR](https://opencor.ws/)    |
| Continuous kinetic | NeuroML  |                                                | [NetPyNe](http://www.netpyne.org/), [NEURON](https://neuron.yale.edu/neuron/), [pyNeuroML](https://github.com/NeuroML/pyNeuroML)  | [NetPyNe](http://www.netpyne.org/), [NEURON](https://neuron.yale.edu/neuron/), [pyNeuroML](https://github.com/NeuroML/pyNeuroML)    |
| Continuous kinetic | SBML     | [JWS Online](http://jjj.biochem.sun.ac.za/)    | [BioNetGen](https://bionetgen.org/), [COPASI](http://copasi.org/), [tellurium](http://tellurium.analogmachine.org/), [VCell](https://vcell.org/) | [AMICI](https://amici.readthedocs.io/), [GillesPy2](https://stochss.github.io/GillesPy2/), [libRoadRunner](https://libroadrunner.org/), [LibSBMLSim](http://fun.bio.keio.ac.jp/software/libsbmlsim/), [pyBioNetGen](https://pybionetgen.readthedocs.io/), [PySCeS](http://pysces.sourceforge.net/)   |
| Continuous kinetic | XPP ODE  |                                                | [XPP](http://www.math.pitt.edu/~bard/xpp/xpp.html)        |         |
| Discrete kinetic   | BNGL     |                                                | [BioNetGen](https://bionetgen.org/)      | [pyBioNetGen](https://pybionetgen.readthedocs.io/)    |
| Discrete kinetic   | SBML     | [StochSS](https://stochss.org/)                | [BioNetGen](https://bionetgen.org/), [COPASI](http://copasi.org/), [tellurium](http://tellurium.analogmachine.org/), [VCell](https://vcell.org/) | [GillesPy2](https://stochss.github.io/GillesPy2/), [libRoadRunner](https://libroadrunner.org/), [pyBioNetGen](https://pybionetgen.readthedocs.io/)   |
| Flux balance       | SBML     | [Fluxer](https://fluxer.umbc.edu/)             | [CBMPy](http://cbmpy.sourceforge.net/)             | [CBMPy](http://cbmpy.sourceforge.net/), [COBRApy](https://opencobra.github.io/cobrapy/)        |
| Logical            | GINsim   |                                                | [GINsim](http://ginsim.org/)           |    |
| Logical            | SBML     | [Cell Collective](https://cellcollective.org/) | [GINsim](http://ginsim.org/)           | [BoolNet](https://sysbio.uni-ulm.de/?Software:BoolNet#:~:text=BoolNet%20is%20an%20R%20package,available%20from%20BoolNet's%20CRAN%20page.)   |
| MASS               | SBML     |                                                |                                                    | [MASSpy](https://masspy.readthedocs.io/)        |
| Resource balance   | RBA XML  |                                                |                                                    | [RBApy](https://sysbioinra.github.io/RBApy/)        |
| Spatial discrete   | Smoldyn  |                                                | [Smoldyn](https://www.smoldyn.org/)                | [Smoldyn](https://www.smoldyn.org/)        |

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




## Guide for authors: publishing models, simulations, and visualizations

Uploading models
Uploading simulation experiments
Note, simulation results will be stored permanently
Uploading visualizations
Sharing resources reviewers and editors

## Guide for reviewers and editors: evaluating models, simulations, and visualizations

Accessing resources

## Guide for simulation software developers: contributing an additional simulation tool
BioSimulations uses the BioSimulators collection of simulation tools. Please see [BioSimulators](https://biosimulators.org) for information about contributing an additional simulation tool.

## User accounts for owning projects

Signing up
Signing in

## Programmatically working with BioSimulations via the REST API

A comprehensive API is available for submitting and retrieving projects, models, simulations, charts, and visualizations and executing simulations and retrieving their results. Please see the documentation for the [REST API](https://api.biosimulations.org) for more information.


## Executing simulations with the stand-alone simulation web application and REST API

In addition to this full-featured web application, [runBioSimulations](https://run.biosimulations.org) provides a simpler web application and REST API for executing simulations. runBioSimulations simply enables users to execute COMBINE archives using a variety of simulation tools and generate time series plots of their results. This application does not require an account.
