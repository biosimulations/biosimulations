import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment }  from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { ModelService } from './model.service';

import { AccessLevel } from '../Enums/access-level';
import { SimulationStatus } from '../Enums/simulation-status';
import { License } from '../Enums/license';
import { ModelParameter } from '../Models/model-parameter';
import { Algorithm } from '../Models/algorithm';
import { AlgorithmParameter } from '../Models/algorithm-parameter';
import { Format } from '../Models/format';
import { JournalReference } from '../Models/journal-reference';
import { OntologyTerm } from '../Models/ontology-term';
import { ParameterChange } from '../Models/parameter-change';
import { Person } from '../Models/person';
import { Simulator } from '../Models/simulator';
import { Simulation } from '../Models/simulation';
import { User } from '../Models/user';

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
  private projectService: ProjectService;
  private modelService: ModelService;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private authService: AuthService,
    private injector: Injector,
    ) {
  }

  static _get(id: string, includeRelatedObjects = false): Simulation {
    let simulation: Simulation;

    switch (id) {
      default:
      case '001':
        simulation = new Simulation();
        simulation.id = id;
        simulation.name = 'First simulation';
        simulation.description = 'Simulation of a model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
        simulation.tags = ['wild type', 'normal'];

        simulation.model = ModelService._get('001');

        simulation.format = new Format('SED-ML', 'L1V3', 3685, 'https://sed-ml.org');
        simulation.modelParameterChanges = [
          new ParameterChange(new ModelParameter('p1', 'parameter 1', 2., 'g'), 1.),
          new ParameterChange(new ModelParameter('p2', 'parameter 2', 3.5, 's'), 0.1),
          new ParameterChange(new ModelParameter('p3', 'parameter 3', 1.7, 'm^s'), 2.6),
        ];

        simulation.simulator = new Simulator('VCell', '7.1', 'crbm/vcell:7.1');

        simulation.parent = new Simulation();
        simulation.parent.id = '005';
        simulation.parent.name = 'Sim-005';

        simulation.refs = [
          new JournalReference('Jonathan R Karr & Bilal Shaikh', 'Title', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Yara Skaf & Mike Wilson', 'Title', 'Journal', 101, 3, '10-20', 2019),
        ];
        simulation.owner = UserService._get('y.skaf');
        simulation.access = AccessLevel.public;
        simulation.status = SimulationStatus.finished;
        simulation.created = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.updated = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.startDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.endDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.wallTime = 100.;
        simulation.outLog = 'out\n'.repeat(40);
        simulation.errLog = 'err\n'.repeat(40);
        break;
      case '002':
        simulation = new Simulation();
        simulation.id = id;
        simulation.name = 'First simulation';
        simulation.description = 'Simulation of a model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
        simulation.tags = ['wild type', 'normal'];

        simulation.model = ModelService._get('002');

        simulation.format = new Format('SED-ML', 'L1V3', 3685, 'https://sed-ml.org');
        simulation.modelParameterChanges = [
          new ParameterChange(new ModelParameter('p1', 'parameter 1', 2., 'g'), 1.),
          new ParameterChange(new ModelParameter('p2', 'parameter 2', 3.5, 's'), 0.1),
          new ParameterChange(new ModelParameter('p3', 'parameter 3', 1.7, 'm^s'), 2.6),
        ];

        simulation.simulator = new Simulator('VCell', '7.1', 'crbm/vcell:7.1');

        simulation.parent = new Simulation();
        simulation.parent.id = '005';
        simulation.parent.name = 'Sim-005';

        simulation.refs = [
          new JournalReference('Jonathan R Karr & Bilal Shaikh', 'Title', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Yara Skaf & Mike Wilson', 'Title', 'Journal', 101, 3, '10-20', 2019),
        ];
        simulation.owner = UserService._get('jonrkarr');
        simulation.access = AccessLevel.private;
        simulation.status = SimulationStatus.finished;
        simulation.created = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.updated = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.startDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.endDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.wallTime = 100.;
        simulation.outLog = 'out\n'.repeat(40);
        simulation.errLog = 'err\n'.repeat(40);
        break;

      case '003':
        simulation = new Simulation();
        simulation.id = '003';
        simulation.name = 'Third simulation';
        simulation.description = 'Simulation of a minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.';
        simulation.tags = ['disease', 'cancer'];

        simulation.model = ModelService._get('003');

        simulation.format = new Format('SED-ML', 'L1V2', 3685, 'https://sed-ml.org');
        simulation.modelParameterChanges = [
          new ParameterChange(new ModelParameter('p1', 'parameter 1', 2., 'g'), 1.),
          new ParameterChange(new ModelParameter('p2', 'parameter 2', 3.5, 's'), 0.1),
          new ParameterChange(new ModelParameter('p3', 'parameter 3', 1.7, 'm^s'), 2.6),
        ];

        simulation.simulator = new Simulator('VCell', '7.1', 'crbm/vcell:7.1');

        simulation.parent = null;
        simulation.refs = [];
        simulation.owner = UserService._get('y.skaf');
        simulation.access = AccessLevel.private;
        simulation.status = SimulationStatus.queued;
        simulation.created = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.updated = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.startDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.endDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.wallTime = 100.;
        simulation.outLog = 'out\n'.repeat(40);
        simulation.errLog = null;
        break;

      case '006':
        simulation = new Simulation();
        simulation.id = '006';
        simulation.name = 'Sixth simulation';
        simulation.description = 'Simulation of a mathematical model of the interactions of cdc2 and cyclin.';
        simulation.tags = ['disease', 'diabetes'];

        simulation.model = ModelService._get('006');

        simulation.format = new Format('SED-ML', 'L1V1', 3685, 'https://sed-ml.org');
        simulation.modelParameterChanges = [
          new ParameterChange(new ModelParameter('p1', 'parameter 1', 2., 'g'), 1.),
          new ParameterChange(new ModelParameter('p2', 'parameter 2', 3.5, 's'), 0.1),
          new ParameterChange(new ModelParameter('p3', 'parameter 3', 1.7, 'm^s'), 2.6),
        ];
        simulation.simulator = new Simulator('VCell', '7.1', 'crbm/vcell:7.1');

        simulation.parent = null;
        simulation.refs = [];
        simulation.owner = UserService._get('b.shaikh');
        simulation.access = AccessLevel.public;
        simulation.status = SimulationStatus.failed;
        simulation.created = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.updated = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.startDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.endDate = new Date(Date.parse('2019-11-06 00:00:00'));
        simulation.wallTime = 100.;
        simulation.outLog = 'out\n'.repeat(40);
        simulation.errLog = 'err\n'.repeat(40);
        break;
    }
    simulation.startTime = 0.;
    simulation.endTime = 10.;
    simulation.length = 10.;
    simulation.numTimePoints = 360;
    simulation.algorithm = new Algorithm('0000064', 'Runge-Kutta based method');
    simulation.algorithm.parameters = [
      new AlgorithmParameter('seed', 'random number generator seed', 1, 488),
      new AlgorithmParameter('atol', 'absolute tolerance', 1e-6, 211),
      new AlgorithmParameter('rtol', 'relative tolerance', 1e-6, 209),
    ];
    simulation.algorithmParameterChanges = [
      new ParameterChange(new AlgorithmParameter('seed', 'random number generator seed', 1, 488), 2),
      new ParameterChange(new AlgorithmParameter('atol', 'absolute tolerance', 1e-6, 211), 2e-6),
      new ParameterChange(new AlgorithmParameter('rtol', 'relative tolerance', 1e-6, 209), 2e-6),
    ];
    simulation.license = License.cc0;
    simulation.authors = [
      UserService._get('s.edelstein'),
      new Person('John', 'C', 'Doe'),
      new Person('Jane', 'D', 'Doe'),
    ];
    if (includeRelatedObjects) {
      simulation.projects = [
        ProjectService._get('001'),
        ProjectService._get('003'),
        ProjectService._get('006'),
      ];
    }
    return simulation;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.projectService = this.injector.get(ProjectService);
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
    return SimulationService._get(id, true);
  }

  list(name?: string): Simulation[] {
    const data: Simulation[] = [
      this.get('001'),
      this.get('002'),
      this.get('003'),
      this.get('006'),
    ];
    return this.filter(data, name) as Simulation[];
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item => item['name'].toLowerCase().includes(lowCaseName));
    } else {
      return list;
    }
  }

  getHistory(id: string, includeParents: boolean = true, includeChildren: boolean = true): object[] {
    // tslint:disable:max-line-length
    return [
      {
        id: '003',
        name: 'Grandparent',
        route: ['/simulations', '003'],
        isExpanded: true,
        children: [
          {
            id: '002',
            name: 'Parent',
            route: ['/simulations', '006'],
            isExpanded: true,
            children: [
              {
                id: '001',
                name: 'This simulation',
                route: ['/simulations', '001'],
                isExpanded: true,
                children: [
                  {
                    id: '004',
                    name: 'Child-1',
                    route: ['/simulations', '004'],
                    children: [
                      {
                        id: '005',
                        name: 'Grandchild-1-1',
                        route: ['/simulations', '005'],
                        children: [],
                      },
                      {
                        id: '006',
                        name: 'Grandchild-1-2',
                        route: ['/simulations', '006'],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: '007',
                    name: 'Child-2',
                    route: ['/simulations', '007'],
                    children: [
                      {
                        id: '008',
                        name: 'Grandchild-2-1',
                        route: ['/simulations', '008'],
                        children: [],
                      },
                      {
                        id: '009',
                        name: 'Grandchild-2-2',
                        route: ['/simulations', '009'],
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: '010',
                name: 'Sibling',
                route: ['/simulations', '010'],
                children: [
                  {
                    id: '011',
                    name: 'Nephew',
                    route: ['/simulations', '011'],
                    children: [],
                  },
                  {
                    id: '012',
                    name: 'Niece',
                    route: ['/simulations', '012'],
                    children: [],
                  },
                ]
              },
            ],
          },
        ],
      },
    ];
  }

  set(data:Simulation, id?: string): string {
    if (!id) {
      id = '007';
    }

    data.id = id;
    data.format = new Format('SED-ML', 'L1V3', 3685, 'https://sed-ml.org');
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: string): void {}
}
