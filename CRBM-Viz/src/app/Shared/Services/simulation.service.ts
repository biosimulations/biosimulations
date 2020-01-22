import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { Simulation } from '../Models/simulation';

import { ResourceService } from './resource.service';
import { Serializer } from '../Serializers/serializer';
import { SimulationSerializer } from '../Serializers/simulation-serializer';

@Injectable({
  providedIn: 'root',
})
export class SimulationService extends ResourceService<Simulation> {
  simulationData: object = null;
  fileData: Array<object> = null;
  omexFiles: Array<string> = null;
  solverFiles: Array<string> = null;
  sbatchFiles: Array<string> = null;
  simulationDataChangeSubject = new Subject<null>();

  private userService: UserService;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private injector: Injector
  ) {
    super(http, 'simulations', new SimulationSerializer());
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
    }
  }

  getSimulationAndJobFilesInfo(): void {
    this.http.get(`${environment.crbm.CRBMAPI_URL}/simulation`).subscribe(
      success => {
        this.simulationData = this.flattenSimulationData(
          success['data']['simulations']
        );
        this.omexFiles = success['data']['omexSolvers']['omex'];
        this.solverFiles = success['data']['omexSolvers']['solver'];
        const sbatches = [];
        for (const sbatch of success['data']['files']) {
          sbatches.push(`${sbatch['createdBy']}-${sbatch['filename']}`);
        }
        this.sbatchFiles = sbatches;
        this.fileData = success['data']['files'];
        this.simulationDataChangeSubject.next();
      },
      error => {
        this.alertService.openDialog(
          'Error occured in Simulation service: ' + JSON.stringify(error)
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
      fileId: id,
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

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item =>
        item['name'].toLowerCase().includes(lowCaseName)
      );
    } else {
      return list;
    }
  }

  getHistory(
    id: string,
    includeParents: boolean = true,
    includeChildren: boolean = true
  ): object[] {
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
                ],
              },
            ],
          },
        ],
      },
    ];
  }
}
