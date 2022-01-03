# Guidelines for using Vega to visualize simulation results


## Overview

We recommend [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by reusing the same graphical marks with results from multiple simulations. This feature also makes the provenance of data visualizations transparent. As a result, we believe Vega is ideal for collaboration and publication.

Below, we provide recommendations for using Vega to visualize the results of simulation experiments described with SED-ML.

## Creating Vega visualizations of the results of SED-ML files in COMBINE archives

BioSimulators recommends using Vega visualizations with SED-ML as follows:

1. Annotate the Vega signals whose values should be rendered with the values of attributes of simulations or reports of SED-ML documents (e.g., number of a steps of a uniform time course simulation).

    - To set the `value` attribute of a Vega signal equal to the value of an attribute of a simulation or report of a SED-ML document, add a `sedmlUri` key to the signal with a value equal to a list of the location of the SED-ML document, the id of the SED-ML simulation or report, and the name of the attribute of the simulation or report (e.g., `['location/of/simulation.sedml', 'simulationId', 'numberOfSteps']`). To indicate that a signal should be rendered with a list of the values of an attribute of multiple simulations or reports, use `SedDocument:*`, `Simulation:*`, or `Report:*` for the SED-ML document location or simulation/report id (e.g., `['SedDocument:*', 'Report:*', 'id']` to render a signal with a list of the ids of the all of the reports of all of the SED-ML files in the parent COMBINE/OMEX archive).
    - Similarly, to set the `bind` attribute of a Vega signal equal to the value of an attribute of a simulation or report of a SED-ML document, add a `sedmlUri` key to the `bind` attribute with a value as described above.

2. Annotate the Vega data sets whose values should be rendered with the results of SED-ML reports by adding `sedmlUri` keys to these Vega data sets. The values of these keys should be set as follows to indicate the simulation results that should be linked to each Vega data set:
    - To render a Vega data set with the results of all reports from all of the SED-ML files in the parent COMBINE/OMEX archive, the value of the `sedmlUri` key should be an empty array (i.e. `[]`).
    - To render a Vega data set with the result of a single report from one SED-ML file in the parent COMBINE/OMEX archive, the value of the `sedmlUri` key should be a list of the location of the SED-ML document and the id of the report in the document (e.g., `['location/of/simulation.sedml', 'reportId']`).

3. Use the URI `http://purl.org/NET/mediatypes/application/vnd.vega.v5+json` to indicate the formats of Vega files in the manifests of COMBINE/OMEX archives.


### Example data visualization snippet (Vega document that indicates which Vega data sets should be mapped to SED-ML reports)
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

## Rendering Vega visualizations of the results of SED-ML files in COMBINE archives


Simulation software tools should render such Vega visualizations linked to SED-ML files in COMBINE/OMEX archives as follows:

1. Execute the SED-ML files in the COMBINE/OMEX archive and save each report.

2. Use the manifest of the archive to identify the Vega visualizations in the archive (contents with the format `http://purl.org/NET/mediatypes/application/vnd.vega.v5+json`).

3. Extract these Vega visualization files from the archive.

4. Use a JSON library to parse the Vega visualization files.

5. Identify the Vega signals whose values should be rendered with the values of attributes of simulations or reports in SED-ML documents (i.e. Vega signals that have `sedmlUri` keys).

6. Set the values of the Vega signals identified in the previous step to the indicated values of attributes of SED-ML simulations or reports. As illustrated below, SED-ML reports should be encoded as lists of objects that represent the results of each SED-ML dataset. Data sets with multidimensional values should be captured using nested lists.

7. Identify the Vega data sets whose values should be rendered with the values of the results of SED-ML reports (i.e. Vega data sets that have `sedmlUri` keys).

8. Set the values of the Vega data sets identified in the previous step to the results of the indicated SED-ML reports. As illustrated below, SED-ML reports should be encoded as lists of objects that represent the results of each SED-ML dataset. Data sets with multidimensional values should be captured using nested lists.

9. Use [Vega-Embed](https://github.com/vega/vega-embed) to render the resultant Vega visualizations.

### Example simulation results (SED-ML report)

```json
[
  {
    "id": "data_gen_mass",
    "label": "data_gen_mass",
    "name": "mass",
    "values": [
      0.80224854,
      0.8050613294000692,
      0.8078839808114837,
      0.8107165288117656,
      0.8135590080996636,
      0.816411453495585
    ]
  },
  {
    "id": "data_gen_time",
    "label": "data_gen_time",
    "name": "time",
    "values": [
      0,
      0.7,
      1.4,
      2.0999999999999996,
      2.8,
      3.5
    ]
  }
]
```

### Example rendered Vega document (Vega document with data sets replaced with the values of SED-ML reports)


```json
{
  "signals": [
    {
      "name": "Regular Vega signal",
      "value": 2
    },
    {
      "name": "Vega signal whose value should be rendered with the value of a simulation attribute of a SED-ML document",
      "value": 100
    }
  ],
  "data": [
    {
      "name": "Regular Vega data set, such as for data for visual marks",
      "values": []
    },
    {
      "name": "Vega data set whose value should be rendered with the result of a report of a SED-ML document",
      "values": [
        {
          "id": "data_gen_mass",
          "label": "data_gen_mass",
          "name": "mass",
          "values": [
            0.80224854,
            0.8050613294000692,
            0.8078839808114837,
            0.8107165288117656,
            0.8135590080996636,
            0.816411453495585
          ]
        },
        {
          "id": "data_gen_time",
          "label": "data_gen_time",
          "name": "time",
          "values": [
            0,
            0.7,
            1.4,
            2.0999999999999996,
            2.8,
            3.5
          ]
        }
      ]
    }
  ]
}
```

## Example COMBINE/OMEX archives with Vega visualizations

--8<--
vega-examples.md
--8<--

## Tools for converting visualizations of models into Vega data visualizations

--8<--
vega-converters.md
--8<--

## Recommended resources for creating and rendering visualizations

--8<--
vega-resources.md
--8<--