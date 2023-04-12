# Deploying BioSimulations in alternative environments

As discussed [here](./philosophy.md), although BioSimulations use Slurm to run simulations, BioSimulations is designed to be easily modified to execute simulations with other environments.

Simulations are executed by the [`dispatch-service`](https://github.com/biosimulations/biosimulations/tree/dev/apps/dispatch-service/src). This service generates Slurm scripts to run simulations, submits these scripts via an SSH connection to a Slurm queue, and uses an SSH connection to monitor simulation jobs. When jobs complete, the service retrieves their logs via SSH and submits them to BioSimulations' API. 

The following modifications are needed to deploy BioSimulations in other systems:

- Slurm-based HPCs: The path to the `dispatch-service` user's home directory, the location of the simulation file, and other configuration variables must be modified. This is done simply by setting the appropriate environment variables through the application config. An example configuration is available [here](https://github.com/biosimulations/deployment/blob/main/config/prod/dispatch-service/config.env).

- Other job schedulers: The generation of the Sbatch script and submission of the job must be modified to support the desired scheduler. The job submission and monitoring code must also be modified to support the desired scheduler. The following files contain the code that must be modified:
    - [`sbatch.service.ts`](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/services/sbatch/sbatch.service.ts)
    - [`hpc.service.ts`](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/services/hpc/hpc.service.ts)

- Cloud-based compute: Using a cloud-based environment may also require changing how simulation runs are monitored and how their logs are retrieved. The following files contain the code that may need to be modified:
    - [`monitor.processor.ts`](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/submission/monitor.processor.ts)
    - [`complete.processor.ts`](https://github.com/biosimulations/biosimulations/blob/dev/apps/dispatch-service/src/app/submission/complete.processor.ts)

For further assistance, please contact the [BioSimulations Team](mailto:info@biosimulations.org).
