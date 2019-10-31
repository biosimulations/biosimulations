import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/Shared/Services/alert.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';

@Component({
  selector: 'app-new-simulation',
  templateUrl: './new-simulation.component.html',
  styleUrls: ['./new-simulation.component.sass'],
})
export class NewSimulationComponent implements OnInit {
  selectedSbatch: string = null;
  selectedOmex: string = null;
  selectedSolver: string = null;
  omexFiles: Array<string> = null;
  solverFiles: Array<string> = null;
  sbatchFiles: Array<string> = null;

  constructor(
    private alertService: AlertService,
    private simulationService: SimulationService
  ) {}

  ngOnInit() {
    this.simulationService.simulationDataChangeSubject.subscribe(
      success => {
        this.omexFiles = this.simulationService.omexFiles;
        this.solverFiles = this.simulationService.solverFiles;
        this.sbatchFiles = this.simulationService.sbatchFiles;
      },
      error => {
        this.alertService.openDialog(
          'Error occured in new simulation component, while getting omexsolvers: ' +
            JSON.stringify(error)
        );
      }
    );
  }

  onSubmit() {
    this.simulationService.createSimulation(
      this.selectedSbatch,
      this.selectedOmex,
      this.selectedSolver
    ).subscribe(
      success => {
        this.alertService.openDialog(
          'Simulatin created: ' + 
          JSON.stringify(success)
        );
        this.simulationService.getSimulationAndJobFilesInfo();
      },
      error => {
        this.alertService.openDialog(
          'Error occured while creating simulation: ' +
          JSON.stringify(error)
        );
      }
    );
  }
}
