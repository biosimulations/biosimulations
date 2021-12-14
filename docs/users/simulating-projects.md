# Executing simulation projects (COMBINE/OMEX archives)


## Using runBioSimulations tool to execute a simulation in the cloud

[runBioSimulations](https://run.biosimulations.org) is a simple application that uses BioSimulators to execute modeling studies. runBioSimulations also provides a REST API for programmatically executing simulations.

### Submit a simulation
Please follow these steps to execute a modeling project:

1. Open the [project submission form](https://run.biosimulations.dev/run).
1. Select a COMBINE/OMEX file to execute.
1. Select a simulation tool and a specific version of that tool.
1. Enter a name for your project. We recommend choosing a descriptive name that will help you recall the purpose of your project. These names will be particularly helpful if you run multiple projects.
1. Optionally, enter your email address to receive notification when your project has completed and is ready for your analysis.
1. Click the "Run" button. After you click the "Run" button, you will receive a URL where you will be able to view the status of your project and retrieve and visualize its results. If you provided an email address, you will be notified by email when your project has completed. This email will contain the same URL.

### View the status of a project


Please follow these steps to view the status of a project:

1. Open the URL provided after you submitted your project.
1. Click the "Overview" tab to view the status of the project.
1. Once the project has completed, click the "Log" tab to view the console log for the execution of the project.

### Retrieve Simulation results

After your project has completed, please follow these steps to retrieve its results:

1. Open the URL provided after you submitted your project.
1. Click the results icon to download the results of the project as a zip archive. This archive will contain a file for each report specified in each SED-ML file in the COMBINE/OMEX archive for your project.

### View Simulation results

After your project has completed, please follow these steps to visualize its results:

1. Open the URL provided after you submitted your project.
1. Click the "Design chart" tab to open a form for choosing which results to visualize.
1. Select one of the SED-ML files in your project.
1. Select one of the reports in the selected SED-ML file. This will display a time series chart of the selected report.
1. Use the controls in the chart to customize the chart. For example, the controls can be used to view specific variables or zoom into the chart.

### Programmatically executing projects with the REST API

In addition to our web application, a REST API for executing projects is available at https://api.biosimulations.org/. This API supports the same simulation tools as the web interface.


### Running example simulation projects

The runBioSimulation app contains a variety of example simulation projects that can be executed. You can click [here](https://run.biosimulations.dev/simulations?try=1) to automatically run the example projects. Alternatively, from the runBioSimulations app, you can run the example projects by clicking the "Try simulations" button.

These simulation projects are verified to be compatible with runBioSimulations. The [BioSimulators test suite](https://github.com/biosimulators/Biosimulators_test_suite/tree/deploy/examples/) describes the specific simulation tools that are compatible with each example project.

## Using containerized simulation tools 

### Execute a simulation locally

The BioSimulators simulation tools can also be used to execute simulations on your own machine. Please follow these steps to use a containerized simulation tool to execute a modeling study on your own machine.

1. **Install the Docker container engine**: Detailed instructions for all major operating systems are available from the [Docker website](https://docs.docker.com/get-docker/).
1. ** Download the simulator(s) that you wish to use**: From your console, execute `docker pull ghcr.io/biosimulators/{ simulator-id }` for each simulator that you wish to use. This will download the simulators and install them onto your machine.
1. **Use the selected simulator(s) to execute simulations and save their results**: Execute the following from your console:

```bash
docker run \
  --tty \
  --rm \
  --mount type=bind,source={ path-to-directory-of-COMBINE-archive },target=/tmp/project,readonly \
  --mount type=bind,source={ path-to-save-results },target=/tmp/results \
  ghcr.io/biosimulators/{ simulator-id } \
    --archive /tmp/project/{ name-of-COMBINE-archive } \
    --out-dir /tmp/results
```
Your COMBINE archive should be located at path-to-directory-of-COMBINE-archive/name-of-COMBINE-archive.

The results will be saved to `path-to-save-results`. The data for reports and plots will be saved in Hierarchical Data Format 5 (HDF5) format and plots will be saved in Portable Document Format (PDF) and bundled into a single zip archive. See the [specifications for reports](../concepts/conventions/simulation-run-reports.md) for more information about the format of reports.

For reports, the rows of each data table will represent the data sets (`sedml:dataSet`) outlined in the SED-ML definition of the report. The heading of each row will be the label of the corresponding data set. For plots, the rows of each data table will represent the data generators (`sedml:dataGenerator`) outlined in the SED-ML definition of the plot. The heading of each row will be the id of the corresponding data generator

Report tables of steady-state simulations will have a single column of the steady-state predictions of each data set. Report tables of one step simulations will have two columns that represent the predicted start and end states of each data set. Report tables of time course simulations will have multiple columns that represent the predicted time course of each data set. Report tables of non-spatial simulations will not have additional dimensions. Report tables of spatial simulations will have additional dimensions that represent the spatial axes of the simulation.

### Execute a simulation in an HPC environment

The BioSimulators simulation tools can also be running in high-performance computing (HPC) environments where root access is not available by first converting the Docker images for the tools into Singularity images .

All of the validated images for simulation tools are compatible with Singularity. As part of the validation process, we check that each Docker image can be converted into a [Singularity image](https://sylabs.io/).

The steps below illustrate how Singularity can be used to execute the simulation tools in HPC environments.

1. **Install Singularity**: Instructions are available at [https://sylabs.io/docs/](https://sylabs.io/docs/).
1. **Pull the Docker image** by executing `docker pull ghcr.io/biosimulators/{ id }:{ version }`.
1. **Convert the Docker image to a Singularity image** by executing `singularity pull { /path/to/save/singularity-image.sif } docker://ghcr.io/biosimulators/{ id }:{ version }`.
1. **Run the Singularity image by executing** `singularity run { /path/to/save/singularity-image.sif } ....`

## Using a command-line interface for a simulation tool to execute a simulation

The command-line interfaces for simulation tools can also be installed and run locally. Note, this typically requires additional effort beyond using the Docker images because it requires installing the dependencies for simulation tools.

Please follow these steps to use a command-line interface for a simulation tool to execute a modeling study.

1. **Install Python >= 3.7**.
1. **Install pip**.
1. **Install the dependencies for the simulation tool**. Links to installation instructions are available from the pages for each simulation tool.
1. **Install the command-line application for the simulation tool**. From your console, use pip to install the Python package which provides the command-line application. The names of the Python packages which provide the command-line applications are available from the pages for each simulation tool.
1. **Use the command-line program to execute a simulation project and save its results**: Execute the following from your console:

```bash
biosimulators-{ simulator-id } \
    --archive { /path/to/COMBINE-archive.omex } \
    --out-dir { /path/to/save/outputs }
```

In the above example, the simulation project is located at `/path/to/COMBINE-archive.omex` and the results will be saved to `/path/to/save/outputs`.


## Using a Python API for a simulation tool to execute a simulation

The Python APIs for simulation tools provide additional flexibility beyond their Docker images and command-line interfaces. However, using these APIs typically requires additional effort beyond using the Docker images because it requires installing the dependencies for simulation tools, as well as some knowledge of the data structures used by BioSimulators.

Please follow these steps to use a Python API for a simulation tool to execute a modeling study.

1. **Install Python >= 3.7**.
1. **Install pip**.
1. **Install the dependencies for the simulation tool**. Links to installation instructions are available from the pages for each simulation tool.
1. **Install the Python API for the simulation tool**. From your console, use pip to install the Python package which provides the Python API. The names of the Python packages which provide the Python APIs are available from the pages for each simulation tool.
1. **Open a Python shell.**
1. **Import the Python API for the simulation tool**. Import the Python module which provides the Python API. The names of the Python modules which provide the Python APIs are available from the pages for each simulation tool.
1. **Use the Python API** to execute a simulation project and save its results: Execute the following from your Python shell:

```python
import { simulator_module }
archive_filename = '{ /path/to/COMBINE-archive.omex }'
output_dirname = '{ /path/to/save/outputs }'
{ simulator_module }.exec_sedml_docs_in_combine_archive(archive_filename, output_dirname)
```

In the above example, the simulation project is located at `/path/to/COMBINE-archive.omex` and the results will be saved to `/path/to/save/outputs`.

The `ghcr.io/biosimulators/biosimulators` Docker image contains most of the available Python APIs inside a single Python environment. An ipython shell to this environment can be launched by executing the following from your console:

```bash
docker pull ghcr.io/biosimulators/biosimulators
docker run -it --rm ghcr.io/biosimulators/biosimulators
```

Additional interactive tutorials are available from [Binder](https://tutorial.biosimulators.org/).