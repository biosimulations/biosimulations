import { Injectable } from '@angular/core';
import { map, Observable, pluck, shareReplay, of } from 'rxjs';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { ProjectsService } from '../projects.service';
import { SimulatorIdNameMap, List, ListItem } from '../datamodel';
import { UtilsService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  public constructor(private service: ProjectsService) {}

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

  public getSimulationRunMetadata(id: string): Observable<List[]> {
    return this.service.getProjectSimulation(id).pipe(
      map((simulationRun: any): List[] => { // SimulationRun
        const methods: ListItem[] = [];

        /* TODO: add tasks: simulation type, simulation algorithm
        for () {
          methods.push({
            title: 'Tasks',
            value: of('SED-ML'),
            icon: 'code',
            href: 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' + id
          });
        }
        */

        const formats: ListItem[] = [];
        formats.push({
          title: 'Project',
          value: of('COMBINE/OMEX'),
          icon: 'format',
          href: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
        });

        /* TODO: add model format(s)
        for () {
          formats.push({
            title: 'Model',
            value: of('SBML'),
            icon: 'format',
            href: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3686'
          });
        }
        */

        formats.push({
          title: 'Simulation',
          value: of('SED-ML'),
          icon: 'format',
          href: 'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3685'
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
          href: `https://biosimulators.org/simulators/${simulationRun.simulator}/${simulationRun.simulatorVersion}`,
        });

        const compResources: ListItem[] = [];

        compResources.push({
          title: 'Project',
          value: of(UtilsService.formatDigitalSize(simulationRun.projectSize)),
          icon: 'disk',
          href: null,
        });

        compResources.push({
          title: 'Results',
          value: of(UtilsService.formatDigitalSize(simulationRun.resultsSize)),
          icon: 'disk',
          href: null,
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
          href: null,
        });

        compResources.push({
          title: 'CPUs',
          value: of(simulationRun.cpus.toString()),
          icon: 'processor',
          href: null,
        });

        compResources.push({
          title: 'Memory',
          value: of(UtilsService.formatDigitalSize(simulationRun.memory * 1e9)),
          icon: 'memory',
          href: null,
        });

        const run: ListItem[] = [];

        run.push({
          title: 'Id',
          value: of(simulationRun.id),
          icon: 'id',
          href: `https://run.biosimulations.org/simulations/${simulationRun.id}`,
        });

        run.push({
          title: 'Submitted',
          value: of(UtilsService.getDateTimeString(new Date(simulationRun.submitted))),
          icon: 'date',
          href: null,
        });

        run.push({
          title: 'Completed',
          value: of(UtilsService.getDateTimeString(new Date(simulationRun.updated))),
          icon: 'date',
          href: null,
        });

        run.push({
          title: 'Log',
          value: of('Log'),
          icon: 'logs',
          href: 'https://run.biosimulations.org/simulations/${simulationRun.id}#tab=log',
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

  public getFilesMetadata(id: string) {
    return this.service.getArchiveContents(id);
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
}
