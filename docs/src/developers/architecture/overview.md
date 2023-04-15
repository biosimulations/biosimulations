# Architecture

The BioSimulations/BioSimulators platform is a distributed computing system that is architected for extensibility, scalability, and ease of development. By separating the various components of the platform, we hope to enable developers to focus on relevant portions of the system and not on the details of the underlying architecture. In deciding which parts of the system should be separated, we try to balance the added complexity of distributed computing with clean separation of concerns. Details about the decisions and thought processes behind the architecture can be found in [Architecture philosophy](./philosophy.md) page.

The components of the platform are organized as follows:

- Front-end applications
    - [BioSimulations](https://biosimulations.org) (`platform` app)
    - [runBiosimulations](https://run.biosimulations.org) (`dispatch` app)
    - [BioSimulators](https://simulators.org) (`simulators` app)
- Public APIs
    - [BioSimulations API](https://api.biosimulations.org) (`api` app)
    - [BioSimulators API](https://api.biosimulators.org) (`simulators-api` app)
- Back-end services
    - Dispatch service (`dispatch-service` app)
    - [COMBINE API](https://combine.api.biosimulations.org) (`combine-api` app)
- Data storage
    - Mongo database
    - [S3 buckets](https://files.biosimulations.org) (accessed through `api` app)
- Computing infrastructure
    - GKE Kubernetes cluster
    - High performance computing cluster managed with SLURM
