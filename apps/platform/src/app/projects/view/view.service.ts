import { Injectable } from '@angular/core';
import { map, Observable, pluck, shareReplay, of } from 'rxjs';
import { ArchiveMetadata, CombineArchiveContentFormat, FORMATS, COMBINE_OMEX_FORMAT } from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { ProjectsService } from '../projects.service';
import { SimulatorIdNameMap, Directory, File, List, ListItem } from '../datamodel';
import { UtilsService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';

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

  public getArchiveMetadata(id: string): Observable<ArchiveMetadata> {
    const metaData: Observable<ArchiveMetadata> = this.getProjectMetadata(
      id,
    ).pipe(map((metadata) => metadata[0]));

    return metaData;
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
  public getProjectMetadata(id: string): Observable<ArchiveMetadata[]> {
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

  public getSimulationRun(id: string): Observable<List[]> {
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

        const compResources: ListItem[] = [];

        compResources.push({
          title: 'Project',
          value: of(UtilsService.formatDigitalSize(simulationRun.projectSize)),
          icon: 'disk',
          url: null,
        });

        compResources.push({
          title: 'Results',
          value: of(UtilsService.formatDigitalSize(simulationRun.resultsSize)),
          icon: 'disk',
          url: null,
        });

        const durationSec = this.service.getProjectSimulationLog(simulationRun.id)
          .pipe(
            pluck('duration'),
            map((durationSec: number): string => UtilsService.formatDuration(durationSec)),
          );
        compResources.push({
          title: 'Duration',
          value: durationSec,
          icon: 'duration',
          url: null,
        });

        compResources.push({
          title: 'CPUs',
          value: of(simulationRun.cpus.toString()),
          icon: 'processor',
          url: null,
        });

        compResources.push({
          title: 'Memory',
          value: of(UtilsService.formatDigitalSize(simulationRun.memory * 1e9)),
          icon: 'memory',
          url: null,
        });

        const run: ListItem[] = [];

        run.push({
          title: 'Id',
          value: of(simulationRun.id),
          icon: 'id',
          url: `${urls.dispatch}/simulations/${id}`,
        });

        run.push({
          title: 'Submitted',
          value: of(UtilsService.getDateTimeString(new Date(simulationRun.submitted))),
          icon: 'date',
          url: null,
        });

        run.push({
          title: 'Completed',
          value: of(UtilsService.getDateTimeString(new Date(simulationRun.updated))),
          icon: 'date',
          url: null,
        });

        // return sections
        const sections = [
          {title: 'Methods', items: methods},
          {title: 'Formats', items: formats},
          {title: 'Tools', items: tools},
          {title: 'Computational resources', items: compResources},
          {title: 'Simulation run', items: run},
        ];
        return sections;
      }),
    );
  }

  public getProjectFiles(id: string): Observable<File[]> {
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

  public getFiles(id: string): Observable<(Directory | File)[]> {
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

            console.log(format)

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

  public getOutputs(id: string): Observable<File[]> {
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
