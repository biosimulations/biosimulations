# Creating Vega visualizations of the results of SED-ML files in COMBINE archives

We recommend [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations, and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by using the same graphical marks with results from multiple simulations. This feature also makes the provenance of data visualizations transparent. As a result, Vega is ideal for collaboration and publication.

Below is a brief tutorial on creating data visualizations with Vega and linking their inputs (Vega data sets) to the outputs of simulations (reports of SED-ML files), as well as several examples. In addition, [BioSimulators-utils](https://github.com/biosimulators/Biosimulators_utils) provides a command-line program and Python API for converting several types of structural diagrams of models into Vega data visualizations of simulation results. See [below](#tools-for-converting-visualizations-of-models-into-vega-data-visualizations) for more information. Additional tutorials and and documentation for Vega are available [here](https://vega.github.io/vega/).

## Tutorial

The steps below illustrate how to create Vega data visualizations for simulation results.

1. Create one or more [SED-ML files](https://sed-ml.org/) with one or more reports of the results of one or more simulations.
2. Encode the diagramatic structures from Step 1 into Vega. The [Vega documentation](https://vega.github.io/vega/docs/) and the interactive [Vega Editor](https://vega.github.io/editor) are helpful tools for designing and troubleshooting Vega visualizations. The [Altair](https://altair-viz.github.io/) resource can alternatively be used to design diagrammatic structure(s) for visualizing these SED-ML reports.
3. Indicate the Vega signals whose attributes should be rendered with the values of the attributes of SED-ML simulations (i.e. what visualization features will be painted with simulation results).

    - To render the value of a Vega signal with information from a SED-ML file, add the key `sedmlUri` to the Vega signal and the following value.
    - To render an attribute of the bind attribute of a Vega signal with information from a SED-ML file, set the value of the attribute equal to a dictionary with a single key `sedmlUri` and the following value.

    The value of each `sedmlUri` key should be a list of the SED-ML document location, the id of the SED-ML simulation or report, and the name of the simulation or report attribute that should be rendered with the signal or attribute value of the signal bind attribute (e.g., `['location/of/simulation.sedml', 'simulationId', 'numberOfSteps']`). To indicate that a `sedmlUri` key should be rendered with multiple simulations or reports, via a list of the values of an attribute of the multiple simulations or reports, use `SedDocument:*`, `Simulation:*`, or `Report:*` for the SED-ML document location or simulation/report id (e.g., `['SedDocument:*', 'Report:*', 'id']` to render an attribute with a list of the ids of the all of the reports of all of the SED-ML files in the COMBINE/OMEX archive).

4. Indicate the Vega data sets whose values should be rendered with the results of SED-ML reports by adding a key `sedmlUri` and one of the following values:
    - To render a Vega data set with the results of all reports from all of the SED-ML files in the parent COMBINE/OMEX archive, the value of `sedmlUri` should be an empty array (i.e. `[]`).
    - To render a Vega data set with the result of a single report from one SED-ML file in the parent COMBINE/OMEX archive, the value of `sedmlUri` should be a list of the SED-ML document location and the id of the SED-ML report (e.g., `['location/of/simulation.sedml', 'reportId']`).

5. Package the SED-ML and Vega files into a COMBINE/OMEX archive. Include the Vega files in the manifest of the archive with the format `http://purl.org/NET/mediatypes/application/vnd.vega.v5+json`.

## Examples

### Linking visualizations to simulation results
Below is an example snippet of a Vega document which illustrates how the input to a data visualization (data set of a Vega file) can be linked to an output of a simulation (report of a SED-ML document).

```json
{
  "data": [
    {
      "name": "Regular Vega data set, such as for data for visual marks (e.g., coordinates of nodes and edges of a graph).",
      "values": [
        {
          "id": "A",
          "x": "10",
          "y": "20"
        },
        {
          "id": "B",
          "x": "10",
          "y": "10"
        }
      ]
    },
    {
      "name": "Inlined Vega data set with the result of a report of a SED-ML document. This illustrates how BioSimulations renders Vega data sets linked to SED-ML reports.",
      "values": [
        {
          "id": "t",
          "label": "t",
          "shape": "1,1,11",
          "type": "float64",
          "name": "",
          "values": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
          "id": "A",
          "label": "A",
          "shape": "1,1,11",
          "type": "float64",
          "name": "",
          "values": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
        },
        {
          "id": "B",
          "label": "B",
          "shape": "1,1,11",
          "type": "float64",
          "name": "",
          "values": [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
        }
      ]
    },
    {
      "name": "Vega data set whose value should be rendered with the result of a report of a SED-ML document.",
      "sedmlUri": [
        "simulation.sedml",
        "reportId"
      ]
    }
  ]
}
```

### Linking visualizations to simulation settings
Below is an example snippet of a Vega document which illustrates how an attribute of a data visualization (signal of a Vega file) can be linked to an attribute of a simulation (e.g., number of steps of a time course of a SED-ML file).

```json
{
  "signals": [
    {
      "name": "Regular Vega signal.",
      "value": 10
    },
    {
      "name": "Vega signal whose value should be rendered with the value of an attribute of a simulation of a SED-ML document.",
      "sedmlUri": [
        "simulation_1.sedml",
        "simulation_1",
        "numberOfSteps"
      ]
    }
  ]
}
```

### Complete examples
Several complete examples (COMBINE/OMEX archives with linked SED-ML and Vega files) are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples#compatibility-of-the-example-archives-with-simulation-tools). These examples illustrate how Vega can be combined with a broad range of modeling formalisms, simulation algorithms, model formats, and simulation tools.

* Activity flux diagram created with GINsim with a menu for selecting a perturbation condition (gene knockout) and a slider for scrolling through simulation time
    * Interactive visualization: [synchronous logical updating with SBML-qual, BoolNet](https://biosimulations.org/projects/Yeast-cell-cycle-Irons-J-Theor-Biol-2009#tab=select-viz)
    * COMBINE archive: [synchronous logical updating with SBML-qual](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/sbml-qual/Irons-J-Theor-Biol-2009-yeast-cell-cycle.omex?raw=true)
    * Individual files: [synchronous logical updating with SBML-qual](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/sbml-qual/Irons-J-Theor-Biol-2009-yeast-cell-cycle)
* Line chart with an interactive legend 
    * Interactive visualization: [LSODA with SBML, PySCeS](https://biosimulations.org/projects/Nicotinic-excitation-Edelstein-Biol-Cybern-1996#tab=select-viz)
    * COMBINE archive: [LSODA with SBML](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/sbml-core/Edelstein-Biol-Cybern-1996-Nicotinic-excitation.omex?raw=true)
    * Individual files: [LSODA with SBML](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/sbml-core/Edelstein-Biol-Cybern-1996-Nicotinic-excitation)
* Figure with multiple panels
    * Interactive visualization: [CVODE method with SBML, tellurium](https://biosimulations.org/projects/Morphogenesis-checkpoint-continuous-Ciliberto-J-Cell-Biol-2003#tab=select-viz)
    * COMBINE archive: [CVODE method with SBML](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/sbml-core/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex?raw=true)
    * Individual files: [CVODE method with SBML](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/sbml-core/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous)
* Process description map created with SBGN with a slider for scrolling through simulation time 
    * Interactive visualization: [LSODA with SBML, COPASI](https://biosimulations.org/projects/Repressilator-Elowitz-Nature-2000#tab=select-viz)
    * COMBINE archive: [CVODE with CellML](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/cellml/Elowitz-Nature-2000-Repressilator.omex?raw=true) 
    * COMBINE archive: [CVODE with SBML](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/sbml-core/Elowitz-Nature-2000-Repressilator.omex?raw=true)
    * Individual files: [CVODE with CellML](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/cellml/Elowitz-Nature-2000-Repressilator) 
    * Individual files: [CVODE with SBML](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/sbml-core/Elowitz-Nature-2000-Repressilator)
* Reaction flux map created with Escher with interactive metabolites and reactions
    * Interactive visualization: [FBA with SBML-fbc, COBRApy](https://biosimulations.org/projects/Escherichia-coli-core-metabolism-textbook#tab=select-viz)
    * Interactive visualization: [RBA with RBA XML, RBApy](https://biosimulations.org/projects/Escherichia-coli-resource-allocation-Bulovic-Metab-Eng-2019#tab=select-viz)
    * COMBINE archive: [FBA with SBML-fbc](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/sbml-fbc/
    Escherichia-coli-core-metabolism.omex?raw=true)
    * COMBINE archive: [RBA with RBA XML](https://github.com/biosimulators/Biosimulators_test_suite/blob/deploy/examples/rba/Escherichia-coli-K12-WT.omex?raw=true)
    * Individual files: [FBA with SBML-fbc](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/sbml-fbc/
    Escherichia-coli-core-metabolism)
    * Individual files: [RBA with RBA XML](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/rba/Escherichia-coli-K12-WT)

## Tools for converting visualizations of models into Vega data visualizations
To help investigators use Vega to visualization simulation results, BioSimulators-utils provide a command-line program and Python API for converting several types of structural diagrams of models into Vega data visualizations of simulation results. This includes activity network diagrams created with [GINsim](http://ginsim.org/), reaction flux maps created with [Escher](https://escher.github.io/), and [SBGN](https://sbgn.github.io/) process description maps.

### More information
* [Interactive tutorial](https://mybinder.org/v2/gh/biosimulators/Biosimulators_tutorials/HEAD?filepath=tutorials/6.%20Generating%20data%20visualizations%20for%20simulation%20results/Converting%20visualizations%20to%20Vega.ipynb) 
* [API documentation](https://docs.biosimulators.org/Biosimulators_utils/source/biosimulators_utils.viz.vega.html)
* [PyPI](https://pypi.org/project/biosimulators-utils/)
* [Source code](https://github.com/biosimulators/Biosimulators_utils)

## More information
* [Vega examples](https://vega.github.io/vega/examples/)
* [Vega tutorials](https://vega.github.io/vega/tutorials/)
* [Vega documentation](https://vega.github.io/vega/docs/)
* Software tools for creating Vega visualizations
    * [Altair Python library](https://altair-viz.github.io/)
    * [Code editor](https://vega.github.io/editor/)
    * [Lyra graphical editor](https://vega.github.io/lyra/)
