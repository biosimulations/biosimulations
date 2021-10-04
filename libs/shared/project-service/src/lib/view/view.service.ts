import { Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, pluck, shareReplay, of, combineLatest } from 'rxjs';
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
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { ProjectsService } from '../projects/projects.service';
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
} from '@biosimulations/datamodel/project';
import { UtilsService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { OntologyService } from '@biosimulations/ontology/client';
import { Spec as VegaSpec } from 'vega';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  formatMap!: {[uri: string]: CombineArchiveContentFormat};

  public constructor(
    private service: ProjectsService,
    private vegaVisualizationService: VegaVisualizationService,
    private sedPlot2DVisualizationService: SedPlot2DVisualizationService,
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

  public getFormattedProjectContentFiles(id: string): Observable<Path[]> {
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

  public getFormattedOutputFiles(id: string): Observable<File[]> {
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

        const sedmlReportArchive = JSON.parse(JSON.stringify(sedmlArchive));
        sedmlReportArchive.contents.forEach((sedDocContent: CombineArchiveContent): void => {
          if (sedDocContent.location.path.startsWith('./')) {
            sedDocContent.location.path = sedDocContent.location.path.substring(2);
          }
          const sedDoc = sedDocContent.location.value as SedDocument;
          sedDoc.outputs = sedDoc.outputs
            .filter((output: SedOutput): boolean => {
              return output._type === 'SedReport';
            });
        })

        const uriSedDataSetMap: UriSedDataSetMap = {};
        sedmlArchive.contents.forEach(
          (sedDocContent: CombineArchiveContent): void => {
            (sedDocContent.location.value as SedDocument).outputs.forEach((output: SedOutput): void => {
              if (output._type === 'SedReport') {
                output.dataSets.forEach((dataSet: SedDataSet): void => {
                  let location = sedDocContent.location.path;
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
              userDesigned: false,
              renderer: 'Vega',
              vegaSpec: this.service.getProjectFile(id, content.location.path)
                .pipe(map((spec: VegaSpec): VegaSpec | false => {
                  return this.vegaVisualizationService.linkSignalsAndDataSetsToSimulationsAndResults(id, sedmlArchive, spec);
                })),
            });
          }
        });
        vegaVisualizations.sort((a: VegaVisualization, b: VegaVisualization): number => {
          return a.name.localeCompare(b.name, undefined, { numeric: true });
        });

        const vegaVisualizationsList: VisualizationList[] = vegaVisualizations.length 
        ? [{
            title: 'Vega charts',
            visualizations: vegaVisualizations,
          }]
        : [];

        const sedmlVisualizationsList = sedmlArchive.contents.map((sedmlContent: CombineArchiveContent): VisualizationList => {
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
                  userDesigned: false,
                  renderer: 'Plotly',
                  plotlyDataLayout: of(this.service.getSimulationRunResults(id, `${location}/${output.id}`, true).pipe(
                    map((result: any): PlotlyDataLayout => {
                      return this.sedPlot2DVisualizationService.getPlotlyDataLayout(id, location, output as SedPlot2D, result);
                    }))),
                };
              })
              .sort((a: Visualization, b: Visualization): number => {
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              }),
            };
        })
        .filter((a: VisualizationList): boolean => {
          return a.visualizations.length > 0;
        })
        .sort((a: VisualizationList, b: VisualizationList): number => {
          return a.title.localeCompare(b.title, undefined, { numeric: true });
        });

        const designVisualizations: Visualization[] = [];

        let behaviorSubject: BehaviorSubject<Observable<PlotlyDataLayout | false | null>>;

        behaviorSubject = new BehaviorSubject<Observable<PlotlyDataLayout | false | null>>(of(null));
        designVisualizations.push({
          _type: 'Histogram1DVisualization',
          id: 'Histogram1DVisualization',
          name: '1D histogram',
          userDesigned: true,
          simulationRunId: id,
          combineArchiveSedDocs: sedmlReportArchive,
          uriSedDataSetMap: uriSedDataSetMap,
          renderer: 'Plotly',
          plotlyDataLayoutSubject: behaviorSubject,
          plotlyDataLayout: behaviorSubject.asObservable(),
        });

        behaviorSubject = new BehaviorSubject<Observable<PlotlyDataLayout | false | null>>(of(null));
        designVisualizations.push({
          _type: 'Heatmap2DVisualization',
          id: 'Heatmap2DVisualization',
          name: '2D heatmap',
          userDesigned: true,
          simulationRunId: id,
          combineArchiveSedDocs: sedmlReportArchive,
          uriSedDataSetMap: uriSedDataSetMap,
          renderer: 'Plotly',
          plotlyDataLayoutSubject: behaviorSubject,
          plotlyDataLayout: behaviorSubject.asObservable(),
        });
        
        behaviorSubject = new BehaviorSubject<Observable<PlotlyDataLayout | false | null>>(of(null));
        designVisualizations.push({
          _type: 'Line2DVisualization',
          id: 'Line2DVisualization',
          name: '2D line plot',
          userDesigned: true,
          simulationRunId: id,
          combineArchiveSedDocs: sedmlReportArchive,
          uriSedDataSetMap: uriSedDataSetMap,
          renderer: 'Plotly',
          plotlyDataLayoutSubject: behaviorSubject,
          plotlyDataLayout: behaviorSubject.asObservable(),
        });

        const designVisualizationsList: VisualizationList[] = [{
          title: 'Design a chart',
          visualizations: designVisualizations,
        }];
        
        return vegaVisualizationsList
          .concat(sedmlVisualizationsList)
          .concat(designVisualizationsList);
      })
    );
  }

  public getReportResults(simulationRunId: string, selectedUris: string[]): Observable<UriSetDataSetResultsMap> {
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
        reportObs.push(this.service.getSimulationRunResults(simulationRunId, reportUri, true));
      }
    }

    return combineLatest(...reportObs).pipe(
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
      })
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
}
