import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment }  from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';

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

  // Variables used to store new simulation data
  combineArchiveSelected = null;
  combineArchiveParsed = null;

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

  parseCombineArchive(archiveInfo) {
    this.combineArchiveSelected = archiveInfo;
    const params = `?omex=${archiveInfo['filename']}&author=${archiveInfo['createdBy']}`;
    const url = `${environment.crbm.CRBMAPI_URL}/simulate${params}`;
    this.http.get(url).subscribe(
      success => {
        this.combineArchiveParsed = success;
      },
      error => {
        this.alertService.openDialog('Error occured' + JSON.stringify(error));
      }
    );
  }
}
