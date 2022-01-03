# Creating Vega visualizations of the results of SED-ML files in COMBINE archives

We recommend [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations, and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by reusing the same graphical marks with results from multiple simulations. This feature also makes the provenance of data visualizations transparent. As a result, we believe Vega is ideal for collaboration and publication.

Below is a brief tutorial on creating data visualizations with Vega and linking their inputs (Vega data sets) to the outputs of simulations (reports of SED-ML files), as well as several examples. In addition, [BioSimulators-utils](https://github.com/biosimulators/Biosimulators_utils) provides a command-line program and Python API for converting several types of structural diagrams of models into Vega data visualizations of simulation results. See [below](#tools-for-converting-visualizations-of-models-into-vega-data-visualizations) for more information. Links to additional tutorials and documentation for Vega are available [below](#more-information).

## Background SED-ML, COMBINE archive, and Vega concepts

This tutorial focuses on combining Vega data visualizations with simulation experiments described with SED-ML and the COMBINE/OMEX archive format. This requires familiarity with the SED-ML, COMBINE archive, and Vega concepts outlined below. Links to further information about these concepts is also provided below.

* [Simulation Experiment Description Markup Language (SED-ML)](http://sed-ml.org/)
    * Simulations (`sedml:oneStep`, `sedml:steadyState`, `sedml:uniformTimeCourse`)
    * Reports (`sedml:report`)
* [COMBINE/OMEX archive format](https://combinearchive.org/)
    * Manifests which describe the `content` (files) of archives (XML files located at `manifest.xml` in COMBINE archives)
    * The `location` (path) of each `content` (e.g., `path/to/simulation.sedml`)
    * The `format` (media type) of each `content` (e.g., `http://identifiers.org/combine.specifications/sed-ml` for SED-ML, `http://purl.org/NET/mediatypes/application/vnd.vega.v5+json` for Vega)
* [BioSimulations/BioSimulators format for the results of SED-ML reports](../concepts/conventions/simulation-run-reports.md)
* [BioSimulations/BioSimulators conventions for executing COMBINE/OMEX archives with SED-ML files](../concepts/conventions/simulator-interfaces.md)
* [Vega format for data visualizations](https://vega.github.io/vega/)
    * [Signals](https://vega.github.io/vega/docs/signals/)
        * [`value` property](https://vega.github.io/vega/docs/signals/#signal-properties)
        * [`bind` property](https://vega.github.io/vega/docs/signals/#bind)
    * [Data sets](https://vega.github.io/vega/docs/data/)
        * [`values` property](https://vega.github.io/vega/docs/data/#properties)

## Tutorial

The steps below outline how to create Vega data visualizations for simulation results.

1. Create one or more [SED-ML files](https://sed-ml.org/) with one or more reports of the results of one or more simulations.

2. Create a Vega document that captures the desired diagrammatic structure for visualizing these SED-ML reports. We recommend creating Vega documents through tools such as the [Altair Python library](https://altair-viz.github.io/) or the [Lyra graphical editor](https://vega.github.io/lyra/). The [Vega Editor](https://vega.github.io/editor) is also a helpful tool for iteratively editing and troubleshooting Vega visualizations. Furthermore, the [Vega website](https://vega.github.io/vega/) contains extensive examples, tutorials, and documentation for learning Vega.

3. Annotate the Vega signals whose values should be rendered with the values of attributes of simulations or reports of SED-ML documents (e.g., number of a steps of a uniform time course simulation).

    - To set the `value` attribute of a Vega signal equal to the value of an attribute of a simulation or report of a SED-ML document, add a `sedmlUri` key to the signal with a value equal to a list of the location of the SED-ML document, the `id` of the SED-ML simulation or report, and the name of the attribute of the simulation or report (e.g., `['location/of/simulation.sedml', 'simulationId', 'numberOfSteps']`). To indicate that a signal should be rendered with a list of the values of an attribute of multiple simulations or reports, use `SedDocument:*`, `Simulation:*`, or `Report:*` for the SED-ML document location or simulation/report `id` (e.g., `['SedDocument:*', 'Report:*', 'id']` to render a signal with a list of the ids of the all of the reports of all of the SED-ML files in the parent COMBINE/OMEX archive).
    - Similarly, to set the `bind` attribute of a Vega signal equal to the value of an attribute of a simulation or report of a SED-ML document, add a `sedmlUri` key to the `bind` attribute with a value as described above.

4. Annotate the Vega data sets whose values should be rendered with the results of SED-ML reports by adding `sedmlUri` keys to these Vega data sets. The values of these keys should be set as follows to indicate the simulation results that should be linked to each Vega data set:
    - To render a Vega data set with the results of all reports from all of the SED-ML files in the parent COMBINE/OMEX archive, the value of the `sedmlUri` key should be an empty array (i.e. `[]`).
    - To render a Vega data set with the result of a single report from one SED-ML file in the parent COMBINE/OMEX archive, the value of the `sedmlUri` key should be a list of the location of the SED-ML document and the `id` of the report in the document (e.g., `['location/of/simulation.sedml', 'reportId']`).

5. Package the SED-ML and Vega files into a COMBINE/OMEX archive. Include the Vega files in the manifest of the archive with the format `http://purl.org/NET/mediatypes/application/vnd.vega.v5+json`.

## Examples

### Linking visualizations to simulation settings
Below is an example snippet of a Vega document with a regular Vega signal whose value is hard-coded into the Vega document.

```json
{
  "signals": [
    {
      "name": "Regular Vega signal.",
      "value": 10
    }
  ]
}
```

In comparison, below is an example snippet of a Vega document with a signal whose value is dynamically linked to an attribute of a simulation (e.g., number of steps of a time course of a SED-ML file).

```json
{
  "signals": [
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

When BioSimulations renders this Vega document, BioSimulations will retrieve the value of the `numberOfSteps` attribute of the simulation with `id` `simulation_1` of the SED-ML document at location `simulation_1.sedml` (e.g., `10`) and then set the `value` attribute of the signal equal to this value. After this transformation, the value of this signal will be structured as illustrated below.

```json
{
  "signals": [
    {
      "name": "Vega signal whose value should be rendered with the value of an attribute of a simulation of a SED-ML document.",
      "value": 10
    }
  ]
}
```


### Linking visualizations to simulation results

Below is an example snippet of a Vega document with a regular Vega dataset with whose value is hard-coded into the Vega document. Such data sets are useful for capturing the diagrammatic structures of network diagrams, such as the locations of nodes and edges of graphs.

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
    }
  ]
}
```

In comparison, below is an example snippet of a Vega document with a data set whose value is dynamically linked to an output of a simulation (report of a SED-ML document). 

```json
{
  "data": [
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

When BioSimulations renders this Vega document, BioSimulations will retrieve the value of the report with `id` `reportId` from the SED-ML document at location `simulation.sedml`. The value of this report will be structured as illustrated below.
```json
[
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
```

After retrieving the value of this report, BioSimulations will set the `values` attribute of the Vega data set to the value of the report. After this transformation, the Vega document will be structured as illustrated below.
```json
{
  "data": [
    {
      "name": "Vega data set whose value should be rendered with the result of a report of a SED-ML document.",
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
    }
  ]
}
```

### Complete examples
--8<--
vega-examples.md
--8<--

## Tools for converting visualizations of models into Vega data visualizations
--8<--
vega-converters.md
--8<--

## More information and resources
--8<--
vega-resources.md
--8<--
