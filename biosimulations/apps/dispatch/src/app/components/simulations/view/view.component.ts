import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { VisualizationService } from '../../../services/visualization/visualization.service';
import {
  PlotlyVisualizationComponent,
  AxisType,
  ScatterTraceMode,
  ScatterTrace,
  DataLayout,
} from './plotly-visualization/plotly-visualization.component';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { Simulation, TaskMap } from '../../../datamodel';
import { SimulationLogs } from '../../../simulation-logs-datamodel';

import { ConfigService } from '@biosimulations/shared/services';
import { BehaviorSubject, Observable, of, Subscription, forkJoin } from 'rxjs';
import { concatAll, map, shareReplay } from 'rxjs/operators';
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
import { urls } from '@biosimulations/config/common';
import { HttpClient } from '@angular/common/http';
import {
  Spec as VegaSpec,
  BaseData as VegaBaseData,
  ValuesData as VegaValuesData,
  UrlData as VegaUrlData,
  Format as VegaDataFormat,
} from 'vega';
import { VegaVisualizationComponent } from '@biosimulations/shared/ui';

enum VisualizationType {
  'lineScatter2d' = 'Two-dimensional line or scatter plot',
  'vega' = 'Vega or Vega-Lite visualization',
}

interface SedmlLocationReportId {
  id: string;
  label: string;
}

type SedmlDatasetResults = (number | boolean)[];

interface SedmlReportResults {
  data: {[label: string]: SedmlDatasetResults};
}

interface VegaDataSet {
  index: number;
  name: string;
  source: string | string[] | undefined;
  url: string | undefined;
  values: any[] | undefined;
  format: VegaDataFormat | undefined;
}

interface VegaDataSetEntry {
  label: string;
  values: (number | boolean)[];
}

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
  runTime$!: Observable<string>;
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
  lineScatter2dFormGroup: FormGroup;
  vegaFormGroup: FormGroup;
  vegaFileFormControl: FormControl;
  vegaDataSets: VegaDataSet[] = [];
  vegaDataSetSedmlLocationReportIdsFormArray: FormArray;

  private combineArchive: CombineArchive | undefined;

  VisualizationType = VisualizationType;
  visualizationTypes: VisualizationType[] = [
    VisualizationType.lineScatter2d,
    VisualizationType.vega,
  ]
  selectedVisualizationType = VisualizationType.lineScatter2d;

  private sedmlLocations = new BehaviorSubject<string[]>([]);
  sedmlLocations$ = this.sedmlLocations.asObservable();

  public reportIds = new BehaviorSubject<string[] | undefined>(undefined);
  reportIds$ = this.reportIds.asObservable();

  private selectedSedmlLocation: string | undefined;

  private sedmlLocationsReportIds = new BehaviorSubject<SedmlLocationReportId[]>([]);
  sedmlLocationsReportIds$ = this.sedmlLocationsReportIds.asObservable();

  private dataSets: Report = {};
  private dataSetIdDisableds = new BehaviorSubject<DataSetIdDisabled[]>([]);
  dataSetIdDisableds$ = this.dataSetIdDisableds.asObservable();

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  scatterTraceModeLabels: ScatterTraceModeLabel[] = SCATTER_TRACE_MODEL_LABELS;

  private vizDataLayout = new BehaviorSubject<DataLayout | null>(
    null,
  );
  vizDataLayout$ = this.vizDataLayout.asObservable();

  private _vegaSpec: VegaSpec | null = null;
  private vegaSpec = new BehaviorSubject<VegaSpec | null>(null);
  vegaSpec$ = this.vegaSpec.asObservable();

  @ViewChild(PlotlyVisualizationComponent) plotlyVisualization!: PlotlyVisualizationComponent;
  @ViewChild(VegaVisualizationComponent) vegaVisualization!: VegaVisualizationComponent;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private service: ViewService,
    private formBuilder: FormBuilder,
    private simulationService: SimulationService,
    private appService: VisualizationService,
    private dispatchService: DispatchService,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
  ) {
    this.formGroup = formBuilder.group({
      visualizationType: [this.visualizationTypes[0], [Validators.required]],
      lineScatter2d: formBuilder.group({
        sedmlLocation: [undefined, [Validators.required]],
        reportId: [undefined, [Validators.required]],
        xDataSetId: [undefined, [Validators.required]],
        yDataSetIds: [[], [Validators.required]],
        xAxisType: [AxisType.linear, [Validators.required]],
        yAxisType: [AxisType.linear, [Validators.required]],
        scatterTraceMode: [ScatterTraceMode.lines, [Validators.required]],
      }),
      vega: formBuilder.group({
        vegaFile: [''],
        vegaDataSetSedmlLocationReportIds: formBuilder.array([])
      }),
    });

    this.lineScatter2dFormGroup = this.formGroup.get('lineScatter2d') as FormGroup;
    this.vegaFormGroup = this.formGroup.get('vega') as FormGroup;
    this.vegaFileFormControl = this.vegaFormGroup.get('vegaFile') as FormControl;
    this.vegaDataSetSedmlLocationReportIdsFormArray = this.vegaFormGroup.get('vegaDataSetSedmlLocationReportIds') as FormArray;
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

    this.lineScatter2dFormGroup.controls.sedmlLocation.disable();
    this.lineScatter2dFormGroup.controls.reportId.disable();
    this.lineScatter2dFormGroup.controls.xDataSetId.disable();
    this.lineScatter2dFormGroup.controls.yDataSetIds.disable();

    this.sedmlLocationForm$ = this.lineScatter2dFormGroup.controls.sedmlLocation.valueChanges;
    this.reportdIdForm$ = this.lineScatter2dFormGroup.controls.reportId.valueChanges;
    this.xDataSetIdForm$ = this.lineScatter2dFormGroup.controls.xDataSetId.valueChanges;
    this.yDataSetIdsForm$ = this.lineScatter2dFormGroup.controls.yDataSetIds.valueChanges;
    (this.vegaFormGroup.get('vegaFile') as FormControl).valueChanges.subscribe(this.selectVegaFile.bind(this));

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
    this.runTime$ = this.logs$.pipe(
      map((log): string => {
        const duration = log?.structured?.duration;
        return duration == null ? 'N/A' : (Math.round(duration * 1000) / 1000).toString() + ' s';
      })
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
    if (sedmlLocations.length) {
      this.lineScatter2dFormGroup.controls.sedmlLocation.enable();
    } else {
      this.lineScatter2dFormGroup.controls.sedmlLocation.disable();
    }

    const selectedSedmlLocation = sedmlLocations?.[0];
    this.lineScatter2dFormGroup.controls.sedmlLocation.setValue(selectedSedmlLocation);
    this.selectSedmlLocation(selectedSedmlLocation);

    const sedmlLocationsReportIds: SedmlLocationReportId[] = [{
      id: '__none__',
      label: '-- None --',
    }];
    sedmlLocations.forEach((sedmlLocation: string): void => {
      this.combineArchive?.[sedmlLocation]?.forEach((reportId: string): void => {
        sedmlLocationsReportIds.push({
          id: encodeURIComponent(sedmlLocation + '/' + reportId),
          label: sedmlLocation + ' / ' + reportId,
        });
      });
    });
    this.sedmlLocationsReportIds.next(sedmlLocationsReportIds);
  }

  selectVisualizationType(selectedVisualizationType: VisualizationType): void {
    this.selectedVisualizationType = selectedVisualizationType;
    this.formGroup.controls.visualizationType.setValue(selectedVisualizationType);
  }

  selectSedmlLocation(selectedSedmlLocation?: string): void {
    this.selectedSedmlLocation = selectedSedmlLocation;

    const reportIds =
      this.combineArchive && selectedSedmlLocation
        ? this.combineArchive[selectedSedmlLocation]
        : undefined;
    this.reportIds.next(reportIds);
    if (reportIds?.length) {
      this.lineScatter2dFormGroup.controls.reportId.enable();
    } else {
      this.lineScatter2dFormGroup.controls.reportId.disable();
    }

    const selectedReportId = reportIds?.[0];
    this.lineScatter2dFormGroup.controls.reportId.setValue(selectedReportId);
    this.selectReportId(selectedReportId);
  }

  selectReportId(selectedReportId?: string): void {
    this.lineScatter2dFormGroup.controls.xDataSetId.disable();
    this.lineScatter2dFormGroup.controls.yDataSetIds.disable();
    this.lineScatter2dFormGroup.controls.xDataSetId.setValue(undefined);
    this.lineScatter2dFormGroup.controls.yDataSetIds.setValue([]);
    this.build2dVizData();

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

      this.lineScatter2dFormGroup.controls.xDataSetId.enable();
      this.lineScatter2dFormGroup.controls.yDataSetIds.enable();
    } else {
      this.lineScatter2dFormGroup.controls.xDataSetId.disable();
      this.lineScatter2dFormGroup.controls.yDataSetIds.disable();
    }

    this.lineScatter2dFormGroup.controls.xDataSetId.setValue(xDataSetId);
    this.lineScatter2dFormGroup.controls.yDataSetIds.setValue(yDataSetIds);
    this.build2dVizData();
  }

  build2dVizData(): void {
    const xDataSetId: string | undefined = this.lineScatter2dFormGroup.controls['xDataSetId']
      .value;
    const yDataSetIds: string[] = this.lineScatter2dFormGroup.controls['yDataSetIds'].value;

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
              mode: this.lineScatter2dFormGroup.controls['scatterTraceMode'].value,
            };
          },
        ),
        layout: {
          xaxis: {
            title: xAxisTitle,
            type: this.lineScatter2dFormGroup.controls['xAxisType'].value,
          },
          yaxis: {
            title: yAxisTitle,
            type: this.lineScatter2dFormGroup.controls['yAxisType'].value,
          },
          showlegend: showlegend,
          width: undefined,
          height: undefined,
        },
      });
    } else {
      this.vizDataLayout.next(null);
    }

    setTimeout(() => this.changeDetectorRef.detectChanges());
  }

  selectVegaFile(file: File): void {
    while (this.vegaDataSetSedmlLocationReportIdsFormArray.length !== 0) {
      this.vegaDataSets.pop();
      this.vegaDataSetSedmlLocationReportIdsFormArray.removeAt(0);
    }

    const reader = new FileReader();
    file.text().then(
      (content: string): void => {
        try {
          this._vegaSpec = JSON.parse(content) as VegaSpec;
          this.vegaFileFormControl.setErrors(null);

          const vegaDatas = this._vegaSpec?.data;
          if (Array.isArray(vegaDatas)) {
            (vegaDatas as any[]).forEach((data: any, iData: number): void => {
              const name = data?.name;
              if (typeof name === 'string' && data?._mapToSedmlReport !== false) {
                this.vegaDataSets.push({
                  index: iData,
                  name: name,
                  source: data?.source,
                  url: data?.url,
                  values: data?.values,
                  format: data?.format,
                });
                this.vegaDataSetSedmlLocationReportIdsFormArray.push(this.formBuilder.control(this.sedmlLocationsReportIds.value[0].id));
              }
            })
          }

        } catch {
          this._vegaSpec = null;
          this.vegaFileFormControl.setErrors({invalid: true});
        }

        this.changeDetectorRef.detectChanges();

        this.buildVegaVizData();
      },
      (): void => {
        this.vegaFileFormControl.setErrors({invalid: true});
        this.changeDetectorRef.detectChanges();
      });
  }

  buildVegaVizData(): void {
    const vegaSpec = this._vegaSpec as VegaSpec;
    const resultsPromises: Observable<SedmlReportResults>[] = [];

    this.vegaDataSetSedmlLocationReportIdsFormArray.value.forEach((value: string | null, iVegaDataSet: number): void => {
      const vegaDataSet = this.vegaDataSets[iVegaDataSet];
      const vegaSpecDataSet = vegaSpec?.data?.[vegaDataSet.index] as VegaBaseData;
      if (value === this.sedmlLocationsReportIds.value[0].id) {
        if (vegaDataSet.source) {
          (vegaSpecDataSet as any).source = vegaDataSet.source;
        } else if ('source' in vegaSpecDataSet) {
          delete (vegaSpecDataSet as any).source;
        }

        if (vegaDataSet.url) {
          (vegaSpecDataSet as any).url = vegaDataSet.url;
        } else if ('url' in vegaSpecDataSet) {
          delete (vegaSpecDataSet as any).url;
        }

        if (vegaDataSet.values) {
          (vegaSpecDataSet as any).values = vegaDataSet.values;
        } else if ('values' in vegaSpecDataSet) {
          delete (vegaSpecDataSet as any).values;
        }

        if (vegaDataSet.format) {
          (vegaSpecDataSet as any).format = vegaDataSet.format;
        } else if ('format' in vegaSpecDataSet) {
          delete (vegaSpecDataSet as any).format;
        }
      } else {
        const vegaSpecUrlDataSet = vegaSpecDataSet as VegaUrlData;
        const url = `${urls.dispatchApi}results/${this.uuid}/${value}?sparse=false`;
        resultsPromises.push(this.http.get<SedmlReportResults>(url))
      }
    });

    if (resultsPromises.length) {
      forkJoin(resultsPromises).subscribe((reportsResults: SedmlReportResults[]): void => {
        reportsResults.forEach((reportResults: SedmlReportResults, iVegaDataSet: number): void => {
          const vegaDataSet = this.vegaDataSets[iVegaDataSet];
          const vegaSpecDataSet = vegaSpec?.data?.[vegaDataSet.index] as VegaBaseData;

          if ('source' in vegaDataSet) {
            delete (vegaSpecDataSet as any).source;
          }

          if ('url' in vegaDataSet) {
            delete (vegaSpecDataSet as any).url;
          }

          if ('format' in vegaDataSet) {
            delete (vegaSpecDataSet as any).format;
          }

          const values: VegaDataSetEntry[] = [];
          Object.entries(reportResults.data).forEach(
            (labelValues: [string, unknown]): void => {
              values.push({
                label: labelValues[0] as string,
                values: labelValues[1] as SedmlDatasetResults,
              });
            }
          );

          (vegaSpecDataSet as VegaValuesData).values = values;
        });

        this.vegaSpec.next(this._vegaSpec);
        // this.changeDetectorRef.detectChanges();
      });

    } else {
      this.vegaSpec.next(this._vegaSpec);
      // this.changeDetectorRef.detectChanges();
    }
  }

  vegaRefreshHandler(): void {
    // this.changeDetectorRef.detectChanges();
  }

  vegaErrorHandler(): void {
    this.vegaFileFormControl.setErrors({invalid: true});
    this.changeDetectorRef.detectChanges();
  }

  selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == 2) {
      if (this.plotlyVisualization) {
        this.plotlyVisualization.setLayout();
      }
      if (this.vegaVisualization) {
        this.vegaVisualization.render();
      }
      this.changeDetectorRef.detectChanges();
    }
  }
}
