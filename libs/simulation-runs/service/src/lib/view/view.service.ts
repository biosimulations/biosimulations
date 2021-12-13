import { Injectable } from '@angular/core';
import {
  map,
  Observable,
  BehaviorSubject,
  shareReplay,
  of,
  forkJoin,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  LabeledIdentifier,
  DescribedIdentifier,
  LocationPredecessor,
  SimulationRunSedDocument,
  SedAbstractTask,
  SedOutput,
  SedReport,
  SedPlot2D,
  SedDataSet,
  SimulationTypeBriefName,
  PlotlyDataLayout,
  SimulationRunSummary,
  SimulationRunAlgorithmSummary,
  SimulationRunOutput,
  SimulationRunOutputDatum,
  File as CombineArchiveFile,
  ProjectSummary,
  EdamTerm,
  Account,
  Organization,
} from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { SimulationRunService } from '@biosimulations/angular-api-client';
import { VegaVisualizationService } from '../vega-visualization/vega-visualization.service';
import { SedPlot2DVisualizationService } from '../sed-plot-2d-visualization/sed-plot-2d-visualization.service';
import {
  LabeledIdentifierIsUrl,
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
} from '@biosimulations/datamodel-simulation-runs';
import { FormatService } from '@biosimulations/shared/services';
import { Spec as VegaSpec } from 'vega';
import {
  Dataset as DatasetSchema,
  Person as PersonSchema,
  Article as ArticleSchema,
  Organization as OrganizationSchema,
  WithContext,
} from 'schema-dts';
import { Endpoints } from '@biosimulations/config/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { environment } from '@biosimulations/shared/environments';
import { deserializeSedDocument } from '../sed-document/sed-document';
import isUrl from 'is-url';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private omexManifestUriFormatMap: { [omexManifestUri: string]: EdamTerm };
  private sedmlFormat: EdamTerm;
  private vegaFormatOmexManifestUris: string[];
  private combineOmexFormat: EdamTerm;

  private endpoints = new Endpoints();

  public constructor(
    private simRunService: SimulationRunService,
    private vegaVisualizationService: VegaVisualizationService,
    private sedPlot2DVisualizationService: SedPlot2DVisualizationService,
  ) {
    this.omexManifestUriFormatMap = {};
    BIOSIMULATIONS_FORMATS.forEach((format: EdamTerm): void => {
      format?.biosimulationsMetadata?.omexManifestUris?.forEach(
        (uri: string): void => {
          this.omexManifestUriFormatMap[uri] = format;
        },
      );
    });

    const sedmlFormat = BIOSIMULATIONS_FORMATS.filter(
      (format) => format.id === 'format_3685',
    )?.[0];
    if (sedmlFormat) {
      this.sedmlFormat = sedmlFormat;
    } else {
      throw new Error('SED-ML format (EDAM:format_3685) could not be found');
    }

    const vegaFormatOmexManifestUris = BIOSIMULATIONS_FORMATS.filter(
      (format) => format.id === 'format_3969',
    )?.[0]?.biosimulationsMetadata?.omexManifestUris;
    if (vegaFormatOmexManifestUris) {
      this.vegaFormatOmexManifestUris = vegaFormatOmexManifestUris;
    } else {
      throw new Error(
        'Vega format (EDAM:format_3969) must be annotated with one or more OMEX Manifest URIs',
      );
    }

    const combineOmexFormat = BIOSIMULATIONS_FORMATS.filter(
      (format) => format.id === 'format_3686',
    )[0];
    if (combineOmexFormat) {
      this.combineOmexFormat = combineOmexFormat;
    } else {
      throw new Error(
        'COMBINE/OMEX format (EDAM:format_3686) must be annotated with one or more OMEX Manifest URIs',
      );
    }
  }

  public getFormattedProjectMetadata(
    simulationRunSummary: SimulationRunSummary,
    owner?: Account,
  ): ProjectMetadata | null {
    const metadata = simulationRunSummary.metadata;
    if (!metadata) {
      return null;
    }

    // Check for undefined metadata for all fields
    const formattedMetadata: ProjectMetadata = {
      thumbnails: metadata?.thumbnails || [],
      title: metadata?.title || simulationRunSummary.id,
      abstract: metadata?.abstract,
      creators: (metadata?.creators || []).map(
        (creator: LabeledIdentifier): Creator => {
          let icon = 'link';
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
            icon: icon as BiosimulationsIcon,
          };
        },
      ),
      description: metadata?.description,
      attributes: [],
    };

    formattedMetadata.attributes.push({
      values: metadata?.encodes?.map(this.uriIsUrl),
      icon: 'cell',
      title: 'Biology',
    });
    formattedMetadata.attributes.push({
      values: metadata?.taxa?.map(this.uriIsUrl),
      icon: 'taxon',
      title: 'Taxon',
    });
    formattedMetadata.attributes.push({
      values: metadata?.keywords?.map(this.uriIsUrl),
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
        ]
        .map(this.uriIsUrl),
      });
    });
    formattedMetadata.attributes.push({
      values: metadata?.seeAlso?.map(this.uriIsUrl),
      icon: 'link',
      title: 'More info',
    });
    formattedMetadata.attributes.push({
      values: metadata?.sources?.map(this.uriIsUrl),
      icon: 'code',
      title: 'Source',
    });

    formattedMetadata.attributes.push({
      values: metadata?.citations?.map(this.uriIsUrl),
      icon: 'file',
      title: 'Citation',
    });
    formattedMetadata.attributes.push({
      values: metadata?.identifiers?.map(this.uriIsUrl),
      icon: 'id',
      title: 'Cross reference',
    });

    formattedMetadata.attributes.push({
      values: metadata?.predecessors?.map(this.uriIsUrl),
      icon: 'backward',
      title: 'Predecessor',
    });

    metadata?.locationPredecessors?.forEach((locationPredecessor: LocationPredecessor): void => {
      const location = locationPredecessor.location.substring(locationPredecessor.location.indexOf('/') + 1);

      formattedMetadata.attributes.push({
        values: locationPredecessor.predecessors
          ?.map((predecessor: LabeledIdentifier): LabeledIdentifier => {
            return {
              label: predecessor?.label,
              uri: predecessor?.uri?.startsWith('http://omex-library.org/') && predecessor?.uri?.indexOf('.omex/') !== -1
                ? predecessor?.uri?.substring(predecessor?.uri?.indexOf('.omex/') + 6)
                : predecessor?.uri,
            };
          })
          ?.map(this.uriIsUrl),
        icon: 'backward',
        title: `Predecessor (${location})`,
      });
    });

    formattedMetadata.attributes.push({
      values: metadata?.successors?.map(this.uriIsUrl),
      icon: 'forward',
      title: 'Successor',
    });

    if (owner) {
      formattedMetadata.attributes.push({
        values: owner.organizations.map(
          (organization: Organization): LabeledIdentifier => {
            return {
              label: organization.name,
              uri: organization?.url || null,
            };
          },
        )
        .map(this.uriIsUrl),
        icon: 'organization',
        title: 'Organization',
      });
      formattedMetadata.attributes.push({
        values: [
          {
            label: owner.name,
            uri: owner?.url || null,
          },
        ]
        .map(this.uriIsUrl),
        icon: 'author',
        title: 'Owner',
      });
    }
    formattedMetadata.attributes.push({
      values: metadata?.contributors?.map(this.uriIsUrl),
      icon: 'author',
      title: 'Curator',
    });
    formattedMetadata.attributes.push({
      values: metadata?.funders?.map(this.uriIsUrl),
      icon: 'funding',
      title: 'Funder',
    });

    formattedMetadata.attributes.push({
      values: metadata?.license?.map(this.uriIsUrl),
      icon: 'license',
      title: 'License',
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

    if (metadata?.modified) {
      formattedMetadata.attributes.push({
        icon: 'date',
        title: 'Last modified',
        values: [
          {
            label: FormatService.formatDate(new Date(metadata?.modified)),
            uri: null,
          },
        ],
      });
    }

    return formattedMetadata;
  }

  public getFormattedSimulationRun(
    simulationRunSummary: SimulationRunSummary,
  ): Observable<FormattedSimulationRunMetadata> {
    return this.simRunService
      .getSimulationRunSimulationSpecifications(simulationRunSummary.id)
      .pipe(
        shareReplay(1),
        map(
          (
            sedmlArchiveContents: SimulationRunSedDocument[],
          ): FormattedSimulationRunMetadata => {
            const modelLanguageSedUrns = new Set<string>();
            const simulationTypes = new Set<string>();
            sedmlArchiveContents.forEach(
              (serializedSedDoc: SimulationRunSedDocument): void => {
                const sedDoc = deserializeSedDocument({
                  _type: 'SedDocument',
                  version: serializedSedDoc.version,
                  level: serializedSedDoc.level,
                  models: serializedSedDoc.models,
                  simulations: serializedSedDoc.simulations,
                  tasks: serializedSedDoc.tasks,
                  dataGenerators: serializedSedDoc.dataGenerators,
                  outputs: serializedSedDoc.outputs,
                });
                sedDoc.tasks.forEach((task: SedAbstractTask): void => {
                  if (task._type === 'SedTask') {
                    modelLanguageSedUrns.add(task.model.language);
                    simulationTypes.add(task.simulation._type);
                  }
                });
              },
            );

            const methods: ListItem[] = [];

            Array.from(simulationTypes)
              .map((simulationType: string): ListItem => {
                return {
                  title: 'Simulation',
                  value:
                    SimulationTypeBriefName[
                      simulationType as keyof typeof SimulationTypeBriefName
                    ],
                  icon: 'simulator' as BiosimulationsIcon,
                  url: 'https://sed-ml.org/',
                };
              })
              .sort((a, b): number => {
                return a.value.localeCompare(b.value, undefined, {
                  numeric: true,
                });
              });

            const kisaoIdSimulationAlgorithmMap: {
              [kisaoId: string]: SimulationRunAlgorithmSummary;
            } = {};
            simulationRunSummary?.tasks?.forEach((task) => {
              kisaoIdSimulationAlgorithmMap[task.simulation.algorithm.kisaoId] =
                task.simulation.algorithm;
            });

            Object.values(kisaoIdSimulationAlgorithmMap)
              .map((algorithm): ListItem => {
                return {
                  title: 'Algorithm',
                  value: algorithm.name,
                  icon: 'code' as BiosimulationsIcon,
                  url:
                    'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' +
                    algorithm.kisaoId,
                };
              })
              .sort((a, b): number => {
                return a.value.localeCompare(b.value, undefined, {
                  numeric: true,
                });
              });

            const formats: ListItem[] = [];
            formats.push({
              title: 'Project',
              value: 'COMBINE/OMEX',
              icon: 'archive',
              url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686',
            });

            Array.from(modelLanguageSedUrns)
              .filter((modelLanguageSedUrn): boolean => {
                for (const format of BIOSIMULATIONS_FORMATS) {
                  if (
                    format?.biosimulationsMetadata?.modelFormatMetadata
                      ?.sedUrn &&
                    modelLanguageSedUrn.startsWith(
                      format?.biosimulationsMetadata?.modelFormatMetadata
                        ?.sedUrn,
                    )
                  ) {
                    return true;
                  }
                }
                return false;
              })
              .map((modelLanguageSedUrn): ListItem => {
                let modelLanguage!: ListItem;
                for (const format of BIOSIMULATIONS_FORMATS) {
                  if (
                    format?.biosimulationsMetadata?.modelFormatMetadata
                      ?.sedUrn &&
                    modelLanguageSedUrn.startsWith(
                      format?.biosimulationsMetadata?.modelFormatMetadata
                        ?.sedUrn,
                    )
                  ) {
                    modelLanguage = {
                      title: 'Model',
                      value:
                        format?.biosimulationsMetadata?.acronym || format.name,
                      icon: 'model',
                      url: format.url,
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
              });

            formats.push({
              title: 'Simulation',
              value:
                this.sedmlFormat?.biosimulationsMetadata?.acronym ||
                this.sedmlFormat.name,
              icon: (this.sedmlFormat?.biosimulationsMetadata?.icon ||
                'simulation') as BiosimulationsIcon,
              url: this.sedmlFormat.url,
            });

            const tools: ListItem[] = [];
            tools.push({
              title: 'Simulator',
              value: `${simulationRunSummary.run.simulator.name} ${simulationRunSummary.run.simulator.version}`,
              icon: 'simulator',
              url: this.endpoints.getSimulatorsView(
                simulationRunSummary.run.simulator.id,
                simulationRunSummary.run.simulator.version,
              ),
            });

            const run: ListItem[] = [];

            run.push({
              title: 'Id',
              value: simulationRunSummary.id,
              icon: 'id',
              url: this.endpoints.getSimulationRunsView(
                simulationRunSummary.id,
              ),
            });

            run.push({
              title: 'Duration',
              value:
                simulationRunSummary.run.runtime !== undefined
                  ? FormatService.formatDuration(
                      simulationRunSummary.run.runtime,
                    )
                  : 'N/A',
              icon: 'duration',
              url: null,
            });

            run.push({
              title: 'CPUs',
              value: simulationRunSummary.run.cpus.toString(),
              icon: 'processor',
              url: null,
            });

            run.push({
              title: 'Memory',
              value: FormatService.formatDigitalSize(
                simulationRunSummary.run.memory * 1e9,
              ),
              icon: 'memory',
              url: null,
            });

            run.push({
              title: 'Submitted',
              value: FormatService.formatTime(
                new Date(simulationRunSummary.submitted),
              ),
              icon: 'date',
              url: null,
            });

            run.push({
              title: 'Completed',
              value: FormatService.formatTime(
                new Date(simulationRunSummary.updated),
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
        shareReplay(1),
      );
  }

  public getFormattedProjectFiles(
    simulationRunSummary: SimulationRunSummary,
  ): File[] {
    return [
      {
        _type: 'File',
        level: 0,
        location: '',
        title: 'Project',
        format:
          this.combineOmexFormat.name +
          (this.combineOmexFormat?.biosimulationsMetadata?.acronym
            ? ` (${this.combineOmexFormat?.biosimulationsMetadata?.acronym})`
            : ''),
        formatUrl: this.combineOmexFormat.url,
        master: false,
        size:
          simulationRunSummary.run.projectSize === undefined
            ? 'N/A'
            : FormatService.formatDigitalSize(
                simulationRunSummary.run.projectSize,
              ),
        icon: (this.combineOmexFormat?.biosimulationsMetadata?.icon ||
          'archive') as BiosimulationsIcon,
        url: this.endpoints.getRunDownloadEndpoint(
          true,
          simulationRunSummary.id,
        ),
        basename: 'project.omex',
      },
    ];
  }

  public getFormattedProjectContentFiles(runId: string): Observable<Path[]> {
    return this.simRunService.getSimulationRunFiles(runId).pipe(
      map((contents: CombineArchiveFile[]): Path[] => {
        const root: { [path: string]: Path } = {};

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
            if (!(format in this.omexManifestUriFormatMap)) {
              for (const uri of Object.keys(this.omexManifestUriFormatMap)) {
                if (format.startsWith(uri)) {
                  format = uri;
                  break;
                }
              }
            }

            let formatName!: string;
            if (format in this.omexManifestUriFormatMap) {
              const formatObj = this.omexManifestUriFormatMap[format];
              formatName = formatObj.name;
              if (formatObj?.biosimulationsMetadata?.acronym) {
                formatName +=
                  ' (' + formatObj.biosimulationsMetadata?.acronym + ')';
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
              master: content?.master,
              url: content.url,
              size:
                content.size === undefined
                  ? 'N/A'
                  : FormatService.formatDigitalSize(
                      typeof content.size === 'string'
                        ? parseFloat(content.size)
                        : content.size,
                    ),
              formatUrl: this.omexManifestUriFormatMap?.[format]?.url,
              icon: (this.omexManifestUriFormatMap?.[format]
                ?.biosimulationsMetadata?.icon || 'file') as BiosimulationsIcon,
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
      shareReplay(1),
    );
  }

  public getFormattedOutputFiles(
    simulationRunSummary: SimulationRunSummary,
  ): File[] {
    return [
      {
        _type: 'File',
        level: 0,
        location: '',
        title: 'Outputs',
        format: 'JavaScript Object Notation (JSON) in BioSimulators schema',
        formatUrl: this.endpoints.getApiBaseUrl(true),
        master: false,
        size: null,
        icon: 'report',
        url: this.endpoints.getRunResultsEndpoint(
          true,
          simulationRunSummary.id,
          undefined,
          true,
        ),
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
        size:
          simulationRunSummary.run.resultsSize === undefined
            ? 'N/A'
            : FormatService.formatDigitalSize(
                simulationRunSummary.run.resultsSize,
              ),
        icon: 'report',
        url: this.endpoints.getRunResultsDownloadEndpoint(
          true,
          simulationRunSummary.id,
        ),
        basename: 'outputs.zip',
      },
      {
        _type: 'File',
        level: 0,
        location: '',
        title: 'Log',
        format: 'YAML in BioSimulators log schema',
        formatUrl: this.endpoints.getConventionsView('simulation-logs'),
        master: false,
        size: null,
        icon: 'logs',
        url: this.endpoints.getSimulationRunLogsEndpoint(
          true,
          simulationRunSummary.id,
        ),
        basename: 'log.yml',
      },
    ];
  }

  public getVisualizations(runId: string): Observable<VisualizationList[]> {
    return forkJoin([
      this.simRunService.getSimulationRunFiles(runId),
      this.simRunService.getSimulationRunSimulationSpecifications(runId),
    ]).pipe(
      shareReplay(1),
      map(
        (
          args: [CombineArchiveFile[], SimulationRunSedDocument[]],
        ): VisualizationList[] => {
          const contents = args[0];
          const sedmlArchiveContents = args[1];

          // Vega visualizations
          const vegaVisualizations: VegaVisualization[] = contents
            .filter((content: CombineArchiveFile): boolean => {
              return this.vegaFormatOmexManifestUris.includes(content.format);
            })
            .map((content: CombineArchiveFile): VegaVisualization => {
              return this.makeVegaVisualization(
                runId,
                content.location,
                sedmlArchiveContents,
              );
            })
            .sort((a: VegaVisualization, b: VegaVisualization): number => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            });

          const vegaVisualizationsList: VisualizationList[] =
            vegaVisualizations.length
              ? [
                  {
                    title: 'Vega charts',
                    visualizations: vegaVisualizations,
                  },
                ]
              : [];

          // SED-ML visualizations
          const sedmlVisualizationsList = sedmlArchiveContents
            .map(
              (sedDocLocation: SimulationRunSedDocument): VisualizationList => {
                let location = sedDocLocation.id;
                if (location.startsWith('./')) {
                  location = location.substring(2);
                }

                const sedDoc = deserializeSedDocument({
                  _type: 'SedDocument',
                  version: sedDocLocation.version,
                  level: sedDocLocation.level,
                  models: sedDocLocation.models,
                  simulations: sedDocLocation.simulations,
                  tasks: sedDocLocation.tasks,
                  dataGenerators: sedDocLocation.dataGenerators,
                  outputs: sedDocLocation.outputs,
                });

                return {
                  title: 'SED-ML charts for ' + location,
                  visualizations: sedDoc.outputs
                    .flatMap((output: SedOutput): SedPlot2D[] => {
                      return output._type === 'SedPlot2D' ? [output] : [];
                    })
                    .map((output: SedPlot2D): SedPlot2DVisualization => {
                      return this.makeSedPlot2DVisualization(
                        runId,
                        location,
                        output,
                      );
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
              return a.title.localeCompare(b.title, undefined, {
                numeric: true,
              });
            });

          // User-designed visualizations
          const sedmlReportArchiveContents = sedmlArchiveContents.map(
            (content: SimulationRunSedDocument): SedDocumentReports => {
              const sedDoc = deserializeSedDocument({
                _type: 'SedDocument',
                version: content.version,
                level: content.level,
                models: content.models,
                simulations: content.simulations,
                tasks: content.tasks,
                dataGenerators: content.dataGenerators,
                outputs: content.outputs,
              });

              return {
                id: content.id,
                outputs: sedDoc.outputs.flatMap(
                  (output: SedOutput): SedReport[] => {
                    return output._type === 'SedReport' ? [output] : [];
                  },
                ),
              };
            },
          );

          const uriSedDataSetMap: UriSedDataSetMap = {};
          sedmlArchiveContents.forEach(
            (sedDocLocation: SimulationRunSedDocument): void => {
              const sedDoc = deserializeSedDocument({
                _type: 'SedDocument',
                version: sedDocLocation.version,
                level: sedDocLocation.level,
                models: sedDocLocation.models,
                simulations: sedDocLocation.simulations,
                tasks: sedDocLocation.tasks,
                dataGenerators: sedDocLocation.dataGenerators,
                outputs: sedDocLocation.outputs,
              });

              sedDoc.outputs.forEach((output: SedOutput): void => {
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

          const designVisualizations: Visualization[] = [];

          let behaviorSubject: BehaviorSubject<
            Observable<PlotlyDataLayout | null>
          >;

          behaviorSubject = new BehaviorSubject<
            Observable<PlotlyDataLayout | null>
          >(of(null));
          designVisualizations.push({
            _type: 'Histogram1DVisualization',
            id: 'Histogram1DVisualization',
            name: '1D histogram',
            userDesigned: true,
            simulationRunId: runId,
            sedDocs: sedmlReportArchiveContents,
            uriSedDataSetMap: uriSedDataSetMap,
            renderer: 'Plotly',
            plotlyDataLayoutSubject: behaviorSubject,
            plotlyDataLayout: behaviorSubject.asObservable(),
          });

          behaviorSubject = new BehaviorSubject<
            Observable<PlotlyDataLayout | null>
          >(of(null));
          designVisualizations.push({
            _type: 'Heatmap2DVisualization',
            id: 'Heatmap2DVisualization',
            name: '2D heatmap',
            userDesigned: true,
            simulationRunId: runId,
            sedDocs: sedmlReportArchiveContents,
            uriSedDataSetMap: uriSedDataSetMap,
            renderer: 'Plotly',
            plotlyDataLayoutSubject: behaviorSubject,
            plotlyDataLayout: behaviorSubject.asObservable(),
          });

          behaviorSubject = new BehaviorSubject<
            Observable<PlotlyDataLayout | null>
          >(of(null));
          designVisualizations.push({
            _type: 'Line2DVisualization',
            id: 'Line2DVisualization',
            name: '2D line plot',
            userDesigned: true,
            simulationRunId: runId,
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
        },
      ),
      shareReplay(1),
    );
  }

  private makeVegaVisualization(
    runId: string,
    fileLocation: string,
    sedmlArchiveContents: SimulationRunSedDocument[],
  ): VegaVisualization {
    if (fileLocation.startsWith('./')) {
      fileLocation = fileLocation.substring(2);
    }

    return {
      _type: 'VegaVisualization',
      id: fileLocation,
      name: fileLocation,
      userDesigned: false,
      renderer: 'Vega',
      vegaSpec: this.simRunService
        .getSimulationRunFileContent(runId, fileLocation)
        .pipe(
          shareReplay(1),
          map((spec: VegaSpec): VegaSpec | false => {
            return this.vegaVisualizationService.linkSignalsAndDataSetsToSimulationsAndResults(
              runId,
              sedmlArchiveContents,
              spec,
            );
          }),
          catchError((error: any): Observable<false> => {
            if (!environment.production) {
              console.error(error);
            }
            return of<false>(false);
          }),
          shareReplay(1),
        ),
    };
  }

  private makeSedPlot2DVisualization(
    runId: string,
    sedDocLocation: string,
    plot: SedPlot2D,
  ): SedPlot2DVisualization {
    const data: Observable<SimulationRunOutput> =
      this.simRunService.getSimulationRunOutputResults(
        runId,
        `${sedDocLocation}/${plot.id}`,
        true,
      );

    return {
      _type: 'SedPlot2DVisualization',
      id: `${sedDocLocation}/${plot.id}`,
      name: `${plot.name || plot.id}`,
      userDesigned: false,
      renderer: 'Plotly',
      plotlyDataLayout: of(
        data.pipe(
          shareReplay(1),
          map((result: SimulationRunOutput): PlotlyDataLayout => {
            return this.sedPlot2DVisualizationService.getPlotlyDataLayout(
              runId,
              sedDocLocation,
              plot,
              result,
            );
          }),
          catchError((error: any): Observable<PlotlyDataLayout> => {
            if (!environment.production) {
              console.error(error);
            }
            return of({
              dataErrors: ['The data for the plot could not be loaded.'],
            });
          }),
          shareReplay(1),
        ),
      ),
    };
  }

  public getReportResults(
    simulationRunId: string,
    selectedUris: string[],
  ): Observable<UriSetDataSetResultsMap> {
    const reportUris = new Set<string>();
    const reportObs: Observable<SimulationRunOutput | false>[] = [];
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
          this.simRunService
            .getSimulationRunOutputResults(simulationRunId, reportUri, true)
            .pipe(
              catchError((): Observable<false> => {
                return of(false);
              }),
            ),
        );
      }
    }

    return forkJoin(reportObs).pipe(
      shareReplay(1),
      map(
        (
          reportResults: (SimulationRunOutput | false)[],
        ): UriSetDataSetResultsMap => {
          const uriResultsMap: UriSetDataSetResultsMap = {};
          reportResults
            .flatMap(
              (
                reportResult: SimulationRunOutput | false,
              ): SimulationRunOutput[] => {
                if (reportResult) {
                  return [reportResult];
                } else {
                  return [];
                }
              },
            )
            .forEach((reportResult: SimulationRunOutput): void => {
              reportResult.data.forEach(
                (datum: SimulationRunOutputDatum): void => {
                  let outputId = reportResult.outputId;
                  if (outputId.startsWith('./')) {
                    outputId = outputId.substring(2);
                  }
                  uriResultsMap[`${outputId}/${datum.id}`] = datum;
                },
              );
            });
          return uriResultsMap;
        },
      ),
      shareReplay(1),
    );
  }

  public flattenArray(nestedArray: any[]): any[] {
    const flattenedArray: any[] = [];
    const toFlatten = [...nestedArray];
    while (toFlatten.length) {
      const el = toFlatten.pop();
      if (Array.isArray(el)) {
        el.forEach((subel: any[]): void => {
          toFlatten.push(subel);
        });
      } else {
        flattenedArray.push(el);
      }
    }
    return flattenedArray;
  }

  public getJsonLdData(
    simulationRunSummary: SimulationRunSummary,
    projectSummary?: ProjectSummary,
  ): WithContext<DatasetSchema> {
    const runId = simulationRunSummary.id;
    const runDataSet: DatasetSchema = {
      '@type': 'Dataset',
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        name: 'runBioSimulations',
        description:
          'Database of runs of biosimulations, including models, simulation experiments, simulation results, and data visualizations of simulation results.',
        url: this.endpoints.getDispatchAppHome(),
      },
      name: simulationRunSummary.name,
      url: this.endpoints.getSimulationRunsView(runId),
      identifier: [
        this.endpoints
          .getSimulationRunsView(runId)
          .replace('https://', 'http://'),
        `http://identifiers.org/runbiosimulations/${runId}`,
      ],
      distribution: [
        {
          '@type': 'DataDownload',
          description: 'Project',
          contentUrl: this.endpoints.getRunDownloadEndpoint(true, runId),
          encodingFormat: 'application/zip',
          contentSize:
            simulationRunSummary.run.projectSize === undefined
              ? 'N/A'
              : FormatService.formatDigitalSize(
                  simulationRunSummary.run.projectSize,
                ),
        },
        {
          '@type': 'DataDownload',
          description: 'Simulation results',
          contentUrl: this.endpoints.getRunResultsEndpoint(
            true,
            runId,
            undefined,
            true,
          ),
          encodingFormat: 'application/json',
        },
        {
          '@type': 'DataDownload',
          description: 'Simulation outputs',
          contentUrl: this.endpoints.getRunResultsDownloadEndpoint(true, runId),
          encodingFormat: 'application/zip',
          contentSize:
            simulationRunSummary.run.resultsSize === undefined
              ? 'N/A'
              : FormatService.formatDigitalSize(
                  simulationRunSummary.run.resultsSize,
                ),
        },
        {
          '@type': 'DataDownload',
          description: 'Simulation log',
          contentUrl: this.endpoints.getSimulationRunLogsEndpoint(true, runId),
          encodingFormat: 'application/json',
        },
      ],
      dateCreated: FormatService.formatDate(
        new Date(simulationRunSummary.submitted),
      ),
      dateModified: FormatService.formatDate(
        new Date(simulationRunSummary.updated),
      ),
      keywords: [
        'mathematical model',
        'numerical simulation',
        'COMBINE',
        'OMEX',
        'Simulation Experiment Description Markup Language',
        'SED-ML',
        simulationRunSummary.run.simulator.name,
      ],
      educationalLevel: 'advanced',
    };

    const projectMeta = simulationRunSummary.metadata;
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
          const person: PersonSchema = {
            '@type': 'Person',
          };
          if (creator.label) {
            person.name = creator.label;
          }
          if (creator.uri) {
            person.identifier = creator.uri;
          }
          return person;
        },
      );
      runDataSet.contributor = projectMeta.contributors.map(
        (contributor: LabeledIdentifier) => {
          const person: PersonSchema = {
            '@type': 'Person',
          };
          if (contributor.label) {
            person.name = contributor.label;
          }
          if (contributor.uri) {
            person.identifier = contributor.uri;
          }
          return person;
        },
      );
      projectMeta.identifiers
        .filter(
          (identifier: LabeledIdentifier) => !!identifier && !!identifier?.uri,
        )
        .forEach((identifier: LabeledIdentifier): void => {
          (runDataSet.identifier as string[]).push(identifier.uri as string);
        });
      runDataSet.citation = projectMeta.citations.map(
        (citation: LabeledIdentifier) => {
          const article: ArticleSchema = {
            '@type': 'Article',
          };
          if (citation.label) {
            article.description = citation.label;
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
          const organization: OrganizationSchema = {
            '@type': 'Organization',
          };
          if (funder.label) {
            organization.name = funder.label;
          }
          if (funder.uri) {
            organization.identifier = funder.uri;
          }
          return organization;
        },
      );
    }

    if (projectSummary) {
      const dataSet: WithContext<DatasetSchema> = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
      };
      Object.assign(dataSet, runDataSet);

      dataSet.includedInDataCatalog = {
        '@type': 'DataCatalog',
        name: 'BioSimulations',
        description:
          'Open registry of biosimulation projects, including models, simulation experiments, simulation results, and data visualizations of simulation results.',
        url: this.endpoints.getPlatformAppHome(),
      };
      dataSet.url = this.endpoints.getProjectsView(projectSummary.id);
      dataSet.identifier = [...(dataSet.identifier as string[])];
      (dataSet.identifier as string[])[0] = this.endpoints
        .getProjectsView(projectSummary.id)
        .replace('https://', 'http://');
      (
        dataSet.identifier as string[]
      )[1] = `http://identifiers.org/biosimulations/${projectSummary.id}`;
      dataSet.creativeWorkStatus = 'Published';
      dataSet.hasPart = runDataSet;
      dataSet.distribution = [
        {
          '@type': 'DataDownload',
          description: 'Project',
          contentUrl: this.endpoints.getProjectsEndpoint(
            true,
            projectSummary.id,
          ),
          encodingFormat: 'application/json',
        },
      ];
      dataSet.datePublished = FormatService.formatDate(
        new Date(projectSummary.created),
      );
      dataSet.dateModified = FormatService.formatDate(
        new Date(projectSummary.updated),
      );

      return dataSet;
    } else {
      const dataSet: WithContext<DatasetSchema> = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
      };
      Object.assign(dataSet, runDataSet);
      return dataSet;
    }
  }

  private uriIsUrl(labeledIdentifier: LabeledIdentifier): LabeledIdentifierIsUrl {
    return {
      label: labeledIdentifier?.label,
      uri: labeledIdentifier?.uri 
        ? {
            value: labeledIdentifier?.uri,
            isUrl: isUrl(labeledIdentifier?.uri),
          }
        : null,
    };
  }
}
