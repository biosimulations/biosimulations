import { Injectable } from '@angular/core';
import { SimulatorService } from '../simulator.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, mergeAll, toArray, mergeMap, pluck } from 'rxjs/operators';
import { TableSimulator } from './tableSimulator.interface';
import { OntologyService } from '../ontology.service';
import { Simulator } from '@biosimulations/simulators/api-models';

@Injectable()
export class SimulatorTableService {
  constructor(
    private service: SimulatorService,
    private ontologyService: OntologyService
  ) {}

  getData(): Observable<TableSimulator[]> {
    const data = this.service.getLatest().pipe(
      //Data from the service is an array of API objects - Convert to array of table objects
      map((simulators: Simulator[]) => {
        // Go through the array and convert each api object to a an observable of a table object
        //Array of table object observables
        const tableSimulatorObservables = simulators.map(
          (simulator: Simulator) => {
            // Simulator is a api object
            //Use the data to get the definitions for all additional calls
            const frameworks = this.getFrameworks(simulator);
            const algorithms = this.getAlgorithms(simulator);
            const formats = this.getFormats(simulator);
            const license = this.getLicense(simulator);

            // These are all observables of string[] that need to be collapsed
            const innerObservables = {
              frameworks: frameworks,
              algorithms: algorithms,
              formats: formats,
              license: license,
            };

            const frameworkIds = new Set<string>();
            const algorithmIds = new Set<string>();
            const formatIds = new Set<string>();
            for (const alg of simulator.algorithms) {
              for (const framework of alg.modelingFrameworks) {
                frameworkIds.add(framework.id);
              }
              algorithmIds.add(alg.kisaoId.id);
              for (const format of alg.modelFormats) {
                formatIds.add(format.id);
              }
            }
            const licenseId = simulator.license.id;

            //Observable of the table object
            const tableSimulatorObservable = of(innerObservables).pipe(
              mergeMap((sourceValue) =>
                forkJoin({
                  algorithms: sourceValue.algorithms,
                  frameworks: sourceValue.frameworks,
                  formats: sourceValue.formats,
                  license: license,
                }).pipe(
                  map((value) => {
                    // Table simulator
                    return {
                      id: simulator.id,
                      name: simulator.name,
                      latestVersion: simulator.version,
                      url: simulator.url,
                      created: new Date(simulator.created),
                      license: value.license,
                      licenseId: '',
                      frameworks: value.frameworks,
                      frameworkIds: [...frameworkIds],
                      algorithms: value.algorithms,
                      algorithmIds: [...algorithmIds],
                      formats: value.formats,
                      formatIds: [...formatIds],
                      image: simulator.image || undefined,
                      validated: simulator?.biosimulators?.validated,
                    };
                  })
                )
              )
            );
            return tableSimulatorObservable;
          }
        );

        const observableTableSimulators = from(tableSimulatorObservables).pipe(
          mergeAll(),
          toArray()
        );
        return observableTableSimulators;
      }),
      mergeAll()
    );
    return data;
  }

  getLicense(simulator: any) {
    return this.ontologyService.getSpdxTerm(simulator.license.id).pipe(
      pluck('name'),
      map((name) => this.shortenLicense(name))
    );
  }

  getFormats(simulator: any): Observable<string[]> {
    const formats: Set<string> = new Set();
    for (const algorithm of simulator.algorithms) {
      for (const format of algorithm.modelFormats) {
        formats.add(format.id as string);
      }
    }
    const formatsArr: Observable<string>[] = [];
    for (const id of formats) {
      formatsArr.push(this.ontologyService.getEdamTerm(id).pipe(pluck('name')));
    }
    const obs = from(formatsArr).pipe(mergeAll(), toArray());

    return obs;
  }

  getFrameworks(simulator: any): Observable<string[]> {
    const frameworks: Set<string> = new Set();
    for (const algorithm of simulator.algorithms) {
      for (const framework of algorithm.modelingFrameworks) {
        frameworks.add(framework.id);
      }
    }

    const frameworksArr: Observable<string>[] = [];
    for (const id of frameworks) {
      frameworksArr.push(
        this.ontologyService.getSboTerm(id).pipe(
          pluck('name'),
          map((name) => this.trimFramework(name))
        )
      );
    }

    const obs = from(frameworksArr).pipe(mergeAll(), toArray());
    return obs;
  }

  getAlgorithms(simulator: any): Observable<string[]> {
    const algorithms: Set<string> = new Set();
    for (const algorithm of simulator.algorithms) {
      algorithms.add(algorithm.kisaoId.id);
    }

    const alg: Observable<string>[] = [];
    for (const id of algorithms) {
      alg.push(this.ontologyService.getKisaoTerm(id).pipe(pluck('name')));
    }
    const obs = from(alg).pipe(mergeAll(), toArray());
    return obs;
  }

  trimFramework(name: string): string {
    if (name && name.toLowerCase().endsWith(' framework')) {
      name = name.substring(0, name.length - 10).trim();
    }
    return name;
  }

  shortenLicense(name: string | undefined): string {
    if (name) {
      return name
        .replace(/\bLicense\b/, '')
        .replace('  ', ' ')
        .trim();
    } else {
      return '';
    }
  }
}
