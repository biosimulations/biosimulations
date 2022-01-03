# Creating Vega visualizations of the results of SED-ML files in COMBINE archives

We recommend [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by combining the same graphical marks with results from multiple simulations. This features also makes the provenance of data visualizations transparent. As a result, Vega is ideal for collaboration and publication.

## Tutorial

We recommend creating Vega visualizations for simulation results as follows:

1. Create one or more SED-ML files with one or more reports of the results of one or more simulations.
2. Use tools such as the [Vega Editor](https://vega.github.io/editor) and [Altair](https://altair-viz.github.io/) to design diagrammatic structure(s) for visualizing these SED-ML reports.
3. Encode these diagramatic structures into Vega. The [Vega documentation](https://vega.github.io/vega/docs/) is a helpful resource for learning Vega.
4. Indicate the Vega signals whose attributes should be rendered with the values of the attributes of SED-ML simulations.

    - To render the value of a Vega signal with information from a SED-ML file, add the key `sedmlUri` to the Vega signal.
    - To render an attribute of the bind attribute of a Vega signal with information from a SED-ML file, set the value of the attribute equal to a dictionary with a single key `sedmlUri`.

    The value of each `sedmlUri` key should be a list of the location of the SED-ML document, the id of the SED-ML simulation or report, and the name of the simulation or report attribute that should be rendered with the signal or attribute value of the signal bind attribute (e.g., `['location/of/simulation.sedml', 'simulationId', 'numberOfSteps']`). To indicate that a `sedmlUri` key should be rendered with a list of the values of an attribute of multiple simulations or reports, use `SedDocument:*`, `Simulation:*`, or `Report:*` for the SED-ML document location or simulation/report id (e.g., `['SedDocument:*', 'Report:*', 'id']` to render an attribute with a list of the ids of the all of the reports of all of the SED-ML files in the COMBINE/OMEX archive).

5. Indicate the Vega data sets whose values should be rendered with the results of SED-ML reports by adding a key `sedmlUri` to such Vega data sets. The values of these keys should be set as follows:
    - To render a Vega data set with the results of all reports from all of the SED-ML files in the parent COMBINE/OMEX archive, the value of `sedmlUri` should be set to an empty array (`[]`).
    - To render a Vega data set with the result of a single report from one SED-ML file in the parent COMBINE/OMEX archive, the value of `sedmlUri` should be set to a list of the locations of the SED-ML document and the id of the SED-ML report (e.g., `['location/of/simulation.sedml', 'reportId']`).

6. Package the SED-ML and Vega files into a COMBINE/OMEX archive. Include the Vega files in the manifest of the archive with the format `http://purl.org/NET/mediatypes/application/vnd.vega.v5+json`.

## Examples

Below is an example snippet of a Vega document which illustrates how SED-ML reports can be mapped to Vega data sets. Several complete examples are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples#compatibility-of-the-example-archives-with-simulation-tools).
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
