import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment }  from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { ModelService } from './model.service';

import { AccessLevel } from '../Enums/access-level'
import { SimulationStatus } from '../Enums/simulation-status'
import { ChangedParameter } from '../Models/changed-parameter'
import { Format } from '../Models/format'
import { JournalReference } from '../Models/journal-reference'
import { Simulator } from '../Models/simulator'
import { Simulation } from '../Models/simulation'
import { User } from '../Models/user'

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  simulationData: object = null;
  fileData: Array<object> = null;
  omexFiles: Array<string> = null;
  solverFiles: Array<string> = null;
  sbatchFiles: Array<string> = null;
  simulationDataChangeSubject = new Subject<null>();

  private userService: UserService;
  private modelService: ModelService;
  
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private injector: Injector,
    ) {
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.modelService = this.injector.get(ModelService);
    }
  }

  getSimulationAndJobFilesInfo(): void {
    this.http.get(`${environment.crbm.CRBMAPI_URL}/simulation`)
    .subscribe(
      success => {
        this.simulationData = this.flattenSimulationData(
          success['data']['simulations']
        );
        this.omexFiles = success['data']['omexSolvers']['omex'];
        this.solverFiles = success['data']['omexSolvers']['solver'];
        const sbatches = []
          for (const sbatch of success['data']['files']) {
            sbatches.push(`${sbatch['createdBy']}-${sbatch['filename']}`);
          }
        this.sbatchFiles = sbatches;
        this.fileData = success['data']['files']
        this.simulationDataChangeSubject.next();
      },
      error => {
        this.alertService.openDialog(
          'Error occured in Simulation service: ' +
          JSON.stringify(error)
        );
      }
    );
  }

  createSimulation(
    selectedSbatch: string,
    selectedOmex: string,
    selectedSolver: string
    ) {
    const id = this.getFileId(selectedSbatch);
    return this.http.post(`${environment.crbm.CRBMAPI_URL}/simulation`, {
      omex: selectedOmex,
      solver: selectedSolver,
      fileId: id
    });
  }

  getFileId(selectedSbatch: string) {
    const fileSplitted = selectedSbatch.split('-');
    const user = fileSplitted[0];
    const filename = fileSplitted[1];
    const fileObj = this.fileData.find(
        file => file['createdBy'] === user && file['filename'] === filename
      );
    return fileObj['fileId'];
  }

  flattenSimulationData(simData) {
    const data = [];
    for (const sim of simData) {
      const simObj = { ...sim };
      const jobInfo = sim['jobInfo'];
      for (const key in jobInfo) {
        if (jobInfo.hasOwnProperty(key)) {
          simObj[key] = jobInfo[key];
        }
      }
      data.push(simObj);
    }
    return data;
  }

  get(id: string): Simulation {
    this.getServices();
    return SimulationService._get(id);
  }

  static _get(id: string): Simulation {
    let simulation: Simulation;

    switch (id) {
      case '001':
        simulation = new Simulation(
          '001',
          'First simulation',
          'Simulation of a model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.',
          ['wild type', 'normal'],

          ModelService._get('001'),

          new Format('SED-ML', 'L1V3'),
          [
            new ChangedParameter('p1', 'parameter 1', 2., 1., 'g'),
            new ChangedParameter('p2', 'parameter 2', 3.5, 0.1, 's'),
            new ChangedParameter('p3', 'parameter 3', 1.7, 2.6, 'm^s'),
          ],
          10.,

          new Simulator('VCell', '7.1', 'crbm/vcell:7.1'),

          [
            new JournalReference(['Karr, JR', 'Shaikh, B'], 'Journal', 101, 3, '10-20', 2019),
            new JournalReference(['Skaf, Y', 'Wilson, M'], 'Journal', 101, 3, '10-20', 2019),
          ],
          new Simulation('005', 'Sim-005'),
          UserService._get(2),
          AccessLevel.public,
          SimulationStatus.finished,
          new Date(Date.parse('2019-11-06 00:00:00')),
          new Date(Date.parse('2019-11-06 00:00:00')),
          new Date(Date.parse('2019-11-06 00:00:00')),
          100.,
          'out\n'.repeat(40),
          'err\n'.repeat(40),
        );
        break;

      case '003':
        simulation = new Simulation(
          '003',
          'Third simulation',
          'Simulation of a minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.',
          ['disease', 'cancer'],

          ModelService._get('003'),

          new Format('SED-ML', 'L1V2'),
          [
            new ChangedParameter('p1', 'parameter 1', 2., 1., 'g'),
            new ChangedParameter('p2', 'parameter 2', 3.5, 0.1, 's'),
            new ChangedParameter('p3', 'parameter 3', 1.7, 2.6, 'm^s'),
          ],
          10.,

          new Simulator('VCell', '7.1', 'crbm/vcell:7.1'),

          [],
          null,
          UserService._get(2),
          AccessLevel.private,
          SimulationStatus.queued,
          new Date(Date.parse('2019-11-06 00:00:00')),
          new Date(Date.parse('2019-11-06 00:00:00')),
          new Date(Date.parse('2019-11-06 00:00:00')),
          100.,
          'out\n'.repeat(40),
          null,
        );
        break;
      
      case '006':
        simulation = new Simulation(
          '006',
          'Sixth simulation',
          'Simulation of a mathematical model of the interactions of cdc2 and cyclin.',
          ['disease', 'diabetes'],

          ModelService._get('006'),

          new Format('SED-ML', 'L1V1'),
          [
            new ChangedParameter('p1', 'parameter 1', 2., 1., 'g'),
            new ChangedParameter('p2', 'parameter 2', 3.5, 0.1, 's'),
            new ChangedParameter('p3', 'parameter 3', 1.7, 2.6, 'm^s'),
          ],
          10.,

          new Simulator('VCell', '7.1', 'crbm/vcell:7.1'),

          [],
          null,
          UserService._get(3),
          AccessLevel.public,
          SimulationStatus.failed,
          new Date(Date.parse('2019-11-06 00:00:00')),
          new Date(Date.parse('2019-11-06 00:00:00')),
          new Date(Date.parse('2019-11-06 00:00:00')),
          100.,
          'out\n'.repeat(40),
          'err\n'.repeat(40),
        );
        break;
    }
    simulation.license = 'MIT';
    return simulation;
  }

  list(auth?): Simulation[] {
    const data: Simulation[] = [
      this.get('001'),
      this.get('003'),
      this.get('006'),
    ];
    return data;
  }
}
