# Guidelines for using Vega to visualize simulation results


## Overview

We recommend [Vega](https://vega.github.io/vega/) for data visualizations of simulation results. Vega is a powerful, declarative grammar for describing interactive, two-dimensional data visualizations.

One key feature of Vega is that it modularly captures the graphical marks which comprise visualizations and how those graphical marks should be painted with data. This feature makes it easy to produce data visualizations for multiple simulation conditions by combining the same graphical marks with results from multiple simulations. This features also makes the provenance of data visualizations transparent. As a result, Vega is ideal for collaboration and publication.

Below, we provide recommendations for using Vega to visualize the results of simulation experiments described with SED-ML.

## Creating Vega visualizations of the results of SED-ML files in COMBINE archives

BioSimulators recommends using Vega visualizations with SED-ML as follows:

1. Use the folowing annotations to indicate the Vega signals whose attributes should be rendered with the values of the attributes of SED-ML simulations.

    - To render the value of a Vega signal with information from a SED-ML file, add the key `sedmlUri` to the Vega signal.
    - To render an attribute of the `bind` attribute of a Vega signal with information from a SED-ML file, set the value of the attribute equal to a dictionary with a single key `sedmlUri`.

    The value of each `sedmlUri` key should be a list of the location of the SED-ML document, the id of the SED-ML simulation or report, and the name of the simulation or report attribute that should be rendered with the signal or attribute value of the signal bind attribute (e.g., `['location/of/simulation.sedml', 'simulationId', 'numberOfSteps']`). To indicate that a `sedmlUri` key should be rendered with a list of the values of an attribute of multiple simulations or reports, use `SedDocument:*`, `Simulation:*`, or `Report:*` for the SED-ML document location or simulation/report id (e.g., `['SedDocument:*', 'Report:*', 'id']` to render an attribute with a list of the ids of the all of the reports of all of the SED-ML files in the COMBINE/OMEX archive).

2. Use the following annotations to indicate the Vega data sets whose values should be rendered with the results of SED-ML reports by adding a key `sedmlUri` to such Vega data sets. The values of these keys should be set as follows:
    - To render a Vega data set with the results of all reports from all of the SED-ML files in the parent COMBINE/OMEX archive, the value of `sedmlUri` should be set to an empty array (`[]`).
    - To render a Vega data set with the result of a single report from one SED-ML file in the parent COMBINE/OMEX archive, the value of `sedmlUri` should be set to a list of the locations of the SED-ML document and the id of the SED-ML report (e.g., `['location/of/simulation.sedml', 'reportId']`).

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

5. Identify the Vega signals and data sets whose values are intended to be rendered with the values of simulation attributes of SED-ML documents and the results of reports of SED-ML documents (Vega signals and data sets with the key `sedmlUri`).

6. Set the values of these Vega signals and data sets equal to the values of the indicated attributes of SED-ML simulations and the results of SED-ML reports. As illustrated below, SED-ML reports should be encoded as lists of objects that represent the results of each SED-ML dataset. Data sets with multidimensional values should be captured using nested lists.

7. Use [Vega-Embed](https://github.com/vega/vega-embed) to render the resultant Vega visualizations.


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

Several example COMBINE/OMEX archives with Vega visualizations are available [here](https://github.com/biosimulators/Biosimulators_test_suite/tree/dev/examples). This includes examples of canonical statistical charts, as well as interactive maps of metabolic networks.

## Recommended resources for creating and rendering visualizations

Below are helpful tools for creating Vega visualizations:

- [Altair](https://altair-viz.github.io/) is a Python library which provides methods for generating Vega visualizations similar to packages such as Matplotib and Seaborn.
- [Lyra](http://vega.github.io/lyra/) is a interactive graphical program for designing data visualizations.
- [Vega Editor](https://vega.github.io/editor) is a text editor for Vega documents which continuously renders Vega documents as they are edited.
- [Vega-Embed](https://github.com/vega/vega-embed) is a JavaScript program for rendering Vega visualizations inside web pages.
