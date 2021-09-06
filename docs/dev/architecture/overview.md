# Biosimulations Architecture

The BioSimulations/BioSimulators platform (BioSimulations) is a distributed computing system that is architected for extensibilty, scalability, and ease of development. By seperating the various components of the platform, we hope to enable developers to focus on relevant portions of the system and not on the details of the underlying architecture. In deciding which parts of the system should be seperated, we try to balance the added complexity of distributed computing with clean seperation of concerns. Details about the decisions and thought processes behind the architecture can be found in [Architecture Phillosophy](./phillosophy.md) page.

The components of the BioSimulations platform can be roughly organized as follows:

- Front-end applications
- Public APIs
- Back-end services
- Data storage
- Computing infrastructure
