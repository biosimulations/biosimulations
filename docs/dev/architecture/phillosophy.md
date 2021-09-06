# Architecture Decsions and Philosophy

This page is intended to be a place to document the reasoning behind some of the decisions made in the architecture of the project and note changes in the architecture as the project evolves. Earlier decisions may turn out to be incorrect, overly complex, or otherwise outdated as development continues. The notes here can be used to guide other decisions that may be made or work through various design and implementation discussions.

## Cloud Computing vs. On-Prem HPC

The funding structure for the BioSimulations project encourages the use of existing HPC and storage resources at the University of Connecticut Health Center. While this is a reasonable approach, the architecture is designed to be as flexible as possible, allowing for the use of resources at other institutions or entriely cloud based resources with minimal changes to the code and design.

The seperation of the dispatch-service ensures that any platform specific code is kept contained in the service. Slight modifications to the code are needed to support the use of other HPC systems or cloud based resources.

The dispatch-service assumes a SLURM based job scheduler. The dispatch-service maintains a queue of the simulations to be run. It then generates an SBATCH script and then submits the job using an SSH connection to the UCONN HPC. It uses SSH and the SLURM system to monitor the job. Upon completion, it again uses SSH to copy the output results and logs into the rest of the platform. The files on the HPC are not used after the simulation run job has finished executing. This limits the mofication needed for use on other systems. The following modifications are needed to support other systems:

- SLURM based HPCs at other instiutions: The file paths to the service-users home directory and the location of the simulation file inputs and outputs must be modified. This is done simply by setting the appropriate environment variables through the application config.

??? todo "TODO: Link to the config section of docs" 
    Still see this todo and want an update? Open an [issue](https://github.com/biosimulations/biosimulations/issues/new) on GitHub.

- Other Job Schedulers: The generation of the SBATCH script and submission of the job must be modified to support the relevant job scheduler. The dispatch-service maintains a queue of the simulations to be run and orchestrates a series of steps to submit, monitor, and process the outputs. At two of the steps, submission and monitoring, the code must be modified to support another job scheduler. The following files contain the relevant code:
    - [sbatch.service.ts](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/services/sbatch/sbatch.service.ts)

    - [hpc.service.ts](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/services/hpc/hpc.service.ts)

- Cloud based compute: 
Using a cloud based compute environment will likey involve some changes to the monitoring of the runs, and the copying of the outputs. The following files contain the relevant code:
    -[monitor.processor.ts](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/submission/monitor.processor.ts)
    -[complete.processor.ts](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/submission/complete.processor.ts)