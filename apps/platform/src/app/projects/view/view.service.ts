import { Injectable } from '@angular/core';
import { map, Observable, pluck, shareReplay, of } from 'rxjs';
import {
  ArchiveMetadata, 
  LabeledIdentifier,
  DescribedIdentifier,
  CombineArchiveContentFormat,
  FORMATS,
  COMBINE_OMEX_FORMAT,
} from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { ProjectsService } from '../projects.service';
import { SimulatorIdNameMap } from '../datamodel';
import { ProjectMetadata, Creator, Directory, File, List, ListItem } from './view.model';
import { UtilsService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  formatMap!: {[uri: string]: CombineArchiveContentFormat};

  public constructor(private service: ProjectsService) {
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

  public getFormattedSimulationRun(id: string): Observable<List[]> {
    return this.service.getProjectSimulation(id).pipe(
      map((simulationRun: any): List[] => { // SimulationRun
        const methods: ListItem[] = [];

        /* TODO: add tasks: simulation type, simulation algorithm
        for () {
          methods.push({
            title: 'Tasks',
            value: of('SED-ML'),
            icon: 'code',
            url: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + id
          });
        }
        */

        const formats: ListItem[] = [];
        formats.push({
          title: 'Project',
          value: of('COMBINE/OMEX'),
          icon: 'format',
          url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
        });

        /* TODO: add model format(s)
        for () {
          formats.push({
            title: 'Model',
            value: of('SBML'),
            icon: 'format',
            url: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
          });
        }
        */

        formats.push({
          title: 'Simulation',
          value: of('SED-ML'),
          icon: 'format',
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

        const durationSec = this.service.getProjectSimulationLog(simulationRun.id)
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
          {title: 'Simulation methods', items: methods},
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
    return this.service.getProjectSimulation(id).pipe(
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

  public getFormattedFiles(id: string): Observable<(Directory | File)[]> {
    return this.service.getArchiveContents(id).pipe(
      map((archive: any): (Directory | File)[] => {
        const root: {[path: string]: Directory | File} = {};

        archive.contents
          .filter((content: any): boolean => {
            return content.location.value.filename != '.';
          })
          .forEach((content: any): void => {
            let location = content.location.value.filename;
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

            let format!: string;
            if (content.format in this.formatMap) {
              const formatObj = this.formatMap[content.format]
              format = formatObj.name;
              if (formatObj.acronym) {
                format += ' (' + formatObj.acronym + ')';
              }              
            } else if (content.format.startsWith('http://purl.org/NET/mediatypes/')) {
              format = content.format.substring('http://purl.org/NET/mediatypes/'.length);
            } else {
              format = content.format;
            }

            root[location] = {
              _type: 'File',
              level: parentBasenames.length,
              location: location,
              title: basename,
              basename: basename,
              format: format,
              master: content.master,
              url: `https://files.biosimulations.org/${id}/${location}`, // TODO: correct file URLs
              size: null, // UtilsService.formatDigitalSize(100), // TODO: incorporate and display file size
              formatUrl: this.formatMap?.[content.format]?.url,
              icon: this.formatMap?.[content.format]?.icon || 'file',
            };
          });

        return Object.values(root)
          .sort((a: Directory | File, b: Directory | File): number => {
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

  public getVegaFilesMetadata(id: string) {
    return this.service.getArchiveContents(id).pipe(
      pluck('contents'),
      // Get the information for the files that have vega format
      map((data) =>
        data.filter((item: any) =>
          item.format.endsWith(
            'http://purl.org/NET/mediatypes/application/vega+json',
          ),
        ),
      ),
    );
  }

  public getVegaVisualizations(
    id: string,
  ): Observable<
    [{ id: string; path: string; spec: Observable<{ $schema: string }> }]
  > {
    return this.getVegaFilesMetadata(id).pipe(
      // Just need the information about the path of the file within the archive
      map((data) => data.map((item: any) => item.location.path)),
      map((paths) =>
        paths.map((path: string) => {
          return {
            path: path,
            id: id,
            spec: this.service.getProjectFile(id, path),
          };
        }),
      ),
    );
  }
  
  public getSedmlVisualizations(id: string): Observable<string[]> {
    return this.service.getProjectSedmlContents(id);
  }

  public getProjectSedmlContent(id: string): Observable<string> {
    return this.service.getProjectSedmlContents(id);
  }

  public getFormattedOutputs(id: string): Observable<File[]> {
    return this.service.getProjectSimulation(id).pipe(
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
}
