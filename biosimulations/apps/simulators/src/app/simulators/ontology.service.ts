import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import spdxJson from './spdx.json';
import {
  IOntologyTerm,
  Ontologies,
  KISAOTerm,
  SBOTerm,
  SPDXTerm,
  EDAMTerm,
  KisaoId,
  IdentifierTerm,
} from '@biosimulations/shared/datamodel';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OntologyService {
  kisaoTerms: Observable<{ [id: string]: KISAOTerm }>;
  edamTerms: Observable<{ [id: string]: EDAMTerm }>;
  sboTerms: Observable<{ [id: string]: SBOTerm }>;
  spdxTerms: Observable<{ [id: string]: SPDXTerm }>;

  constructor(private http: HttpClient) {
    this.kisaoTerms = this.fetchKisaoTerms();
    this.kisaoTerms.subscribe();

    this.edamTerms = this.fetchEdamTerms();
    this.edamTerms.subscribe();

    this.sboTerms = this.fetchSBOTerms();
    this.sboTerms.subscribe();

    this.spdxTerms = this.fetchSpdxTerms();
    this.spdxTerms.subscribe();
  }

  getKisaoUrl(id: string): string {
    return (
      'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_' +
      id
    );
  }
  private fetchKisaoTerms(): Observable<{ [id: string]: KISAOTerm }> {
    return this.http
      .get<KISAOTerm[]>('https://ontology.biosimulations.dev/kisao/list')
      .pipe(
        shareReplay(1),
        map((terms) => {

          const termSet: { [id: string]: KISAOTerm } = {};
          terms.forEach((term) => {
            termSet[term.id] = term;
          });
          return termSet;
        })
      );
  }
  private fetchSBOTerms(): Observable<{
    [id: string]: SBOTerm;
  }> {
    return this.http
      .get<SBOTerm[]>('https://ontology.biosimulations.dev/sbo/list')
      .pipe(
        shareReplay(1),
        map((terms) => {

          const termSet: { [id: string]: SBOTerm } = {};
          terms.forEach((term) => {
            termSet[term.id] = term;
          });
          return termSet;
        })
      );
  }
  private fetchEdamTerms(): Observable<{
    [id: string]: EDAMTerm;
  }> {
    return this.http
      .get<EDAMTerm[]>('https://ontology.biosimulations.dev/edam/list')
      .pipe(
        shareReplay(1),
        map((terms) => {

          const termSet: { [id: string]: EDAMTerm } = {};
          terms.forEach((term) => {
            termSet[term.id] = term;
          });
          return termSet;
        })
      );
  }
  private fetchSpdxTerms(): Observable<{
    [id: string]: SPDXTerm;
  }> {
    const spdxTerms = spdxJson as {
      [id: string]: SPDXTerm;
    };
    return of(spdxTerms);
  }

  private mapToArray<T>(
    input: Observable<{ [id: string]: T }>
  ): Observable<T[]> {
    return input.pipe(
      map((value) => {
        const arr = [];
        for (const id in value) {
          arr.push(value.id);
        }
        return arr;
      })
    );
  }
  private getTerm<T extends IdentifierTerm>(
    input: Observable<{ [id: string]: T }>,
    term: string
  ): Observable<T> {
    return input.pipe(
      map((value) => {

        const setTerm = value[term];

        if (setTerm) {
          return setTerm;
        } else {
          throw { term, value };
        }
      }),
      catchError((err: any, caught: Observable<T>) => {

        const value = JSON.parse(JSON.stringify(err.value)) as any;

        return of(({
          namespace: (value[Object.keys(value)[0]] as any).namespace,
          id: term,
          name: term,
          description: 'Unknown Term',
          url: '',
          iri: '',
        } as unknown) as T);
      })
    );
  }
  getKisaoTerms(): Observable<KISAOTerm[]> {
    return this.mapToArray(this.kisaoTerms);
  }

  getKisaoTerm(id: string): Observable<KISAOTerm> {
    if (id.startsWith("KISAO:")) {
      id = id.replace("KISAO:", "KISAO_")
    }
    return this.getTerm(this.kisaoTerms, id);
  }

  getEdamTerm(id: string): Observable<EDAMTerm> {
    return this.getTerm(this.edamTerms, id);
  }
  getSboTerm(id: string): Observable<SBOTerm> {
    if (!id.startsWith("SBO_")) {


      id = "SBO_" + id
    }
    return this.getTerm(this.sboTerms, id);
  }
  getSpdxTerm(id: string): Observable<SPDXTerm> {

    return this.getTerm(this.spdxTerms, id);
  }
}
