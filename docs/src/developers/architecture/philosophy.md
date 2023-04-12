# Architectural decisions and philosophy

This page outlines some of the rationale for the architecture of the project.

## Hybrid cloud-on-premise architecture

BioSimulations uses a hybrid architecture in which the APIs, backend services, and databases are deployed in a Kubernetes cluster in the commercial cloud; simulation runs are executed using on-premise high-performance computing (HPC) at UConn Health; and simulation projects and their results are stored using on-premise resources at UConn Health. We chose this hybrid architecture to minimize the long-term cost of deploying BioSimulations, particularly executing simulations for the community. Nevertheless, BioSimulations and BioSimulators are architected such they can be deployed to alternative resources with minimal modification.
