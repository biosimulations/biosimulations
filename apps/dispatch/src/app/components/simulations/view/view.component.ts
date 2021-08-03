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
  ValidationErrors,
} from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { VisualizationService } from '../../../services/visualization/visualization.service';
import {
  PlotlyVisualizationComponent,
  AxisType,
  TraceType,
  TraceMode,
  Trace,
  DataLayout,
} from './plotly-visualization/plotly-visualization.component';
import { CombineService } from '../../../services/combine/combine.service';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import {
  Simulation,
  SedDatasetResultsMap,
  CombineResults,
  SedDocumentResults,
  SedOutputResults,
  SedDatasetResults,
} from '../../../datamodel';
import {
  CombineArchive,
  CombineArchiveContent,
  CombineArchiveContentFile,
  SedDocument,
  SedModel,
  SedSimulation,
  SedAbstractTask,
  SedDataGenerator,
  SedOutput,
  SedOutputType,
  SedPlot2D,
  SedReport,
  SedDataSet,
} from '../../../combine-sedml.interface';
import { SimulationLogs } from '../../../simulation-logs-datamodel';
import { ConfigService } from '@biosimulations/shared/services';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
  combineLatest,
} from 'rxjs';
import { concatAll, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import {
  AxisLabelType,
  AXIS_LABEL_TYPES,
  FormattedSimulation,
  TraceModeLabel,
  TRACE_MODE_LABELS,
} from './view.model';
import { ViewService } from './view.service';
import { Spec as VegaSpec, Format as VegaDataFormat } from 'vega';
import { VegaVisualizationComponent } from '@biosimulations/shared/ui';
import { MatSnackBar } from '@angular/material/snack-bar';
import { urls } from '@biosimulations/config/common';
import {
  CombineArchiveElementMetadata,
  MetadataValue,
} from '../../../metadata.interface';
import user1DHistogramVegaTemplate from './viz-vega-templates/1d-histogram.json';
import user2DHeatmapVegaTemplate from './viz-vega-templates/2d-heatmap.json';
import user2DLineScatterVegaTemplate from './viz-vega-templates/2d-line-scatter.json';
import { UtilsService } from '@biosimulations/shared/services';

interface Metadata {
  archive: CombineArchiveElementMetadata | null;
  other: CombineArchiveElementMetadata[];
}

interface FigureTableMetadata {
  uri: string;
  identifier: MetadataValue;
  click?: () => void;
}

enum VisualizationSource {
  sedml = 'sedml',
  vega = 'vega',
  user = 'user',
}

enum VisualizationType {
  sedml = 'sedml',
  vega = 'vega',
  user1DHistogram = 'user1DHistogram',
  user2DHeatmap = 'user2DHeatmap',
  user2DLineScatter = 'user2DLineScatter',
}

enum VisualizationRenderer {
  vega = 'vega',
  plotly = 'plotly',
}

interface Visualization {
  id: string;
  source: VisualizationSource;
  type: VisualizationType;
  renderer: VisualizationRenderer;
  uri: string | undefined;
  label: string;
  vegaSpec: Observable<VegaSpec | undefined | false>;
  sedmlOutputSpec: SedPlot2D | undefined;
  error?: Error;
}

interface VegaDataSet {
  index: number;
  name: string;
  source: string | string[] | undefined;
  url: string | undefined;
  values: any[] | undefined;
  format: VegaDataFormat | undefined;
}

export interface SedDocumentReports {
  _type: 'SedDocument';
  level: number;
  version: number;
  models: SedModel[];
  simulations: SedSimulation[];
  tasks: SedAbstractTask[];
  dataGenerators: SedDataGenerator[];
  outputs: SedReport[];
}

export interface SedDocumentReportsCombineArchiveLocation {
  _type: 'CombineArchiveLocation';
  path: string;
  value: SedDocumentReports;
}

interface SedDocumentReportsCombineArchiveContent {
  _type: 'CombineArchiveContent';
  location: SedDocumentReportsCombineArchiveLocation;
  format: string;
  master: boolean;
}

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  //this seems to be required oddly
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit, OnDestroy {
  private uuid = '';

  // simulation run
  statusRunning$!: Observable<boolean>;
  statusSucceeded$!: Observable<boolean>;
  runTime$!: Observable<string>;
  private Simulation$!: Observable<Simulation>;
  formattedSimulation$?: Observable<FormattedSimulation>;

  // metadata about COMBINE/OMEX archive of simulation run
  metadataLoaded$!: Observable<boolean | undefined>;
  metadata$!: Observable<Metadata | undefined>;
  figuresTablesMetadata$!: Observable<FigureTableMetadata[] | undefined>;

  // SED documents in COMBINE/OMEX archive of simulation run
  sedDocumentsConfiguration: CombineArchive | undefined;
  sedDocumentsConfiguration$!: Observable<CombineArchive | undefined>;
  sedDocumentReportsConfiguration$!: Observable<
    SedDocumentReportsCombineArchiveContent[]
  >;
  private sedDataSetConfigurationMap!: { [uri: string]: SedDataSet };

  // visualizations
  visualizationFormGroup: FormGroup;

  visualizations$!: Observable<Visualization[]>;
  private visualizationsIdMap!: { [id: string]: Visualization };
  selectedVisualization!: Visualization;

  @ViewChild(VegaVisualizationComponent)
  private vegaVisualization!: VegaVisualizationComponent;

  @ViewChild(PlotlyVisualizationComponent)
  private plotlyVisualization!: PlotlyVisualizationComponent;
  private plotlyVizDataLayout = new BehaviorSubject<DataLayout | null | false>(
    null,
  );
  plotlyVizDataLayout$ = this.plotlyVizDataLayout.asObservable();

  user1DHistogramDataSetsFormControl: FormControl;
  user2DHeatmapYDataSetsFormControl: FormControl;
  user2DLineScatterCurvesFormGroups: FormGroup[];

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  traceModeLabels: TraceModeLabel[] = TRACE_MODE_LABELS;

  private userSimulationResults: SedDatasetResultsMap | undefined | false =
    undefined;
  private userSimulationResultsLoadingInitialized = false;
  userSimulationResultsLoaded = false;

  // log of simulation run
  logs$!: Observable<SimulationLogs | undefined>;

  // subscriptions
  private subscriptions: Subscription[] = [];

  // tabs
  selectedTabIndex = 0;

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
    this.visualizationFormGroup = formBuilder.group({
      visualization: [null, [Validators.required]],
      user1DHistogram: formBuilder.group({
        dataSets: [[], Validators.minLength(1)],
      }),
      user2DHeatmap: formBuilder.group({
        yDataSets: [[], Validators.minLength(1)],
        xDataSet: [null],
      }),
      user2DLineScatter: formBuilder.group({
        numCurves: [
          1,
          [Validators.required, Validators.min(1), this.integerValidator],
        ],
        curves: formBuilder.array([], Validators.minLength(1)),
        xAxisType: [AxisType.linear, [Validators.required]],
        yAxisType: [AxisType.linear, [Validators.required]],
        traceMode: [TraceMode.lines, [Validators.required]],
      }),
    });

    const user1DHistogramFormGroup = this.visualizationFormGroup.controls
      .user1DHistogram as FormGroup;
    const user2DHeatmapFormGroup = this.visualizationFormGroup.controls
      .user2DHeatmap as FormGroup;
    const user2DLineScatterFormGroup = this.visualizationFormGroup.controls
      .user2DLineScatter as FormGroup;

    user1DHistogramFormGroup.disable();
    user2DHeatmapFormGroup.disable();
    user2DLineScatterFormGroup.disable();

    this.user1DHistogramDataSetsFormControl = user1DHistogramFormGroup.controls
      .dataSets as FormControl;
    this.user2DHeatmapYDataSetsFormControl = user2DHeatmapFormGroup.controls
      .yDataSets as FormControl;
    this.user2DLineScatterCurvesFormGroups = (
      user2DLineScatterFormGroup.controls.curves as FormArray
    ).controls as FormGroup[];
  }

  integerValidator(control: FormControl): ValidationErrors | null {
    if (control.value && control.value != Math.round(control.value)) {
      return {
        integer: true,
      };
    } else {
      return null;
    }
  }

  public ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    this.initSimulationRun();
    this.initVisualizations();
    this.initSimulationRunLog();
    this.initSimulationProjectMetadata();
  }

  initSimulationRun(): void {
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
  }

  initVisualizations(): void {
    const archiveUrl = `${urls.dispatchApi}run/${this.uuid}/download`;

    const archiveManifest = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<CombineArchive | undefined> => {
        return succeeded
          ? this.combineService.getCombineArchiveManifest(archiveUrl)
          : of({ _type: 'CombineArchive', contents: [] });
      }),
      concatAll(),
      shareReplay(1),
    );

    this.sedDocumentsConfiguration$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<CombineArchive | undefined> => {
        return succeeded
          ? this.visualizationService.getSpecsOfSedDocsInCombineArchive(
              this.uuid,
            )
          : of({ _type: 'CombineArchive', contents: [] });
      }),
      concatAll(),
      shareReplay(1),
    );

    const sedDocumentsConfigurationSub =
      this.sedDocumentsConfiguration$.subscribe(
        (archive: CombineArchive | undefined): void => {
          this.sedDocumentsConfiguration = archive;
        },
      );
    this.subscriptions.push(sedDocumentsConfigurationSub);


    const combineResultStructure = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<CombineResults | undefined> => {
        return succeeded
          ? this.visualizationService.getCombineResultsStructure(
              this.uuid,
            )
          : of([]);
      }),
      concatAll(),
      shareReplay(1),
    );

    this.sedDocumentReportsConfiguration$ =
      combineLatest(
        this.sedDocumentsConfiguration$,
        combineResultStructure,
      )
      .pipe(
        map(
          (
            args: [CombineArchive | undefined, CombineResults | undefined],
          ): SedDocumentReportsCombineArchiveContent[] => {
            let archive = args[0];
            const combineResults = args[1];

            if (archive) {
              archive = JSON.parse(JSON.stringify(archive)) as CombineArchive;
              archive.contents.forEach(
                (content: CombineArchiveContent): void => {
                  const sedDoc = content.location.value as SedDocument;
                  sedDoc.outputs = sedDoc.outputs.filter(
                    (output: SedOutput): boolean => {
                      return output._type === 'SedReport';
                    },
                  );
                  sedDoc.outputs.sort((a: SedOutput, b: SedOutput): number => {
                    return (a.name || a.id).localeCompare((b.name || b.id), undefined, { numeric: true });
                  });
                },
              );
              archive.contents.sort((a: CombineArchiveContent, b: CombineArchiveContent): number => {
                return a.location.path.localeCompare(b.location.path, undefined, { numeric: true });
              });
              return archive.contents as SedDocumentReportsCombineArchiveContent[];

            } else if (combineResults) {
              this.snackBar.open(
                'Sorry! We were unable to get the SED-ML and Vega charts for this project.',
                undefined,
                {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                },
              );

              return combineResults
                .map((sedDocumentResults: SedDocumentResults): SedDocumentReportsCombineArchiveContent => {
                  return {
                    _type: 'CombineArchiveContent',
                    location: {
                      _type: 'CombineArchiveLocation',
                      path: sedDocumentResults.location,
                      value: {
                        _type: 'SedDocument',
                        level: 0,
                        version: 0,
                        models: [],
                        simulations: [],
                        tasks: [],
                        dataGenerators: [],
                        outputs: sedDocumentResults.outputs.map((outputResults: SedOutputResults): SedReport => {
                          return {
                            _type: SedOutputType.SedReport,
                            id: outputResults.id,
                            name: null,
                            dataSets: outputResults.datasets.map((dataSetResults: SedDatasetResults): SedDataSet => {
                              return {
                                _type: 'SedDataSet',
                                id: dataSetResults.id,
                                label: dataSetResults.label,
                                name: null,
                                dataGenerator: undefined,
                              };
                            }),
                          }
                        })
                        .sort((a: SedReport, b: SedReport): number => {
                          return a.id.localeCompare(b.id, undefined, { numeric: true });
                        }),
                      },
                    },
                    format: 'http://identifiers.org/combine.specifications/sed-ml',
                    master: true,
                  }
                })
                .sort((a: SedDocumentReportsCombineArchiveContent, b: SedDocumentReportsCombineArchiveContent): number => {
                  return a.location.path.localeCompare(b.location.path, undefined, { numeric: true });
                });
            } else {
              return [];
            }
          },
        ),
        shareReplay(1),
      );

    this.sedDocumentReportsConfiguration$.subscribe(
      (contents: SedDocumentReportsCombineArchiveContent[]): void => {
        this.sedDataSetConfigurationMap = {};
        contents.forEach(
          (sedDoc: SedDocumentReportsCombineArchiveContent): void => {
            sedDoc.location.value.outputs.forEach((output: SedReport): void => {
              output.dataSets.forEach((dataSet: SedDataSet): void => {
                const uri =
                  sedDoc.location.path + '/' + output.id + '/' + dataSet.id;
                this.sedDataSetConfigurationMap[uri] = dataSet;
              });
            });
          },
        );
      },
    );

    this.visualizations$ = combineLatest(
      this.statusSucceeded$,
      archiveManifest,
      this.sedDocumentsConfiguration$,
    ).pipe(
      map(
        (
          args: [
            boolean,
            CombineArchive | undefined,
            CombineArchive | undefined,
          ],
        ): Visualization[] => {
          const succeeded = args[0];
          const manifest = args[1];
          const sedmlSpecs = args[2];

          const visualizations: Visualization[] = [];
          if (succeeded) {
            if (manifest && sedmlSpecs) {
              for (const content of manifest.contents) {
                if (
                  content.format ==
                  'http://purl.org/NET/mediatypes/application/vega+json'
                ) {
                  visualizations.push({
                    id:
                      'vega/' +
                      (content.location.value as CombineArchiveContentFile)
                        .filename,
                    source: VisualizationSource.vega,
                    type: VisualizationType.vega,
                    renderer: VisualizationRenderer.vega,
                    uri: (content.location.value as CombineArchiveContentFile)
                      .filename,
                    label:
                      (content.location.value as CombineArchiveContentFile)
                        .filename + ' (Vega)',
                    vegaSpec: of(undefined),
                    sedmlOutputSpec: undefined,
                  });
                }
              }

              for (const content of sedmlSpecs.contents) {
                const sedDocument = content.location.value as SedDocument;
                for (const output of sedDocument.outputs) {
                  if (['SedPlot2D'].includes(output._type)) {
                    visualizations.push({
                      id: `sedml/${content.location.path}/${output.id}`,
                      source: VisualizationSource.sedml,
                      type: VisualizationType.sedml,
                      renderer: VisualizationRenderer.plotly,
                      uri: `${content.location.path}/${output.id}`,
                      label: `${output.name || output.id} of ${
                        content.location.path
                      } (SED-ML 2D line plot)`,
                      vegaSpec: of(undefined),
                      sedmlOutputSpec: output as SedPlot2D,
                    });
                  }
                }
              }
            }

            visualizations.push({
              id: `user1DHistogram`,
              source: VisualizationSource.user,
              type: VisualizationType.user1DHistogram,
              renderer: VisualizationRenderer.plotly,
              uri: undefined,
              label: 'Design a 1D histogram',
              vegaSpec: of(undefined),
              sedmlOutputSpec: undefined,
            });

            visualizations.push({
              id: `user2DHeatmap`,
              source: VisualizationSource.user,
              type: VisualizationType.user2DHeatmap,
              renderer: VisualizationRenderer.plotly,
              uri: undefined,
              label: 'Design a 2D heatmap',
              vegaSpec: of(undefined),
              sedmlOutputSpec: undefined,
            });

            visualizations.push({
              id: `user2DLineScatter`,
              source: VisualizationSource.user,
              type: VisualizationType.user2DLineScatter,
              renderer: VisualizationRenderer.plotly,
              uri: undefined,
              label: 'Design a 2D line or scatter plot',
              vegaSpec: of(undefined),
              sedmlOutputSpec: undefined,
            });
          }

          this.visualizationsIdMap = {};
          for (const visualization of visualizations) {
            this.visualizationsIdMap[visualization.id] = visualization;
          }

          if (visualizations.length) {
            const visualizationFormControl = this.visualizationFormGroup
              .controls.visualization as FormControl;
            visualizationFormControl.setValue(visualizations[0].id);
            this.selectVisualization();
          }

          visualizations.sort((a: Visualization, b: Visualization): number => {
            let aSource = 0;
            let bSource = 0;
            switch (a.source) {
              case VisualizationSource.vega:
                aSource = 0;
                break;
              case VisualizationSource.sedml:
                aSource = 1;
                break;
              default:
                aSource = 2;
                break;
            }
            switch (b.source) {
              case VisualizationSource.vega:
                bSource = 0;
                break;
              case VisualizationSource.sedml:
                bSource = 1;
                break;
              default:
                bSource = 2;
                break;
            }

            if (aSource < bSource) {
              return -1;
            }
            if (aSource > bSource) {
              return 1;
            }

            return a.label.localeCompare(b.label, undefined, { numeric: true });
          });
          return visualizations;
        },
      ),
      shareReplay(1),
    );
  }

  initSimulationRunLog(): void {
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
            'Sorry! We were unable to get the log for this project.',
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
  }

  initSimulationProjectMetadata(): void {
    const archiveUrl = this.getArchiveUrl();
    this.metadata$ = combineLatest(
      this.combineService.getCombineArchiveMetadata(archiveUrl),
      this.visualizations$,
      this.sedDocumentsConfiguration$,
    ).pipe(
      map(
        (
          args: [
            CombineArchiveElementMetadata[] | undefined,
            Visualization[],
            CombineArchive | undefined,
          ],
        ): Metadata | undefined => {
          let elMetadatas = args[0];
          const visualizations = args[1];
          const sedDocumentsConfiguration = args[2];

          if (elMetadatas === undefined) {
            return undefined;
          }

          elMetadatas = elMetadatas.map(
            (
              elMetadata: CombineArchiveElementMetadata,
            ): CombineArchiveElementMetadata => {
              elMetadata = Object.assign({}, elMetadata);
              elMetadata.thumbnails = elMetadata.thumbnails.map(
                (thumbnail: string): string => {
                  return `${urls.combineApi}combine/file?url=${encodeURI(
                    archiveUrl,
                  )}&location=${encodeURI(thumbnail)}`;
                },
              );

              if (elMetadata.created) {
                elMetadata.created = UtilsService.getDateString(
                  new Date(elMetadata.created),
                );
              }
              elMetadata.modified = elMetadata.modified.map(
                (date: string): string => {
                  return UtilsService.getDateString(new Date(date));
                },
              );
              elMetadata.modified.sort();
              elMetadata.modified.reverse();

              return elMetadata;
            },
          );

          const visualizationsUriIdMap: { [uri: string]: string } = {};
          for (const visualization of visualizations) {
            if (visualization.uri) {
              visualizationsUriIdMap[visualization.uri] = visualization.id;
            }
          }

          const sedUris = new Set<string>();
          if (sedDocumentsConfiguration) {
            sedDocumentsConfiguration.contents.forEach(
              (content: CombineArchiveContent): void => {
                const uri = content.location.path;
                const sedDocument = content.location.value as SedDocument;
                sedUris.add(uri);
                sedDocument.outputs.forEach((output: SedOutput): void => {
                  sedUris.add(uri + '/' + output.id);
                });
              },
            );
          }

          return {
            archive: elMetadatas.filter(
              (elMetadata: CombineArchiveElementMetadata): boolean => {
                return elMetadata.uri === '.';
              },
            )?.[0],
            other: elMetadatas
              .filter((elMetadata: CombineArchiveElementMetadata): boolean => {
                return elMetadata.uri !== '.';
              })
              .map(
                (
                  elMetadata: CombineArchiveElementMetadata,
                ): CombineArchiveElementMetadata => {
                  if (elMetadata.uri.startsWith('./')) {
                    elMetadata.uri = elMetadata.uri.substring(2);
                  }

                  if (elMetadata.uri in visualizationsUriIdMap) {
                    elMetadata.click = (): void => {
                      const vizFormControl = this.visualizationFormGroup
                        .controls.visualization as FormControl;
                      vizFormControl.setValue(
                        visualizationsUriIdMap[elMetadata.uri],
                      );
                      this.selectVisualization();
                      this.selectedTabIndex = this.iViewChartTab;
                    };
                  } else if (sedUris.has(elMetadata.uri)) {
                    elMetadata.click = (): void => {
                      this.selectedTabIndex = this.iSelectChartTab;
                    };
                  }

                  return elMetadata;
                },
              ),
          };
        },
      ),
      shareReplay(1),
    );
    this.metadataLoaded$ = this.metadata$.pipe(
      map((): boolean => {
        return true;
      }),
      shareReplay(1),
    );
    this.figuresTablesMetadata$ = this.metadata$.pipe(
      map(
        (metadata: Metadata | undefined): FigureTableMetadata[] | undefined => {
          if (metadata) {
            const figuresTables: FigureTableMetadata[] = [];
            metadata.other.forEach(
              (other: CombineArchiveElementMetadata): void => {
                other.identifiers.forEach((identifier: MetadataValue): void => {
                  figuresTables.push({
                    uri: other.uri,
                    identifier: identifier,
                    click: other.click,
                  });
                });
              },
            );
            return figuresTables;
          } else {
            return undefined;
          }
        },
      ),
      shareReplay(1),
    );
  }

  getArchiveUrl(): string {
    return `${urls.dispatchApi}run/${this.uuid}/download`;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public selectVisualization(): void {
    (
      this.visualizationFormGroup.controls.user1DHistogram as FormGroup
    ).disable();
    (this.visualizationFormGroup.controls.user2DHeatmap as FormGroup).disable();
    (
      this.visualizationFormGroup.controls.user2DLineScatter as FormGroup
    ).disable();

    this.selectedVisualization =
      this.visualizationsIdMap?.[
        this.visualizationFormGroup.value.visualization
      ];
    if (this.selectedVisualization) {
      switch (this.selectedVisualization.type) {
        case VisualizationType.vega: {
          this.setUpVegaVisualization();
          break;
        }
        case VisualizationType.sedml: {
          this.setUpSedmlVisualization();
          break;
        }
        case VisualizationType.user1DHistogram: {
          (
            this.visualizationFormGroup.controls.user1DHistogram as FormGroup
          ).enable();
          this.setUpUser1DHistogramVisualization();
          break;
        }
        case VisualizationType.user2DHeatmap: {
          (
            this.visualizationFormGroup.controls.user2DHeatmap as FormGroup
          ).enable();
          this.setUpUser2DHeatmapVisualization();
          break;
        }
        case VisualizationType.user2DLineScatter: {
          (
            this.visualizationFormGroup.controls.user2DLineScatter as FormGroup
          ).enable();
          this.setUpUser2DLineScatterVisualization();
          break;
        }
      }
    }
  }

  /* Vega visualization */
  private setUpVegaVisualization(): void {
    const visualization = this.selectedVisualization;

    const archiveUrl = this.getArchiveUrl();

    visualization.vegaSpec = this.combineService
      .getFileInCombineArchive(archiveUrl, visualization.uri as string)
      .pipe(
        map((spec: VegaSpec | undefined): VegaSpec | false => {
          if (spec) {
            // link attributes of SED-ML documents to Vega signals
            if (Array.isArray(spec?.signals)) {
              for (const signal of spec?.signals) {
                const anySignal = signal as any;
                if ('sedmlUri' in signal) {
                  const sedmlSimulationAttributePath =
                    anySignal.sedmlUri as any;
                  anySignal.value = this.getValueOfSedmlObjectAttribute(
                    sedmlSimulationAttributePath,
                  );
                  if (anySignal.value === undefined) {
                    return false;
                  }
                  delete anySignal['sedmlUri'];
                }

                if ('bind' in signal) {
                  const bind = signal.bind as any;
                  for (const [key, val] of Object.entries(bind)) {
                    const anyVal = val as any;
                    if (
                      anyVal != null &&
                      typeof anyVal === 'object' &&
                      'sedmlUri' in anyVal
                    ) {
                      bind[key] = this.getValueOfSedmlObjectAttribute(
                        anyVal['sedmlUri'],
                      );
                      if (bind[key] === undefined) {
                        return false;
                      }
                    }
                  }
                }
              }
            }

            // link results of SED-ML reports to Vega data sets
            if (Array.isArray(spec?.data)) {
              for (const data of spec?.data) {
                const anyData = data as any;
                const name = anyData?.name;
                if ('sedmlUri' in anyData) {
                  if (
                    anyData.sedmlUri?.length == 0 ||
                    (anyData.sedmlUri?.length == 2 &&
                      this.getSedReport(anyData.sedmlUri) &&
                      !Array.isArray(this.getSedReport(anyData.sedmlUri)))
                  ) {
                    anyData.url = this.visualizationService.getRunResultsUrl(
                      this.uuid,
                      anyData.sedmlUri.join('/'),
                    );
                    anyData.format = {
                      type: 'json',
                      property:
                        anyData.sedmlUri?.length == 0 ? 'outputs' : 'data',
                    };
                    delete anyData['sedmlUri'];
                    if ('values' in anyData) {
                      delete anyData['values'];
                    }
                  } else {
                    return false;
                  }
                }
              }
            }

            return spec;
          } else {
            return false;
          }
        }),
        shareReplay(1),
      );
  }

  private getSedDocument(path: any): SedDocument | SedDocument[] | undefined {
    if (!Array.isArray(path)) {
      return undefined;
    }

    if (!this.sedDocumentsConfiguration) {
      return undefined;
    }

    const contentTypeUriStr = path?.[0];
    if (
      !(
        typeof contentTypeUriStr === 'string' ||
        contentTypeUriStr instanceof String
      )
    ) {
      return undefined;
    }

    const contentTypeUriArr = contentTypeUriStr.split(':');
    const contentType =
      contentTypeUriArr.length === 1 ? '' : contentTypeUriArr[0];
    let contentUri = contentTypeUriArr[contentTypeUriArr.length - 1];

    if (contentUri.startsWith('./')) {
      contentUri = contentUri.substring(2);
    }

    const contents: SedDocument[] = [];
    const multipleContents = contentUri === '*';

    for (
      let iContent = 0;
      iContent < this.sedDocumentsConfiguration.contents.length;
      iContent++
    ) {
      const content = this.sedDocumentsConfiguration.contents[iContent];
      let thisContentUri = content.location.path;
      if (thisContentUri.startsWith('./')) {
        thisContentUri = thisContentUri.substring(2);
      }
      if (
        ['', 'SedDocument'].includes(contentType) &&
        (['*', thisContentUri].includes(contentUri) ||
          contentUri === `[${iContent}]`)
      ) {
        contents.push(content.location.value as SedDocument);
      }
    }

    if (multipleContents) {
      return contents;
    } else if (contents.length) {
      return contents[0];
    } else {
      return undefined;
    }
  }

  private getSedReport(path: any): SedReport | SedReport[] | undefined {
    const sedDocument: SedDocument | SedDocument[] | undefined =
      this.getSedDocument(path);
    if (!sedDocument || Array.isArray(sedDocument)) {
      return undefined;
    }

    const reportTypeIdStr = path?.[1];
    if (
      !(
        typeof reportTypeIdStr === 'string' || reportTypeIdStr instanceof String
      )
    ) {
      return undefined;
    }

    const reportTypeIdArr = reportTypeIdStr.split(':');
    const reportType = reportTypeIdArr.length === 1 ? '' : reportTypeIdArr[0];
    const reportId = reportTypeIdArr[reportTypeIdArr.length - 1];

    const reports: SedReport[] = [];
    const multipleReports = reportId === '*';

    let iReport = -1;
    for (const thisOutput of sedDocument.outputs) {
      if (thisOutput._type == 'SedReport') {
        iReport++;
        if (
          ['', 'Report'].includes(reportType) &&
          (['*', thisOutput.id].includes(reportId) ||
            reportId === `[${iReport}]`)
        ) {
          reports.push(thisOutput as SedReport);
        }
      }
    }

    if (multipleReports) {
      return reports;
    } else {
      if (reports.length) {
        return reports[0];
      }
    }

    return undefined;
  }

  private getValueOfSedmlObjectAttribute(path: any): any {
    const sedDocument: SedDocument | SedDocument[] | undefined =
      this.getSedDocument(path);
    if (!sedDocument) {
      return undefined;
    }

    const objectTypeIdStr = path?.[1];
    if (
      !(
        typeof objectTypeIdStr === 'string' || objectTypeIdStr instanceof String
      )
    ) {
      return undefined;
    }
    const objectTypeIdArr = objectTypeIdStr.split(':');
    const objectType = objectTypeIdArr.length === 1 ? '' : objectTypeIdArr[0];
    const objectId = objectTypeIdArr[objectTypeIdArr.length - 1];

    const sedObjects: (SedSimulation | SedReport)[] = [];
    const multipleSedObjects = objectId === '*' || Array.isArray(sedDocument);
    const sedDocuments = Array.isArray(sedDocument)
      ? sedDocument
      : [sedDocument];

    for (const sedDocument of sedDocuments) {
      for (let iSim = 0; iSim < sedDocument.simulations.length; iSim++) {
        const thisSimulation = sedDocument.simulations[iSim];
        if (
          ['Simulation', ''].includes(objectType) &&
          (['*', thisSimulation.id].includes(objectId) ||
            objectId === `[${iSim}]`)
        ) {
          sedObjects.push(thisSimulation);
        }
      }
      let iReport = -1;
      for (let iOutput = 0; iOutput < sedDocument.outputs.length; iOutput++) {
        const thisOutput = sedDocument.outputs[iOutput];
        if (thisOutput._type == 'SedReport') {
          iReport++;
          if (
            ['Report', ''].includes(objectType) &&
            (['*', thisOutput.id].includes(objectId) ||
              objectId === `[${iReport}]`)
          ) {
            sedObjects.push(thisOutput as SedReport);
          }
        }
      }
    }

    if (!multipleSedObjects && !sedObjects.length) {
      return undefined;
    }

    if (path.length > 3) {
      return undefined;
    }

    let attributeName = path?.[2];
    if (
      !(typeof attributeName === 'string' || attributeName instanceof String)
    ) {
      return undefined;
    }
    if (attributeName === 'numberOfPoints') {
      attributeName = 'numberOfSteps';
    }

    const attributeValues: any[] = [];
    for (const sedObject of sedObjects) {
      if (attributeName in (sedObject as any)) {
        attributeValues.push((sedObject as any)[attributeName]);
      } else {
        return undefined;
      }
    }

    if (multipleSedObjects) {
      return attributeValues;
    } else {
      return attributeValues[0];
    }

    return undefined;
  }

  /* SED-ML visualization */
  private setUpSedmlVisualization(): void {
    const visualization = this.selectedVisualization;
    this.plotlyVizDataLayout.next(null);

    const sub = this.visualizationService
      .getCombineResults(this.uuid) // TODO: replace with the following line when #2683 is fixed
      // .getCombineResults(this.uuid, visualization.uri as string)
      .subscribe((results: SedDatasetResultsMap | undefined): void => {
        if (results) {
          const traces: Trace[] = [];
          const xAxisTitlesSet = new Set<string>();
          const yAxisTitlesSet = new Set<string>();
          const output = visualization.sedmlOutputSpec as SedPlot2D;
          let missingData = false;
          for (const curve of output.curves) {
            const xId = curve.xDataGenerator._resultsDataSetId;
            const yId = curve.yDataGenerator._resultsDataSetId;
            xAxisTitlesSet.add(
              curve.xDataGenerator.name || curve.xDataGenerator.id,
            );
            yAxisTitlesSet.add(
              curve.yDataGenerator.name || curve.yDataGenerator.id,
            );
            const trace = {
              name: curve.name || curve.id,
              x: results?.[xId]?.values,
              y: results?.[yId]?.values,
              xaxis: 'x1',
              yaxis: 'y1',
              type: TraceType.scatter,
              mode: TraceMode.lines,
            };
            if (trace.x && trace.y) {
              traces.push(trace as Trace);
            } else {
              missingData = true;
            }
          }

          const xAxisTitlesArr = Array.from(xAxisTitlesSet);
          const yAxisTitlesArr = Array.from(yAxisTitlesSet);
          let xAxisTitle: string | undefined = undefined;
          let yAxisTitle: string | undefined = undefined;
          let showLegend = false;

          if (xAxisTitlesArr.length == 1) {
            xAxisTitle = xAxisTitlesArr[0];
          } else if (xAxisTitlesArr.length > 1) {
            xAxisTitle = 'Multiple';
            showLegend = true;
          }

          if (yAxisTitlesArr.length == 1) {
            yAxisTitle = yAxisTitlesArr[0];
          } else if (yAxisTitlesArr.length > 1) {
            yAxisTitle = 'Multiple';
            showLegend = true;
          }

          const dataLayout = {
            data: traces,
            layout: {
              xaxis1: {
                anchor: 'x1',
                title: xAxisTitle,
                type: output.xScale,
              },
              yaxis1: {
                anchor: 'y1',
                title: yAxisTitle,
                type: output.yScale,
              },
              grid: {
                rows: 1,
                columns: 1,
                pattern: 'independent',
              },
              showlegend: showLegend,
              width: undefined,
              height: undefined,
            },
          } as DataLayout;
          if (missingData) {
            this.plotlyVizDataLayout.next(false);
          } else {
            this.plotlyVizDataLayout.next(dataLayout);
          }
        } else {
          this.plotlyVizDataLayout.next(false);
        }
      });
    this.subscriptions.push(sub);
  }

  /* User-defined visualization */
  private setUpUser1DHistogramVisualization() {
    this.getUserSimulationResults();
    this.displayUser1DHistogram();
  }

  private setUpUser2DHeatmapVisualization() {
    this.getUserSimulationResults();
    this.displayUser2DHeatmap();
  }

  private setUpUser2DLineScatterVisualization() {
    this.getUserSimulationResults();
    this.setNum2DLineScatterCurves();
    this.displayUser2DLineScatterViz();
  }

  private getUserSimulationResults(): void {
    if (!this.userSimulationResultsLoadingInitialized) {
      this.userSimulationResultsLoadingInitialized = true;
      this.visualizationService
        .getCombineResults(this.uuid)
        .subscribe((results: SedDatasetResultsMap | undefined): void => {
          this.userSimulationResults = results || false;
          this.userSimulationResultsLoaded = results !== undefined;
          if (this.selectedVisualization.source == VisualizationSource.user) {
            this.selectVisualization();
          }
        });
    }
  }

  public setSelectedDataSets(
    formControl: FormControl,
    type: 'SedDocument' | 'SedReport' | 'SedDataSet',
    sedDocument: SedDocumentReportsCombineArchiveContent,
    sedDocumentId: string,
    report?: SedReport,
    reportId?: string,
    dataSet?: SedDataSet,
    dataSetId?: string,
  ): void {
    // const formGroup = this.visualizationFormGroup.controls.user1DHistogram as FormGroup;
    // const formControl = formGroup.controls.dataSets as FormControl;
    const selectedUris = new Set(formControl.value);

    const uri =
      sedDocumentId +
      (reportId ? '/' + reportId : '') +
      (dataSetId ? '/' + dataSetId : '');
    const selected = selectedUris.has(uri);

    if (type === 'SedDocument') {
      sedDocument.location.value.outputs.forEach((report: SedReport): void => {
        const reportUri = uri + '/' + report.id;
        if (selected) {
          selectedUris.add(reportUri);
        } else {
          selectedUris.delete(reportUri);
        }

        report.dataSets.forEach((dataSet: SedDataSet): void => {
          const dataSetUri = reportUri + '/' + dataSet.id;
          if (selected) {
            selectedUris.add(dataSetUri);
          } else {
            selectedUris.delete(dataSetUri);
          }
        });
      });
    } else if (type === 'SedReport') {
      if (!selected) {
        selectedUris.delete(sedDocumentId);
      }

      (report as SedReport).dataSets.forEach((dataSet: SedDataSet): void => {
        const dataSetUri = uri + '/' + dataSet.id;
        if (selected) {
          selectedUris.add(dataSetUri);
        } else {
          selectedUris.delete(dataSetUri);
        }
      });

      let hasAllReports = true;
      for (const report of sedDocument.location.value.outputs) {
        const reportUri = sedDocumentId + '/' + (report as SedReport).id;
        if (!selectedUris.has(reportUri)) {
          hasAllReports = false;
          break;
        }
      }
      if (hasAllReports) {
        selectedUris.add(sedDocumentId);
      }
    } else {
      if (selected) {
        let hasAllDataSets = true;
        for (const dataSet of (report as SedReport).dataSets) {
          const dataSetUri =
            sedDocumentId + '/' + (report as SedReport).id + '/' + dataSet.id;
          if (!selectedUris.has(dataSetUri)) {
            hasAllDataSets = false;
            break;
          }
        }
        if (hasAllDataSets) {
          selectedUris.add(sedDocumentId + '/' + (reportId as string));
        }

        let hasAllReports = true;
        for (const report of sedDocument.location.value.outputs) {
          const reportUri = sedDocumentId + '/' + (report as SedReport).id;
          if (!selectedUris.has(reportUri)) {
            hasAllReports = false;
            break;
          }
        }
        if (hasAllReports) {
          selectedUris.add(sedDocumentId);
        }
      } else {
        selectedUris.delete(sedDocumentId + '/' + (reportId as string));
        selectedUris.delete(sedDocumentId);
      }
    }

    formControl.setValue(Array.from(selectedUris));
    this.displayUserViz();
  }

  public setNum2DLineScatterCurves(): void {
    const formGroup = this.visualizationFormGroup.controls
      .user2DLineScatter as FormGroup;
    const numCurves = Math.round(formGroup.value.numCurves);
    const curvesFormArray = formGroup.controls.curves as FormArray;

    while (curvesFormArray.length > numCurves) {
      curvesFormArray.removeAt(curvesFormArray.length - 1);
    }

    while (curvesFormArray.length < numCurves) {
      const curve = this.formBuilder.group({
        name: [null],
        xData: [[], [Validators.required]],
        yData: [[], [Validators.required]],
      });
      curvesFormArray.push(curve);
    }
  }

  public displayUserViz(): void {
    switch (this.selectedVisualization.type) {
      case VisualizationType.user1DHistogram: {
        this.displayUser1DHistogram();
        break;
      }
      case VisualizationType.user2DHeatmap: {
        this.displayUser2DHeatmap();
        break;
      }
      case VisualizationType.user2DLineScatter: {
        this.displayUser2DLineScatterViz();
        break;
      }
    }
  }

  private displayUser1DHistogram(): void {
    if (this.userSimulationResults) {
      const formGroup = this.visualizationFormGroup.controls
        .user1DHistogram as FormGroup;
      const formControl = formGroup.controls.dataSets as FormControl;
      const selectedUris = formControl.value;

      let allData: any = [];
      let missingData = false;
      const xAxisTitles: string[] = [];
      for (let selectedUri of selectedUris) {
        if (selectedUri.startsWith('./')) {
          selectedUri = selectedUri.substring(2);
        }

        const selectedDataSet = this.sedDataSetConfigurationMap?.[selectedUri];
        if (selectedDataSet) {
          const data = this.userSimulationResults?.[selectedUri];
          if (data) {
            allData = allData.concat(this.flattenArray(data.values));
            xAxisTitles.push(data.label);
          } else {
            missingData = true;
            break;
          }
        }
      }

      const trace = {
        x: allData,
        xaxis: 'x1',
        yaxis: 'y1',
        type: TraceType.histogram,
      };

      let xAxisTitle: string | undefined = undefined;
      if (xAxisTitles.length === 1) {
        xAxisTitle = xAxisTitles[0];
      } else if (xAxisTitles.length > 1) {
        xAxisTitle = 'Multiple';
      }

      const dataLayout = {
        data: [trace],
        layout: {
          xaxis1: {
            anchor: 'x1',
            title: xAxisTitle,
            type: 'linear',
          },
          yaxis1: {
            anchor: 'y1',
            title: 'Frequency',
            type: 'linear',
          },
          grid: {
            rows: 1,
            columns: 1,
            pattern: 'independent',
          },
          showlegend: false,
          width: undefined,
          height: undefined,
        },
      } as DataLayout;

      if (missingData) {
        this.plotlyVizDataLayout.next(false);
      } else {
        this.plotlyVizDataLayout.next(dataLayout);
      }
    } else if (this.userSimulationResults === undefined) {
      this.plotlyVizDataLayout.next(null);
    } else {
      this.plotlyVizDataLayout.next(false);
    }
  }

  private flattenArray(nestedArray: any[]): any[] {
    const flattenedArray: any[] = [];
    const toFlatten = [...nestedArray];
    while (toFlatten.length) {
      const el = toFlatten.pop();
      if (Array.isArray(el)) {
        toFlatten.push(el);
      } else {
        flattenedArray.push(el);
      }
    }
    return flattenedArray;
  }

  private displayUser2DHeatmap(): void {
    if (this.userSimulationResults) {
      const formGroup = this.visualizationFormGroup.controls
        .user2DHeatmap as FormGroup;
      const yFormControl = formGroup.controls.yDataSets as FormControl;
      const xFormControl = formGroup.controls.xDataSet as FormControl;
      const selectedYUris = yFormControl.value;
      const selectedXUri = xFormControl.value;

      let missingData = false;

      const zData: any[][] = [];
      const yTicks: string[] = [];
      for (let selectedUri of selectedYUris) {
        if (selectedUri.startsWith('./')) {
          selectedUri = selectedUri.substring(2);
        }

        const selectedDataSet = this.sedDataSetConfigurationMap?.[selectedUri];
        if (selectedDataSet) {
          const data = this.userSimulationResults?.[selectedUri];
          if (data) {
            const flattenedData = this.flattenArray(data.values);
            zData.push(flattenedData);
            yTicks.push(data.label);
          } else {
            missingData = true;
            break;
          }
        }
      }

      let xTicks: any[] | undefined = undefined;
      let xAxisTitle: string | undefined = undefined;
      if (selectedXUri) {
        const data = this.userSimulationResults?.[selectedXUri];
        if (data) {
          xTicks = this.flattenArray(data.values);
          xAxisTitle = data.label;
        } else {
          missingData = true;
        }
      }

      zData.reverse();
      yTicks.reverse();

      const trace = {
        z: zData,
        y: yTicks,
        x: xTicks,
        xaxis: 'x1',
        yaxis: 'y1',
        type: TraceType.heatmap,
        hoverongaps: false,
      };

      const dataLayout = {
        data: [trace],
        layout: {
          xaxis1: {
            anchor: 'x1',
            title: xAxisTitle,
            type: 'linear',
          },
          //yaxis1: {
          //  anchor: 'y1',
          //  title: undefined,
          //  type: 'linear',
          //},
          grid: {
            rows: 1,
            columns: 1,
            pattern: 'independent',
          },
          showlegend: false,
          width: undefined,
          height: undefined,
        },
      } as DataLayout;

      if (missingData) {
        this.plotlyVizDataLayout.next(false);
      } else {
        this.plotlyVizDataLayout.next(dataLayout);
      }
    } else if (this.userSimulationResults === undefined) {
      this.plotlyVizDataLayout.next(null);
    } else {
      this.plotlyVizDataLayout.next(false);
    }
  }

  private displayUser2DLineScatterViz(): void {
    if (this.userSimulationResults) {
      const formGroup = this.visualizationFormGroup.controls
        .user2DLineScatter as FormGroup;
      const traceMode = (formGroup.controls.traceMode as FormControl).value;

      const traces = [];
      const xAxisTitlesSet = new Set<string>();
      const yAxisTitlesSet = new Set<string>();
      let missingData = false;

      for (const curve of this.user2DLineScatterCurvesFormGroups) {
        for (const xDataUri of (curve.controls.xData as FormControl).value) {
          for (const yDataUri of (curve.controls.yData as FormControl).value) {
            const xDataSet = this.sedDataSetConfigurationMap[xDataUri];
            const yDataSet = this.sedDataSetConfigurationMap[yDataUri];
            const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
            const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;
            let name!: string;
            if ((curve.controls.name as FormControl).value) {
              name = (curve.controls.name as FormControl).value;

              const attributes = [];
              if ((curve.controls.xData as FormControl).value.length > 1) {
                attributes.push(`x: ${xLabel}`);
              }
              if ((curve.controls.yData as FormControl).value.length > 1) {
                attributes.push(`y: ${yLabel}`);
              }

              if (attributes.length) {
                name += ` (${attributes.join(', ')})`;
              }
            } else {
              name = `${yLabel} vs ${xLabel}`;
            }

            const trace = {
              name: name,
              x: this.userSimulationResults?.[xDataUri]?.values,
              y: this.userSimulationResults?.[yDataUri]?.values,
              xaxis: 'x1',
              yaxis: 'y1',
              type: TraceType.scatter,
              mode: traceMode,
            };

            if (trace.x && trace.y) {
              traces.push(trace);
              xAxisTitlesSet.add(xLabel);
              yAxisTitlesSet.add(yLabel);
            } else if (xDataUri && yDataUri) {
              missingData = true;
            }
          }
        }
      }

      const xAxisTitlesArr = Array.from(xAxisTitlesSet);
      const yAxisTitlesArr = Array.from(yAxisTitlesSet);

      let xAxisTitle: string | undefined = undefined;
      let yAxisTitle: string | undefined = undefined;

      if (xAxisTitlesArr.length === 1) {
        xAxisTitle = xAxisTitlesArr[0];
      } else if (xAxisTitlesArr.length > 1) {
        xAxisTitle = 'Multiple';
      }

      if (yAxisTitlesArr.length === 1) {
        yAxisTitle = yAxisTitlesArr[0];
      } else if (yAxisTitlesArr.length > 1) {
        yAxisTitle = 'Multiple';
      }

      const dataLayout = {
        data: traces,
        layout: {
          xaxis1: {
            anchor: 'x1',
            title: xAxisTitle,
            type: (formGroup.controls.xAxisType as FormControl).value,
          },
          yaxis1: {
            anchor: 'y1',
            title: yAxisTitle,
            type: (formGroup.controls.yAxisType as FormControl).value,
          },
          grid: {
            rows: 1,
            columns: 1,
            pattern: 'independent',
          },
          showlegend: traces.length > 1,
          width: undefined,
          height: undefined,
        },
      } as DataLayout;

      if (missingData) {
        this.plotlyVizDataLayout.next(false);
      } else {
        this.plotlyVizDataLayout.next(dataLayout);
      }
    } else if (this.userSimulationResults === undefined) {
      this.plotlyVizDataLayout.next(null);
    } else {
      this.plotlyVizDataLayout.next(false);
    }
  }

  exportUserViz(format: 'vega' | 'combine'): void {
    this.selectedVisualization;

    let vega: any;
    let vegaDataSets: {
      templateNames: string[];
      sourceName: (iDataSet: number) => string;
      filteredName: (iDataSet: number) => string;
      joinedName?: string;
      joinedTransforms?: any[];
      data: { [outputUri: string]: string[] };
    }[] = [];
    let vegaSignals: { [name: string]: any } = {};
    let vegaScales: { name: string; attributes: { [key: string]: any } }[] = [];
    switch (this.selectedVisualization.type) {
      case VisualizationType.user1DHistogram: {
        const formGroup = this.visualizationFormGroup.controls
          .user1DHistogram as FormGroup;
        const formControl = formGroup.controls.dataSets as FormControl;
        const selectedUris = formControl.value;
        vega = JSON.parse(JSON.stringify(user1DHistogramVegaTemplate)) as any;

        const selectedDataSets: { [outputUri: string]: string[] } = {};
        const histogramExtent = [NaN, NaN];
        const xAxisTitles: string[] = [];
        for (let selectedUri of selectedUris) {
          if (selectedUri.startsWith('./')) {
            selectedUri = selectedUri.substring(2);
          }

          const selectedDataSet =
            this.sedDataSetConfigurationMap?.[selectedUri];
          if (selectedDataSet) {
            const data = (this.userSimulationResults as SedDatasetResultsMap)?.[
              selectedUri
            ];
            if (data) {
              const outputUri = data.location + '/' + data.outputId;
              if (!(outputUri in selectedDataSets)) {
                selectedDataSets[outputUri] = [];
              }
              selectedDataSets[outputUri].push(data.id);

              const flatData = this.flattenArray(data.values);
              histogramExtent[0] = isNaN(histogramExtent[0])
                ? Math.min(...flatData)
                : Math.min(histogramExtent[0], Math.min(...flatData));
              histogramExtent[1] = isNaN(histogramExtent[1])
                ? Math.max(...flatData)
                : Math.max(histogramExtent[1], Math.max(...flatData));

              xAxisTitles.push(data.label);
            }
          }
        }
        vegaDataSets = [
          {
            templateNames: ['rawData0', 'rawData0_filtered', 'rawData_joined'],
            sourceName: (iDataSet: number): string => `rawData${iDataSet}`,
            filteredName: (iDataSet: number): string =>
              `rawData${iDataSet}_filtered`,
            joinedName: 'rawData_joined',
            data: selectedDataSets,
          },
        ];

        let xAxisTitle: string | undefined = undefined;
        if (xAxisTitles.length === 1) {
          xAxisTitle = xAxisTitles[0];
        } else if (xAxisTitles.length > 1) {
          xAxisTitle = 'Multiple';
        }
        vegaSignals = {
          histogramExtent: [
            isNaN(histogramExtent[0]) ? null : histogramExtent[0],
            isNaN(histogramExtent[1]) ? null : histogramExtent[1],
          ],
          xAxisTitle: xAxisTitle,
        };
        break;
      }

      case VisualizationType.user2DHeatmap: {
        const formGroup = this.visualizationFormGroup.controls
          .user2DHeatmap as FormGroup;
        const yFormControl = formGroup.controls.yDataSets as FormControl;
        const xFormControl = formGroup.controls.xDataSet as FormControl;
        const selectedYUris = yFormControl.value;
        let selectedXUri = xFormControl.value;
        vega = JSON.parse(JSON.stringify(user2DHeatmapVegaTemplate)) as any;

        // y axis
        const selectedYDataSets: { [outputUri: string]: string[] } = {};
        for (let selectedUri of selectedYUris) {
          if (selectedUri.startsWith('./')) {
            selectedUri = selectedUri.substring(2);
          }

          const selectedDataSet =
            this.sedDataSetConfigurationMap?.[selectedUri];
          if (selectedDataSet) {
            const data = (this.userSimulationResults as SedDatasetResultsMap)?.[
              selectedUri
            ];
            if (data) {
              const outputUri = data.location + '/' + data.outputId;
              if (!(outputUri in selectedYDataSets)) {
                selectedYDataSets[outputUri] = [];
              }
              selectedYDataSets[outputUri].push(data.id);
            }
          }
        }

        // x axis
        let xAxisTitle: string;
        let selectedXOutputUri: string;
        let selectedXDataSetId: string;
        if (selectedXUri) {
          if (selectedXUri.startsWith('./')) {
            selectedXUri = selectedXUri.substring(2);
          }
          const data = (this.userSimulationResults as SedDatasetResultsMap)?.[
            selectedXUri
          ];
          selectedXOutputUri = data.location + '/' + data.outputId;
          selectedXDataSetId = data.id;
          xAxisTitle = data.label;
        } else {
          selectedXOutputUri = Object.keys(selectedYDataSets)[0];
          selectedXDataSetId = selectedYDataSets[selectedXOutputUri][0];
          xAxisTitle = 'Index';
        }
        const selectedXDataSet: { [outputUri: string]: string[] } = {};
        selectedXDataSet[selectedXOutputUri] = [selectedXDataSetId];

        vegaDataSets = [
          {
            templateNames: [
              'rawHeatmapData0',
              'rawHeatmapData0_filtered',
              'rawHeatmapData_joined',
            ],
            sourceName: (iDataSet: number): string =>
              `rawHeatmapData${iDataSet}`,
            filteredName: (iDataSet: number): string =>
              `rawHeatmapData${iDataSet}_filtered`,
            joinedName: 'rawHeatmapData_joined',
            data: selectedYDataSets,
          },
          {
            templateNames: ['rawXData', 'rawXData_filtered'],
            sourceName: (iDataSet: number): string => `rawXData`,
            filteredName: (iDataSet: number): string => `rawXData_filtered`,
            data: selectedXDataSet,
          },
        ];

        // signals
        vegaSignals = {
          ordinalXScale: !selectedXUri,
          xAxisTitle: xAxisTitle,
        };
        break;
      }

      case VisualizationType.user2DLineScatter: {
        const formGroup = this.visualizationFormGroup.controls
          .user2DLineScatter as FormGroup;
        vega = JSON.parse(JSON.stringify(user2DLineScatterVegaTemplate)) as any;

        // data sets
        const selectedDataSets: { [outputUri: string]: any[] } = {};
        const curveFilters: string[] = [];
        const xAxisTitlesSet = new Set<string>();
        const yAxisTitlesSet = new Set<string>();

        for (const curve of this.user2DLineScatterCurvesFormGroups) {
          for (const xDataUri of (curve.controls.xData as FormControl).value) {
            for (const yDataUri of (curve.controls.yData as FormControl).value) {
              if (
                this.userSimulationResults &&
                xDataUri in this.userSimulationResults &&
                yDataUri in this.userSimulationResults
              ) {
                const xDataSet = this.sedDataSetConfigurationMap[xDataUri];
                const yDataSet = this.sedDataSetConfigurationMap[yDataUri];
                const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
                const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;

                const xDataUriParts = xDataUri.split('/');
                const yDataUriParts = yDataUri.split('/');
                const xOutputUri = xDataUriParts
                  .slice(0, xDataUriParts.length - 1)
                  .join('/');
                const yOutputUri = yDataUriParts
                  .slice(0, yDataUriParts.length - 1)
                  .join('/');

                if (!(xOutputUri in selectedDataSets)) {
                  selectedDataSets[xOutputUri] = [];
                }
                if (!(yOutputUri in selectedDataSets)) {
                  selectedDataSets[yOutputUri] = [];
                }
                selectedDataSets[xOutputUri].push(
                  xDataUriParts[xDataUriParts.length - 1],
                );
                selectedDataSets[yOutputUri].push(
                  yDataUriParts[yDataUriParts.length - 1],
                );

                const conditions = [
                  `datum.X.outputUri === '${xOutputUri}'`,
                  `datum.X.id == '${xDataSet.id}'`,
                  `datum.Y.outputUri === '${yOutputUri}'`,
                  `datum.Y.id == '${yDataSet.id}'`,
                ];
                curveFilters.push(`(${conditions.join(' && ')})`);
                xAxisTitlesSet.add(xLabel);
                yAxisTitlesSet.add(yLabel);
              }
            }
          }
        }

        const xAxisTitlesArr = Array.from(xAxisTitlesSet);
        const yAxisTitlesArr = Array.from(yAxisTitlesSet);
        let xAxisTitle: string | null = null;
        let yAxisTitle: string | null = null;
        let singleXAxis = false;
        let singleYAxis = false;

        if (xAxisTitlesArr.length === 1) {
          singleXAxis = true;
          xAxisTitle = xAxisTitlesArr[0];
        } else if (xAxisTitlesArr.length > 1) {
          xAxisTitle = 'Multiple';
        }

        if (yAxisTitlesArr.length === 1) {
          singleYAxis = true;
          yAxisTitle = yAxisTitlesArr[0];
        } else if (yAxisTitlesArr.length > 1) {
          yAxisTitle = 'Multiple';
        }

        vegaDataSets = [
          {
            templateNames: ['rawData0', 'rawData0_filtered', 'rawData_joined'],
            sourceName: (iDataSet: number): string => `rawData${iDataSet}`,
            filteredName: (iDataSet: number): string =>
              `rawData${iDataSet}_filtered`,
            joinedName: 'rawData_joined',
            joinedTransforms: [
              {
                type: 'cross',
                as: ['X', 'Y'],
                filter: curveFilters.join('||'),
              },
            ],
            data: selectedDataSets,
          },
        ];

        //signals
        const traceMode = (formGroup.controls.traceMode as FormControl).value;
        vegaSignals = {
          singleXAxis: singleXAxis,
          singleYAxis: singleYAxis,
          xAxisTitle: xAxisTitle,
          yAxisTitle: yAxisTitle,
          style: traceMode,
        };

        // other properties
        vegaScales = [
          {
            name: 'xScale',
            attributes: {
              type: (formGroup.controls.xAxisType as FormControl).value,
            },
          },
          {
            name: 'yScale',
            attributes: {
              type: (formGroup.controls.yAxisType as FormControl).value,
            },
          },
        ];
        break;
      }
    }

    // signals
    vega.signals.forEach((signalTemplate: any): void => {
      if (signalTemplate.name in vegaSignals) {
        signalTemplate.value = vegaSignals[signalTemplate.name];
      }
    });

    // data
    vegaDataSets.forEach((vegaDataSet: any): void => {
      // remove template data sets
      for (let iData = vega.data.length - 1; iData >= 0; iData--) {
        if (vegaDataSet.templateNames.includes(vega.data[iData].name)) {
          vega.data.splice(iData, 1);
        }
      }

      // add concrete data sets
      const concreteDataSets: any[] = [];
      const filteredVegaDataSetNames: string[] = [];
      Object.entries(vegaDataSet.data).forEach(
        (outputUriDataSetIds: [string, any], iDataSet: number): void => {
          const outputUri = outputUriDataSetIds[0];
          const outputUriParts = outputUri.split('/');
          const outputId = outputUriParts.pop();
          const sedDocumentLocation = outputUriParts.join('/');
          const dataSetIds = outputUriDataSetIds[1] as string[];

          concreteDataSets.push({
            name: vegaDataSet.sourceName(iDataSet),
            sedmlUri: [sedDocumentLocation, outputId],
          });

          concreteDataSets.push({
            name: vegaDataSet.filteredName(iDataSet),
            source: concreteDataSets[concreteDataSets.length - 1].name,
            transform: [
              {
                type: 'filter',
                expr: `indexof(['${dataSetIds.join(
                  "', '",
                )}'], datum.id) !== -1`,
              },
              {
                type: 'formula',
                expr: `'${outputUri}'`,
                as: 'outputUri',
              },
            ],
          });

          filteredVegaDataSetNames.push(
            concreteDataSets[concreteDataSets.length - 1].name,
          );
        },
      );

      if (vegaDataSet.joinedName) {
        concreteDataSets.push({
          name: vegaDataSet.joinedName,
          source: filteredVegaDataSetNames,
          transform: vegaDataSet.joinedTransforms || [],
        });
      }

      vega.data = concreteDataSets.concat(vega.data);
    });

    // scales
    vegaScales.forEach((vegaScale): void => {
      for (const scale of vega.scales) {
        if (scale.name === vegaScale.name) {
          Object.entries(vegaScale.attributes).forEach(
            (keyVal: [string, any]): void => {
              scale[keyVal[0]] = keyVal[1];
            },
          );
          break;
        }
      }
    });

    // download
    const blob = new Blob([JSON.stringify(vega, null, 2)], {
      type: 'application/vega+json',
    });

    if (format === 'vega') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'visualization.json';
      a.click();
    } else {
      const sub = this.combineService
        .addFileToCombineArchive(
          `${urls.dispatchApi}run/${this.uuid}/download`,
          'plot.json',
          'http://purl.org/NET/mediatypes/application/vega+json',
          false,
          blob,
          false,
        )
        .subscribe((fileOrUrl: any | string | undefined): void => {
          if (fileOrUrl) {
            const a = document.createElement('a');
            a.download = 'project.omex';
            if (typeof fileOrUrl === 'string' || fileOrUrl instanceof String) {
              a.href = fileOrUrl as string;
            } else {
              a.href = URL.createObjectURL(fileOrUrl);
            }
            a.click();
          } else {
            this.snackBar.open(
              'Sorry! We were unable to modify your project.',
              undefined,
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              },
            );
          }
        });
      this.subscriptions.push(sub);
    }
  }

  /* tabs */
  private iSelectChartTab = 2;
  private iViewChartTab = 3;

  public selectedTabChange($event: MatTabChangeEvent): void {
    this.selectedTabIndex = $event.index;
    if ($event.index == this.iViewChartTab) {
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
