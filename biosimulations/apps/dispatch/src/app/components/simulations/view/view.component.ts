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

interface VizApiResponse {
  message: string;
  data: CombineArchive;
}

interface CombineArchive {
  [id: string]: string[];
}

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

  outLog = '';
  errLog = '';

  formGroup: FormGroup;
  combineArchive?: CombineArchive;
  sedmlLocations?: string[];
  selectedSedmlLocation?: string;
  reportIds?: string[];
  selectedReportId?: string;

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
      sedmlLocation: ['', [Validators.required]],
      reportId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

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

      this.combineArchive = undefined;
      this.sedmlLocations = undefined;
      this.selectedSedmlLocation = undefined;
      this.reportIds = undefined;
      this.selectedReportId = undefined;
      this.formGroup.controls.sedmlLocation.disable();
      this.formGroup.controls.reportId.disable();

      if (!this.statusRunning) {
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
      }

      if (this.statusSucceeded) {
        this.visualisationService
          .getResultStructure(this.uuid)
          .subscribe((response: any): void => {
            if (response != null && response.message === 'OK') {
              this.setProjectOutputs(response.data as CombineArchive);
            }
          });
      }
    });
  }

  private setProjectOutputs(combineArchive: CombineArchive): void {
    this.combineArchive = combineArchive;

    this.sedmlLocations = Object.keys(combineArchive);
    if (this.sedmlLocations?.length) {
      this.formGroup.controls.sedmlLocation.enable();
    } else {
      this.formGroup.controls.sedmlLocation.disable();
    }

    const selectedSedmlLocation = this.sedmlLocations?.[0];
    this.formGroup.controls.sedmlLocation.setValue(selectedSedmlLocation);
    this.selectSedmlLocation(selectedSedmlLocation);
  }

  selectSedmlLocation(selectedSedmlLocation?: string): void {
    this.selectedSedmlLocation = selectedSedmlLocation;

    this.reportIds = this.combineArchive && selectedSedmlLocation ? this.combineArchive[selectedSedmlLocation] : undefined;
    if (this.reportIds?.length) {
      this.formGroup.controls.reportId.enable();
    } else {
      this.formGroup.controls.reportId.disable();
    }

    const selectedReportId = this.reportIds?.[0];
    this.formGroup.controls.reportId.setValue(selectedReportId);
    this.selectReportId(selectedReportId);
  }

  selectReportId(selectedReportId?: string): void {
    this.selectedReportId = selectedReportId;

    this.visualisationService.updateDataEvent.next(undefined);

    if (this.selectedSedmlLocation && selectedReportId) {
      this.visualisationService
        .getVisualisation(this.uuid, this.selectedSedmlLocation, selectedReportId)
        .subscribe((data: any) => {
          this.visualisationService.updateDataEvent.next({
            report: selectedReportId,
            data: data.data,
          });
        });
    }
  }

  selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == 3) {
      this.visualization.setLayout();
    }
  }
}
