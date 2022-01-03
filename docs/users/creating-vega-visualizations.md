# Creating Vega visualizations of the results of SED-ML files in COMBINE archives

We recommend [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations, and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by using the same graphical marks with results from multiple simulations. This feature also makes the provenance of data visualizations transparent. As a result, Vega is ideal for collaboration and publication.

## Tutorial

Several complete examples of visualized simulation results in Vega, and the corresponding COMBINE archives, are available on GitHub [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples). The following steps guide through the creation of Vega visualizations for simulation results:

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

Below is an example snippet of a Vega document which illustrates how SED-ML reports can be mapped to Vega data sets. 
```json
{
  "signals": [
    {
      "name": "Regular Vega signal",
      "value": 2
    },
    {
      "name": "Vega signal whose value should be rendered with the value of an attribute of a simulation of a SED-ML document",
      "sedmlUri": [
        "simulation_1.sedml",
        "simulation_1",
        "numberOfSteps"
      ]
    }
  ],
  "data": [
    {
      "name": "Regular Vega data set, such as for data for visual marks",
      "values": []
    },
    {
      "name": "Vega data set whose value should be rendered with the result of a report of a SED-ML document",
      "sedmlUri": [
        "simulation.sedml",
        "reportId"
      ]
    }
  ]
}
```
