import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { VisualisationService } from '../../../services/visualisation/visualisation.service';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { Simulation } from '../../../datamodel';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  uuid = '';
  name = '';
  simulator = '';
  simulatorVersion = '';
  simulatorUrl = '';
  statusRunning = false;
  statusSucceeded = false;
  statusLabel = '';
  submitted = '';
  updated = '';
  runtime = '';
  projectUrl = '';
  projectSize = '';
  resultsUrl = '';
  resultsSize = '';
  sedmls!: Array<string>;
  reports!: Array<string>;
  outLog = ''
  errLog = ''

  formGroup: FormGroup;

  sedmlError!: string;
  reportError!: string;

  projectStructure!: any;

  selectedSedml!: string;
  selectedReport!: string;

  @ViewChild('visualization') visualization!: VisualisationComponent;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private simulationService: SimulationService,
    private visualisationService: VisualisationService,
    private dispatchService: DispatchService
  ) {
    this.formGroup = formBuilder.group({
      sedml: ['', [Validators.required]],
      report: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    
    this.setSimulationInfo();

    this.dispatchService.getSimulationLogs(this.uuid)
      .subscribe((data: any) => {
        if (data.data === undefined) {
          // TODO: should this be interpreted as an error message?
          this.outLog = data.message;
          this.errLog = '';
        } else {
          this.outLog = data.data.output;
          this.errLog = data.data.error;

        }
      });

    this.visualisationService
      .getResultStructure(this.uuid)
      .subscribe((data: any) => {
        if (data != null) {
          this.setProjectResults(data);
        }
      });
  }

  private setSimulationInfo(): void {
    this.simulationService.getSimulationByUuid(this.uuid).subscribe((simulation: Simulation): void => {
      this.name = simulation.name;
      this.simulator = simulation.simulator;
      this.simulatorVersion = simulation.simulatorVersion;
      this.statusRunning = SimulationStatusService.isSimulationStatusRunning(simulation.status);
      this.statusSucceeded = SimulationStatusService.isSimulationStatusSucceeded(simulation.status);
      this.statusLabel = SimulationStatusService.getSimulationStatusMessage(simulation.status, true);
      this.runtime = simulation.runtime !== undefined ? Math.round((simulation.runtime)/1000).toString() + ' s' : 'N/A';
      this.submitted = new Date(simulation.submitted).toLocaleString();
      this.updated = new Date(simulation.updated).toLocaleString();
      this.projectSize = simulation.projectSize !== undefined ? ((simulation.projectSize) / 1024).toFixed(2) + ' KB' : '';
      this.resultsSize = simulation.resultsSize !== undefined ? (simulation.resultsSize / 1024).toFixed(2) + ' KB' : 'N/A';
      this.projectUrl = `${urls.dispatchApi}run/${simulation.id}/download`;
      this.simulatorUrl = `${this.config.simulatorsAppUrl}simulators/${simulation.simulator}/${simulation.simulatorVersion}`;
      this.resultsUrl = `${urls.dispatchApi}download/result/${simulation.id}`;
    });
  }

  private setProjectResults(data: any): void {
    if(data.message === 'OK') {
      const projectStructure = data.data;
      this.projectStructure = projectStructure;

      this.sedmls = Object.keys(projectStructure);
      this.selectedSedml = this.sedmls[0];

      this.setSedml();
    }
    // const sedml = this.sedmls[0];
    // this.formGroup.controls.sedml.setValue(sedml);
  }

  setSedml(): void {
    // const sedml = this.formGroup.value.sedml;
    // this.reports = Object.keys(this.projectResults[sedml]);
    this.reports = this.projectStructure[this.selectedSedml];
    this.selectedReport = this.reports[0];
    // const report = this.reports[0];
    // this.formGroup.controls.report.setValue(report);
    this.setReport();
  }

  setReport(): void {
    // const sedml = this.formGroup.value.sedml;
    // const report = this.formGroup.value.report;
    // const reportResults = this.projectResults[sedml][report];

    this.visualisationService
      .getVisualisation(this.uuid, this.selectedSedml, this.selectedReport)
      .subscribe((data: any) => {
        this.visualisationService.updateDataEvent.next({
          report: this.selectedReport,
          data: data['data'],
        });
      });
  }

  selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == 3) {
      this.visualization.setLayout();
    }
  }
}
