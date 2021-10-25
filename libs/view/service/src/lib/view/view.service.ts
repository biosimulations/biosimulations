import { Injectable } from '@angular/core';
import {
  map,
  Observable,
  BehaviorSubject,
  pluck,
  shareReplay,
  of,
  forkJoin,
} from 'rxjs';
import {
  ArchiveMetadata,
  LabeledIdentifier,
  DescribedIdentifier,
  CombineArchiveContentFormat,
  FORMATS,
  MODEL_FORMATS,
  SEDML_FORMAT,
  COMBINE_OMEX_FORMAT,
  VEGA_FORMAT,
  SimulationRunSedDocument,
  SedAbstractTask,
  SedTask,
  SedOutput,
  SedReport,
  SedPlot2D,
  SedDataSet,
  Ontologies,
  KisaoTerm,
  SimulationTypeBriefName,
  SimulatorIdNameMap,
  PlotlyDataLayout,
  SimulationRun,
  CombineArchiveLog,
  SedDocumentLog,
  SedTaskLog,
  SimulationRunOutput,
  SimulationRunOutputDatum,
  File as CombineArchiveFile,
  Project,
} from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { ProjectService } from '@biosimulations/angular-api-client';
import { SimulationService } from '@biosimulations/angular-api-client';
import { VegaVisualizationService } from '../vega-visualization/vega-visualization.service';
import { SedPlot2DVisualizationService } from '../sed-plot-2d-visualization/sed-plot-2d-visualization.service';
import {
  ProjectMetadata,
  Creator,
  SimulationRunMetadata as FormattedSimulationRunMetadata,
  List,
  ListItem,
  Path,
  File,
  VisualizationList,
  Visualization,
  SedPlot2DVisualization,
  VegaVisualization,
  UriSedDataSetMap,
  UriSetDataSetResultsMap,
  SedDocumentReports,
} from '@biosimulations/datamodel-view';
import { FormatService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { OntologyService } from '@biosimulations/ontology/client';
import { Spec as VegaSpec } from 'vega';
import { Dataset, Person, Article, Organization, WithContext } from 'schema-dts';
import { Endpoints } from '@biosimulations/config/common';

interface ConcreteListItem {
  title: string;
  value: string;
  icon: BiosimulationsIcon;
  url: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  formatMap!: { [uri: string]: CombineArchiveContentFormat };

  private endpoints = new Endpoints();

  public constructor(
    private projService: ProjectService,
    private simService: SimulationService,
    private vegaVisualizationService: VegaVisualizationService,
    private sedPlot2DVisualizationService: SedPlot2DVisualizationService,
    private ontologyService: OntologyService,
  ) {
    this.formatMap = {};
    FORMATS.forEach((format: CombineArchiveContentFormat): void => {
      format.combineUris.forEach((combineUri: string): void => {
        this.formatMap[combineUri] = format;
      });
    });
  }

  public getFormattedProjectMetadata(
    id: string,
  ): Observable<ProjectMetadata | undefined> {
    return this.getProjectMetadata(id).pipe(
      map((metadatas: ArchiveMetadata[]): ProjectMetadata | undefined => {
        // only select the metadata for the root object
        const rootMetadata = metadatas.filter(
          (metadata: ArchiveMetadata): boolean => {
            return metadata.uri == id;
          },
        );

        // If no root metadata, set as undefined
        const metadata = rootMetadata.length > 0 ? rootMetadata[0] : undefined;
        if (!metadata) {
          return undefined;
        }
        // Check for undefiend metadata for all fields
        const formattedMetadata: ProjectMetadata = {
          thumbnails: metadata?.thumbnails || [],
          title: metadata?.title || id,
          abstract: metadata?.abstract,
          creators: (metadata?.creators || []).map(
            (creator: LabeledIdentifier): Creator => {
              let icon: BiosimulationsIcon = 'link';
              if (creator.uri) {
                if (
                  creator.uri.match(
                    /^https?:\/\/(wwww\.)?(identifiers\.org\/orcid[:/]|orcid\.org\/)/i,
                  )
                ) {
                  icon = 'orcid';
                } else if (
                  creator.uri.match(
                    /^https?:\/\/(wwww\.)?(identifiers\.org\/github[:/]|github\.com\/)/i,
                  )
                ) {
                  icon = 'github';
                } else if (
                  creator.uri.match(/^https?:\/\/(wwww\.)?(linkedin\.com\/)/i)
                ) {
                  icon = 'linkedin';
                } else if (
                  creator.uri.match(/^https?:\/\/(wwww\.)?(twitter\.com\/)/i)
                ) {
                  icon = 'twitter';
                } else if (
                  creator.uri.match(/^https?:\/\/(wwww\.)?(facebook\.com\/)/i)
                ) {
                  icon = 'facebook';
                } else if (creator.uri.match(/^mailto:/i)) {
                  icon = 'email';
                }
              }

              return {
                label: creator.label,
                uri: creator.uri,
                icon: icon,
              };
            },
          ),
          description: metadata?.description,
          attributes: [],
        };

        formattedMetadata.attributes.push({
          values: metadata?.encodes,
          icon: 'cell',
          title: 'Biology',
        });
        formattedMetadata.attributes.push({
          values: metadata?.taxa,
          icon: 'taxon',
          title: 'Taxon',
        });
        formattedMetadata.attributes.push({
          values: metadata?.keywords,
          icon: 'tags',
          title: 'Keyword',
        });
        (metadata?.other || []).forEach((other: DescribedIdentifier): void => {
          formattedMetadata.attributes.push({
            icon: 'info',
            title: (other.attribute_label || other.attribute_uri) as string,
            values: [
              {
                label: (other.label || other.uri) as string,
                uri: other.uri,
              },
            ],
          });
        });
        formattedMetadata.attributes.push({
          values: metadata?.seeAlso,
          icon: 'link',
          title: 'More info',
        });
        formattedMetadata.attributes.push({
          values: metadata?.citations,
          icon: 'file',
          title: 'Citation',
        });
        formattedMetadata.attributes.push({
          values: metadata?.sources,
          icon: 'code',
          title: 'Source',
        });
        formattedMetadata.attributes.push({
          values: metadata?.identifiers,
          icon: 'id',
          title: 'Cross reference',
        });
        formattedMetadata.attributes.push({
          values: metadata?.predecessors,
          icon: 'backward',
          title: 'Predecessor',
        });
        formattedMetadata.attributes.push({
          values: metadata?.successors,
          icon: 'forward',
          title: 'Successor',
        });
        formattedMetadata.attributes.push({
          values: metadata?.license,
          icon: 'license',
          title: 'License',
        });
        formattedMetadata.attributes.push({
          values: metadata?.contributors,
          icon: 'author',
          title: 'Curator',
        });
        formattedMetadata.attributes.push({
          values: metadata?.funders,
          icon: 'funding',
          title: 'Funder',
        });

        if (metadata?.created) {
          formattedMetadata.attributes.push({
            icon: 'date',
            title: 'Created',
            values: [
              {
                label: FormatService.formatDate(new Date(metadata?.created)),
                uri: null,
              },
            ],
          });
        }

        if (metadata?.modified.length) {
          formattedMetadata.attributes.push({
            icon: 'date',
            title: 'Last modified',
            values: [
              {
                label: FormatService.formatDate(
                  new Date(metadata?.modified[0]),
                ),
                uri: null,
              },
            ],
          });
        }

        return formattedMetadata;
      }),
    );
  }

  public getFormattedSimulationRun(
    id: string,
  ): Observable<FormattedSimulationRunMetadata> {
    return forkJoin([
      this.simService.getSimulationRun(id),
      this.projService.getProjectSedmlContents(id),
      this.simService.getSimulationRunLog(id),
      this.ontologyService.getTerms<KisaoTerm>(Ontologies.KISAO),
    ]).pipe(
      map(
        (
          args: [
            SimulationRun,
            SimulationRunSedDocument[],
            CombineArchiveLog,
            { [id: string]: KisaoTerm },
          ],
        ): FormattedSimulationRunMetadata => {
          // SimulationRun
          const simulationRun = args[0];
          const sedmlArchiveContents = args[1];
          const log = args[2];
          const kisaoIdTermMap = args[3];

          const modelLanguageSedUrns = new Set<string>();
          const simulationTypes = new Set<string>();
          let simulationAlgorithms = new Set<string>();
          sedmlArchiveContents.forEach(
            (sedDoc: SimulationRunSedDocument): void => {
              sedDoc.tasks.forEach((abstractTask: SedAbstractTask): void => {
                if (abstractTask._type === 'SedTask') {
                  const task = abstractTask as SedTask;
                  modelLanguageSedUrns.add(task.model.language);
                  simulationTypes.add(task.simulation._type);
                  simulationAlgorithms.add(task.simulation.algorithm.kisaoId);
                }
              });
            },
          );

          const loggedSimulationAlgorithms = new Set<string>();
          log.sedDocuments?.forEach((sedDoc: SedDocumentLog): void => {
            sedDoc.tasks?.forEach((task: SedTaskLog): void => {
              if (task?.algorithm && task?.algorithm in kisaoIdTermMap) {
                loggedSimulationAlgorithms.add(task?.algorithm);
              }
            });
          });

          if (loggedSimulationAlgorithms.size) {
            simulationAlgorithms = loggedSimulationAlgorithms;
          }

          const methods: ListItem[] = [];

          Array.from(simulationTypes)
            .map((simulationType: string): ConcreteListItem => {
              return {
                title: 'Simulation',
                value:
                  SimulationTypeBriefName[
                    simulationType as keyof typeof SimulationTypeBriefName
                  ],
                icon: 'simulator',
                url: 'https://sed-ml.org/',
              };
            })
            .sort((a, b): number => {
              return a.value.localeCompare(b.value, undefined, {
                numeric: true,
              });
            })
            .forEach((simulationType): void => {
              methods.push({
                title: simulationType.title,
                value: of(simulationType.value),
                icon: simulationType.icon,
                url: simulationType.url,
              });
            });

          Array.from(simulationAlgorithms)
            .map((kisaoId: string): ConcreteListItem => {
              return {
                title: 'Algorithm',
                value: kisaoIdTermMap[kisaoId].name,
                icon: 'code',
                url:
                  'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' +
                  kisaoId,
              };
            })
            .sort((a, b): number => {
              return a.value.localeCompare(b.value, undefined, {
                numeric: true,
              });
            })
            .forEach((simulationAlgorithm): void => {
              methods.push({
                title: simulationAlgorithm.title,
                value: of(simulationAlgorithm.value),
                icon: simulationAlgorithm.icon,
                url: simulationAlgorithm.url,
              });
            });

          const formats: ListItem[] = [];
          formats.push({
            title: 'Project',
            value: of('COMBINE/OMEX'),
            icon: 'archive',
            url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686',
          });

          Array.from(modelLanguageSedUrns)
            .filter((modelLanguageSedUrn): boolean => {
              for (const modelFormat of MODEL_FORMATS) {
                if (modelLanguageSedUrn.startsWith(modelFormat.sedUrn)) {
                  return true;
                }
              }
              return false;
            })
            .map((modelLanguageSedUrn): ConcreteListItem => {
              let modelLanguage!: ConcreteListItem;
              for (const modelFormat of MODEL_FORMATS) {
                if (modelLanguageSedUrn.startsWith(modelFormat.sedUrn)) {
                  modelLanguage = {
                    title: 'Model',
                    value: modelFormat.acronym || modelFormat.name,
                    icon: 'model',
                    url: modelFormat.url,
                  };
                  break;
                }
              }
              return modelLanguage;
            })
            .sort((a, b): number => {
              return a.value.localeCompare(b.value, undefined, {
                numeric: true,
              });
            })
            .forEach((modelLanguage): void => {
              formats.push({
                title: modelLanguage.title,
                value: of(modelLanguage.value),
                icon: modelLanguage.icon,
                url: modelLanguage.url,
              });
            });

          formats.push({
            title: 'Simulation',
            value: of('SED-ML'),
            icon: 'simulation',
            url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3685',
          });

          const tools: ListItem[] = [];
          const simulator = this.projService.getSimulatorIdNameMap().pipe(
            map((simulatorIdNameMap: SimulatorIdNameMap): string => {
              return (
                simulatorIdNameMap[simulationRun.simulator] +
                ' ' +
                simulationRun.simulatorVersion
              );
            }),
          );
          tools.push({
            title: 'Simulator',
            value: simulator,
            icon: 'simulator',
            url: `${urls.simulators}/simulators/${simulationRun.simulator}/${simulationRun.simulatorVersion}`,
          });

          const run: ListItem[] = [];

          run.push({
            title: 'Id',
            value: of(simulationRun.id),
            icon: 'id',
            url: `${urls.dispatch}/simulations/${id}`,
          });

          const durationSec = this.simService
            .getSimulationRunLog(simulationRun.id)
            .pipe(
              pluck('duration'),
              map((durationSec: number | null): string =>
                durationSec === null
                ? 'N/A' 
                : FormatService.formatDuration(durationSec),
              ),
            );
          run.push({
            title: 'Duration',
            value: durationSec,
            icon: 'duration',
            url: null,
          });

          run.push({
            title: 'CPUs',
            value: of(simulationRun.cpus.toString()),
            icon: 'processor',
            url: null,
          });

          run.push({
            title: 'Memory',
            value: of(
              FormatService.formatDigitalSize(simulationRun.memory * 1e9),
            ),
            icon: 'memory',
            url: null,
          });

          run.push({
            title: 'Submitted',
            value: of(
              FormatService.formatTime(new Date(simulationRun.submitted)),
            ),
            icon: 'date',
            url: null,
          });

          run.push({
            title: 'Completed',
            value: of(
              FormatService.formatTime(new Date(simulationRun.updated)),
            ),
            icon: 'date',
            url: null,
          });

          // return sections
          const sections = [
            { title: 'Modeling methods', items: methods },
            { title: 'Modeling formats', items: formats },
            { title: 'Simulation tools', items: tools },
            { title: 'Simulation run', items: run },
          ];
          return sections.filter((section: List): boolean => {
            return section.items.length > 0;
          });
        },
      ),
    );
  }

  public getFormattedProjectFiles(id: string): Observable<File[]> {
    return this.simService.getSimulationRun(id).pipe(
      map((simulationRun: SimulationRun): File[] => {
        // SimulationRun
        return [
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Project',
            format: `${COMBINE_OMEX_FORMAT.name} (${COMBINE_OMEX_FORMAT.acronym})`,
            formatUrl: COMBINE_OMEX_FORMAT.url,
            master: false,
            size: simulationRun.projectSize === undefined
              ? 'N/A' 
              : FormatService.formatDigitalSize(simulationRun.projectSize),
            icon: COMBINE_OMEX_FORMAT.icon,
            url: this.endpoints.getRunDownloadEndpoint(id),
            basename: 'project.omex',
          },
        ];
      }),
    );
  }

  public getFormattedProjectContentFiles(id: string): Observable<Path[]> {
    return this.projService.getArchiveContents(id).pipe(
      map((contents: CombineArchiveFile[]): Path[] => {
        const root: { [path: string]: Path } = {};

        let hasMaster = false;
        for (const content of contents) {
          if (content?.master === true) {
            hasMaster = true;
            break;
          }
        }

        contents
          .filter((content: CombineArchiveFile): boolean => {
            return content.location != '.';
          })
          .forEach((content: CombineArchiveFile): void => {
            let location = content.location;
            if (location.substring(0, 2) === './') {
              location = location.substring(2);
            }

            const parentBasenames = location.split('/');
            const basename = parentBasenames.pop() as string;

            let parentPath = '';
            let level = -1;
            parentBasenames.forEach((parentBasename: string): void => {
              level++;
              parentPath += '/' + parentBasename;
              if (!(parentPath.substring(1) in root)) {
                root[parentPath.substring(1)] = {
                  _type: 'Directory',
                  level: level,
                  location: parentPath.substring(1),
                  title: parentBasename,
                };
              }
            });

            let format = content.format;
            if (!(format in this.formatMap)) {
              for (const uri of Object.keys(this.formatMap)) {
                if (format.startsWith(uri)) {
                  format = uri;
                  break;
                }
              }
            }

            let formatName!: string;
            if (format in this.formatMap) {
              const formatObj = this.formatMap[format];
              formatName = formatObj.name;
              if (formatObj.acronym) {
                formatName += ' (' + formatObj.acronym + ')';
              }
            } else if (format.startsWith('http://purl.org/NET/mediatypes/')) {
              formatName = format.substring(
                'http://purl.org/NET/mediatypes/'.length,
              );
            } else {
              formatName = format;
            }

            root[location] = {
              _type: 'File',
              level: parentBasenames.length,
              location: location,
              title: basename,
              basename: basename,
              format: formatName,
              master:
                content?.master ||
                (!hasMaster && format.startsWith(SEDML_FORMAT.combineUris[0])),
              url: content.url,
              size: content.size === undefined
                ? 'N/A'
                : FormatService.formatDigitalSize(typeof content.size === 'string' ? parseFloat(content.size) : content.size),
              formatUrl: this.formatMap?.[format]?.url,
              icon: this.formatMap?.[format]?.icon || 'file',
            };
          });

        return Object.values(root).sort((a: Path, b: Path): number => {
          if (a._type == 'Directory' && b._type === 'File') {
            return -1;
          }

          if (a._type == 'File' && b._type === 'Directory') {
            return 1;
          }

          return a.location.localeCompare(b.location, undefined, {
            numeric: true,
          });
        });
      }),
    );
  }

  public getFormattedOutputFiles(id: string): Observable<File[]> {
    return this.simService.getSimulationRun(id).pipe(
      map((simulationRun: SimulationRun): File[] => {
        // SimulationRun
        return [
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Outputs',
            format: 'JavaScript Object Notation (JSON) in BioSimulators schema',
            formatUrl: this.endpoints.getBaseUrl(),
            master: false,
            size: null,
            icon: 'report',
            url: this.endpoints.getRunResultsEndpoint(id, undefined, true),
            basename: 'outputs.json',
          },
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Outputs',
            format: 'Zip of HDF5 and PDF files',
            formatUrl:
              'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3987',
            master: false,
            size: simulationRun.resultsSize === undefined 
              ? 'N/A'
              : FormatService.formatDigitalSize(simulationRun.resultsSize),
            icon: 'report',
            url: this.endpoints.getRunResultsDownloadEndpoint(id),
            basename: 'outputs.zip',
          },
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Log',
            format: 'YAML in BioSimulators log schema',
            formatUrl: `${urls.simulators}/conventions/simulation-logs`,
            master: false,
            size: null,
            icon: 'logs',
            url: this.endpoints.getSimulationRunLogsEndpoint(id),
            basename: 'log.yml',
          },
        ];
      }),
    );
  }

  public getVisualizations(id: string): Observable<VisualizationList[]> {
    return forkJoin([
      this.projService.getArchiveContents(id),
      this.projService.getProjectSedmlContents(id),
    ]).pipe(
      map((args: [CombineArchiveFile[], SimulationRunSedDocument[]]): VisualizationList[] => {
        const contents = args[0];
        const sedmlArchiveContents = args[1];

        const sedmlReportArchiveContents = sedmlArchiveContents.map((content: SimulationRunSedDocument): SedDocumentReports => {
          return {
            id: content.id,
            outputs: content.outputs
              .flatMap((output: SedOutput): SedReport[] => {
                return output._type === 'SedReport' ? [output] : [];
              })
          };
        });

        const uriSedDataSetMap: UriSedDataSetMap = {};
        sedmlArchiveContents.forEach(
          (sedDocLocation: SimulationRunSedDocument): void => {
            sedDocLocation.outputs.forEach((output: SedOutput): void => {
              if (output._type === 'SedReport') {
                output.dataSets.forEach((dataSet: SedDataSet): void => {
                  let location = sedDocLocation.id;
                  if (location.startsWith('./')) {
                    location = location.substring(2);
                  }
                  const uri = location + '/' + output.id + '/' + dataSet.id;
                  uriSedDataSetMap[uri] = dataSet;
                });
              }
            });
          },
        );

        const vegaVisualizations: VegaVisualization[] = [];
        contents.forEach((content: CombineArchiveFile): void => {
          if (VEGA_FORMAT.combineUris.includes(content.format)) {
            let location = content.location;
            if (location.startsWith('./')) {
              location = location.substring(2);
            }

            vegaVisualizations.push({
              _type: 'VegaVisualization',
              id: location,
              name: location,
              userDesigned: false,
              renderer: 'Vega',
              vegaSpec: this.projService
                .getProjectFile(id, content.location)
                .pipe(
                  shareReplay(1),
                  map((spec: VegaSpec): VegaSpec | false => {
                    return this.vegaVisualizationService.linkSignalsAndDataSetsToSimulationsAndResults(
                      id,
                      sedmlArchiveContents,
                      spec,
                    );
                  }),
                  shareReplay(1),
                ),
            });
          }
        });
        vegaVisualizations.sort(
          (a: VegaVisualization, b: VegaVisualization): number => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          },
        );

        const vegaVisualizationsList: VisualizationList[] =
          vegaVisualizations.length
            ? [
                {
                  title: 'Vega charts',
                  visualizations: vegaVisualizations,
                },
              ]
            : [];

        const sedmlVisualizationsList = sedmlArchiveContents
          .map(
            (sedDocLocation: SimulationRunSedDocument): VisualizationList => {
              let location = sedDocLocation.id;
              if (location.startsWith('./')) {
                location = location.substring(2);
              }
              return {
                title: 'SED-ML charts for ' + location,
                visualizations: sedDocLocation.outputs
                  .flatMap((output: SedOutput): SedPlot2D[] => {
                    return output._type === 'SedPlot2D' ? [output] : [];
                  })
                  .map((output: SedPlot2D): SedPlot2DVisualization => {
                    return {
                      _type: 'SedPlot2DVisualization',
                      id: `${location}/${output.id}`,
                      name: `${output.name || output.id}`,
                      userDesigned: false,
                      renderer: 'Plotly',
                      plotlyDataLayout: of(
                        this.simService
                          .getSimulationRunOutputResults(
                            id,
                            `${location}/${output.id}`,
                            true,
                          )
                          .pipe(
                            map((result: SimulationRunOutput): PlotlyDataLayout => {
                              return this.sedPlot2DVisualizationService.getPlotlyDataLayout(
                                id,
                                location,
                                output,
                                result,
                              );
                            }),
                          ),
                      ),
                    };
                  })
                  .sort((a: Visualization, b: Visualization): number => {
                    return a.name.localeCompare(b.name, undefined, {
                      numeric: true,
                    });
                  }),
              };
            },
          )
          .filter((a: VisualizationList): boolean => {
            return a.visualizations.length > 0;
          })
          .sort((a: VisualizationList, b: VisualizationList): number => {
            return a.title.localeCompare(b.title, undefined, { numeric: true });
          });

        const designVisualizations: Visualization[] = [];

        let behaviorSubject: BehaviorSubject<
          Observable<PlotlyDataLayout | false | null>
        >;

        behaviorSubject = new BehaviorSubject<
          Observable<PlotlyDataLayout | false | null>
        >(of(null));
        designVisualizations.push({
          _type: 'Histogram1DVisualization',
          id: 'Histogram1DVisualization',
          name: '1D histogram',
          userDesigned: true,
          simulationRunId: id,
          sedDocs: sedmlReportArchiveContents,
          uriSedDataSetMap: uriSedDataSetMap,
          renderer: 'Plotly',
          plotlyDataLayoutSubject: behaviorSubject,
          plotlyDataLayout: behaviorSubject.asObservable(),
        });

        behaviorSubject = new BehaviorSubject<
          Observable<PlotlyDataLayout | false | null>
        >(of(null));
        designVisualizations.push({
          _type: 'Heatmap2DVisualization',
          id: 'Heatmap2DVisualization',
          name: '2D heatmap',
          userDesigned: true,
          simulationRunId: id,
          sedDocs: sedmlReportArchiveContents,
          uriSedDataSetMap: uriSedDataSetMap,
          renderer: 'Plotly',
          plotlyDataLayoutSubject: behaviorSubject,
          plotlyDataLayout: behaviorSubject.asObservable(),
        });

        behaviorSubject = new BehaviorSubject<
          Observable<PlotlyDataLayout | false | null>
        >(of(null));
        designVisualizations.push({
          _type: 'Line2DVisualization',
          id: 'Line2DVisualization',
          name: '2D line plot',
          userDesigned: true,
          simulationRunId: id,
          sedDocs: sedmlReportArchiveContents,
          uriSedDataSetMap: uriSedDataSetMap,
          renderer: 'Plotly',
          plotlyDataLayoutSubject: behaviorSubject,
          plotlyDataLayout: behaviorSubject.asObservable(),
        });

        const designVisualizationsList: VisualizationList[] = [
          {
            title: 'Design a chart',
            visualizations: designVisualizations,
          },
        ];

        return vegaVisualizationsList
          .concat(sedmlVisualizationsList)
          .concat(designVisualizationsList);
      }),
    );
  }

  public getReportResults(
    simulationRunId: string,
    selectedUris: string[],
  ): Observable<UriSetDataSetResultsMap> {
    const reportUris = new Set<string>();
    const reportObs: Observable<SimulationRunOutput>[] = [];
    for (let selectedUri of selectedUris) {
      if (selectedUri.startsWith('./')) {
        selectedUri = selectedUri.substring(2);
      }
      const uriParts = selectedUri.split('/');
      uriParts.pop();
      const reportUri = uriParts.join('/');
      if (!reportUris.has(reportUri)) {
        reportUris.add(reportUri);
        reportObs.push(
          this.simService.getSimulationRunOutputResults(
            simulationRunId,
            reportUri,
            true,
          ),
        );
      }
    }

    return forkJoin(reportObs).pipe(
      map((reportResults: SimulationRunOutput[]): UriSetDataSetResultsMap => {
        const uriResultsMap: UriSetDataSetResultsMap = {};
        reportResults.forEach((reportResult: SimulationRunOutput): void => {
          reportResult.data.forEach((datum: SimulationRunOutputDatum): void => {
            let outputId = reportResult.outputId;
            if (outputId.startsWith('./')) {
              outputId = outputId.substring(2);
            }
            uriResultsMap[`${outputId}/${datum.id}`] = datum;
          });
        });
        return uriResultsMap;
      }),
    );
  }

  public flattenArray(nestedArray: any[]): any[] {
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

  private getProjectMetadata(id: string): Observable<ArchiveMetadata[]> {
    const response: Observable<ArchiveMetadata[]> = this.simService
      .getSimulationRunMetadata(id)
      .pipe(
        // Only call the HTTP service once
        shareReplay(1),
        map((data: SimulationRunMetadata) => {
          return data.metadata.map((metaData: APIMetadata) => {
            return {
              ...metaData,
              created: new Date(metaData.created),
              modified: metaData.modified.map((modified) => new Date(modified)),
            };
          });
        }),
        // Only do the above mapping once
        shareReplay(1),
      );

    return response;
  }

  public getJsonLdData(
    runId: string,
    project?: Project,
  ): Observable<WithContext<Dataset>> {
    return forkJoin([
      this.simService.getSimulationRun(runId),
      this.getProjectMetadata(runId),
    ]).pipe(
      map((args: [SimulationRun, ArchiveMetadata[] | undefined]): WithContext<Dataset> => {
        const simulationRun = args[0];
        const projectMeta: ArchiveMetadata | undefined = args[1] === undefined 
          ? undefined 
          : args[1].filter((meta: ArchiveMetadata) => meta.uri.search('/') === -1)[0];

        const runDataSet: Dataset = {
          '@type': 'Dataset',
          includedInDataCatalog: {
            '@type': 'DataCatalog',
            name: 'runBioSimulations',
            description:
              'Database of runs of biosimulations, including models, simulation experiments, simulation results, and data visualizations of simulation results.',
            url: urls.dispatch,
          },
          name: simulationRun.name,
          url: `${urls.dispatch}/simulations/${runId}`,
          identifier: [
            `${urls.dispatch}/simulations/${runId}`.replace(
              'https://',
              'http://',
            ),
            `http://identifiers.org/runbiosimulations/${runId}`,
          ],
          distribution: [
            {
              '@type': 'DataDownload',
              description: 'Project',
              contentUrl: this.endpoints.getRunDownloadEndpoint(runId),
              encodingFormat: 'application/zip',
              contentSize: simulationRun.projectSize === undefined
                ? 'N/A'
                : FormatService.formatDigitalSize(simulationRun.projectSize),
            },
            {
              '@type': 'DataDownload',
              description: 'Simulation results',
              contentUrl: this.endpoints.getRunResultsEndpoint(
                runId,
                undefined,
                true,
              ),
              encodingFormat: 'application/json',
            },
            {
              '@type': 'DataDownload',
              description: 'Simulation outputs',
              contentUrl: this.endpoints.getRunResultsDownloadEndpoint(runId),
              encodingFormat: 'application/zip',
              contentSize: simulationRun.resultsSize === undefined 
                ? 'N/A'
                : FormatService.formatDigitalSize(simulationRun.resultsSize),
            },
            {
              '@type': 'DataDownload',
              description: 'Simulation log',
              contentUrl: this.endpoints.getSimulationRunLogsEndpoint(runId),
              encodingFormat: 'application/json',
            },
          ],
          dateCreated: FormatService.formatDate(
            new Date(simulationRun.submitted),
          ),
          dateModified: FormatService.formatDate(
            new Date(simulationRun.updated),
          ),
          keywords: [
            'mathematical model',
            'numerical simulation',
            'COMBINE',
            'OMEX',
            'Simulation Experiment Description Markup Language',
            'SED-ML',
            simulationRun.simulator,
          ],
          educationalLevel: 'advanced',
        };

        if (projectMeta) {
          if (projectMeta.title) {
            runDataSet.headline = projectMeta.title;
          }
          if (projectMeta.abstract) {
            runDataSet.description = projectMeta.abstract;
          }
          if (projectMeta.description) {
            runDataSet.abstract = projectMeta.description;
          }
          runDataSet.thumbnailUrl = projectMeta.thumbnails;
          runDataSet.keywords = projectMeta.keywords.map(
            (keyword: LabeledIdentifier): string => {
              return keyword.label as string;
            },
          );
          runDataSet.creator = projectMeta.creators.map(
            (creator: LabeledIdentifier) => {
              const person: Person = {
                '@type': 'Person'
              };
              if (creator.label) {
                person.name = creator.label
              }
              if (creator.uri) {
                person.identifier = creator.uri;
              }
              return person;
            },
          );
          runDataSet.contributor = projectMeta.contributors.map(
            (contributor: LabeledIdentifier) => {
              const person: Person = {
                '@type': 'Person'
              };
              if (contributor.label) {
                person.name = contributor.label
              }
              if (contributor.uri) {
                person.identifier = contributor.uri;
              }
              return person;
            },
          );
          projectMeta.identifiers
            .filter(
              (identifier: LabeledIdentifier) =>
                !!identifier && !!identifier?.uri,
            )
            .forEach((identifier: LabeledIdentifier): void => {
              (runDataSet.identifier as string[]).push(
                identifier.uri as string,
              );
            });
          runDataSet.citation = projectMeta.citations.map(
            (citation: LabeledIdentifier) => {
              const article: Article = {
                '@type': 'Article'
              };
              if (citation.label) {
                article.description = citation.label
              }
              if (citation.uri) {
                article.identifier = citation.uri;
              }
              return article;
            },
          );
          if (projectMeta.license) {
            runDataSet.license = projectMeta.license
              ?.filter((license: LabeledIdentifier) => !!license.uri)
              ?.map((license: LabeledIdentifier) => license.uri) as string[];
          }
          runDataSet.funder = projectMeta.funders.map(
            (funder: LabeledIdentifier) => {
              const organization: Organization = {
                '@type': 'Organization'
              };
              if (funder.label) {
                organization.name = funder.label
              }
              if (funder.uri) {
                organization.identifier = funder.uri;
              }
              return organization;
            },
          );
        }

        if (project) {
          const dataSet: WithContext<Dataset> = {
            '@context': 'https://schema.org',
            '@type': 'Dataset',
          };
          Object.assign(dataSet, runDataSet);

          dataSet.includedInDataCatalog = {
            '@type': 'DataCatalog',
            name: 'BioSimulations',
            description:
              'Open registry of biosimulation projects, including models, simulation experiments, simulation results, and data visualizations of simulation results.',
            url: urls.platform,
          };
          dataSet.url = `${urls.platform}/projects/${project?.id}`;
          dataSet.identifier = [...(dataSet.identifier as string[])];
          (dataSet.identifier as string[])[0] =
            `${urls.platform}/projects/${project?.id}`.replace(
              'https://',
              'http://',
            );
          (
            dataSet.identifier as string[]
          )[1] = `http://identifiers.org/biosimulations/${project?.id}`;
          dataSet.creativeWorkStatus = 'Published';
          dataSet.hasPart = runDataSet;
          dataSet.distribution = [
            {
              '@type': 'DataDownload',
              description: 'Project',
              contentUrl: this.endpoints.getProjectsEndpoint(project?.id),
              encodingFormat: 'application/json',
            },
          ];
          dataSet.datePublished = FormatService.formatDate(
            new Date(project.created),
          );
          dataSet.dateModified = FormatService.formatDate(
            new Date(project.updated),
          );

          return dataSet;
        } else {
          const dataSet: WithContext<Dataset> = {
            '@context': 'https://schema.org',
            '@type': 'Dataset',
          };
          Object.assign(dataSet, runDataSet);
          return dataSet;
        }
      }),
    );
  }
}
