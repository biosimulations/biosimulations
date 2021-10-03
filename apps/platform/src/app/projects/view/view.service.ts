import { Injectable } from '@angular/core';
import { map, Observable, pluck, shareReplay, of, combineLatest } from 'rxjs';
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
  CombineArchive,
  CombineArchiveContent,
  SedDocumentReportsCombineArchiveContent,
  SedDocument,
  SedAbstractTask,
  SedTask,
  SedSimulation,
  SedOutput,
  SedReport,
  SedPlot2D,
  Ontologies,
  KisaoTerm,
  SimulationTypeBriefName,
  PlotlyDataLayout,
  PlotlyTrace,
  PlotlyTraceMode,
  PlotlyTraceType,
} from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
/*
import {
  SimulationRun,
  SimulationRunOutput,
  SimulationRunResults,
  SimulationRunOutputDatum,
} from '@biosimulations/dispatch/api-models';
*/
import { ProjectsService } from '../projects.service';
import { SimulatorIdNameMap } from '../datamodel';
import { SedDatasetResultsMap } from './view.model';
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
} from '@biosimulations/datamodel/view-simulation';
import { UtilsService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { OntologyService } from '@biosimulations/ontology/client';
import { Spec as VegaSpec } from 'vega';
import { Endpoints } from '@biosimulations/config/common';


@Injectable({
  providedIn: 'root',
})
export class ViewService {
  formatMap!: {[uri: string]: CombineArchiveContentFormat};

  private endpoints = new Endpoints();

  public constructor(
    private service: ProjectsService,
    private ontologyService: OntologyService,
  ) {
    this.formatMap = {};
    FORMATS.forEach((format: CombineArchiveContentFormat): void => {
      this.formatMap[format.combineUri] = format;
    })
  }

  public getFormattedProjectMetadata(id: string): Observable<ProjectMetadata> {
    return this.getProjectMetadata(
      id,
    ).pipe(
      map((metadatas: ArchiveMetadata[]): ProjectMetadata => {
        let metadata!: ArchiveMetadata;
        for (metadata of metadatas) {
          if (metadata.uri.search('/') === -1) {
            break;
          }
        }

        const formattedMetadata: ProjectMetadata = {
          thumbnails: metadata.thumbnails,
          title: metadata?.title || id,
          abstract: metadata?.abstract,
          creators: metadata.creators.map(
            (creator: LabeledIdentifier): Creator => {
              let icon: BiosimulationsIcon = 'link';
              if (creator.uri) {
                if (creator.uri.match(/^https?:\/\/(wwww\.)?(identifiers\.org\/orcid[:/]|orcid\.org\/)/i)) {
                  icon = 'orcid';
                } else if (creator.uri.match(/^https?:\/\/(wwww\.)?(identifiers\.org\/github[:/]|github\.com\/)/i)) {
                  icon = 'github';
                } else if (creator.uri.match(/^https?:\/\/(wwww\.)?(linkedin\.com\/)/i)) {
                  icon = 'linkedin';
                } else if (creator.uri.match(/^https?:\/\/(wwww\.)?(twitter\.com\/)/i)) {
                  icon = 'twitter';
                } else if (creator.uri.match(/^https?:\/\/(wwww\.)?(facebook\.com\/)/i)) {
                  icon = 'facebook';
                } else if (creator.uri.match(/^mailto:/i)) {
                  icon = 'email';
                }
              }

              return {
                label: creator.label,
                uri: creator.uri,
                icon: icon,
              }
            }
          ),
          description: metadata?.description,
          attributes: [],
        };

        formattedMetadata.attributes.push({
          values: metadata.encodes,
          icon: 'cell' as BiosimulationsIcon,
          title: 'Biology'          
        });
        formattedMetadata.attributes.push({
          values: metadata.taxa, 
          icon: 'taxon' as BiosimulationsIcon, 
          title: 'Taxon',
        });
        formattedMetadata.attributes.push({
          values: metadata.keywords, 
          icon: 'tags' as BiosimulationsIcon, 
          title: 'Keyword',
        });
        metadata.other.forEach((other: DescribedIdentifier): void => {
          formattedMetadata.attributes.push({
            icon: 'info' as BiosimulationsIcon,
            title: (other.attribute_label || other.attribute_uri) as string,
            values: [{
              label: (other.label || other.uri) as string,
              uri: other.uri,
            }],
          });
        });
        formattedMetadata.attributes.push({
          values: metadata.seeAlso,
          icon: 'link' as BiosimulationsIcon, 
          title: 'More info',
        });
        formattedMetadata.attributes.push({
          values: metadata.citations,
          icon: 'file' as BiosimulationsIcon, 
          title: 'Citation',
        });
        formattedMetadata.attributes.push({
          values: metadata.sources,
          icon: 'code' as BiosimulationsIcon,
          title: 'Source',
        });
        formattedMetadata.attributes.push({
          values: metadata.identifiers,
          icon: 'id' as BiosimulationsIcon, 
          title: 'Cross reference',
        });
        formattedMetadata.attributes.push({
          values: metadata.predecessors,
          icon: 'backward' as BiosimulationsIcon, 
          title: 'Predecessor',
        });
        formattedMetadata.attributes.push({
          values: metadata.successors,
          icon: 'forward' as BiosimulationsIcon, 
          title: 'Successor',
        });
        formattedMetadata.attributes.push({
          values: metadata.license,
          icon: 'license' as BiosimulationsIcon, 
          title: 'License',
        });
        formattedMetadata.attributes.push({
          values: metadata.contributors,
          icon: 'author' as BiosimulationsIcon, 
          title: 'Curator',
        });
        formattedMetadata.attributes.push({
          values: metadata.funders,
          icon: 'funding' as BiosimulationsIcon, 
          title: 'Funder',
        });

        if (metadata?.created) {
          formattedMetadata.attributes.push({
            icon: 'date' as BiosimulationsIcon,
            title: 'Created',
            values: [{
              label: UtilsService.formatDate(new Date(metadata?.created)),
              uri: null,
            }],
          });
        }

        if (metadata?.modified.length) {
          formattedMetadata.attributes.push({
            icon: 'date' as BiosimulationsIcon,
            title: 'Last modified',
            values: [{
              label: UtilsService.formatDate(new Date(metadata?.modified[0])),
              uri: null,
            }],
          });
        }

        return formattedMetadata;
      })
    );
  }

  public getOtherMetadata(id: string): Observable<ArchiveMetadata[]> {
    const metadata: Observable<ArchiveMetadata[]> = this.getProjectMetadata(
      id,
    ).pipe(
      map((data: ArchiveMetadata[]) => {
        return data.slice(1);
      }),
      //tap((data) => console.log(data))
    );
    return metadata;
  }

  private getProjectMetadata(id: string): Observable<ArchiveMetadata[]> {
    const response: Observable<ArchiveMetadata[]> = this.service
      .getProject(id)
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

  public getFormattedSimulationRun(id: string): Observable<FormattedSimulationRunMetadata> {
    return combineLatest(      
      this.service.getSimulationRun(id),
      this.service.getProjectSedmlContents(id),
      this.service.getSimulationRunLog(id),
      this.ontologyService.getTerms<KisaoTerm>(Ontologies.KISAO),
    ).pipe(
      map((args: [any, CombineArchive, any, {[id: string]: KisaoTerm}]): FormattedSimulationRunMetadata => { // SimulationRun
        const simulationRun = args[0];
        const sedmlArchive = args[1];
        const log = args[2];
        const kisaoIdTermMap = args[3];

        const modelLanguageSedUrns = new Set<string>();
        const simulationTypes = new Set<string>();
        let simulationAlgorithms = new Set<string>();
        sedmlArchive.contents.forEach((sedmlContent: CombineArchiveContent): void => {
          const sedDoc: SedDocument = (sedmlContent as SedDocumentReportsCombineArchiveContent).location.value;
          sedDoc.tasks.forEach((abstractTask: SedAbstractTask): void => {
            if (abstractTask._type === 'SedTask') {
              const task = abstractTask as SedTask;
              modelLanguageSedUrns.add(task.model.language);
              simulationTypes.add(task.simulation._type);
              simulationAlgorithms.add(task.simulation.algorithm.kisaoId);
            }
          })
        });

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
              value: SimulationTypeBriefName[simulationType as keyof typeof SimulationTypeBriefName],
              icon: 'simulator',
              url: 'https://sed-ml.org/',
            };
          })
          .sort((a: any, b: any): number => {
            return a.value.localeCompare(b.value, undefined, { numeric: true });
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
              url: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + kisaoId,
            };
          })
          .sort((a: any, b: any): number => {
            return a.value.localeCompare(b.value, undefined, { numeric: true });
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
          url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
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
            return a.value.localeCompare(b.value, undefined, { numeric: true });
          })
          .forEach((modelLanguage: any): void => {
            modelLanguage.value = of(modelLanguage.value);
            formats.push(modelLanguage as ListItem);
          });        

        formats.push({
          title: 'Simulation',
          value: of('SED-ML'),
          icon: 'simulation',
          url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3685'
        });

        const tools: ListItem[] = [];
        const simulator = this.service.getSimulatorIdNameMap().pipe(
          map((simulatorIdNameMap: SimulatorIdNameMap): string => {
            return simulatorIdNameMap[simulationRun.simulator] + ' ' + simulationRun.simulatorVersion;
          })
        );
        tools.push({
          title: 'Simulator',
          value: simulator,
          icon: 'simulator',
          url: `https://biosimulators.org/simulators/${simulationRun.simulator}/${simulationRun.simulatorVersion}`,
        });

        const run: ListItem[] = [];

        run.push({
          title: 'Id',
          value: of(simulationRun.id),
          icon: 'id',
          url: `${urls.dispatch}/simulations/${id}`,
        });

        const durationSec = this.service.getSimulationRunLog(simulationRun.id)
          .pipe(
            pluck('duration'),
            map((durationSec: number): string => UtilsService.formatDuration(durationSec)),
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
          value: of(UtilsService.formatDigitalSize(simulationRun.memory * 1e9)),
          icon: 'memory',
          url: null,
        });

        run.push({
          title: 'Submitted',
          value: of(UtilsService.formatTime(new Date(simulationRun.submitted))),
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
          {title: 'Modeling methods', items: methods},
          {title: 'Modeling formats', items: formats},
          {title: 'Simulation tools', items: tools},
          {title: 'Simulation run', items: run},
        ];
        return sections.filter((section: List): boolean => {
          return section.items.length > 0;
        });
      }),
    );
  }

  public getFormattedProjectFiles(id: string): Observable<File[]> {
    return this.service.getSimulationRun(id).pipe(
      map((simulationRun: any): File[] => { // SimulationRun
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
            url: `${urls.dispatchApi}runs/${id}/download`,
            basename: 'project.omex',
          },
        ]
      })
    );
  }

  public getFormattedFiles(id: string): Observable<Path[]> {
    return this.service.getArchiveContents(id).pipe(
      map((archive: any): Path[] => {
        const root: {[path: string]: Path} = {};

        let hasMaster = false;
        for (const content of archive.contents) {
          if (content.master) {
            hasMaster = true;
            break;
          }
        }

        archive.contents
          .filter((content: any): boolean => {
            return content.location.path != '.';
          })
          .forEach((content: any): void => {
            let location = content.location.path;
            if (location.substring(0, 2) === './') {
              location = location.substring(2);
            }

            const parentBasenames = location.split('/')
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
                }
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
              const formatObj = this.formatMap[format]
              formatName = formatObj.name;
              if (formatObj.acronym) {
                formatName += ' (' + formatObj.acronym + ')';
              }            
            } else if (format.startsWith('http://purl.org/NET/mediatypes/')) {
              formatName = format.substring('http://purl.org/NET/mediatypes/'.length);
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
              master: content.master || (!hasMaster && format === SEDML_FORMAT.combineUri),
              url: `https://files.biosimulations.org/${id}/${location}`, // TODO: correct file URLs
              size: null, // UtilsService.formatDigitalSize(100), // TODO: incorporate and display file size
              formatUrl: this.formatMap?.[format]?.url,
              icon: this.formatMap?.[format]?.icon || 'file',
            };
          });

        return Object.values(root)
          .sort((a: Path, b: Path): number => {
            if (a._type == 'Directory' && b._type === 'File') {
              return -1;
            }
            
            if (a._type == 'File' && b._type === 'Directory') {
              return 1;
            }

            return a.location.localeCompare(b.location, undefined, { numeric: true });
          });
      })
    );
  }

  public getFormattedOutputs(id: string): Observable<File[]> {
    return this.service.getSimulationRun(id).pipe(
      map((simulationRun: any): File[] => { // SimulationRun
        return [          
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Outputs',
            format: 'JavaScript Object Notation (JSON) in BioSimulators schema',
            formatUrl: 'https://api.biosimulations.org/',
            master: false,
            size: null,
            icon: 'report',
            url: `${urls.dispatchApi}results/${id}`,
            basename: 'outputs.json',
          },
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Outputs',
            format: 'Zip of HDF5 and PDF files',
            formatUrl: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3987',
            master: false,
            size: UtilsService.formatDigitalSize(simulationRun.resultsSize),
            icon: 'report',
            url: `${urls.dispatchApi}results/${id}/download`,
            basename: 'outputs.zip',
          },
          {
            _type: 'File',
            level: 0,
            location: '',
            title: 'Log',
            format: 'YAML in BioSimulators log schema',
            formatUrl: 'https://biosimulators.org/conventions/simulation-logs',
            master: false,
            size: null,
            icon: 'logs',
            url: `${urls.dispatchApi}logs/${id}`,
            basename: 'log.yml',
          }
        ];
      })
    );
  }

  public getVisualizations(id: string): Observable<VisualizationList[]> {
    return combineLatest(
      this.service.getArchiveContents(id),
      this.service.getProjectSedmlContents(id),
    ).pipe(
      map((args: [any, CombineArchive]): VisualizationList[] => {
        const archive = args[0];
        const sedmlArchive = args[1];        
        
        const vegaVisualizations: VegaVisualization[] = [];
        archive.contents.forEach((content: any): void => {
          if (content.format === VEGA_FORMAT.combineUri) {
            let location = content.location.path;
            if (location.startsWith('./')) {
              location = location.substring(2);
            }

            vegaVisualizations.push({
              _type: 'VegaVisualization',
              id: location,
              name: location,
              renderer: 'Vega',
              vegaSpec: this.service.getProjectFile(id, content.location.path)
                .pipe(map((spec: VegaSpec): VegaSpec | false => {
                  return this.processVegaVisualizationSpec(id, sedmlArchive, spec);
                })),
            });
          }
        });
        vegaVisualizations.sort((a: VegaVisualization, b: VegaVisualization): number => {
          return a.name.localeCompare(b.name, undefined, { numeric: true });
        });

        const sedmlVisualizations = sedmlArchive.contents.map((sedmlContent: CombineArchiveContent): VisualizationList => {
          const sedDoc: SedDocument = (sedmlContent as SedDocumentReportsCombineArchiveContent).location.value;
          let location = sedmlContent.location.path;
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
                  renderer: 'Plotly',
                  dataLayout: this.getSedPlot2dDataLayout(id, location, output as SedPlot2D),                  
                };
              })
              .sort((a: Visualization, b: Visualization): number => {
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              }),
            };
        });
        sedmlVisualizations.sort((a: VisualizationList, b: VisualizationList): number => {
          return a.title.localeCompare(b.title, undefined, { numeric: true });
        });

        return ([
          {
            title: 'Vega charts',
            visualizations: vegaVisualizations,
          }
        ] as VisualizationList[]
        )
        .concat(sedmlVisualizations)
        .concat([
          {
            title: 'Design a chart',
            visualizations: [
              {
                _type: 'Histogram1DVisualization',
                id: 'Histogram1DVisualization',
                name: '1D histogram',
              },
              {
                _type: 'Heatmap2DVisualization',
                id: 'Heatmap2DVisualization',
                name: '2D heatmap',
              },
              {
                _type: 'Line2DVisualization',
                id: 'Line2DVisualization',
                name: '2D line plot',
              },
            ] as Visualization[],
          }
        ] as VisualizationList[]);
      })
    );
  }

  private processVegaVisualizationSpec(
    simulationRunId: string, sedDocumentConfigurations: CombineArchive, spec: VegaSpec
  ): VegaSpec | false {
    if (Array.isArray(spec?.signals)) {
      for (const signal of spec?.signals) {
        const anySignal = signal as any;

        if ('sedmlUri' in signal) {
          console.error(anySignal);
          const sedmlSimulationAttributePath = anySignal.sedmlUri as any;
          anySignal.value = this.getValueOfSedmlObjectAttribute(
            sedmlSimulationAttributePath,
            sedDocumentConfigurations,
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
                sedDocumentConfigurations,
              );
              if (bind[key] === undefined) {
                return false;
              }
            }
          }
        }
      }
    }

    if (Array.isArray(spec?.data)) {
      for (const data of spec?.data) {
        const anyData = data as any;
        const name = anyData?.name;
        if ('sedmlUri' in anyData) {
          if (
            anyData.sedmlUri?.length == 0 ||
            (anyData.sedmlUri?.length == 2 &&
              this.getSedReport(anyData.sedmlUri, sedDocumentConfigurations) &&
              !Array.isArray(this.getSedReport(anyData.sedmlUri, sedDocumentConfigurations)))
          ) {
            anyData.url = this.endpoints.getRunResultsEndpoint(
              simulationRunId,
              anyData.sedmlUri.join('/'),
              true,
            );
            anyData.format = {
              type: 'json',
              property: anyData.sedmlUri?.length == 0 ? 'outputs' : 'data',
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
  }

  private getSedDocument(path: any, sedDocumentConfigurations: CombineArchive): SedDocument | SedDocument[] | undefined {
    if (!Array.isArray(path)) {
      return undefined;
    }

    if (!sedDocumentConfigurations) {
      console.error('No sedDocumentConfigurations');
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
      iContent < sedDocumentConfigurations.contents.length;
      iContent++
    ) {
      const content = sedDocumentConfigurations.contents[iContent] as SedDocumentReportsCombineArchiveContent;
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

  private getSedReport(path: any, sedDocumentConfigurations: CombineArchive): SedReport | SedReport[] | undefined {
    const sedDocument: SedDocument | SedDocument[] | undefined =
      this.getSedDocument(path, sedDocumentConfigurations);
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

  private getValueOfSedmlObjectAttribute(path: any, sedDocumentConfigurations: CombineArchive): any {
    const sedDocument: SedDocument | SedDocument[] | undefined =
      this.getSedDocument(path, sedDocumentConfigurations);
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

  private getSedPlot2dDataLayout(simulationRunId: string, sedDocLocation: string, plot: SedPlot2D): Observable<PlotlyDataLayout> {
    return this.getSimulationRunResults(simulationRunId, `${sedDocLocation}/${plot.id}`, true)
      .pipe(
        map((results: SedDatasetResultsMap | undefined): PlotlyDataLayout => {
          const traces: PlotlyTrace[] = [];
          const xAxisTitlesSet = new Set<string>();
          const yAxisTitlesSet = new Set<string>();
          let missingData = false;
          for (const curve of plot.curves) {
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
              type: PlotlyTraceType.scatter,
              mode: PlotlyTraceMode.lines,
            };
            if (trace.x && trace.y) {
              traces.push(trace as PlotlyTrace);
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

          if (missingData) {
            // TODO: handle error
          }

          const dataLayout: PlotlyDataLayout = {
            data: traces,
            layout: {
              xaxis1: {
                anchor: 'x1',
                title: xAxisTitle,
                type: plot.xScale,
              },
              yaxis1: {
                anchor: 'y1',
                title: yAxisTitle,
                type: plot.yScale,
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
          };

          return dataLayout;
        })
      );
  }

  private getSimulationRunResults(simulationRunId: string, outputId?: string, includeData = false): Observable<SedDatasetResultsMap> {
    return this.service.getSimulationRunResults(simulationRunId, outputId, includeData).pipe(
      map(
        (
          result: any,
        ): SedDatasetResultsMap => {
          const outputs = outputId
            ? [result as any] // SimulationRunOutput
            : (result as any).outputs; // SimulationRunResults

          const datasetResultsMap: SedDatasetResultsMap = {};

          outputs.forEach((output: any): void => { // SimulationRunOutput
            const sedmlLocationOutputId = output.outputId;

            const sedmlLocation = this.getLocationFromSedmLocationId(
              sedmlLocationOutputId,
            );

            const outputId = this.getOutputIdFromSedmlLocationId(
              sedmlLocationOutputId,
            );

            output.data.forEach((datum: any): void => { // SimulationRunOutputDatum
              const uri = sedmlLocation + '/' + outputId + '/' + datum.id;
              datasetResultsMap[uri] = {
                uri: uri,
                id: datum.id,
                location: sedmlLocation,
                outputId: outputId,
                label: datum.label,
                values: datum.values,
              };
            });
          });

          return datasetResultsMap;
        },
      ),
    );
  }

  private getLocationFromSedmLocationId(locationId: string): string {
    // Remove the last "/" and the text after the last "/"
    // EG simulation_1.sedml/subfolder1/Figure_3b" => simulation_1.sedml/subfolder1
    // TODO write tests
    return locationId.split('/').reverse().slice(1).reverse().join('/');
  }

  private getOutputIdFromSedmlLocationId(location: string): string {
    return location.split('/').reverse()[0];
  }
}
