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
  SedDatasetResults,
  SedDatasetResultsMap,
} from '../../../datamodel';
import {
  CombineArchive,
  SedOutputType,
} from '../../../combine-sedml.interface';
import { SimulationLogs } from '../../../simulation-logs-datamodel';
import { ConfigService } from '@biosimulations/shared/services';
import { BehaviorSubject, Observable, of, Subscription, combineLatest } from 'rxjs';
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
import {
  Spec as VegaSpec,
  BaseData as VegaBaseData,
  UrlData as VegaUrlData,
  Format as VegaDataFormat,
} from 'vega';
import { VegaVisualizationComponent } from '@biosimulations/shared/ui';
import { MatSnackBar } from '@angular/material/snack-bar';

enum VisualizationType {
  'lineScatter2d' = 'Interactively design a grid of two-dimensional line or scatter plots',
  'vega' = 'Select a Vega visualization file (supports arbitrarily complex visualizations) and map SED-ML reports to it',
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

type SimulationRunReport = any;

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  //this seems to be required oddly
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit, OnDestroy {
  // Refactored Variables Start
  private uuid = '';
  logs$!: Observable<SimulationLogs | undefined>;
  runTime$!: Observable<string>;
  statusRunning$!: Observable<boolean>;
  statusSuceeded$!: Observable<boolean>;
  formattedSimulation$?: Observable<FormattedSimulation>;
  Simulation$!: Observable<Simulation>;
  combineResultsStructure$!: Observable<CombineResults | undefined>;
  sedPlotConfiguration$!: Observable<CombineArchive | undefined>;
  subscriptions: Subscription[] = [];

  formGroup: FormGroup;
  lineScatter2dFormGroup: FormGroup;
  lineScatter2dRowsControl: FormControl;
  lineScatter2dColsControl: FormControl;
  lineScatter2dSubplotsFormArray: FormArray;
  subplotCurves: (FormGroup[])[] = [];
  vegaFormGroup: FormGroup;
  vegaFileFormControl: FormControl;
  vegaDataSets: VegaDataSet[] = [];
  vegaDataSetSedmlLocationReportIdsFormArray: FormArray;

  hasData = false;
  dataLoaded = false;
  combineResultsStructure: CombineResults | undefined = undefined;
  combineResults: SedDatasetResultsMap = {};
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
    private formBuilder: FormBuilder,
    private service: ViewService,
    private simulationService: SimulationService,
    private visualizationService: VisualizationService,
    private dispatchService: DispatchService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
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
    this.lineScatter2dRowsControl = this.lineScatter2dFormGroup.get('rows') as FormControl;
    this.lineScatter2dColsControl = this.lineScatter2dFormGroup.get('cols') as FormControl;
    this.lineScatter2dSubplotsFormArray = this.lineScatter2dFormGroup.get('subplots') as FormArray;
    this.vegaFormGroup = this.formGroup.get('vega') as FormGroup;
    this.vegaFileFormControl = this.vegaFormGroup.get('vegaFile') as FormControl;
    this.vegaFileFormControl.setErrors(null);
    this.vegaDataSetSedmlLocationReportIdsFormArray = this.vegaFormGroup.get('vegaDataSetSedmlLocationReportIds') as FormArray;
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

    const vegaFileFormControl = this.vegaFormGroup.get('vegaFile') as FormControl;
    const vegaSub = vegaFileFormControl.valueChanges.subscribe(this.selectVegaFile.bind(this))
    this.subscriptions.push(vegaSub);

    this.Simulation$ = this.simulationService
      .getSimulation(this.uuid)
      .pipe(shareReplay(1));

    this.formattedSimulation$ = this.Simulation$.pipe(
      map<Simulation, FormattedSimulation>(this.service.formatSimulation),
    );

    this.statusRunning$ = this.formattedSimulation$.pipe(
      map((value: FormattedSimulation): boolean =>
        SimulationStatusService.isSimulationStatusRunning(value.status),
      ),
    );

    this.statusSuceeded$ = this.formattedSimulation$.pipe(
      map((value: FormattedSimulation): boolean =>
        SimulationStatusService.isSimulationStatusSucceeded(value.status),
      ),
    );

    this.logs$ = this.statusRunning$.pipe(
      map((running: boolean): Observable<SimulationLogs | undefined> =>
        running
        ? of<undefined>(undefined)
        : this.dispatchService.getSimulationLogs(this.uuid),
      ),
      concatAll(),
    );

    const runningLogSub = combineLatest([this.statusRunning$, this.logs$]).subscribe((runningLog: [boolean, SimulationLogs | undefined]): void => {
      const running = runningLog[0];
      const log = runningLog[1];
      if (!running && !log) {
        this.snackBar.open((
            'Sorry! We were unable to get the log for this simulation.'
            ), undefined, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
      }
    });
    this.subscriptions.push(runningLogSub);

    this.runTime$ = this.logs$.pipe(
      map((log: SimulationLogs | undefined): string => {
        const duration = log?.structured?.duration;
        return duration == null ? 'N/A' : (Math.round(duration * 1000) / 1000).toString() + ' s';
      })
    );

    this.combineResultsStructure$ = this.statusSuceeded$.pipe(
      map((succeeded: boolean): Observable<CombineResults | undefined> =>
        succeeded
          ? this.visualizationService.getCombineResultsStructure(this.uuid)
          : of(undefined),
      ),
      concatAll(),
    );
    const combineResultsSub = this.combineResultsStructure$.subscribe((results: CombineResults | undefined): void => {
      if (results?.length) {
        this.setProjectOutputs(results);
      } else {
        this.snackBar.open((
            'Sorry! We were unable to get results for this simulation.'
            ), undefined, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
      }
    });
    this.subscriptions.push(combineResultsSub);

    this.sedPlotConfiguration$ = this.combineResultsStructure$.pipe(
      map((results: CombineResults | undefined): Observable<CombineArchive | undefined> => {
        return results
          ? this.visualizationService.getSpecsOfSedPlotsInCombineArchive(this.uuid)
          : of({_type: "CombineArchive", contents: []});
      }),
      concatAll(),
    );
    const setPlotConfigurationSub = this.sedPlotConfiguration$.subscribe((archive: CombineArchive | undefined): void => {
      if (archive) {
        this.setPlotConfiguration(archive);
      } else {
        this.snackBar.open((
          'Sorry! We were unable to retrieve the specifications of the plots in the SED-ML files for this simulation.'
          ), undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
    this.subscriptions.push(setPlotConfigurationSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  private setPlotConfiguration(combineArchive: CombineArchive): void {
    const subplotsCurves: any[] = [];
    combineArchive.contents.forEach((content): void => {
      content.location.value.outputs.forEach((output): void => {
        if (output._type === SedOutputType.SedPlot2D) {
          const curves = output.curves
            .map((curve) => {
              return {
                xData: curve.xDataGenerator._resultsDataSetId,
                yData: curve.yDataGenerator._resultsDataSetId,
              };
            })
            .filter((curve): boolean => {
              return curve.xData in this.combineResults && curve.yData in this.combineResults;
            });

          if (curves.length) {
            subplotsCurves.push(curves);
          }
        }
      })
    });

    const nSubplots = subplotsCurves.length;
    if (nSubplots === 0) {
      return;
    }

    const rows = Math.floor(Math.sqrt(nSubplots));
    const cols = Math.ceil(nSubplots / rows);
    this.lineScatter2dRowsControl.setValue(rows)
    this.lineScatter2dRowsControl.setValue(cols)
    this.setVizGrid();

    for (let iSubplot=0; iSubplot < subplotsCurves.length; iSubplot++) {
      const subplot = this.lineScatter2dSubplotsFormArray.at(iSubplot) as FormGroup;

      const curves = subplotsCurves[iSubplot];

      const numCurvesControl = subplot.get('numCurves') as FormControl;
      numCurvesControl.setValue(curves.length);
      this.setNumCurves(iSubplot);

      const curvesFormArray = subplot.get('curves') as FormArray;
      curvesFormArray.setValue(curves);
    }
  }

  selectVisualizationType(): void {
    this.selectedVisualizationType = this.formGroup.value.visualizationType;
  }

  setVizGrid(): void {
    const rows = this.lineScatter2dRowsControl.value;
    const cols = this.lineScatter2dColsControl.value;

    while (this.lineScatter2dSubplotsFormArray.length > rows * cols) {
      this.subplotCurves.pop();
      this.lineScatter2dSubplotsFormArray.removeAt(this.lineScatter2dSubplotsFormArray.length - 1);
    }

    while (this.lineScatter2dSubplotsFormArray.length < rows * cols) {
      const curves = this.formBuilder.array([]);
      const subplot = this.formBuilder.group({
        label: [''],
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

    for (let iSubplot=0; iSubplot < rows * cols; iSubplot++) {
      const subplot = this.lineScatter2dSubplotsFormArray.at(iSubplot) as FormGroup;
      const iRow = Math.floor(iSubplot / cols);
      const iCol = iSubplot % cols;
      subplot.controls.label.setValue(`Subplot R${iRow + 1}, C${iCol + 1}`);
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
        xData: [this.defaultXSedDataset?.id, [Validators.required]],
        yData: [this.defaultYSedDataset?.id, [Validators.required]],
      });
      curves.push(curve);
    }

    this.build2dViz();
  }

  build2dViz(): void {
    if (!this.dataLoaded && this.defaultYSedDataset) {
      this.lineScatter2dValid = true;
      const combineResults = this.visualizationService.getCombineResults(this.uuid);
      const combineResultsSub = combineResults.subscribe((combineResults: SedDatasetResultsMap | undefined): void => {
        if (combineResults) {
          this.combineResults = combineResults;
          this.dataLoaded = true;
          this.draw2dViz();
        } else {
          this.snackBar.open((
            'Sorry! We were unable to get results for this simulation.'
            ), undefined, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
      this.subscriptions.push(combineResultsSub);
    } else {
      this.draw2dViz();
    }
  }

  draw2dViz(): void {
    const traces: ScatterTrace[] = [];
    const layout: Layout = {
      grid: {
        rows: this.lineScatter2dRowsControl.value,
        columns: this.lineScatter2dColsControl.value,
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
            x: xDataset.values,
            y: yDataset.values,
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
        if ('source' in vegaDataSet) {
          delete (vegaSpecDataSet as any).source;
        }

        if ('values' in vegaDataSet) {
          delete (vegaSpecDataSet as any).values;
        }

        const vegaSpecUrlDataSet = vegaSpecDataSet as VegaUrlData;

        vegaSpecUrlDataSet.url = this.visualizationService.getReportResultsUrl(this.uuid, value as string);
        vegaSpecUrlDataSet.format = {
          'type': 'json',
          'property': 'data',
        };
      }
    });

    this.vegaSpec.next(this._vegaSpec);
    // this.changeDetectorRef.detectChanges();
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
