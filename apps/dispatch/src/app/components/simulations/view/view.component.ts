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
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
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
import { CombineService } from '../../../services/combine/combine.service';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import {
  Simulation,
  CombineResults,
  SedReportResults,
  SedDatasetResults,
  SedDatasetResultsMap,
} from '../../../datamodel';
import {
  CombineArchive,
  SedOutputType,
} from '../../../combine-sedml.interface';
import { SimulationLogs } from '../../../simulation-logs-datamodel';
import { ConfigService } from '@biosimulations/shared/services';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { concatAll, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import {
  AxisLabelType,
  AXIS_LABEL_TYPES,
  FormattedSimulation,
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
import { urls } from '@biosimulations/config/common';
import { CombineArchiveElementMetadata } from '../../../metadata.interface';

enum VisualizationType {
  'lineScatter2d' = 'Interactively design a grid of two-dimensional line or scatter plots',
  'vega' = 'Select a Vega visualization file (supports arbitrarily complex visualizations) and map SED-ML reports to it',
}

enum SubplotEnabledType {
  'enabled' = 'Enabled',
  'disabled' = 'Disabled',
}

interface SedmlLocationReportId {
  uri: string;
  label: string;
}

type SedmlDatasetResults = (number | boolean)[];

interface SedmlReportResults {
  data: { [label: string]: SedmlDatasetResults };
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

interface Metadata {
  archive: CombineArchiveElementMetadata | null;
  other: CombineArchiveElementMetadata[];
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
  logs$!: Observable<SimulationLogs | undefined>;
  runTime$!: Observable<string>;
  statusRunning$!: Observable<boolean>;
  private statusSucceeded$!: Observable<boolean>;
  formattedSimulation$?: Observable<FormattedSimulation>;
  private Simulation$!: Observable<Simulation>;
  combineResultsStructure$!: Observable<CombineResults | undefined>;
  private combineResultsSucceeded$!: Observable<
    [SedDatasetResultsMap | undefined, boolean]
  >;
  private subscriptions: Subscription[] = [];
  // refactored variables end

  formGroup: FormGroup;
  lineScatter2dFormGroup: FormGroup;
  private lineScatter2dRowsControl: FormControl;
  private lineScatter2dColsControl: FormControl;
  lineScatter2dSubplotsFormArray: FormArray;
  subplotCurves: FormGroup[][] = [];
  private vegaFormGroup: FormGroup;
  vegaFileFormControl: FormControl;
  vegaDataSets: VegaDataSet[] = [];
  vegaDataSetSedmlLocationReportIdsFormArray: FormArray;

  gettingResultsStructure = true;
  hasData = false;
  gettingResults = false;
  dataLoaded = false;
  combineResultsStructure: CombineResults | undefined = undefined;
  private combineResults: SedDatasetResultsMap = {};
  private defaultXSedDataset: SedDatasetResults | undefined = undefined;
  private defaultYSedDataset: SedDatasetResults | undefined = undefined;

  VisualizationType = VisualizationType;
  visualizationTypes: VisualizationType[] = [
    VisualizationType.lineScatter2d,
    VisualizationType.vega,
  ];
  selectedVisualizationType = VisualizationType.lineScatter2d;

  subplotEnabledTypes: SubplotEnabledType[] = [
    SubplotEnabledType.enabled,
    SubplotEnabledType.disabled,
  ];

  private sedmlLocationsReportIds = new BehaviorSubject<
    SedmlLocationReportId[]
  >([]);
  sedmlLocationsReportIds$ = this.sedmlLocationsReportIds.asObservable();

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  scatterTraceModeLabels: ScatterTraceModeLabel[] = SCATTER_TRACE_MODEL_LABELS;

  lineScatter2dValid = false;
  private vizDataLayout = new BehaviorSubject<DataLayout | null>(null);
  vizDataLayout$ = this.vizDataLayout.asObservable();

  private _vegaSpec: VegaSpec | null = null;
  private vegaSpec = new BehaviorSubject<VegaSpec | null>(null);
  vegaSpec$ = this.vegaSpec.asObservable();

  @ViewChild(PlotlyVisualizationComponent)
  private plotlyVisualization!: PlotlyVisualizationComponent;
  @ViewChild(VegaVisualizationComponent)
  private vegaVisualization!: VegaVisualizationComponent;

  metadataLoaded$!: Observable<boolean | undefined>;
  metadata$!: Observable<Metadata | undefined>;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: ViewService,
    private combineService: CombineService,
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
        vegaDataSetSedmlLocationReportIds: formBuilder.array([]),
      }),
    });

    this.lineScatter2dFormGroup = this.formGroup.get(
      'lineScatter2d',
    ) as FormGroup;
    this.lineScatter2dRowsControl = this.lineScatter2dFormGroup.get(
      'rows',
    ) as FormControl;
    this.lineScatter2dColsControl = this.lineScatter2dFormGroup.get(
      'cols',
    ) as FormControl;
    this.lineScatter2dSubplotsFormArray = this.lineScatter2dFormGroup.get(
      'subplots',
    ) as FormArray;
    this.vegaFormGroup = this.formGroup.get('vega') as FormGroup;
    this.vegaFileFormControl = this.vegaFormGroup.get(
      'vegaFile',
    ) as FormControl;
    this.vegaFileFormControl.setErrors(null);
    this.vegaDataSetSedmlLocationReportIdsFormArray = this.vegaFormGroup.get(
      'vegaDataSetSedmlLocationReportIds',
    ) as FormArray;
  }

  public ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];

    const vegaFileFormControl = this.vegaFormGroup.get(
      'vegaFile',
    ) as FormControl;
    const vegaSub = vegaFileFormControl.valueChanges.subscribe(
      this.selectVegaFile.bind(this),
    );
    this.subscriptions.push(vegaSub);

    this.Simulation$ = this.simulationService
      .getSimulation(this.uuid)
      .pipe(shareReplay(1));

    this.formattedSimulation$ = this.Simulation$.pipe(
      map<Simulation, FormattedSimulation>(this.service.formatSimulation),
    );

    this.statusRunning$ = this.formattedSimulation$.pipe(
      map((value: FormattedSimulation): boolean => {
        return SimulationStatusService.isSimulationStatusRunning(value.status);
      }),
    );

    this.statusSucceeded$ = this.formattedSimulation$.pipe(
      map((value: FormattedSimulation): boolean => {
        return SimulationStatusService.isSimulationStatusSucceeded(
          value.status,
        );
      }),
    );

    this.logs$ = this.statusRunning$.pipe(
      map(
        (running: boolean): Observable<SimulationLogs | undefined> =>
          running
            ? of<undefined>(undefined)
            : this.dispatchService.getSimulationLogs(this.uuid),
      ),
      concatAll(),
      shareReplay(1),
    );

    const runningLogSub = this.logs$
      .pipe(withLatestFrom(this.statusRunning$))
      .subscribe((runningLog: [SimulationLogs | undefined, boolean]): void => {
        const log = runningLog[0];
        const running = runningLog[1];
        if (!running && !log) {
          this.snackBar.open(
            'Sorry! We were unable to get the log for this simulation.',
            undefined,
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
        }
      });
    this.subscriptions.push(runningLogSub);

    this.runTime$ = this.logs$.pipe(
      map((log: SimulationLogs | undefined): string => {
        const duration = log?.structured?.duration;
        return duration == null
          ? 'N/A'
          : (Math.round(duration * 1000) / 1000).toString() + ' s';
      }),
      shareReplay(1),
    );

    this.combineResultsStructure$ = this.statusSucceeded$.pipe(
      map(
        (succeeded: boolean): Observable<CombineResults | undefined> =>
          succeeded
            ? this.visualizationService.getCombineResultsStructure(this.uuid)
            : of(undefined),
      ),
      concatAll(),
      shareReplay(1),
    );

    const combineResultsStructureSub = this.combineResultsStructure$
      .pipe(withLatestFrom(this.statusSucceeded$), shareReplay(1))
      .subscribe(
        (succeededResults: [CombineResults | undefined, boolean]): void => {
          const results = succeededResults[0] as CombineResults | undefined;
          const succeeded = succeededResults[1] as boolean;
          if (succeeded) {
            if (results?.length) {
              this.setProjectOutputs(results);
            } else if (!results) {
              this.snackBar.open(
                'Sorry! We were unable to get results for this simulation.',
                undefined,
                {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                },
              );
            }
          }
          this.gettingResultsStructure = false;
          this.gettingResults = true;
        },
      );
    this.subscriptions.push(combineResultsStructureSub);

    this.combineResultsSucceeded$ = this.statusSucceeded$.pipe(
      map(
        (succeeded: boolean): Observable<SedDatasetResultsMap | undefined> =>
          succeeded
            ? this.visualizationService.getCombineResults(this.uuid)
            : of(undefined),
      ),
      concatAll(),
      withLatestFrom(this.statusSucceeded$),
      shareReplay(1),
    );

    const combineResultsSub = this.combineResultsSucceeded$.subscribe(
      (
        combineResultsSucceeded: [SedDatasetResultsMap | undefined, boolean],
      ): void => {
        const combineResults = combineResultsSucceeded?.[0];
        const statusSucceeded = combineResultsSucceeded?.[1];

        if (statusSucceeded) {
          if (combineResults) {
            this.combineResults = combineResults;
            this.dataLoaded = true;
            this.build2dViz();
          } else {
            this.snackBar.open(
              'Sorry! We were unable to get results for this simulation.',
              undefined,
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              },
            );
          }
        }

        this.gettingResults = false;
      },
    );
    this.subscriptions.push(combineResultsSub);

    const sedPlotConfiguration = this.combineResultsSucceeded$.pipe(
      map(
        (
          results: [SedDatasetResultsMap | undefined, boolean],
        ): Observable<CombineArchive | undefined> => {
          return results
            ? this.visualizationService.getSpecsOfSedPlotsInCombineArchive(
                this.uuid,
              )
            : of({ _type: 'CombineArchive', contents: [] });
        },
      ),
      concatAll(),
      withLatestFrom(this.combineResultsSucceeded$),
    );
    const setPlotConfigurationSub = sedPlotConfiguration.subscribe(
      (
        succeededResultsArchive: [
          CombineArchive | undefined,
          [SedDatasetResultsMap | undefined, boolean],
        ],
      ): void => {
        const archive = succeededResultsArchive[0] as
          | CombineArchive
          | undefined;
        const results = succeededResultsArchive[1][0] as
          | SedDatasetResultsMap
          | undefined;
        const succeeded = succeededResultsArchive[1][1] as boolean;

        if (succeeded && results && Object.keys(results).length) {
          if (archive) {
            this.setPlotConfiguration(archive);
          } else {
            this.snackBar.open(
              'Sorry! We were unable to retrieve the specifications of the plots in the SED-ML files for this simulation.',
              undefined,
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              },
            );
          }
        }
      },
    );
    this.subscriptions.push(setPlotConfigurationSub);

    // get metadata
    const archiveUrl = `${urls.dispatchApi}run/${this.uuid}/download`;
    this.metadata$ = this.combineService.getCombineArchiveMetadata(archiveUrl).pipe(
      map((elMetadatas: CombineArchiveElementMetadata[] | undefined): Metadata | undefined => {
        console.log(elMetadatas);

        if (elMetadatas === undefined) {
          return undefined;
        }

        elMetadatas.forEach((elMetadata: CombineArchiveElementMetadata): void => {
          if (elMetadata.created) {
            const d = new Date(elMetadata.created);
            elMetadata.created = (
              d.getFullYear() 
              + "-" 
              + ("0"+(d.getMonth()+1)).slice(-2)
              + "-" 
              + ("0" + d.getDate()).slice(-2)
            );
          }
          elMetadata.modified = elMetadata.modified.map((date: string): string => {
            const d = new Date(date);
            return (
              d.getFullYear() 
              + "-" 
              + ("0"+(d.getMonth()+1)).slice(-2)
              + "-" 
              + ("0" + d.getDate()).slice(-2)
            );
          });
          elMetadata.modified.sort();
          elMetadata.modified.reverse();
        });

        return {
          archive: elMetadatas.filter((elMetadata: CombineArchiveElementMetadata): boolean => {
            return elMetadata.uri === '.';
          })?.[0],
          other: elMetadatas.filter((elMetadata: CombineArchiveElementMetadata): boolean => {
            return elMetadata.uri !== '.';
          }),
        };
      }),
    );
    this.metadataLoaded$ = this.metadata$.pipe(
      map((): boolean => {
        return true;
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private setProjectOutputs(combineResultsStructure: CombineResults): void {
    // store structure of results of the execution of the COMBINE archive
    this.combineResultsStructure = combineResultsStructure;

    const sedmlLocationsReportIds: SedmlLocationReportId[] = [
      {
        uri: '__none__',
        label: '-- None --',
      },
    ];
    for (const sedDocumentResultsStructure of combineResultsStructure) {
      for (const sedReportResultsStructure of sedDocumentResultsStructure.reports) {
        sedmlLocationsReportIds.push({
          uri: encodeURIComponent(sedReportResultsStructure.uri),
          label: sedReportResultsStructure.uri,
        });
      }
    }
    this.sedmlLocationsReportIds.next(sedmlLocationsReportIds);

    // determine if the COMBINE archive generated at least one data set
    let hasData = false;
    for (const sedDocumentResultsStructure of combineResultsStructure) {
      sedDocumentResultsStructure.reports.sort(
        (a: SedReportResults, b: SedReportResults): number => {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        },
      );

      for (const sedReportResultsStructure of sedDocumentResultsStructure.reports) {
        if (sedReportResultsStructure.datasets.length) {
          hasData = true;
          this.defaultXSedDataset = sedReportResultsStructure.datasets[0];
          this.defaultYSedDataset =
            sedReportResultsStructure.datasets?.[1] || this.defaultXSedDataset;
          break;
        }

        sedReportResultsStructure.datasets.sort(
          (a: SedDatasetResults, b: SedDatasetResults): number => {
            return a.label.localeCompare(b.label, undefined, {
              numeric: true,
            });
          },
        );
      }
    }
    this.hasData = hasData;

    // setup design visualization tab
    this.updateVizGrid();
  }

  private setPlotConfiguration(combineArchive: CombineArchive): void {
    const subplotsCurves: any[] = [];
    combineArchive.contents.forEach((content): void => {
      content.location.value.outputs.forEach((output): void => {
        if (output._type === SedOutputType.SedPlot2D) {
          const curves = output.curves
            .map((curve) => {
              return {
                id: curve.id,
                name: curve?.name || null,
                xData: curve.xDataGenerator._resultsDataSetId,
                yData: curve.yDataGenerator._resultsDataSetId,
              };
            })
            .filter((curve): boolean => {
              const resultsAvailable =
                curve.xData in this.combineResults &&
                curve.yData in this.combineResults;

              return resultsAvailable;
            });

          if (curves.length) {
            subplotsCurves.push({
              enabled: SubplotEnabledType.enabled,
              numCurves: curves.length,
              curves: curves,
              xAxisType: output.xScale,
              yAxisType: output.yScale,
              scatterTraceMode: ScatterTraceMode.lines,
            });
          }
        }
      });
    });

    const nSubplots = subplotsCurves.length;
    if (nSubplots === 0) {
      return;
    }

    this.lineScatter2dValid = true;

    const rows = Math.ceil(Math.sqrt(nSubplots));
    const cols = Math.ceil(nSubplots / rows);
    this.lineScatter2dRowsControl.setValue(rows);
    this.lineScatter2dColsControl.setValue(cols);
    this.updateVizGrid();

    for (let iSubplot = 0; iSubplot < subplotsCurves.length; iSubplot++) {
      const subplot = this.lineScatter2dSubplotsFormArray.at(
        iSubplot,
      ) as FormGroup;

      const curves = subplotsCurves[iSubplot].curves;

      const numCurvesControl = subplot.get('numCurves') as FormControl;
      numCurvesControl.setValue(curves.length);
      this.setNumCurves(iSubplot);

      const iRow = Math.floor(iSubplot / cols);
      const iCol = iSubplot % cols;
      subplotsCurves[iSubplot]['label'] = `Subplot R${iRow + 1}, C${iCol + 1}`;
    }

    for (
      let iSubplot = subplotsCurves.length;
      iSubplot < rows * cols;
      iSubplot++
    ) {
      const iRow = Math.floor(iSubplot / cols);
      const iCol = iSubplot % cols;

      subplotsCurves.push({
        enabled: SubplotEnabledType.disabled,
        label: `Subplot R${iRow + 1}, C${iCol + 1}`,
        numCurves: 1,
        curves: [
          {
            id: null,
            name: null,
            xData: this.defaultXSedDataset,
            yData: this.defaultYSedDataset,
          },
        ],
        xAxisType: AxisType.linear,
        yAxisType: AxisType.linear,
        scatterTraceMode: ScatterTraceMode.lines,
      });
    }

    this.lineScatter2dSubplotsFormArray.setValue(subplotsCurves);
    this.build2dViz();
  }

  public selectVisualizationType(): void {
    this.selectedVisualizationType = this.formGroup.value.visualizationType;
  }

  public setVizGrid(): void {
    this.updateVizGrid();
  }

  private updateVizGrid(): void {
    const rows = this.lineScatter2dRowsControl.value;
    const cols = this.lineScatter2dColsControl.value;

    while (this.lineScatter2dSubplotsFormArray.length > rows * cols) {
      this.subplotCurves.pop();
      this.lineScatter2dSubplotsFormArray.removeAt(
        this.lineScatter2dSubplotsFormArray.length - 1,
      );
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

    for (let iSubplot = 0; iSubplot < rows * cols; iSubplot++) {
      const subplot = this.lineScatter2dSubplotsFormArray.at(
        iSubplot,
      ) as FormGroup;
      const iRow = Math.floor(iSubplot / cols);
      const iCol = iSubplot % cols;
      subplot.controls.label.setValue(`Subplot R${iRow + 1}, C${iCol + 1}`);
    }

    this.build2dViz();
  }

  public setNumCurves(iSubplot: number): void {
    const subplot = this.lineScatter2dSubplotsFormArray.at(
      iSubplot,
    ) as FormGroup;
    const numCurves = subplot.value.numCurves;
    const curves = subplot.get('curves') as FormArray;

    while (curves.length > numCurves) {
      curves.removeAt(curves.length - 1);
    }

    while (curves.length < numCurves) {
      const curve = this.formBuilder.group({
        id: [null],
        name: [null],
        xData: [this.defaultXSedDataset?.uri, [Validators.required]],
        yData: [this.defaultYSedDataset?.uri, [Validators.required]],
      });
      curves.push(curve);
    }

    this.build2dViz();
  }

  public build2dViz(): void {
    if (this.dataLoaded && this.defaultYSedDataset) {
      this.lineScatter2dValid = true;
      this.draw2dViz();
    }
  }

  private draw2dViz(): void {
    const rows = this.lineScatter2dRowsControl.value;
    const cols = this.lineScatter2dColsControl.value;

    const traces: ScatterTrace[] = [];
    const layout: Layout = {
      grid: {
        rows: rows,
        columns: cols,
        pattern: 'independent',
      },
      showlegend: false,
      width: undefined,
      height: undefined,
    };

    for (
      let iSubplot = 0;
      iSubplot < this.lineScatter2dSubplotsFormArray.length;
      iSubplot++
    ) {
      const subplotFormGroup = this.lineScatter2dSubplotsFormArray.at(
        iSubplot,
      ) as FormGroup;
      const xAxisId = 'x' + (iSubplot + 1).toString();
      const yAxisId = 'y' + (iSubplot + 1).toString();
      const xAxisTitlesSet = new Set<string>();
      const yAxisTitlesSet = new Set<string>();

      if (
        subplotFormGroup.controls['enabled'].value == SubplotEnabledType.enabled
      ) {
        const curvesFormArray = subplotFormGroup.controls[
          'curves'
        ] as FormArray;
        for (let iCurve = 0; iCurve < curvesFormArray.length; iCurve++) {
          const curveFormGroup = curvesFormArray.at(iCurve) as FormGroup;

          const name = curveFormGroup.value.name || curveFormGroup.value.id;

          const xDataId = curveFormGroup.value.xData;
          const yDataId = curveFormGroup.value.yData;

          const xDataset = this.combineResults?.[xDataId] as SedDatasetResults;
          const yDataset = this.combineResults?.[yDataId] as SedDatasetResults;

          xAxisTitlesSet.add(xDataset.label);
          yAxisTitlesSet.add(yDataset.label);

          traces.push({
            name: name || yDataset.label + ' vs. ' + xDataset.label,
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

  public selectVegaFile(file: File): void {
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
              if (
                typeof name === 'string' &&
                data?._mapToSedmlReport !== false
              ) {
                this.vegaDataSets.push({
                  index: iData,
                  name: name,
                  source: data?.source,
                  url: data?.url,
                  values: data?.values,
                  format: data?.format,
                });
                this.vegaDataSetSedmlLocationReportIdsFormArray.push(
                  this.formBuilder.control(
                    this.sedmlLocationsReportIds.value[0].uri,
                  ),
                );
              }
            });
          }
        } catch (err) {
          console.error(err);
          this._vegaSpec = null;
          this.vegaFileFormControl.setErrors({ invalid: true });
        }

        this.changeDetectorRef.detectChanges();

        this.buildVegaVizData();
      },
      (): void => {
        this.vegaFileFormControl.setErrors({ invalid: true });
        this.changeDetectorRef.detectChanges();
      },
    );
  }

  public buildVegaVizData(): void {
    const vegaSpec = this._vegaSpec as VegaSpec;

    this.vegaDataSetSedmlLocationReportIdsFormArray.value.forEach(
      (value: string | null, iVegaDataSet: number): void => {
        const vegaDataSet = this.vegaDataSets[iVegaDataSet];
        const vegaSpecDataSet = vegaSpec?.data?.[
          vegaDataSet.index
        ] as VegaBaseData;
        if (value === this.sedmlLocationsReportIds.value[0].uri) {
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

          vegaSpecUrlDataSet.url = this.visualizationService.getReportResultsUrl(
            this.uuid,
            value as string,
          );
          vegaSpecUrlDataSet.format = {
            type: 'json',
            property: 'data',
          };
        }
      },
    );

    this.vegaSpec.next(this._vegaSpec);
    // this.changeDetectorRef.detectChanges();
  }

  public vegaErrorHandler(): void {
    this.vegaFileFormControl.setErrors({ invalid: true });
    this.changeDetectorRef.detectChanges();
  }

  private iVisualizationTab = 3;

  public selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == this.iVisualizationTab) {
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
