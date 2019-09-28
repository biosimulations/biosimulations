import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from 'src/app/crbm-config';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getOmexAndSolver()
      .subscribe(
        success => {
          console.log('Fetching of Omex and solver successful', success);
          this.omexFiles = success['data']['omexSolvers']['omex'];
          this.solverFiles = success['data']['omexSolvers']['solver']
          const sbatches = []
          for (const sbatch of success['data']['files']) {
            sbatches.push(`${sbatch['createdBy']} - ${sbatch['filename']}`);
          }
          this.sbatchFiles = sbatches;
        },
        error => {

        }
      );
  }

  getOmexAndSolver() {
    return this.http.get(`${CrbmConfig.CRBMAPI_URL}/simulation`);
  }

  convert

}
