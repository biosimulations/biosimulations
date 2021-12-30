# Finding, exploring & reusing published projects

## Finding projects

Published projects can be browsed at [https://biosimulations.org/projects](https://biosimulations.org/projects). Each card presents a project, with a thumbnail and title. Mousing over the thumbnail shows additional details about the project. You can customize the attributes that are displayed. 

![browse-projects](./images/browse.png)

### Selecting attributes

![select-attributes](./images/select.png){align=right}
Clicking on the search icon in the top-right corner of the page opens a menu with an attributes sub-menu. From here, you can select the attributes that are displayed. Selecting a field will add the attributes to the details presented in the project card when you mouse over each thumbnail.

 <!-- The new lines must be followed by two spaces-->
&NewLine;  
&NewLine;  
&NewLine;  
&NewLine;  
&NewLine;  
&NewLine;  

### Searching for projects
![search-projects](./images/search.png){align=right}
Clicking on the the search icon at the top right of the page opens a search box. A search term, such as 'metabolism' can be entered in the search box. By default, the search term is searched against each [attribute](#selecting-attributes) of each project. Optionally, you can restrict the search to specific attributes. For example, if you want to search for projects that have the taxa 'Escherichia coli', you can enter 'taxa:Escherichia coli' in the search box. For attributes with spaces in the name, replace these spaces with "-". For example, the term "last-updated:2020" can be used to search for projects that contain the value "2020" in the ;last updated' attribute. A list of the available search fields is available in the [FAQs](faqs.md).

### Filtering projects

![filter-attributes](./images/filter.png){align=right}
The list of displayed projects can be filtered by the values of their attributes. For each available attribute, a menu of values is presented. Selecting a value will filter the list of projects to include only those with the selected values.

 <!-- The new lines must be followed by two spaces-->
&NewLine;  
&NewLine;  
&NewLine;  
&NewLine;  
&NewLine;  
&NewLine;  

## Exploring projects

Clicking on a project card opens a page with the project details. The "Overview" tab provides metadata about the seleted project, as well as information about underlying model and simulation run. The "Select chart" tab allows you to configure visualizations of the simulation results that can then be viewed on the "View chart" tab. The "Files" tab provides downloads for the files of the project.

### Metadata

BioSimulations collects metadata to enable searching, browsing and discovering projects. The metadata includes information about authorship, license, funding and other provenance information. It also includes information about the modelled system, such as the modelled organism, and tags that describe the project.

![project-metadata](./images/metadata.png)

### Visualizations

Projects can be visualized using both predefined and custom visualizations. The "Select chart" tab allows you to select from pre-defined visualizations that were included in the project, including both basic charts described with SED-ML and more complex visualizations described with Vega. Additionally, you can create your own custom visualizations by selecting one of the "Design a chart" options including histograms, heatmaps and lineplots. Selecting a plot time will open an additional menu with configuration options to select the datasets to be plotted.

Once you have configured your visualization, you can view it by clicking on the "View chart" button. The "Export to Vega" button will export the visualization to a [Vega](https://vega.github.io/) specification, which enables greater user customization of the visual. More information for using Vega with BioSimulations in available [here](../concepts/conventions/simulation-run-visualizations.md).

More information about creating SED-ML and Vega visualizations is available [here](./creating-projects.md) and [here](./creating-vega-visualizations.md).

### Simulation runs
![Sidebar screenshot showing simulation run details](./images/sidebar-simulation-run.png){ align=left }
More detailed information about the execution of the project and its results can be viewed by following the links to the runBioSimulations page for the project. The "Logs" tab provides detailed output of the simulation execution, including each individual simulation task and the outputs (reports and plots) produced by the simulation. Each task of the simulation is presented as a collapsible section that can be expanded to show the outputs. Both structured log files and raw output files can be downloaded from the links. 

## Reusing projects

### Creating and executing variants of simulations with runBioSimulations

In addition to this full-featured web application, [runBioSimulations](https://run.biosimulations.org) provides a simpler web application and REST API for executing simulations. runBioSimulations simply enables users to execute COMBINE archives using a variety of simulation tools and generate time series plots of their results. runBioSimulations does not require an account.

### Downloading projects and executing them with your own computers

#### Downloading projects

The models, simulations, and visualizations in BioSimulations can be programmatically obtained using our [REST API](https://api.biosimulations.org). Documentation for the API is available at the same URL.

#### Recommended tools for further exploring simulation projects

BioSimulations provides basic capabilities for reproducing and reusing a wide range of biomodeling projects. For further work, we encourage users to use the domain-specific online platforms, desktop programs, and libraries outlined below. Consistent interfaces to the desktop and library tools below are available from [BioSimulators](https://biosimulators.org), including Docker images, command-line interfaces and Python APIs. More information about obtaining and using these tools is available from [BioSimulators](https://biosimulators.org). 

!!! warning

    While the BioSimulators interfaces to these tools support SED-ML and the COMBINE/OMEX archive format, the primary versions of most of the tools below do not support these formats or do not support them consistently with the specifications of the SED-ML format.

    
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
    rel="noopener" target="_blank"
    title="Cell Collective"
    >
    <img
        class="zoom"
        src="/assets/images/about/partners/cell-collective.png"
    />
    </a>

    <a href="https://fluxer.umbc.edu/" rel="noopener" target="_blank" title="Fluxer">
    <img class="zoom" src="/assets/images/about/partners/fluxer.svg" />
    </a>

    <a
    href="https://jjj.biochem.sun.ac.za/"
    rel="noopener" target="_blank"
    title="JWS Online"
    >
    <img class="zoom" src="/assets/images/about/partners/jws.svg" />
    </a>

    <a href="https://stochss.org/" rel="noopener" target="_blank" title="StochSS">
    <img class="zoom" src="/assets/images/about/partners/stochss.svg" />
    </a>

    <a
    href="https://vivarium-collective.github.io"
    rel="noopener" target="_blank"
    title="Vivarium"
    >
    <img class="zoom" src="/assets/images/about/partners/vivarium.svg" />
    </a>
</div>
</div>
