# About 

## Motivation and Goals of BioSimulations

More comprehensive and more predictive models have the potential to advance biology, bioengineering, and medicine. Building more predictive models will likely require the collaborative efforts of many investigators. This requires teams to be able to share and reuse model components and simulations. Despite extensive efforts to develop standards such as [COMBINE/OMEX ](https://combinearchive.org/), [SBML](http://sbml.org/) , and [SED-ML](https://www.sed-ml.org/)  and repositories such as BioModels, it is still often difficult to share and reuse models and simulations. One challenge to sharing and reusing models is the disparate formats, model repositories, and simulation tools for different types of models. The proliferation of numerous similar formats, repositories, and tools makes it difficult, especially for non-experts, to find models and to find an appropriate simulation tool for each model. In addition, the existing model repositories have limited capabilities for sharing associated resources such as training data, simulation experiments, and visualizations.

BioSimulations addresses these challenges by making it easier for researchers to share and reuse models. First, BioSimulations provides authors a central portal for sharing models, simulations, and visualizations. Importantly, authors can share models in any format, authors can share simulations that require any simulator, and authors can share arbitrarily complex visualizations. Second, BioSimulations provides researchers a central portal for finding models and a simple web interface for reusing any model, simulation, or visualization. This is achieved using BioSimulators, a collection of Docker images that abstract the details of multiple modeling frameworks, simulation algorithms, model formats, and simulation tools.

## Supported modeling frameworks, algorithms, formats and software tools

BioSimulations supports all modeling frameworks and model formats. However, currently BioSimulations can only simulate logical, Flux Balance Analysis (FBA), continuous kinetic (ordinary differential equations (ODE) and differential-algebraic equations (DAE)), and discrete kinetic (e.g., Stochastic Simulation Algorithms (SSA)) models that are described in using the [BioNetGen Language (BNGL)](https://bionetgen.org)  or the [Systems Biology Markup Language (SBML)](https://sbml.org) .

BioSimulations uses the BioSimulators collection of simulation tools to simulate models. Through BioSimulators, BioSimulations supports a numerous algorithms for simulating logical, FBA, and kinetic models. BioSimulators builds upon [Docker](https://docker.com)  and [BioContainers](https://biocontainers.pro) . Please see [BioSimulators](https://biosimulators.org)  for more information about supported modeling frameworks, simulation algorithms, model formats, and simulation software tools.

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


## Source Model Repositories

In addition to models, simulations, and visualizations contributed by investigators, BioSimulations contains models, simulations, and visualizations imported from [BiGG](http://bigg.ucsd.edu/), [BioModels](http://www.ebi.ac.uk/biomodels/), and [Cell Collective](https://cellcollective.org/). BioSimulations provides a central place to find and reuse these models.


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
    -->

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

    <a
    href="https://rba.inrae.fr/models.html"
    target="_blank"
    title="RBA"
    >
    <img class="zoom" src="/assets/images/about/partners/rba.png" />
    </a>
</div>
</div>

## Recommended tools for further exploring modeling projects
BioSimulations provides basic capabilities for reproducing and reusing a wide range of biomodeling projects. For further exploration, we encourage users to use the domain-specific online platforms, desktop programs, and libraries outlined below.

	
|**Framework**  |Online platforms| Desktop programs| Libraries  |
|---------|---------|---------|---------|
|Constraint-based	     |  Fluxer       |   CBMPy iBioSim       | CBMPy COBRApy        |
|Continuous kinetic	     |    JWS Online      |    BioNetGen (rule-based) COPASI iBioSim tellurium VCell      |      AMICI libRoadRunner PySCeS    |
|Discrete kinetic     |    StochSS      |    BioNetGen (rule-based) COPASI iBioSim tellurium VCell      |  GillesPy2 PySCeS libRoadRunner      |
|Logical	     | Cell Collective         |       CNORdt  |         |



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
 
## Technological foundation of BioSimulations
BioSimulations is implemented using several open-source tools and cloud platforms.

<div class="logos">
<div class="logos-row">
    <a href="https://angular.io" target="_blank" title="Angular">
    <img class="zoom" src="/assets/images/about/tech/angular.svg" />
    </a>

    <a href="https://auth0.com/" target="_blank" title="Auth0">
    <img class="zoom" src="/assets/images/about/tech/auth0.svg" />
    </a>

    <a href="https://www.docker.com/" target="_blank" title="Docker">
    <img class="zoom" src="/assets/images/about/tech/docker.svg" />
    </a>

    <a
    href="https://realfavicongenerator.net/"
    target="_blank"
    title="Favicon Generator"
    >
    <img
        class="zoom"
        src="/assets/images/about/tech/real-favicon-generator.png"
    />
    </a>

    <a
    href="https://fontawesome.com"
    target="_blank"
    title="Font Awesome"
    >
    <img class="zoom" src="/assets/images/about/tech/font-awesome.svg" />
    </a>

    <a href="https://www.github.com/" target="_blank" title="GitHub">
    <img class="zoom" src="/assets/images/about/tech/github.svg" />
    </a>

    <a href="https://gravatar.com/" target="_blank" title="Gravatar">
    <img class="zoom" src="/assets/images/about/tech/gravatar.svg" />
    </a>

    <a href="https://kubernetes.io/" target="_blank" title="Kubernetes">
    <img class="zoom" src="/assets/images/about/tech/kubernetes.svg" />
    </a>

    <a href="https://www.mongodb.com/" target="_blank" title="MongoDB">
    <img class="zoom" src="/assets/images/about/tech/mongodb.svg" />
    </a>

    <a
    href="https://material.io/"
    target="_blank"
    title="Material Design"
    >
    <img class="zoom" src="/assets/images/about/tech/material.svg" />
    </a>

    <a
    href="https://materialtheme.arcsine.dev/"
    target="_blank"
    title="Material Theme Generator"
    >
    <img
        class="zoom"
        src="/assets/images/about/tech/material-theme-generator.svg"
    />
    </a>

    <a target="_blank" href="https://nestjs.com/" title="NestJS">
    <img class="zoom" src="/assets/images/about/tech/nestjs.svg"
    /></a>
    <a target="_blank" href="https://www.netlify.com" title="Netlify">
    <img class="zoom" src="/assets/images/about/tech/netlify.svg"
    /></a>
    <a target="_blank" href="https://www.openapis.org/" title="OpenAPI">
    <img class="zoom" src="/assets/images/about/tech/openapi.svg"
    /></a>
    <a target="_blank" href="https://spdx.org" title="SPDX">
    <img class="zoom" src="/assets/images/about/tech/spdx.svg"
    /></a>
    <a target="_blank" href="https://swagger.io" title="Swagger">
    <img class="zoom" src="/assets/images/about/tech/swagger.svg"
    /></a>
</div>
</div>
## Downloading the models, simulations, and visualizations in BioSimulations

The models, simulations, and visualizations in BioSimulations can be programmatically obtained using our REST API . Documentation for the API is available at the same URL.
## Obtaining the containerized simulation tools

The containerized simulation software tools are available from [BioSimulators](https://biosimulators.org). 

## Obtaining the BioSimulations source code

The BioSimulations source code is available in our [Github repository](https://github.com/biosimulations/biosimulations) 

The source code for the underlying simulation tools and utilities for the simulation tools functionality is available on the [BioSimulators](https://github.com/    biosimulators) Github organization.
## License

The models, simulations, and visualizations in BioSimulations are provided under the license specified for each resource. The containerized simulators are provided under the open-source licenses documented for each image. Please see [BioSimulators](https://biosimulators.org)  for more information. The BioSimulations source code is provided under the [MIT license](/License) . The licenses for BioSimulations' third-party dependencies are summarized [here](/Dependencies) .

## BioSimulations Team

BioSimulations was developed by the [Center for Reproducible Biomedical Modeling](http://reproduciblebiomodels.org/) including [Bilal Shaikh](https://bshaikh.com)  and [Jonathan Karr](https://www.karrlab.org)  at the [Icahn School of Medicine at Mount Sinai](https://icahn.mssm.edu) ; Akhil Marupilla, [Mike Wilson](https://www.linkedin.com/in/mike-wilson-08b3324/) , [Michael Blinov](https://health.uconn.edu/blinov-lab/) , and [Ion Moraru](https://facultydirectory.uchc.edu/profile?profileId=Moraru-Ion")  at the [Center for Cell Analysis and Modeling](https://health.uconn.edu/cell-analysis-modeling/)  at UConn Health; and [Herbert Sauro](https://www.sys-bio.org/) at the University of Washington.

<div class="logos">
<div class="logos-row">
    <a
    href="https://reproduciblebiomodels.org/"
    target="_blank"
    title="Center for Reproducible Biomedical Modeling"
    >
    <img class="zoom" src="/assets/images/about/team/crbm.svg" />
    </a>

    <a
    href="https://www.karrlab.org/"
    target="_blank"
    title="Center for Reproducible Biomedical Modeling"
    >
    <img class="zoom" src="/assets/images/about/team/karr-lab.svg" />
    </a>

    <a
    href="https://icahn.mssm.edu"
    target="_blank"
    title="Icahn School of Medicine at Mount Sinai"
    >
    <img class="zoom" src="/assets/images/about/team/sinai.svg" />
    </a>

    <a
    href="https://health.uconn.edu/"
    target="_blank"
    title="UConn Health"
    >
    <img class="zoom" src="/assets/images/about/team/uconn.svg" />
    </a>

    <a
    href="https://uw.edu"
    target="_blank"
    title="University of Washington"
    >
    <img class="zoom" src="/assets/images/about/team/uw.svg" />
    </a>
</div>
</div>
## Contributing to BioSimulations

We welcome contributions to BioSimulations!

Models, simulations, and visualizations can be contributed through this website or our REST API. Please create an account to get started.

Containerized simulators can be contributed by submitting GitHub issues . Please see BioSimulators  for information about the required format, a guide to building simulator images, and examples.

BioSimulations software: We welcome contributions by GitHub pull requests . Please see the Guide to Contributing  for information about how to get started. Please also contact the developers  to coordinate potential contributions.
## Acknowledgements

BioSimulations was developed with support from the [Center for Reproducible Biomodeling Modeling](https://reproduciblebiomodels.org)  from the [National Institute of Bioimaging and Bioengineering](https://www.nigms.nih.gov)  and the [National Institute of General Medical Sciences  of the National Institutes of Health](https://nih.gov)  and the [National Science Foundation](https://nsf.gov).

<div class="logos">
<div class="logos-row">
    <a href="https://nih.gov" target="_blank" title="NIH">
    <img class="zoom" src="/assets/images/about/funding/nih.svg" />
    </a>
    <a href="https://nibib.nih.gov" target="_blank" title="NIBIB">
    <img class="zoom" src="/assets/images/about/funding/nibib.svg" />
    </a>
    <a href="https://nigms.nih.gov" target="_blank" title="NIGMS">
    <img class="zoom" src="/assets/images/about/funding/nigms.svg" />
    </a>
    <a href="https://nsf.gov" target="_blank" title="NSF">
    <img class="zoom" src="/assets/images/about/funding/nsf.svg" />
    </a>
</div>
</div>

