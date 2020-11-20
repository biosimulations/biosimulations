import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  IOntologyTerm,
  Ontologies,
  KisaoTerm,
  SboTerm,
  SpdxTerm,
  EdamTerm,
  SioTerm,
  IdentifierTerm,
} from '@biosimulations/datamodel/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
@Injectable({ providedIn: 'root' })
export class OntologyService {
  kisaoTerms: Observable<{ [id: string]: KisaoTerm }>;
  edamTerms: Observable<{ [id: string]: EdamTerm }>;
  sboTerms: Observable<{ [id: string]: SboTerm }>;
  sioTerms: Observable<{ [id: string]: SioTerm }>;
  spdxTerms: Observable<{ [id: string]: SpdxTerm }>;

  constructor(private http: HttpClient) {
    this.kisaoTerms = this.fetchKisaoTerms();
    this.kisaoTerms.subscribe();

    this.edamTerms = this.fetchEdamTerms();
    this.edamTerms.subscribe();

    this.sboTerms = this.fetchSboTerms();
    this.sboTerms.subscribe();

    this.sioTerms = this.fetchSioTerms();
    this.sioTerms.subscribe();

    this.spdxTerms = this.fetchSpdxTerms();
    this.spdxTerms.subscribe();
  }
  endpoint = urls.ontologyApi;
  getKisaoUrl(id: string): string {
    return (
      'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' +
      id
    );
  }
  private fetchKisaoTerms(): Observable<{ [id: string]: KisaoTerm }> {
    return this.http.get<KisaoTerm[]>(this.endpoint + '/kisao/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: KisaoTerm } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      })
    );
  }
  private fetchSboTerms(): Observable<{
    [id: string]: SboTerm;
  }> {
    return this.http.get<SboTerm[]>(this.endpoint + '/sbo/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: SboTerm } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      })
    );
  }
  private fetchEdamTerms(): Observable<{
    [id: string]: EdamTerm;
  }> {
    return this.http.get<EdamTerm[]>(this.endpoint + '/edam/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: EdamTerm } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      })
    );
  }
  private fetchSioTerms(): Observable<{
    [id: string]: SioTerm;
  }> {
    return this.http.get<SioTerm[]>(this.endpoint + '/sio/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: SioTerm } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      })
    );
  }
  private fetchSpdxTerms(): Observable<{
    [id: string]: SpdxTerm;
  }> {
    return this.http.get<SpdxTerm[]>(this.endpoint + '/spdx/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: SpdxTerm } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      })
    );
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
  getKisaoTerms(): Observable<KisaoTerm[]> {
    return this.mapToArray(this.kisaoTerms);
  }

  getKisaoTerm(id: string): Observable<KisaoTerm> {
    if (id.startsWith('KISAO:')) {
      id = id.replace('KISAO:', 'KISAO_');
    } else if (!id.startsWith('KISAO_')) {
      id = 'KISAO_' + id;
    }
    return this.getTerm(this.kisaoTerms, id);
  }

  getEdamTerm(id: string): Observable<EdamTerm> {
    return this.getTerm(this.edamTerms, id);
  }
  getSboTerm(id: string): Observable<SboTerm> {
    if (!id.startsWith('SBO_')) {
      id = 'SBO_' + id;
    }
    return this.getTerm(this.sboTerms, id);
  }
  getSioTerm(id: string): Observable<SioTerm> {
    if (!id.startsWith('SBO_')) {
      id = 'SBO_' + id;
    }
    return this.getTerm(this.sioTerms, id);
  }
  getSpdxTerm(id: string): Observable<SpdxTerm> {
    return this.getTerm(this.spdxTerms, id);
  }
}
