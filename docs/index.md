# BioSimulations and BioSimulators documentation

## Motivation and goals

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse models, simulations, and simulation tools. Despite extensive efforts to develop standards formats such as the [Systems Biology Markup Language (SBML)](http://sbml.org/), the [Simulation Experiment Description Markup Language (SED-ML)](https://www.sed-ml.org/), and the [COMBINE/OMEX archive format](https://combinearchive.org/); ontologies such as the [Kinetic Simulation Algorithm Ontology (KiSAO)](https://github.com/SED-ML/KiSAO/) and the [Systems Biology Ontology (SBO)](https://github.com/EBI-BioModels/SBO); and repositories such as [BioModels](http://biomodels.net/) and the [Physiome Model Repository](https://models.physiomeproject.org/), it is still often difficult to share and reuse models and simulations. One challenge to sharing and reusing models is the disparate modeling formalisms, simulation algorithms, model formats, simulation tools, and repositories for different types of models and biological systems. This proliferation of methods, formats, repositories, and tools makes it difficult, especially for non-experts, to find models and simulation tools for reusing them. In addition, the existing model repositories have limited capabilities for sharing associated resources such as training data, simulation experiments, and interactive visualizations for their results.

## Key features

BioSimulations and BioSimulators address these challenges by making it easier for researchers to share and reuse simulations and simulation tools. 

* Central portals for publishing and discovering simulation projects and tools. BioSimulations and BioSimulators provide central portals for sharing and discovering models, simulations, data visualizations, and simulation tools across a broad range of modeling frameworks, model formats, simulation algorithms, simulation tools, and data visualizations.
* Guides to finding simulation tools: BioSimulators provides investigators centralized information about the capabilities of simulation tools. This information can be used to find appropriate tools for specific projects. In addition, runBioSimulations provides services for automatically recommending tools for specific COMBINE/OMEX archives, modeling frameworks, or simulation algorithms.
* Web-based tools for running simulations and interactively exploring their results. runBioSimulations provides a simple interface for executing simulations and interactively visualizing their results. runBioSimulations also supports a broad range of modeling methods and formats.
* Simple tools for reusing simulation projects. runBioSimulations provides a simple web interface for modifying simulation experiments and running new simulations.
* Transparent simulation. By building upon the COMBINE/OMEX archive format, KiSAO, and SED-ML, the details of each simulation experiment are fully transparent. This helps investigators understand and reproduce simulation experiments.
* Seamless integration of local development and publication. By building on containerization, runBioSimulations provides authors the ability to preview their simulations using their own computers prior to publication. Similarly, this enables investigators to use their own resources to explore simulations obtained from BioSimulations. In particular, this avoids duplicate effort in using simulations in multiple different environments and enables investigators to interactively debug problems using their own machines.

## Supported simulation methods

The BioSimulators platform supports a broad range of modeling frameworks, model formats, simulation algorithms, and simulation tools. Currently, the BioSimulators registry includes standardized interfaces to simulation tools for constraint-based (Flux Balance Analysis (FBA) and Resource Balance Analysis (RBA)), continuous kinetic (ordinary differential equations (ODE) and differential-algebraic equations (DAE)), discrete kinetic (e.g., Stochastic Simulation Algorithms (SSA)), logical, spatial, particle-based and hybrid models that are described in using several languages including the [BioNetGen Language (BNGL)](https://bionetgen.org), [CellML](https://cellml.org), the [GINsim](http://ginsim.org/) Markup Language, [NeuroML](https://neuroml.org/)/[Low Entropy Model Specification Langauge (LEMS)](https://lems.github.io/LEMS/), the [RBA XML format](https://sysbioinra.github.io/RBApy/), the [Systems Biology Markup Language (SBML)](https://sbml.org) including the Flux Balance Constraints and Qualitative Models Packages, the [Smoldyn](http://www.smoldyn.org/) simulation configuration format, and the XPP [ODE](http://www.math.pitt.edu/~bard/xpp/help/xppodes.html) format. This encompasses over 60 simulation algorithm algorithms with over 20 simulation tools. More information about the available simulation methods available through BioSimulators is available at [https://biosimulators.org](https://biosimulators.org). These simulation capabilities are available through runBioSimulations and BioSimulations. Further, the community can extend BioSimulators' capabilities by contributing additional simulation tools. More information, tutorials, and examples are available from BioSimulators and in this documentation.

<div class="logos">
<div class="logos-row">
    <a href="https://www.bionetgen.org" rel="noopener" target="_blank" title="BNGL">
    <img
        class="zoom"
        src="/assets/images/about/partners/bionetgen.png"
    />
    </a>

    <a href="https://www.cellml.org/" rel="noopener" target="_blank" title="CellML">
    <img class="zoom" src="/assets/images/about/partners/cellml.svg" />
    </a>

    <a href="http://ginsim.org/" rel="noopener" target="_blank" title="GINsim">
    <img class="zoom" src="/assets/images/about/partners/ginsim.svg" />
    </a>

    <a href="https://neuroml.org/" rel="noopener" target="_blank" title="NeuroML">
    <img class="zoom" src="/assets/images/about/partners/neuroml.svg" />
    </a>

    <!--
    <a href="http://www.pharmml.org/" rel="noopener" target="_blank" title="pharmML">
    <img class="zoom" src="/assets/images/about/partners/pharmml.svg" />
    </a>
    -->

    <a href="https://rba.inrae.fr" rel="noopener" target="_blank" title="RBA">
    <img class="zoom" src="/assets/images/about/partners/rba.png" />
    </a>

    <a href="http://sbml.org" rel="noopener" target="_blank" title="SBML">
    <img class="zoom" src="/assets/images/about/partners/sbml.svg" />
    </a>
</div>

<div class="logos-row">
    <a href="http://www.ebi.ac.uk/sbo/" rel="noopener" target="_blank" title="SBO">
    <img class="zoom" src="/assets/images/about/partners/sbo.png" />
    </a>

    <a href="https://sed-ml.org/" rel="noopener" target="_blank" title="SED-ML">
    <img class="zoom" src="/assets/images/about/partners/sed-ml.svg" />
    </a>

    <a
    href="http://co.mbine.org/standards/kisao"
    rel="noopener" target="_blank"
    title="KiSAO"
    >
    <img class="zoom" src="/assets/images/about/partners/kisao.svg" />
    </a>

    <a href="https://escher.github.io/" rel="noopener" target="_blank" title="Escher">
    <img class="zoom" src="/assets/images/about/partners/escher.svg" />
    </a>

    <a href="https://sbgn.github.io/" rel="noopener" target="_blank" title="SBGN">
    <img class="zoom" src="/assets/images/about/partners/sbgn.png" />
    </a>

    <a href="https://vega.github.io/vega/" rel="noopener" target="_blank" title="Vega">
    <img class="zoom" src="/assets/images/about/partners/vega.svg" />
    </a>

    <a
    href="https://co.mbine.org/standards/omex"
    rel="noopener" target="_blank"
    title="OMEX"
    >
    <img class="zoom" src="/assets/images/about/partners/omex.svg" />
    </a>
</div>

<div class="logos-row">
    <a
    href="http://amici-dev.github.io/AMICI/"
    rel="noopener" target="_blank"
    title="AMICI"
    >
    <img class="zoom" src="/assets/images/about/partners/amici.svg" />
    </a>

    <a href="https://bionetgen.org" rel="noopener" target="_blank" title="BioNetGen">
    <img
        class="zoom"
        src="/assets/images/about/partners/bionetgen.png"
    />
    </a>

    <!--
    <a
    href="https://cayenne.readthedocs.io/"
    rel="noopener" target="_blank"
    title="Cayenne"
    >
    <img class="zoom" src="/assets/images/about/partners/cayenne.png" />
    </a>
    -->

    <a
    href="https://opencobra.github.io/cobrapy/"
    rel="noopener" target="_blank"
    title="COBRApy"
    >
    <img class="zoom" src="/assets/images/about/partners/cobrapy.svg" />
    </a>

    <a href="http://copasi.org/" rel="noopener" target="_blank" title="COPASI">
    <img class="zoom" src="/assets/images/about/partners/copasi.svg" />
    </a>

    <a
    href="https://gillespy2.github.io/GillesPy2/"
    rel="noopener" target="_blank"
    title="GillesPy2"
    >
    <img
        class="zoom"
        src="/assets/images/about/partners/gillespy2.svg"
    />
    </a>

    <!--
    <a
    href="https://github.com/MyersResearchGroup/iBioSim"
    rel="noopener" target="_blank"
    title="iBioSim"
    >
    <img class="zoom" src="/assets/images/about/partners/ibiosim.svg" />
    </a>
    -->

    <a
    href="https://masspy.readthedocs.io/"
    rel="noopener" target="_blank"
    title="MASSpy"
    >
    <img class="zoom" src="/assets/images/about/partners/masspy.svg" />
    </a>

    <a href="http://www.netpyne.org/" rel="noopener" target="_blank" title="NetPyNe">
    <img class="zoom" src="/assets/images/about/partners/netpyne.png" />
    </a>
</div>

<div class="logos-row">
    <a
    href="https://sysbioinra.github.io/RBApy/"
    rel="noopener" target="_blank"
    title="RBApy"
    >
    <img class="zoom" src="/assets/images/about/partners/rbapy.svg" />
    </a>

    <a
    href="http://pysces.sourceforge.net/"
    rel="noopener" target="_blank"
    title="PySCeS"
    >
    <img class="zoom" src="/assets/images/about/partners/pysces.svg" />
    </a>

    <a
    href="http://tellurium.analogmachine.org/"
    rel="noopener" target="_blank"
    title="tellurium/libRoadRunner"
    >
    <img
        class="zoom"
        src="/assets/images/about/partners/libroadrunner.svg"
    />
    </a>

    <a href="https://vcell.org/" rel="noopener" target="_blank" title="VCell">
    <img class="zoom" src="/assets/images/about/partners/vcell.svg" />
</a>
</div>
</div>
