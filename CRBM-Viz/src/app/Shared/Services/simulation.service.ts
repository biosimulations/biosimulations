import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment }  from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';

import { AccessLevel } from '../Enums/access-level'
import { SimulationStatus } from '../Enums/simulation-status'
import { ChangedParameter } from '../Models/changed-parameter'
import { Format } from '../Models/format'
import { Identifier } from '../Models/identifier'
import { Model } from '../Models/model'
import { Simulator } from '../Models/simulator'
import { Simulation } from '../Models/simulation'
import { Taxon } from '../Models/taxon'
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

  constructor(
    private http: HttpClient,
    private alertService: AlertService
    ) { }

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

  getSimulation(id: string): Simulation {
    if (id === '001') {
      return new Simulation(
        '001',
        'First simulation',
        ['wild type', 'normal'],
        new Model(
          '001',
          'EPSP ACh event',
          ['neurotransmission', 'signaling'],
          new Taxon(7787, 'Tetronarce californica'),
          new Format('SBML', 'L2V4'),
          [
            new Identifier('biomodels', 'BIOMD0000000001'),
            new Identifier('doi', '10.1007/s004220050302'),
            new Identifier('pubmed', '8983160'),
          ],
          new User(4, 'S', 'Edelstein'),
          new Date(Date.parse('1996-11-01 00:00:00')),
        ),

        new Format('SED-ML', 'L1V3'),
        [],
        10.,

        new Simulator('VCell', '7.1', 'crbm/vcell:7.1'),

        new User(1, 'Yara', 'Skaf'),
        AccessLevel.public,
        SimulationStatus.finished,
        new Date(Date.parse('2019-11-06 00:00:00')),
        new Date(Date.parse('2019-11-06 00:00:00')),
        new Date(Date.parse('2019-11-06 00:00:00')),
        100.,
        'out',
        'err',
      );
    }

    if (id === '003') {
      return new Simulation(
        '003',
        'Third simulation',
        ['disease', 'cancer'],

        new Model(
          '003',
          'Min Mit Oscil',
          ['cell cycle', 'mitosis'],
          new Taxon(8292, 'Xenopus laevis'),
          new Format('SBML', 'L2V4'),
          [
            new Identifier('biomodels', 'BIOMD0000000003'),
            new Identifier('doi', '10.1073/pnas.88.20.9107'),
            new Identifier('pubmed', '1833774'),
          ],
          new User(5, 'A', 'Goldbeter'),
          new Date(Date.parse('1991-10-15 00:00:00')),
        ),

        new Format('SED-ML', 'L1V2'),
        [],
        10.,

        new Simulator('VCell', '7.1', 'crbm/vcell:7.1'),

        new User(1, 'Yara', 'Skaf'),
        AccessLevel.private,
        SimulationStatus.queued,
        new Date(Date.parse('2019-11-06 00:00:00')),
        new Date(Date.parse('2019-11-06 00:00:00')),
        new Date(Date.parse('2019-11-06 00:00:00')),
        100.,
        'out',
        'err',
      );
    }

    if (id === '006') {
      return new Simulation(
        '006',
        'Sixth simulation',
        ['disease', 'diabetes'],

        new Model(
          '006',
          'Cell Cycle 6 var',
          ['cell cycle'],
          new Taxon(33154, 'Homo sapiens'),
          new Format('SBML', 'L2V4'),
          [
            new Identifier('biomodels', 'BIOMD0000000006'),
            new Identifier('doi', '10.1186/1752-0509-4-92'),
            new Identifier('pubmed', '20587024'),
          ],
          new User(5, 'J', 'Tyson'),
          new Date(Date.parse('1991-08-15 00:00:00')),
        ),

        new Format('SED-ML', 'L1V1'),
        [],
        10.,

        new Simulator('VCell', '7.1', 'crbm/vcell:7.1'),

        new User(1, 'Bilal', 'Shaikh'),
        AccessLevel.public,
        SimulationStatus.failed,
        new Date(Date.parse('2019-11-06 00:00:00')),
        new Date(Date.parse('2019-11-06 00:00:00')),
        new Date(Date.parse('2019-11-06 00:00:00')),
        100.,
        'out',
        'err',
      );
    }
  }

  getSimulations(auth?): Simulation[] {
    const data: Simulation[] = [
      this.getSimulation('001'),
      this.getSimulation('003'),
      this.getSimulation('006'),
    ];
    return data;
  }
}
