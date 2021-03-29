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
  Layout,
  DataLayout,
} from './plotly-visualization/plotly-visualization.component';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import {
  Simulation,
  CombineResults,
  SedDocumentResults,
  SedReportResults,
  SedDatasetResults,
} from '../../../datamodel';
import { SimulationLogs } from '../../../simulation-logs-datamodel';

import { ConfigService } from '@biosimulations/shared/services';
import { BehaviorSubject, Observable, of, Subscription, forkJoin } from 'rxjs';
import { concatAll, map, shareReplay } from 'rxjs/operators';
import {
  AxisLabelType,
  AXIS_LABEL_TYPES,
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

type CombineResultsObject = {[locationReportIdLabel: string]: SedDatasetResults};

enum VisualizationType {
  'lineScatter2d' = 'Interactively design a grid of two-dimensional line or scatter plots',
  'vega' = 'Upload a Vega visualization (supports arbitrarily complex visualizations) and map SED-ML reports to it',
}

enum SubplotEnabledType {
  'enabled' = 'Enabled',
  'disabled' = 'Disabled',
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
  combineResultsStructure$!: Observable<CombineResults | undefined>;
  subs: Subscription[] = [];

  formGroup: FormGroup;
  lineScatter2dFormGroup: FormGroup;
  lineScatter2dSubplotsFormArray: FormArray;
  subplotCurves: (FormGroup[])[] = [];
  vegaFormGroup: FormGroup;
  vegaFileFormControl: FormControl;
  vegaDataSets: VegaDataSet[] = [];
  vegaDataSetSedmlLocationReportIdsFormArray: FormArray;

  hasData = false;
  dataLoaded = false;
  combineResultsStructure: CombineResults | undefined = undefined;
  combineResults: CombineResultsObject = {};
  private defaultXSedDataset: SedDatasetResults | undefined = undefined;
  private defaultYSedDataset: SedDatasetResults | undefined = undefined;

  VisualizationType = VisualizationType;
  visualizationTypes: VisualizationType[] = [
    VisualizationType.lineScatter2d,
    VisualizationType.vega,
  ]
  selectedVisualizationType = VisualizationType.lineScatter2d;

  subplotEnabledTypes: SubplotEnabledType[] = [
    SubplotEnabledType.enabled,
    SubplotEnabledType.disabled,
  ];

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

  lineScatter2dValid = false;
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
        rows: [1, [Validators.required, Validators.min(1)]],
        cols: [1, [Validators.required, Validators.min(1)]],
        subplots: formBuilder.array([]),
      }),
      vega: formBuilder.group({
        vegaFile: [''],
        vegaDataSetSedmlLocationReportIds: formBuilder.array([])
      }),
    });

    this.lineScatter2dFormGroup = this.formGroup.get('lineScatter2d') as FormGroup;
    this.lineScatter2dSubplotsFormArray = this.lineScatter2dFormGroup.get('subplots') as FormArray;
    this.vegaFormGroup = this.formGroup.get('vega') as FormGroup;
    this.vegaFileFormControl = this.vegaFormGroup.get('vegaFile') as FormControl;
    this.vegaDataSetSedmlLocationReportIdsFormArray = this.vegaFormGroup.get('vegaDataSetSedmlLocationReportIds') as FormArray;
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

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
    this.combineResultsStructure$ = this.statusSuceeded$.pipe(
      map((succeeded) =>
        succeeded
          ? this.appService.getResults(this.uuid, true)
          : of(undefined),
      ),
      concatAll(),
    );

    // TODO Refactor
    const statusSub = this.statusSuceeded$.subscribe((suceeded) => {
      if (suceeded) {
        const resultsub = this.appService
          .getResults(this.uuid, true)
          .subscribe((response) => {
            this.setProjectOutputs(response as CombineResults);
          });
        this.subs.push(resultsub);
      }
    });
    this.subs.push(statusSub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

  private setProjectOutputs(combineResultsStructure: CombineResults): void {
    // store structure of results of the execution of the COMBINE archive
    this.combineResultsStructure = combineResultsStructure;

    const sedmlLocationsReportIds: SedmlLocationReportId[] = [{
      id: '__none__',
      label: '-- None --',
    }];
    for (const sedDocumentResultsStructure of combineResultsStructure) {
      for (const sedReportResultsStructure of sedDocumentResultsStructure.reports) {
        sedmlLocationsReportIds.push({
          id: encodeURIComponent(sedDocumentResultsStructure.location + '/' + sedReportResultsStructure.id),
          label: sedDocumentResultsStructure.location + ' / ' + sedReportResultsStructure.id,
        })
      }
    }
    this.sedmlLocationsReportIds.next(sedmlLocationsReportIds);

    // determine if the COMBINE archive generated at least one data set
    let hasData = false;
    for (const sedDocumentResultsStructure of combineResultsStructure) {
      for (const sedReportResultsStructure of sedDocumentResultsStructure.reports) {
        if (sedReportResultsStructure.datasets.length) {
          hasData = true;
          this.defaultXSedDataset = sedReportResultsStructure.datasets[0];
          this.defaultYSedDataset = sedReportResultsStructure.datasets?.[1] || this.defaultXSedDataset;
          break;
        }
      }
    }
    this.hasData = hasData;

    // setup design visualization tab
    this.setVizGrid();
  }

  selectVisualizationType(): void {
    this.selectedVisualizationType = this.formGroup.value.visualizationType;
  }

  setVizGrid(): void {
    const rows = (this.lineScatter2dFormGroup.get('rows') as FormControl).value;
    const cols = (this.lineScatter2dFormGroup.get('cols') as FormControl).value;

    while (this.lineScatter2dSubplotsFormArray.length > rows * cols) {
      this.subplotCurves.pop();
      this.lineScatter2dSubplotsFormArray.removeAt(this.lineScatter2dSubplotsFormArray.length - 1);
    }

    while (this.lineScatter2dSubplotsFormArray.length < rows * cols) {
      const curves = this.formBuilder.array([]);
      const subplot = this.formBuilder.group({
        enabled: [SubplotEnabledType.enabled, Validators.required],
        numCurves: [1, [Validators.required]],
        curves: curves,
        xAxisType: [AxisType.linear, [Validators.required]],
        yAxisType: [AxisType.linear, [Validators.required]],
        scatterTraceMode: [ScatterTraceMode.lines, [Validators.required]],
      });
      this.subplotCurves.push(curves.controls as FormGroup[]);
      this.lineScatter2dSubplotsFormArray.push(subplot);
      this.setNumCurves(this.lineScatter2dSubplotsFormArray.length - 1);
    }

    this.build2dViz();
  }

  setNumCurves(iSubplot: number): void {
    const subplot = this.lineScatter2dSubplotsFormArray.at(iSubplot) as FormGroup;
    const numCurves = subplot.value.numCurves;
    const curves = subplot.get('curves') as FormArray;

    while (curves.length > numCurves) {
      curves.removeAt(curves.length - 1);
    }

    while (curves.length < numCurves) {
      const curve = this.formBuilder.group({
        xData: [this.defaultXSedDataset?._id, [Validators.required]],
        yData: [this.defaultYSedDataset?._id, [Validators.required]],
      });
      curves.push(curve);
    }

    this.build2dViz();
  }

  build2dViz(): void {
    if (!this.dataLoaded && this.defaultYSedDataset) {
      this.lineScatter2dValid = true;
      this.appService
        .getResults(this.uuid, false)
        .subscribe((results: CombineResults): void => {
          const combineResults: CombineResultsObject = {};
          results.forEach((sedDocument: SedDocumentResults): void => {
            sedDocument.reports.forEach((report: SedReportResults): void => {
              report.datasets.forEach((dataset: SedDatasetResults): void => {
                combineResults[sedDocument.location + '/' + report.id + '/' + dataset.label] = {
                  _id: undefined,
                  location: sedDocument.location,
                  reportId: report.id,
                  label: dataset.label,
                  value: dataset.value,
                };
              });
            });
          });
          this.combineResults = combineResults;

          this.dataLoaded = true;
          this.draw2dViz();
        });
    } else {
      this.draw2dViz();
    }
  }

  draw2dViz(): void {
    const traces: ScatterTrace[] = [];
    const layout: Layout = {
      grid: {
        rows: (this.lineScatter2dFormGroup.get('rows') as FormControl).value,
        columns: (this.lineScatter2dFormGroup.get('cols') as FormControl).value,
        pattern: 'independent',
      },
      showlegend: false,
      width: undefined,
      height: undefined,
    };

    for (let iSubplot=0; iSubplot < this.lineScatter2dSubplotsFormArray.length; iSubplot++) {
      const subplotFormGroup = this.lineScatter2dSubplotsFormArray.at(iSubplot) as FormGroup;
      const xAxisId = 'x' + (iSubplot + 1).toString();
      const yAxisId = 'y' + (iSubplot + 1).toString();
      const xAxisTitlesSet = new Set<string>();
      const yAxisTitlesSet = new Set<string>();

      if (subplotFormGroup.controls['enabled'].value == SubplotEnabledType.enabled) {
        const curvesFormArray = subplotFormGroup.controls['curves'] as FormArray;
        for (let iCurve=0; iCurve < curvesFormArray.length; iCurve++) {
          const curveFormGroup = curvesFormArray.at(iCurve) as FormGroup;

          const xDataId = curveFormGroup.value.xData;
          const yDataId = curveFormGroup.value.yData;

          const xDataset = this.combineResults?.[xDataId] as SedDatasetResults;
          const yDataset = this.combineResults?.[yDataId] as SedDatasetResults;

          xAxisTitlesSet.add(xDataset.label);
          yAxisTitlesSet.add(yDataset.label);

          traces.push({
            name: yDataset.label + ' vs. ' + xDataset.label,
            x: xDataset.value,
            y: yDataset.value,
            xaxis: xAxisId,
            yaxis: yAxisId,
            mode: subplotFormGroup.controls['scatterTraceMode'].value,
          });
        }
      }

      const xAxisTitlesArr = Array.from(xAxisTitlesSet);
      const yAxisTitlesArr = Array.from(yAxisTitlesSet);
      let xAxisTitle: string | undefined = undefined;
      let yAxisTitle: string | undefined = undefined;

      if (xAxisTitlesArr.length == 1) {
        xAxisTitle = xAxisTitlesArr[0];
      } else if (xAxisTitlesArr.length > 1) {
        layout.showlegend = true;
      }

      if (yAxisTitlesArr.length == 1) {
        yAxisTitle = yAxisTitlesArr[0];
      } else if (yAxisTitlesArr.length > 1) {
        layout.showlegend = true;
      }

      layout['xaxis' + (iSubplot + 1).toString()] = {
        anchor: xAxisId,
        title: xAxisTitle,
        type: subplotFormGroup.controls['xAxisType'].value,
      };

      layout['yaxis' + (iSubplot + 1).toString()] = {
        anchor: yAxisId,
        title: yAxisTitle,
        type: subplotFormGroup.controls['yAxisType'].value,
      };
    }

    this.vizDataLayout.next({
      data: traces,
      layout: layout,
    });

    // setTimeout(() => this.changeDetectorRef.detectChanges());
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

        } catch (err) {
          // console.error(err);
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
