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
import { BehaviorSubject } from 'rxjs';

interface FormattedSimulation {
  id: string;
  name: string;
  simulator: string;
  simulatorVersion: string;
  simulatorUrl: string;
  statusRunning: boolean;
  statusSucceeded: boolean;
  statusLabel: string;
  submitted: string;
  updated: string;
  runtime: string;
  projectUrl: string;
  projectSize: string;
  resultsUrl: string;
  resultsSize: string;
}

interface VizApiResponse {
  message: string;
  data: CombineArchive;
}

interface CombineArchive {
  [id: string]: string[];
}

interface Logs {
  out: string;
  err: string;
}

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  private uuid = '';
  
  private formattedSimulation = new BehaviorSubject<FormattedSimulation | undefined>(undefined);
  formattedSimulation$ = this.formattedSimulation.asObservable();  

  private statusRunning = new BehaviorSubject<boolean>(true);
  statusRunning$ = this.statusRunning.asObservable();

  private logs = new BehaviorSubject<Logs>({out: '', err: ''});
  logs$ = this.logs.asObservable();

  formGroup: FormGroup;
  private combineArchive: CombineArchive | undefined;
  
  private _sedmlLocations: string[] | undefined;
  private sedmlLocations = new BehaviorSubject<string[] | undefined>(undefined);
  sedmlLocations$ = this.sedmlLocations.asObservable()
  
  private _reportIds: string[] | undefined;
  private reportIds = new BehaviorSubject<string[] | undefined>(undefined);
  reportIds$ = this.reportIds.asObservable();

  private selectedSedmlLocation: string | undefined;  
  
  private _selectedReportId: string | undefined;
  private selectedReportId = new BehaviorSubject<string | undefined>(undefined);
  selectedReportId$ = this.selectedReportId.asObservable()

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
      const statusRunning = SimulationStatusService.isSimulationStatusRunning(simulation.status);
      const statusSucceeded = SimulationStatusService.isSimulationStatusSucceeded(simulation.status);
      this.formattedSimulation.next({
        id: simulation.id,
        name: simulation.name,
        simulator: simulation.simulator,
        simulatorVersion: simulation.simulatorVersion,
        statusRunning: statusRunning,
        statusSucceeded: statusSucceeded,
        statusLabel: SimulationStatusService.getSimulationStatusMessage(simulation.status, true),
        runtime: simulation.runtime !== undefined ? Math.round((simulation.runtime)/1000).toString() + ' s' : 'N/A',
        submitted: new Date(simulation.submitted).toLocaleString(),
        updated: new Date(simulation.updated).toLocaleString(),
        projectSize: simulation.projectSize !== undefined ? ((simulation.projectSize) / 1024).toFixed(2) + ' KB' : '',
        resultsSize: simulation.resultsSize !== undefined ? (simulation.resultsSize / 1024).toFixed(2) + ' KB' : 'N/A',
        projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
        simulatorUrl: `${this.config.simulatorsAppUrl}simulators/${simulation.simulator}/${simulation.simulatorVersion}`,
        resultsUrl: `${urls.dispatchApi}download/result/${simulation.id}`,
      });
      this.statusRunning.next(statusRunning);

      this.combineArchive = undefined;
      this._sedmlLocations = undefined;
      this.sedmlLocations.next(this._sedmlLocations);
      this.selectedSedmlLocation = undefined;
      this._reportIds = undefined;
      this.reportIds.next(this._reportIds);
      this._selectedReportId = undefined;
      this.selectedReportId.next(this._selectedReportId);
      this.formGroup.controls.sedmlLocation.disable();
      this.formGroup.controls.reportId.disable();

      if (!statusRunning) {
        this.dispatchService.getSimulationLogs(this.uuid)
          .subscribe((data: any) => {
            if (data.data === undefined) {
              // TODO: should this be interpreted as an error message?
              this.logs.next({
                out: data.message,
                err: '',
              });
            } else {
              this.logs.next({
                out: data.data.output,
                err: data.data.error,
              });
            }
          });
      }

      if (statusSucceeded) {
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

    this._sedmlLocations = Object.keys(combineArchive);
    this.sedmlLocations.next(this._sedmlLocations);
    if (this._sedmlLocations?.length) {
      this.formGroup.controls.sedmlLocation.enable();
    } else {
      this.formGroup.controls.sedmlLocation.disable();
    }

    const selectedSedmlLocation = this._sedmlLocations?.[0];
    this.formGroup.controls.sedmlLocation.setValue(selectedSedmlLocation);
    this.selectSedmlLocation(selectedSedmlLocation);
  }

  selectSedmlLocation(selectedSedmlLocation?: string): void {
    this.selectedSedmlLocation = selectedSedmlLocation;

    this._reportIds = this.combineArchive && selectedSedmlLocation ? this.combineArchive[selectedSedmlLocation] : undefined;
    this.reportIds.next(this._reportIds);
    if (this._reportIds?.length) {
      this.formGroup.controls.reportId.enable();
    } else {
      this.formGroup.controls.reportId.disable();
    }

    const selectedReportId = this._reportIds?.[0];
    this.formGroup.controls.reportId.setValue(selectedReportId);
    this.selectReportId(selectedReportId);
  }

  selectReportId(selectedReportId?: string): void {
    this._selectedReportId = selectedReportId;
    this.selectedReportId.next(this._selectedReportId);

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
