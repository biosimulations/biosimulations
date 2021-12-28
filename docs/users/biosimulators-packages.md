# Documentation for the BioSimulators tools and libraries

## Integrated Docker image

A Docker image with a Python environment with most of the validated simulation tools is available at [https://github.com/orgs/biosimulators/packages/container/package/biosimulators](https://github.com/orgs/biosimulators/packages/container/package/biosimulators). An iPython shell for this environment can be launched by installing Docker and running the following commands:

```bash
docker pull ghcr.io/biosimulators/biosimulators
docker run -it --rm ghcr.io/biosimulators/biosimulators
```

This image includes this package, as well as standardized Python APIs for the simulation tools validated by BioSimulators. Because this image aims to incorporate as many simulation tools as possible within a single Python environment, this image may sometimes lag behind the latest version of each tool.

The Dockerfile for this image is available [here](https://github.com/biosimulators/Biosimulators/blob/dev/Dockerfile).

Information about using the Python APIs in the image is available below.

## Standardized interfaces to simulation tools
Below are links to detailed documentation for the command-line applications and Python APIs for the standardized simulation tools.

* [AMICI](https://docs.biosimulators.org/Biosimulators_AMICI/)
* [Brian 2](https://docs.biosimulators.org/Biosimulators_pyNeuroML/)
* [BioNetGen](https://docs.biosimulators.org/Biosimulators_BioNetGen/)
* [BoolNet](https://docs.biosimulators.org/Biosimulators_BoolNet/)
* [CBMPy](https://docs.biosimulators.org/Biosimulators_CBMPy/)
* [COBRApy](https://docs.biosimulators.org/Biosimulators_COBRApy/)
* [COPASI](https://docs.biosimulators.org/Biosimulators_COPASI/)
* [GillesPy2](https://docs.biosimulators.org/Biosimulators_GillesPy2/)
* [GINsim](https://docs.biosimulators.org/Biosimulators_GINsim/)
* [LibSBMLSim](https://docs.biosimulators.org/Biosimulators_LibSBMLSim/)
* [MASSpy](https://docs.biosimulators.org/Biosimulators_MASSpy/)
* [NetPyNe](https://docs.biosimulators.org/Biosimulators_pyNeuroML/)
* [NEURON](https://docs.biosimulators.org/Biosimulators_pyNeuroML/)
* [OpenCOR](https://docs.biosimulators.org/Biosimulators_OpenCOR/)
* [pyNeuroML](https://docs.biosimulators.org/Biosimulators_pyNeuroML/)
* [PySCeS](https://docs.biosimulators.org/Biosimulators_PySCeS/)
* [RBApy](https://docs.biosimulators.org/Biosimulators_RBApy/)
* [Smoldyn](https://smoldyn.readthedocs.io/en/latest/python/api.html#sed-ml-combine-biosimulators-api)
* [tellurium](https://docs.biosimulators.org/Biosimulators_tellurium/)
* [VCell](https://github.com/virtualcell/vcell)
* [XPP](https://docs.biosimulators.org/Biosimulators_XPP/)

## Template for standardized interfaces to simulation tools
A template repository for creating a standardized interface to a simulation tool is available [here](https://github.com/biosimulators/Biosimulators_simulator_template).

## Core BioSimulators util package
BioSimulators-utils provides (a) several utility command-line programs and (b) a Python API for creating, validating, and executing simulation projects and for creating standardized interfaces to simulation tools. A tutorial and the documentation for the package is available [here](https://docs.biosimulators.org/Biosimulators_utils/).

## Test suite for test simulation tools
A tutorial and the documentation for the BioSimulators test suite for simulation tools is available [here](https://docs.biosimulators.org/Biosimulators_test_suite/).
