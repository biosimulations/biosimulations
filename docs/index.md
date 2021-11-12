# BioSimulations documentation

## Motivation and goals

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse model components and simulations. Despite extensive efforts to develop standards such as the [COMBINE/OMEX archive format](https://combinearchive.org/), the [Kinetic Simulation Algorithm Ontology (KiSAO)](https://github.com/SED-ML/KiSAO/), the [Systems Biology Markup Language (SBML)](http://sbml.org/), and the [Simulation Experiment Description Markup Language (SED-ML)](https://www.sed-ml.org/) and repositories such as [BioModels](http://biomodels.net/) and the [Physiome Model Repository](https://models.physiomeproject.org/), it is still often difficult to share and reuse models and simulations. One challenge to sharing and reusing models is the disparate formats, model repositories, and simulation tools for different types of models. The proliferation of numerous similar formats, repositories, and tools makes it difficult, especially for non-experts, to find models and to find an appropriate simulation tool for each model. In addition, the existing model repositories have limited capabilities for sharing associated resources such as training data, simulation experiments, and visualizations.

## Key features

BioSimulations addresses these challenges by making it easier for researchers to share and reuse simulations. 

* **Central portal for publishing and discovering simulation projects**. BioSimulations provides a central portal for sharing and discovering models, simulations, and data visualizations across a broad range of modeling frameworks, model formats, simulation algorithms, simulation tools, and data visualizations. 
* **Web-based tools for interactively exploring simulation results.** BioSimulations provides results for each simulation experiment and data visualizations for interactively exploring these results.
* **Simple tools for reusing simulation projects.** runBioSimulations provides a simple web interface for modifying simulation experiments and running new simulations.
* **Transparent simulation.** By building upon BioSimulators, the COMBINE/OMEX archive format, KiSAO, and SED-ML, the details of each simulation experiment are fully transparent. This makes it easy for investigators to understand and reproduce simulation experiments.
* **Seamless integration with model development.** BioSimulations executes simulations using BioSimulators. This makes it easy for investigators to continue to work with models beyond BioSimulations using the same containerized simulation tools used by BioSimulations. Similarly, authors can use these same tools prior to publishing models to BioSimulations. This avoids duplicate effort and makes it easy for investigators to debug problems.

## Supported modeling methods

Currently BioSimulations supports constraint-based (Flux Balance Analysis (FBA) and Resource Balance Analysis (RBA)), continuous kinetic (ordinary differential equations (ODE) and differential-algebraic equations (DAE)), discrete kinetic (e.g., Stochastic Simulation Algorithms (SSA)), logical, spatial, particle-based and hybrid models that are described in using several languages including the [BioNetGen Language (BNGL)](https://bionetgen.org), [CellML](https://cellml.org), the [GINsim](http://ginsim.org/) Markup Language, [NeuroML](https://neuroml.org/)/[Low Entropy Model Specification Langauge (LEMS)](https://lems.github.io/LEMS/), the [RBA XML format](https://sysbioinra.github.io/RBApy/), the [Systems Biology Markup Language (SBML)](https://sbml.org) including the Flux Balance Constraints and Qualitative Models Packages, the [Smoldyn](http://www.smoldyn.org/) simulation configuration format, and the XPP [ODE](http://www.math.pitt.edu/~bard/xpp/help/xppodes.html) format. Currently BioSimulations supports over 60 simulation algorithm algorithms with over 20 simulation tools. More information about the available simulation methods is available at [BioSimulators](https://biosimulators.org).

Importantly, BioSimulations is extensible to additional modeling frameworks, model formats, simulation algorithms, and simulation tools. The community can extend BioSimulations' capabilities by contributing simulation tools to [BioSimulators](https://biosimulators.org).
More information, tutorials, and examples are available from BioSimulators. 

<div class="logos">
<div class="logos-row">
    <a href="https://www.bionetgen.org" target="_blank" title="BNGL">
    <img
        class="zoom"
        src="/assets/images/about/partners/bionetgen.png"
    />
    </a>

    <a href="https://www.cellml.org/" target="_blank" title="CellML">
    <img class="zoom" src="/assets/images/about/partners/cellml.svg" />
    </a>

    <a href="http://ginsim.org/" target="_blank" title="GINsim">
    <img class="zoom" src="/assets/images/about/partners/ginsim.svg" />
    </a>

    <a href="https://neuroml.org/" target="_blank" title="NeuroML">
    <img class="zoom" src="/assets/images/about/partners/neuroml.svg" />
    </a>

    <!--
    <a href="http://www.pharmml.org/" target="_blank" title="pharmML">
    <img class="zoom" src="/assets/images/about/partners/pharmml.svg" />
    </a>
    -->

    <a href="https://rba.inrae.fr" target="_blank" title="RBA">
    <img class="zoom" src="/assets/images/about/partners/rba.png" />
    </a>

    <a href="http://sbml.org" target="_blank" title="SBML">
    <img class="zoom" src="/assets/images/about/partners/sbml.svg" />
    </a>
</div>

<div class="logos-row">
    <a href="http://www.ebi.ac.uk/sbo/" target="_blank" title="SBO">
    <img class="zoom" src="/assets/images/about/partners/sbo.png" />
    </a>

    <a href="https://sed-ml.org/" target="_blank" title="SED-ML">
    <img class="zoom" src="/assets/images/about/partners/sed-ml.svg" />
    </a>

    <a
    href="http://co.mbine.org/standards/kisao"
    target="_blank"
    title="KiSAO"
    >
    <img class="zoom" src="/assets/images/about/partners/kisao.svg" />
    </a>

    <a href="https://escher.github.io/" target="_blank" title="Escher">
    <img class="zoom" src="/assets/images/about/partners/escher.svg" />
    </a>

    <a href="https://sbgn.github.io/" target="_blank" title="SBGN">
    <img class="zoom" src="/assets/images/about/partners/sbgn.png" />
    </a>

    <a href="https://vega.github.io/vega/" target="_blank" title="Vega">
    <img class="zoom" src="/assets/images/about/partners/vega.svg" />
    </a>

    <a
    href="https://co.mbine.org/standards/omex"
    target="_blank"
    title="OMEX"
    >
    <img class="zoom" src="/assets/images/about/partners/omex.svg" />
    </a>
</div>

<div class="logos-row">
    <a
    href="http://amici-dev.github.io/AMICI/"
    target="_blank"
    title="AMICI"
    >
    <img class="zoom" src="/assets/images/about/partners/amici.svg" />
    </a>

    <a href="https://bionetgen.org" target="_blank" title="BioNetGen">
    <img
        class="zoom"
        src="/assets/images/about/partners/bionetgen.png"
    />
    </a>

    <!--
    <a
    href="https://cayenne.readthedocs.io/"
    target="_blank"
    title="Cayenne"
    >
    <img class="zoom" src="/assets/images/about/partners/cayenne.png" />
    </a>
    -->

    <a
    href="https://opencobra.github.io/cobrapy/"
    target="_blank"
    title="COBRApy"
    >
    <img class="zoom" src="/assets/images/about/partners/cobrapy.svg" />
    </a>

    <a href="http://copasi.org/" target="_blank" title="COPASI">
    <img class="zoom" src="/assets/images/about/partners/copasi.svg" />
    </a>

    <a
    href="https://gillespy2.github.io/GillesPy2/"
    target="_blank"
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
    target="_blank"
    title="iBioSim"
    >
    <img class="zoom" src="/assets/images/about/partners/ibiosim.svg" />
    </a>
    -->

    <a
    href="https://masspy.readthedocs.io/"
    target="_blank"
    title="MASSpy"
    >
    <img class="zoom" src="/assets/images/about/partners/masspy.svg" />
    </a>

    <a href="http://www.netpyne.org/" target="_blank" title="NetPyNe">
    <img class="zoom" src="/assets/images/about/partners/netpyne.png" />
    </a>
</div>

<div class="logos-row">
    <a
    href="https://sysbioinra.github.io/RBApy/"
    target="_blank"
    title="RBApy"
    >
    <img class="zoom" src="/assets/images/about/partners/rbapy.svg" />
    </a>

    <a
    href="http://pysces.sourceforge.net/"
    target="_blank"
    title="PySCeS"
    >
    <img class="zoom" src="/assets/images/about/partners/pysces.svg" />
    </a>

    <a
    href="http://tellurium.analogmachine.org/"
    target="_blank"
    title="tellurium/libRoadRunner"
    >
    <img
        class="zoom"
        src="/assets/images/about/partners/libroadrunner.svg"
    />
    </a>

    <a href="https://vcell.org/" target="_blank" title="VCell">
    <img class="zoom" src="/assets/images/about/partners/vcell.svg" />
</a>
</div>
</div>


## Source model repositories

In addition to models, simulations, and visualizations contributed by investigators, BioSimulations also contains models, simulations, and visualizations aggregated from several primary repositories including [BiGG](http://bigg.ucsd.edu/), [BioModels](http://www.ebi.ac.uk/biomodels/), [ModelDB](http://modeldb.science/), the [Physiome Model Repository](https://models.physiomeproject.org/), the [Resource Balance Analysis Model Repository](https://github.com/SysBioInra/Bacterial-RBA-models), [RuleHub](https://github.com/RuleWorld/RuleHub), and the [VCell Published Models Database](https://vcell.org/vcell-published-models). Prior to incorporation into BioSimulations, BioSimulations extensively extensively quality-controls and debugs these models. In many cases BioSimulations also adds additional simulation experiments, data visualizations, and metadata.

<div class="logos">
<div class="logos-row">
    <a href="http://bigg.ucsd.edu/" target="_blank" title="BiGG">
    <img class="zoom" src="/assets/images/about/partners/bigg.png" />
    </a>

    <a
    href="http://www.ebi.ac.uk/biomodels/"
    target="_blank"
    title="BioModels"
    >
    <img
        class="zoom"
        src="/assets/images/about/partners/biomodels.svg"
    />
    </a>

    <!--
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

    <a href="http://ginsim.org/" target="_blank" title="GINsim">
    <img class="zoom" src="/assets/images/about/partners/ginsim.svg" />
    </a>

    <a
    href="https://jjj.biochem.sun.ac.za/"
    target="_blank"
    title="JWS Online"
    >
    <img class="zoom" src="/assets/images/about/partners/jws.svg" />
    </a>
    -->

    <a
    href="http://modeldb.science/"
    target="_blank"
    title="ModelDB"
    >
    <img class="zoom" src="/assets/images/about/partners/modeldb.svg" />
    </a>

    <a
    href="https://models.physiomeproject.org/"
    target="_blank"
    title="Physiome Model Repository"
    >
    <img class="zoom" src="/assets/images/about/partners/physiome.svg" />
    </a>

    <a
    href="https://rba.inrae.fr/models.html"
    target="_blank"
    title="RBA"
    >
    <img class="zoom" src="/assets/images/about/partners/rba.png" />
    </a>

    <a
    href="https://vcell.org/vcell-published-models"
    target="_blank"
    title="VCell Published Models Database"
    >
    <img class="zoom" src="/assets/images/about/partners/vcell.svg" />
    </a>
</div>
</div>
