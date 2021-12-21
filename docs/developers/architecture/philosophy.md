# Architectural decisions and philosophy

This page is intended to be a place to document the reasoning behind some of the decisions made in the architecture of the project and note changes in the architecture as the project evolves. Earlier decisions may turn out to be incorrect, overly complex, or otherwise outdated as development continues. The notes here can be used to guide other decisions that may be made or work through various design and implementation discussions.

## Cloud computing versus on-premise high-performance computing

The funding structure for the BioSimulations and BioSimulators projects encourages the use of existing high-performance computing (HPC) and storage resources at UConn Health. While this is a reasonable approach, the architecture is designed to be as flexible as possible, allowing for the use of resources at other institutions or entirely cloud-based resources with minimal changes to the code and design.
