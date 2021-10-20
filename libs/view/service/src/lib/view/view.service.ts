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
  SedDocumentSpecifications,
  SedDocument,
  SedAbstractTask,
  SedTask,
  SedOutput,
  SedPlot2D,
  SedDataSet,
  Ontologies,
  KisaoTerm,
  SimulationTypeBriefName,
  SimulatorIdNameMap,
  PlotlyDataLayout,
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
} from '@biosimulations/datamodel-view';
import { UtilsService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { OntologyService } from '@biosimulations/ontology/client';
import { Spec as VegaSpec } from 'vega';
import { Dataset, DataCatalog, WithContext } from 'schema-dts';
import { Endpoints } from '@biosimulations/config/common';

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
          icon: 'cell' as BiosimulationsIcon,
          title: 'Biology',
        });
        formattedMetadata.attributes.push({
          values: metadata?.taxa,
          icon: 'taxon' as BiosimulationsIcon,
          title: 'Taxon',
        });
        formattedMetadata.attributes.push({
          values: metadata?.keywords,
          icon: 'tags' as BiosimulationsIcon,
          title: 'Keyword',
        });
        (metadata?.other || []).forEach((other: DescribedIdentifier): void => {
          formattedMetadata.attributes.push({
            icon: 'info' as BiosimulationsIcon,
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
          icon: 'link' as BiosimulationsIcon,
          title: 'More info',
        });
        formattedMetadata.attributes.push({
          values: metadata?.citations,
          icon: 'file' as BiosimulationsIcon,
          title: 'Citation',
        });
        formattedMetadata.attributes.push({
          values: metadata?.sources,
          icon: 'code' as BiosimulationsIcon,
          title: 'Source',
        });
        formattedMetadata.attributes.push({
          values: metadata?.identifiers,
          icon: 'id' as BiosimulationsIcon,
          title: 'Cross reference',
        });
        formattedMetadata.attributes.push({
          values: metadata?.predecessors,
          icon: 'backward' as BiosimulationsIcon,
          title: 'Predecessor',
        });
        formattedMetadata.attributes.push({
          values: metadata?.successors,
          icon: 'forward' as BiosimulationsIcon,
          title: 'Successor',
        });
        formattedMetadata.attributes.push({
          values: metadata?.license,
          icon: 'license' as BiosimulationsIcon,
          title: 'License',
        });
        formattedMetadata.attributes.push({
          values: metadata?.contributors,
          icon: 'author' as BiosimulationsIcon,
          title: 'Curator',
        });
        formattedMetadata.attributes.push({
          values: metadata?.funders,
          icon: 'funding' as BiosimulationsIcon,
          title: 'Funder',
        });

        if (metadata?.created) {
          formattedMetadata.attributes.push({
            icon: 'date' as BiosimulationsIcon,
            title: 'Created',
            values: [
              {
                label: UtilsService.formatDate(new Date(metadata?.created)),
                uri: null,
              },
            ],
          });
        }

        if (metadata?.modified.length) {
          formattedMetadata.attributes.push({
            icon: 'date' as BiosimulationsIcon,
            title: 'Last modified',
            values: [
              {
                label: UtilsService.formatDate(new Date(metadata?.modified[0])),
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
            any,
            SedDocumentSpecifications[],
            any,
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
            (sedDoc: SedDocumentSpecifications): void => {
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
          log.sedDocuments?.forEach((sedDoc: any): void => {
            sedDoc.tasks?.forEach((task: any): void => {
              if (task?.algorithm && task?.algorithm in kisaoIdTermMap) {
                loggedSimulationAlgorithms.add(task?.algorithm as string);
              }
            });
          });

          if (loggedSimulationAlgorithms.size) {
            simulationAlgorithms = loggedSimulationAlgorithms;
          }

          const methods: ListItem[] = [];

          Array.from(simulationTypes)
            .map((simulationType: string): any => {
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
            .sort((a: any, b: any): number => {
              return a.value.localeCompare(b.value, undefined, {
                numeric: true,
              });
            })
            .forEach((simulationType: any): void => {
              simulationType.value = of(simulationType.value);
              methods.push(simulationType as ListItem);
            });

          Array.from(simulationAlgorithms)
            .map((kisaoId: string): any => {
              return {
                title: 'Algorithm',
                value: kisaoIdTermMap[kisaoId].name,
                icon: 'code',
                url:
                  'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' +
                  kisaoId,
              };
            })
            .sort((a: any, b: any): number => {
              return a.value.localeCompare(b.value, undefined, {
                numeric: true,
              });
            })
            .forEach((simulationAlgorithm: any): void => {
              simulationAlgorithm.value = of(simulationAlgorithm.value);
              methods.push(simulationAlgorithm as ListItem);
            });

          const formats: ListItem[] = [];
          formats.push({
            title: 'Project',
            value: of('COMBINE/OMEX'),
            icon: 'archive',
            url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686',
          });

          Array.from(modelLanguageSedUrns)
            .map((modelLanguageSedUrn: any): any => {
              for (const modelFormat of MODEL_FORMATS) {
                if (modelLanguageSedUrn.startsWith(modelFormat.sedUrn)) {
                  return {
                    title: 'Model',
                    value: modelFormat.acronym || modelFormat.name,
                    icon: 'model',
                    url: modelFormat.url,
                  };
                }
              }
            })
            .sort((a: any, b: any): number => {
              return a.value.localeCompare(b.value, undefined, {
                numeric: true,
              });
            })
            .forEach((modelLanguage: any): void => {
              modelLanguage.value = of(modelLanguage.value);
              formats.push(modelLanguage as ListItem);
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
              map((durationSec: number): string =>
                UtilsService.formatDuration(durationSec),
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
              UtilsService.formatDigitalSize(simulationRun.memory * 1e9),
            ),
            icon: 'memory',
            url: null,
          });

          run.push({
            title: 'Submitted',
            value: of(
              UtilsService.formatTime(new Date(simulationRun.submitted)),
            ),
            icon: 'date',
            url: null,
          });

          run.push({
            title: 'Completed',
            value: of(UtilsService.formatTime(new Date(simulationRun.updated))),
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
      map((simulationRun: any): File[] => {
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
            size: UtilsService.formatDigitalSize(simulationRun.projectSize),
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
      map((contents: any): Path[] => {
        const root: { [path: string]: Path } = {};

        let hasMaster = false;
        for (const content of contents) {
          if (content?.master === true) {
            hasMaster = true;
            break;
          }
        }

        contents
          .filter((content: any): boolean => {
            return content.location != '.';
          })
          .forEach((content: any): void => {
            let location = content.location;
            if (location.substring(0, 2) === './') {
              location = location.substring(2);
            }

            const parentBasenames = location.split('/');
            const basename = parentBasenames.pop();

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
              size: UtilsService.formatDigitalSize(content.size),
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
      map((simulationRun: any): File[] => {
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
            size: UtilsService.formatDigitalSize(simulationRun.resultsSize),
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
            url: this.endpoints.getRunLogsEndpoint(id),
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
      map((args: [any[], SedDocumentSpecifications[]]): VisualizationList[] => {
        const contents = args[0];
        const sedmlArchiveContents = args[1];

        const sedmlReportArchiveContents = JSON.parse(
          JSON.stringify(sedmlArchiveContents),
        );
        sedmlReportArchiveContents.forEach(
          (sedDocLocation: SedDocumentSpecifications): void => {
            if (sedDocLocation.id.startsWith('./')) {
              sedDocLocation.id = sedDocLocation.id.substring(2);
            }
            const sedDoc = sedDocLocation as SedDocument;
            sedDoc.outputs = sedDoc.outputs.filter(
              (output: SedOutput): boolean => {
                return output._type === 'SedReport';
              },
            );
          },
        );

        const uriSedDataSetMap: UriSedDataSetMap = {};
        sedmlArchiveContents.forEach(
          (sedDocLocation: SedDocumentSpecifications): void => {
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
        contents.forEach((content: any): void => {
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
                  map((spec: VegaSpec): VegaSpec | false => {
                    return this.vegaVisualizationService.linkSignalsAndDataSetsToSimulationsAndResults(
                      id,
                      sedmlArchiveContents,
                      spec,
                    );
                  }),
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
            (sedDocLocation: SedDocumentSpecifications): VisualizationList => {
              const sedDoc = sedDocLocation as SedDocument;
              let location = sedDocLocation.id;
              if (location.startsWith('./')) {
                location = location.substring(2);
              }
              return {
                title: 'SED-ML charts for ' + location,
                visualizations: sedDoc.outputs
                  .filter((output: SedOutput): boolean => {
                    return output._type === 'SedPlot2D';
                  })
                  .map((output: SedOutput): SedPlot2DVisualization => {
                    return {
                      _type: 'SedPlot2DVisualization',
                      id: `${location}/${output.id}`,
                      name: `${output.name || output.id}`,
                      userDesigned: false,
                      renderer: 'Plotly',
                      plotlyDataLayout: of(
                        this.simService
                          .getSimulationRunResults(
                            id,
                            `${location}/${output.id}`,
                            true,
                          )
                          .pipe(
                            map((result: any): PlotlyDataLayout => {
                              return this.sedPlot2DVisualizationService.getPlotlyDataLayout(
                                id,
                                location,
                                output as SedPlot2D,
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
    const reportObs: Observable<any>[] = [];
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
          this.simService.getSimulationRunResults(
            simulationRunId,
            reportUri,
            true,
          ),
        );
      }
    }

    return forkJoin(reportObs).pipe(
      map((reportResults: any[]): UriSetDataSetResultsMap => {
        const uriResultsMap: UriSetDataSetResultsMap = {};
        reportResults.forEach((reportResult: any): void => {
          reportResult.data.forEach((datum: any): void => {
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
    project?: any,
  ): Observable<WithContext<Dataset>> {
    return forkJoin([
      this.simService.getSimulationRun(runId),
      this.getProjectMetadata(runId),
    ]).pipe(
      map((args: [any, any | undefined]): WithContext<Dataset> => {
        const simulationRun = args[0];
        const projectMeta = args[1].filter(
          (meta: any) => meta.uri.search('/') === -1,
        )[0];

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
            `${urls.dispatch}/simulations/${runId}`.replace('https://', 'http://'),
            `http://identifiers.org/runbiosimulations/${runId}`,
          ],
          distribution: [
            {
              '@type': 'DataDownload',
              description: 'Project',
              contentUrl: this.endpoints.getRunDownloadEndpoint(runId),
              encodingFormat: 'application/zip',
              contentSize: UtilsService.formatDigitalSize(
                simulationRun.projectSize,
              ),
            },
            {
              '@type': 'DataDownload',
              description: 'Simulation results',
              contentUrl: this.endpoints.getRunResultsEndpoint(runId, undefined, true),
              encodingFormat: 'application/json',
            },
            {
              '@type': 'DataDownload',
              description: 'Simulation outputs',
              contentUrl: this.endpoints.getRunResultsDownloadEndpoint(runId),
              encodingFormat: 'application/zip',
              contentSize: UtilsService.formatDigitalSize(
                simulationRun.resultsSize,
              ),
            },
            {
              '@type': 'DataDownload',
              description: 'Simulation log',
              contentUrl: this.endpoints.getRunLogsEndpoint(runId),
              encodingFormat: 'application/json',
            },
          ],
          dateCreated: UtilsService.formatDate(
            new Date(simulationRun.submitted),
          ),
          dateModified: UtilsService.formatDate(
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
          if (projectMeta?.title) {
            runDataSet.headline = projectMeta?.title;
          }
          if (projectMeta?.abstract) {
            runDataSet.description = projectMeta?.abstract;
          }
          if (projectMeta?.description) {
            runDataSet.abstract = projectMeta?.description;
          }
          runDataSet.thumbnailUrl = projectMeta.thumbnails;
          runDataSet.keywords = projectMeta.keywords;
          runDataSet.creator = projectMeta?.creators?.map(
            (creator: LabeledIdentifier) => {
              return {
                '@type': 'Person',
                name: creator.label,
                identifier: creator.uri,
              };
            },
          );
          runDataSet.contributor = projectMeta?.contributors?.map(
            (contributor: LabeledIdentifier) => {
              return {
                '@type': 'Person',
                name: contributor.label,
                identifier: contributor.uri,
              };
            },
          );
          projectMeta?.identifiers
            ?.filter(
              (identifier: LabeledIdentifier) =>
                !!identifier && !!identifier?.uri,
            )
            ?.forEach((identifier: LabeledIdentifier): void => {
              (runDataSet.identifier as string[]).push(identifier.uri as string);
            });
          runDataSet.citation = projectMeta?.citation?.map(
            (citation: LabeledIdentifier) => {
              return {
                '@type': 'Article',
                description: citation.label,
                identifier: citation.uri,
              };
            },
          );
          if (projectMeta?.license) {
            runDataSet.license = projectMeta?.license
              ?.filter((license: LabeledIdentifier) => !!license.uri)
              ?.map((license: LabeledIdentifier) => license.uri);
          }
          runDataSet.funder = projectMeta?.funders?.map(
            (funder: LabeledIdentifier) => {
              return {
                '@type': 'Organization',
                name: funder.label,
                identifier: funder.uri,
              };
            },
          );
        }

        if (false && project) {
          const dataSet: WithContext<Dataset> = {
            "@context": "https://schema.org",
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
          (dataSet.identifier as string[])[0] = `${urls.platform}/projects/${project?.id}`.replace('https://', 'http://');
          (dataSet.identifier as string[])[1] = `http://identifiers.org/biosimulations/${project?.id}`;
          dataSet.creativeWorkStatus = 'Published';
          dataSet.hasPart = runDataSet;
          dataSet.distribution = [
            {
              '@type': 'DataDownload',
              description: 'Project',
              contentUrl: this.endpoints.getProjectsEndpoint(project?.id),
              encodingFormat: 'application/json',
            },
          ]
          dataSet.datePublished = UtilsService.formatDate(
            new Date(project.created),
          );
          dataSet.dateModified = UtilsService.formatDate(
            new Date(project.updated),
          );

          return dataSet;
        } else {
          const dataSet: WithContext<Dataset> = {
            "@context": "https://schema.org",
            '@type': 'Dataset',
          };
          Object.assign(dataSet, runDataSet);
          return dataSet;
        }
      }),
    );
  }
}
