import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from 'src/app/crbm-config';
import { AlertService } from 'src/app/Services/alert.service';

@Component({
  selector: 'app-new-simulation',
  templateUrl: './new-simulation.component.html',
  styleUrls: ['./new-simulation.component.sass']
})
export class NewSimulationComponent implements OnInit {

  selectedSbatch: string = null;
  selectedOmex: string = null;
  selectedSolver: string = null;
  omexFiles: Array<string> = null;
  solverFiles: Array<string> = null;
  sbatchFiles: Array<string> = null;
  responseData: object = null;

  constructor(private http: HttpClient, private alertService: AlertService) { }

  ngOnInit() {
    this.getFileInfo()
      .subscribe(
        success => {
          console.log('Fetching of Omex and solver successful', success);
          this.omexFiles = success['data']['omexSolvers']['omex'];
          this.solverFiles = success['data']['omexSolvers']['solver']
          const sbatches = []
          for (const sbatch of success['data']['files']) {
            sbatches.push(`${sbatch['createdBy']}-${sbatch['filename']}`);
          }
          this.sbatchFiles = sbatches;
          this.responseData = success['data'];
        },
        error => {
          this.alertService.openDialog('Error occured while fetching file info');
        }
      );
  }

  getFileInfo() {
    return this.http.get(`${CrbmConfig.CRBMAPI_URL}/simulation`);
  }


  createSimulation(){
    const id = this.getFileId();
    this.http.post(`${CrbmConfig.CRBMAPI_URL}/simulation`, {
      omex: this.selectedOmex,
      solver: this.selectedSolver,
      fileId: id
    }).subscribe(
      success => {
          this.alertService.openDialog('Simulation creation was successfull (Not catching HPC errors)');
      },
      error => {
          this.alertService.openDialog('Simulation creation failed');
      }
    );
  }

  getFileId() {
    const fileSplitted = this.selectedSbatch.split('-');
    const user = fileSplitted[0];
    const filename = fileSplitted[1];
    const fileObj = this.responseData['files'].find(
        file => file.createdBy === user && file.filename === filename
      );
    return fileObj['fileId'];
  }



}
