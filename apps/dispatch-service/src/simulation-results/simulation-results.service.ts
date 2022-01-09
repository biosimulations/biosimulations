import { Endpoints, FilePaths } from '@biosimulations/config/common';
import { DataPaths } from '@biosimulations/hsds/client';
import { Injectable, Logger } from '@nestjs/common';
import { SshService } from '../app/services/ssh/ssh.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SimulationResultsService {
  private logger = new Logger(SimulationResultsService.name);
  private endpoints: Endpoints;
  private filePaths: FilePaths;
  private dataPaths: DataPaths;

  public constructor(
    private configService: ConfigService,
    private sshService: SshService,
  ) {
    const env = configService.get('server.env');
    this.endpoints = new Endpoints(env);
    this.filePaths = new FilePaths(env);
    this.dataPaths = new DataPaths();
  }

  public async processResults(id: string): Promise<void> {
    this.logger.log(`Processing results for simulation run '${id}'.`);

    const simDirname = `${this.configService.get('hpc.hpcBaseDir')}/${id}`;
    const outputsS3Subpath = this.filePaths.getSimulationRunOutputsPath(
      id,
      false,
    );
    const hsdsBasePath = this.configService.get('data.externalBasePath');
    const hsdsUsername = this.configService.get('data.username');
    const hsdsPassword = this.configService.get('data.password');
    const simulationRunResultsHsdsPath =
      this.dataPaths.getSimulationRunResultsPath(id);

    const command =
      `hsload` +
      ` --endpoint ${hsdsBasePath}` +
      ` --username ${hsdsUsername}` +
      ` --password ${hsdsPassword}` +
      ` --verbose` +
      ` ${simDirname}/${outputsS3Subpath}/reports.h5` +
      ` '${simulationRunResultsHsdsPath}'`;
    console.log(command);
    await this.sshService.execStringCommand(command);

    return;
  }
}
