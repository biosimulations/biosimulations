import { Injectable } from '@angular/core';
import { Algorithm } from 'src/app/Shared/Models/algorithm';
import { AlgorithmParameter } from 'src/app/Shared/Models/algorithm-parameter';
import { Simulator } from 'src/app/Shared/Models/simulator';
import { Taxon } from 'src/app/Shared/Models/taxon';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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
        item =>
          id === undefined ||
          item['id'].toLowerCase().includes(lowCaseName) ||
          name === undefined ||
          item['name'].toLowerCase().includes(lowCaseName)
      );
    } else {
      return list;
    }
  }

  getAlgorithms(name?: string): Algorithm[] {
    const list: Algorithm[] = [
      new Algorithm('0000499', 'dynamic flux balance analysis'),
      new Algorithm('0000025', 'Gillespie-like stochastic simulation method'),
      new Algorithm('0000448', 'logical model simulation method'),
      new Algorithm('0000064', 'Runge-Kutta based method'),
    ];

    for (const alg of list) {
      alg.parameters = [
        new AlgorithmParameter('seed', 'random number generator seed', 1, 488),
        new AlgorithmParameter('atol', 'absolute tolerance', 1e-6, 211),
        new AlgorithmParameter('rtol', 'relative tolerance', 1e-6, 209),
      ];
    }

    return this.filter(list, undefined, name) as Algorithm[];
  }

  getAlgorithmParameters(
    algorithm: Algorithm,
    value?: string
  ): AlgorithmParameter[] {
    return this.filter(
      algorithm.parameters,
      value,
      value
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
      list.filter(value =>
        value.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}
