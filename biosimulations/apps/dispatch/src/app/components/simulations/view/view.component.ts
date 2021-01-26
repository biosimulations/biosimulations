import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { VisualizationService } from '../../../services/visualization/visualization.service';
import {
  VisualizationComponent,
  AxisType,
  ScatterTraceMode,
  ScatterTrace,
  DataLayout,
} from './visualization/visualization.component';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { Simulation, TaskMap } from '../../../datamodel';
import { SimulationLogs } from '../../../simulation-logs-datamodel';

import { ConfigService } from '@biosimulations/shared/services';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  concatAll,
  map,
  shareReplay,
} from 'rxjs/operators';
import {
  AxisLabelType,
  AXIS_LABEL_TYPES,
  CombineArchive,
  DataSetIdDisabled,
  FormattedSimulation,
  Report,
  ScatterTraceModeLabel,
  SCATTER_TRACE_MODEL_LABELS,
} from './view.model';
import { ViewService } from './view.service';
@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  //this seems to be required oddly
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit, OnDestroy {
  // Refactored Variables Start
  private uuid = '';
  logs$!: Observable<SimulationLogs | null>;
  statusRunning$!: Observable<boolean>;
  statusSuceeded$!: Observable<boolean>;
  formattedSimulation$?: Observable<FormattedSimulation>;
  Simulation$!: Observable<Simulation>;
  results$!: Observable<TaskMap | undefined>;
  subs: Subscription[] = [];

  // Form Controller Values
  sedmlLocationForm$!: Observable<any>;
  reportdIdForm$!: Observable<any>;
  xDataSetIdForm$!: Observable<any>;
  yDataSetIdsForm$!: Observable<any>;
  // Refactored Variables End

  formGroup: FormGroup;
  private combineArchive: CombineArchive | undefined;

  private sedmlLocations = new BehaviorSubject<string[] | undefined>(undefined);
  sedmlLocations$ = this.sedmlLocations.asObservable();

  private reportIds = new BehaviorSubject<string[] | undefined>(undefined);
  reportIds$ = this.reportIds.asObservable();

  private selectedSedmlLocation: string | undefined;

  private dataSets: Report = {};
  private dataSetIdDisableds = new BehaviorSubject<DataSetIdDisabled[]>([]);
  dataSetIdDisableds$ = this.dataSetIdDisableds.asObservable();

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  scatterTraceModeLabels: ScatterTraceModeLabel[] = SCATTER_TRACE_MODEL_LABELS;

  private vizDataLayout = new BehaviorSubject<DataLayout | undefined>(
    undefined,
  );
  vizDataLayout$ = this.vizDataLayout.asObservable();

  @ViewChild('visualization') visualization!: VisualizationComponent;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private service: ViewService,
    private formBuilder: FormBuilder,
    private simulationService: SimulationService,
    private appService: VisualizationService,
    private dispatchService: DispatchService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.formGroup = formBuilder.group({
      sedmlLocation: [undefined, [Validators.required]],
      reportId: [undefined, [Validators.required]],
      xDataSetId: [undefined, [Validators.required]],
      yDataSetIds: [[], [Validators.required]],
      xAxisType: [AxisType.linear, [Validators.required]],
      yAxisType: [AxisType.linear, [Validators.required]],
      scatterTraceMode: [ScatterTraceMode.lines, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

    this.formGroup.controls.sedmlLocation.disable();
    this.formGroup.controls.reportId.disable();
    this.formGroup.controls.xDataSetId.disable();
    this.formGroup.controls.yDataSetIds.disable();

    this.sedmlLocationForm$ = this.formGroup.controls.sedmlLocation.valueChanges;
    this.reportdIdForm$ = this.formGroup.controls.reportId.valueChanges;
    this.xDataSetIdForm$ = this.formGroup.controls.xDataSetId.valueChanges;
    this.yDataSetIdsForm$ = this.formGroup.controls.yDataSetIds.valueChanges;

    this.Simulation$ = this.simulationService
      .getSimulation(this.uuid)
      .pipe(shareReplay(1));
    this.formattedSimulation$ = this.Simulation$.pipe(
      map<Simulation, FormattedSimulation>(this.service.formatSimulation),
    );
    this.statusRunning$ = this.formattedSimulation$.pipe(
      map((value) =>
        SimulationStatusService.isSimulationStatusRunning(value.status),
      ),
    );
    this.statusSuceeded$ = this.formattedSimulation$.pipe(
      map((value) =>
        SimulationStatusService.isSimulationStatusSucceeded(value.status),
      ),
    );
    this.logs$ = this.statusRunning$.pipe(
      map((running) =>
        running ? of(null) : this.dispatchService.getSimulationLogs(this.uuid),
      ),
      concatAll(),
    );
    this.results$ = this.statusSuceeded$.pipe(
      map((succeeded) =>
        succeeded
          ? this.appService.getResultStructure(this.uuid)
          : of(undefined),
      ),
      concatAll(),
    );

    // TODO Refactor
    const statusSub = this.statusSuceeded$.subscribe((suceeded) => {
      if (suceeded) {
        const resultsub = this.appService
          .getResultStructure(this.uuid)
          .subscribe((response) => {
            this.setProjectOutputs(response as CombineArchive);
          });
        this.subs.push(resultsub);
      }
    });
    this.subs.push(statusSub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

  private setProjectOutputs(combineArchive: CombineArchive): void {
    this.combineArchive = combineArchive;

    const sedmlLocations = Object.keys(combineArchive);
    this.sedmlLocations.next(sedmlLocations);
    if (sedmlLocations?.length) {
      this.formGroup.controls.sedmlLocation.enable();
    } else {
      this.formGroup.controls.sedmlLocation.disable();
    }

    const selectedSedmlLocation = sedmlLocations?.[0];
    this.formGroup.controls.sedmlLocation.setValue(selectedSedmlLocation);
    this.selectSedmlLocation(selectedSedmlLocation);
  }

  selectSedmlLocation(selectedSedmlLocation?: string): void {
    this.selectedSedmlLocation = selectedSedmlLocation;

    const reportIds =
      this.combineArchive && selectedSedmlLocation
        ? this.combineArchive[selectedSedmlLocation]
        : undefined;
    this.reportIds.next(reportIds);
    if (reportIds?.length) {
      this.formGroup.controls.reportId.enable();
    } else {
      this.formGroup.controls.reportId.disable();
    }

    const selectedReportId = reportIds?.[0];
    this.formGroup.controls.reportId.setValue(selectedReportId);
    this.selectReportId(selectedReportId);
  }

  selectReportId(selectedReportId?: string): void {
    this.formGroup.controls.xDataSetId.disable();
    this.formGroup.controls.yDataSetIds.disable();
    this.formGroup.controls.xDataSetId.setValue(undefined);
    this.formGroup.controls.yDataSetIds.setValue([]);
    this.buildVizData();

    if (this.selectedSedmlLocation && selectedReportId) {
      this.appService
        .getReport(this.uuid, this.selectedSedmlLocation, selectedReportId)
        .subscribe((data: any) => this.setDataSets({ data }));
    }
  }

  private setDataSets(data: any): void {
    const dataSets: Report = {};
    const dataSetIdDisabledMap: { [id: string]: boolean } = {};

    Object.keys(data.data).forEach((element): void => {
      dataSetIdDisabledMap[element] = !(
        data.data[element].length > 0 &&
        ['boolean', 'number'].includes(typeof data.data[element][0])
      );

      dataSets[element] = data.data[element];
    });

    this.dataSets = dataSets;
    const dataSetIdDisabledArr = Object.keys(dataSetIdDisabledMap)
      //.sort()
      .map(
        (id: string): DataSetIdDisabled => {
          return { id, disabled: dataSetIdDisabledMap[id] };
        },
      );
    this.dataSetIdDisableds.next(dataSetIdDisabledArr);

    let xDataSetId: string | undefined = undefined;
    let yDataSetIds: string[] = [];

    if (dataSetIdDisabledArr.length > 0) {
      xDataSetId = dataSetIdDisabledArr[0].id;
      if (dataSetIdDisabledArr.length > 1) {
        yDataSetIds = [dataSetIdDisabledArr[1].id];
      }

      this.formGroup.controls.xDataSetId.enable();
      this.formGroup.controls.yDataSetIds.enable();
    } else {
      this.formGroup.controls.xDataSetId.disable();
      this.formGroup.controls.yDataSetIds.disable();
    }

    this.formGroup.controls.xDataSetId.setValue(xDataSetId);
    this.formGroup.controls.yDataSetIds.setValue(yDataSetIds);
    this.buildVizData();
  }

  buildVizData(): void {
    const xDataSetId: string | undefined = this.formGroup.controls['xDataSetId']
      .value;
    const yDataSetIds: string[] = this.formGroup.controls['yDataSetIds'].value;

    if (xDataSetId && yDataSetIds.length > 0) {
      const xAxisTitle = xDataSetId;
      const xData = this.dataSets[xDataSetId];

      let yAxisTitle: string | undefined = undefined;
      let showlegend = false;
      if (yDataSetIds.length === 1) {
        yAxisTitle = yDataSetIds[0];
        showlegend = false;
      } else {
        yAxisTitle = undefined;
        showlegend = true;
      }

      this.vizDataLayout.next({
        data: yDataSetIds.map(
          (yDataSetId: string): ScatterTrace => {
            const yData = this.dataSets[yDataSetId];
            return {
              name: yDataSetId,
              x: xData,
              y: yData,
              mode: this.formGroup.controls['scatterTraceMode'].value,
            };
          },
        ),
        layout: {
          xaxis: {
            title: xAxisTitle,
            type: this.formGroup.controls['xAxisType'].value,
          },
          yaxis: {
            title: yAxisTitle,
            type: this.formGroup.controls['yAxisType'].value,
          },
          showlegend: showlegend,
          width: undefined,
          height: undefined,
        },
      });
    } else {
      this.vizDataLayout.next(undefined);
    }

    setTimeout(() => this.changeDetectorRef.detectChanges());
  }

  selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == 2) {
      this.visualization.setLayout();
      this.changeDetectorRef.detectChanges();
    }
  }
}
