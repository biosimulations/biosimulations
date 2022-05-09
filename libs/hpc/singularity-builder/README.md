# hpc-singularity-builder

This library is used to generate sbatch scripts for creating singularity containers from the docker images of the [BioSimulators](https://biosimulators.org) simulation tools. 

The sbatch script can be configured to build and cache the singularity container. This is needed to prevent the container from needing to be built on the first run, which can take a long time.



## Building

Run `nx build hpc-singularity-builder` to build the library.

## Running unit tests

Run `nx test hpc-singularity-builder` to execute the unit tests via [Jest](https://jestjs.io).


