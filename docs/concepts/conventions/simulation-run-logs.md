# Format for logs of the execution of simulation experiments captured in COMBINE/OMEX archives

## Overview

This format enables simulation tools to consistently communicate information about the status and outcome of the execution of SED-ML files in COMBINE/OMEX archives. The format can capture the following information:

- The status and outcome of the COMBINE archive and each SED document, task, report, plot, data set, curve and surface (`QUEUED`, `RUNNING`, `SUCCEEDED`, `SKIPPED`, or `FAILED`).
- Information about the simulation function that was executed and the arguments that were used.
- The standard output/error produced from executing the COMBINE archive and each SED document, task, and output.
- The duration of the execution of the COMBINE archive and each SED document, task, and output.
- The reason for each SED document, task or output that was skipped.
- The reason for each failed SED document, task, or output.

## Specifications


The schema for the format is available in [JSON schema](https://api.biosimulations.org/schema/CombineArchiveLog.json)  and [Open API](https://api.biosimulations.org/openapi.json) formats. Documentation for the schema is available at [https://api.biosimulations.org/](https://api.biosimulations.org/).

Simulators are encouraged to log the execution of each individual SED element, including each task, report, plot, data set, curve and surface.

At the same time, the format provides simulation tools flexibility to log their execution at whatever level of granularity is convenient. Below are several possible levels of granularity.

- Individual task and output elements (e.g., data sets, curves, surfaces)
- Individual tasks
- Individual SED documents
- The entire COMBINE/OMEX archive

!!!note 
    the output attribute for the log of each COMBINE/OMEX archive, SED document, task, and output can include [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) for color and other terminal formatting .


## Example logs

Below is an example of an element-level log of a COMBINE/OMEX archive that involves a single SED document with two tasks at the beginning of its execution.

```json
{
  "status": "QUEUED",
  "exception": null,
  "skipReason": null,
  "output": null,
  "duration": null,
  "sedDocuments": [
    {
      "location": "doc_1.sedml",
      "status": "QUEUED",
      "exception": null,
      "skipReason": null,
      "output": null,
      "duration": null,
      "tasks": [
        {
          "id": "task_1_ss",
          "status": "QUEUED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": null,
          "algorithm": null,
          "simulatorDetails": null
        },
        {
          "id": "task_2_time_course",
          "status": "QUEUED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": null,
          "algorithm": null,
          "simulatorDetails": null
        }
      ],
      "outputs": [
        {
          "id": "report_1",
          "status": "QUEUED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": null,
          "dataSets": [
            {
              "id": "dataset_1",
              "status": "QUEUED"
            },
            {
              "id": "dataset_2",
              "status": "QUEUED"
            }
          ]
        },
        {
          "id": "plot_1",
          "status": "QUEUED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": null,
          "curves": [
            {
              "id": "curve_1",
              "status": "QUEUED"
            }
          ]
        }
      ]
    }
  ]
}
```

Below is an example of an element-level log of the final state of the successful execution of the same COMBINE/OMEX archive.

```json

{
  "status": "SUCCEEDED",
  "exception": null,
  "skipReason": null,
  "output": null,
  "duration": 6,
  "sedDocuments": [
    {
      "location": "doc_1.sedml",
      "status": "SUCCEEDED",
      "exception": null,
      "skipReason": null,
      "output": null,
      "duration": 5,
      "tasks": [
        {
          "id": "task_1_ss",
          "status": "SUCCEEDED",
          "exception": null,
          "skipReason": null,
          "output": "Reading model ... done\nInitializing simulation ... done\nExecuting simulation ... done\n",
          "duration": 2,
          "algorithm": null,
          "simulatorDetails": null
        },
        {
          "id": "task_2_time_course",
          "status": "SUCCEEDED",
          "exception": null,
          "skipReason": null,
          "output": "Reading model ... done\nInitializing simulation ... done\nExecuting simulation ... done\n",
          "duration": 1,
          "algorithm": null,
          "simulatorDetails": null
        }
      ],
      "outputs": [
        {
          "id": "report_1",
          "status": "SUCCEEDED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": 0.1,
          "dataSets": [
            {
              "id": "dataset_1",
              "status": "SUCCEEDED"
            },
            {
              "id": "dataset_2",
              "status": "SUCCEEDED"
            }
          ]
        },
        {
          "id": "plot_1",
          "status": "SUCCEEDED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": 0.01,
          "curves": [
            {
              "id": "curve_1",
              "status": "SUCCEEDED"
            }
          ]
        }
      ]
    }
  ]
}
```

Below is an example of an element-level log of the final state of the failed execution of the same COMBINE/OMEX archive.


```json
{
  "status": "FAILED",
  "exception": null,
  "skipReason": null,
  "output": null,
  "duration": 6,
  "sedDocuments": [
    {
      "location": "doc_1.sedml",
      "status": "FAILED",
      "exception": null,
      "skipReason": null,
      "output": null,
      "duration": 5,
      "tasks": [
        {
          "id": "task_1_ss",
          "status": "SUCCEEDED",
          "exception": null,
          "skipReason": null,
          "output": "Reading model ... done\nInitializing simulation ... done\nExecuting simulation ... done\n",
          "duration": 2,
          "algorithm": null,
          "simulatorDetails": null
        },
        {
          "id": "task_2_time_course",
          "status": "FAILED",
          "exception": {
            "type": "FileNotFoundError",
            "message": "Model `model2.xml` does not exist."
          },
          "skipReason": null,
          "output": null,
          "duration": 1,
          "algorithm": null,
          "simulatorDetails": null
        }
      ],
      "outputs": [
        {
          "id": "report_1",
          "status": "SUCCEEDED",
          "exception": null,
          "skipReason": null,
          "output": null,
          "duration": 0.1,
          "dataSets": [
            {
              "id": "dataset_1",
              "status": "SUCCEEDED"
            },
            {
              "id": "dataset_2",
              "status": "SUCCEEDED"
            }
          ]
        },
        {
          "id": "plot_1",
          "status": "SKIPPED",
          "exception": null,
          "skipReason": {
            "type": "2DPlotNotImplemented",
            "message": "Output skipped because the simulator cannot generate plots."
          },
          "output": null,
          "duration": 0.01,
          "curves": [
            {
              "id": "curve_1",
              "status": "SKIPPED"
            }
          ]
        }
      ]
    }
  ]
}
```
Below is an example of a SED document-level log of the final state of the failed execution of the same COMBINE/OMEX archive.


```json

{
  "status": "FAILED",
  "exception": null,
  "skipReason": null,
  "output": null,
  "duration": 6,
  "sedDocuments": [
    {
      "location": "doc_1.sedml",
      "status": "FAILED",
      "exception": {
        "type": "FileNotFoundError",
        "message": "Model `model2.xml` does not exist."
      },
      "skipReason": null,
      "output": "Reading model ... done\nInitializing simulation ... done\nExecuting simulation ... done\n",
      "duration": 5,
      "tasks": null,
      "outputs": null
    }
  ]
}

```

## Events which should trigger simulators to update the status of COMBINE/OMEX archives

Simulation tools are encouraged to flush logs of the execution of COMBINE/OMEX archives upon each of the following events:

- **Start of the execution of the COMBINE/OMEX archive**. After this event, the status of the archive should be `RUNNING`, the status of each SED document and SED element that the simulation tool is capable of executing should be QUEUED, and the status of each SED document and SED element that the simulation tool is not capable fo executing should be SKIPPED.
- **Start of the execution of each SED document**. This event should change the status of the document to `RUNNING`.
- **Start of the execution of each SED task**. This event should change the status of the task to `RUNNING`.
- **End of the execution of each SED task**. If the task succeeded, its status should be changed to `SUCCEEDED`. In addition, all data sets, curves, and surfaces which can now be generated should be generated, and their status should be changed to `SUCCEEDED`. The status of the parent reports and plots should be set to SUCCEEDED if all of their data sets, curves, and surfaces have been generated, or `RUNNING` if some of their data sets, curves, and surfaces cannot yet be generated because they depend on tasks which have not yet been executed. If the task failed, its status should be changed to `FAILED`, and the status of all data sets, curves, surfaces, reports, and plots which depend on the task should be changed to `FAILED`.
- **End of the execution of each SED document**. If all of the task and outputs in the document succeeded, the document's status should be changed to `SUCCEEDED`. Otherwise, the document's status should be changed to `FAILED`.

By the end of the execution of a COMBINE/OMEX archive, the status of each SED document, task, report, plot, data set, curve, and surface should be one of `SUCCEEDED`, `SKIPPED`, or `FAILED`.



## Recommended resources for building logs of the execution of COMBINE/OMEX archives

Below are helpful tools for building logs of the execution of COMBINE/OMEX archives:

[BioSimulators utils](https://docs.biosimulators.org/Biosimulators_utils/)  is a Python library which provides functions for generating reports to the above specifications.
[capturer](https://pypi.org/project/capturer/)  is a Python library for capturing standard output and standard error streams.