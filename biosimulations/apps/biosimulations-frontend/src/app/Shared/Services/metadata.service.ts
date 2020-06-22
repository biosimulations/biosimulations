import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Algorithm } from '../Models/algorithm';
import { AlgorithmParameter } from '../Models/algorithm-parameter';
import { Simulator } from '../Models/simulator';
import { Taxon } from '../Models/taxon';
import { PrimitiveType } from '@biosimulations/datamodel/core';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private http: HttpClient) {}

  private filter(list: object[], id?: string, name?: string): object[] {
    let lowCaseId: string;
    let lowCaseName: string;
    if (id) {
      lowCaseId = id.toLowerCase();
    }
    if (name) {
      lowCaseName = name.toLowerCase();
    }

    if (id || name) {
      return list.filter(
        (item) =>
          id === undefined ||
          item['id'].toLowerCase().includes(lowCaseName) ||
          name === undefined ||
          item['name'].toLowerCase().includes(lowCaseName),
      );
    } else {
      return list;
    }
  }

  getAlgorithms(name?: string): Algorithm[] {
    const list: Algorithm[] = [
      new Algorithm({
        id: '499',
        name: 'dynamic flux balance analysis',
        kisaoId: '0000000499',
        ontologyTerms: [],
        modelingFrameworks: [],
        modelFormats: [],
        parameters: [],
        simulationFormats: [],
        archiveFormats: [],
        references: [],
      }),
      new Algorithm({
        id: '25',
        name: 'Gillespie-like stochastic simulation method',
        kisaoId: '0000000025',
        ontologyTerms: [],
        modelingFrameworks: [],
        modelFormats: [],
        parameters: [],
        simulationFormats: [],
        archiveFormats: [],
        references: [],
      }),
      new Algorithm({
        id: '448',
        name: 'logical model simulation method',
        kisaoId: '0000000448',
        ontologyTerms: [],
        modelingFrameworks: [],
        modelFormats: [],
        parameters: [],
        simulationFormats: [],
        archiveFormats: [],
        references: [],
      }),
      new Algorithm({
        id: '64',
        name: 'Runge-Kutta based method',
        kisaoId: '0000000064',
        ontologyTerms: [],
        modelingFrameworks: [],
        modelFormats: [],
        parameters: [],
        simulationFormats: [],
        archiveFormats: [],
        references: [],
      }),
    ];

    for (const alg of list) {
      alg.parameters = [
        new AlgorithmParameter({
          id: 'seed',
          name: 'random number generator seed',
          type: PrimitiveType.integer,
          value: 1,
          recomendedRange: [],
          kisaoId: '488',
        }),
        new AlgorithmParameter({
          id: 'atol',
          name: 'absolute tolerance',
          type: PrimitiveType.float,
          value: 1e-6,
          recomendedRange: [],
          kisaoId: '211',
        }),
        new AlgorithmParameter({
          id: 'rtol',
          name: 'relative tolerance',
          type: PrimitiveType.float,
          recomendedRange: [],
          value: 1e-6,
          kisaoId: '209',
        }),
      ];
    }

    return this.filter(list, undefined, name) as Algorithm[];
  }

  getAlgorithmParameters(
    algorithm: Algorithm,
    value?: string,
  ): AlgorithmParameter[] {
    return this.filter(
      algorithm.parameters,
      value,
      value,
    ) as AlgorithmParameter[];
  }

  getSimulators(name?: string): Simulator[] {
    const list: Simulator[] = [
      new Simulator('COPASI', '4.0'),
      new Simulator('COPASI', '3.0'),
      new Simulator('VCell', '6.1'),
      new Simulator('VCell', '6.0'),
    ];
    return this.filter(list, undefined, name) as Simulator[];
  }

  getTaxa(name?: string): Taxon[] {
    const list: Taxon[] = [
      new Taxon(2, 'Bacillus subtilis'),
      new Taxon(1, 'Escherichia coli'),
      new Taxon(9606, 'Homo sapiens'),
      new Taxon(457483, 'Test Organism'),
    ];
    return this.filter(list, undefined, name) as Taxon[];
  }
  getTaxa$(query?: string): Observable<Taxon[]> {
    const list: Taxon[] = [
      new Taxon(2, 'Bacillus subtilis'),
      new Taxon(1, 'Escherichia coli'),
      new Taxon(9606, 'Homo sapiens'),
      new Taxon(457483, 'Test Organism'),
    ];

    return of(
      list.filter((value) =>
        value.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }
}
