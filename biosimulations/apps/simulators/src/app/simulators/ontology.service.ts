import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  IOntologyTerm,
  Ontologies,
  EdamTerm,
  KisaoTerm,
  SboTerm,
  SioTerm,
  SpdxTerm,
} from '@biosimulations/datamodel/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
@Injectable({ providedIn: 'root' })
export class OntologyService {
  edamTerms: Observable<{ [id: string]: EdamTerm }>;
  kisaoTerms: Observable<{ [id: string]: KisaoTerm }>;
  sboTerms: Observable<{ [id: string]: SboTerm }>;
  sioTerms: Observable<{ [id: string]: SioTerm }>;
  spdxTerms: Observable<{ [id: string]: SpdxTerm }>;

  constructor(private http: HttpClient) {
    this.edamTerms = this.fetchTerms<EdamTerm>(Ontologies.EDAM) as Observable<{ [id: string]: EdamTerm }>;
    this.edamTerms.subscribe();

    this.kisaoTerms = this.fetchTerms<KisaoTerm>(Ontologies.KISAO) as Observable<{ [id: string]: KisaoTerm }>;
    this.kisaoTerms.subscribe();

    this.sboTerms = this.fetchTerms<SboTerm>(Ontologies.SBO) as Observable<{ [id: string]: SboTerm }>;
    this.sboTerms.subscribe();

    this.sioTerms = this.fetchTerms<SioTerm>(Ontologies.SIO) as Observable<{ [id: string]: SioTerm }>;
    this.sioTerms.subscribe();

    this.spdxTerms = this.fetchTerms<SpdxTerm>(Ontologies.SPDX) as Observable<{ [id: string]: SpdxTerm }>;
    this.spdxTerms.subscribe();
  }

  endpoint = urls.ontologyApi;
  
  getKisaoUrl(id: string): string {
    return (
      'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' +
      id
    );
  }

  private fetchTerms<T extends IOntologyTerm>(ontologyId: Ontologies): Observable<{ [id: string]: T }> {
    return this.http.get<T[]>(this.endpoint + '/' + ontologyId + '/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: T } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      })
    );
  }

  private getTerms<T extends IOntologyTerm>(ontologyId: Ontologies): Observable<{ [id: string]: T }> | null {
    switch (ontologyId) {
      case Ontologies.EDAM: return this.edamTerms as Observable<{ [id: string]: T }>;
      case Ontologies.KISAO: return this.kisaoTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SBO: return this.sboTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SIO: return this.sioTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SPDX: return this.spdxTerms as Observable<{ [id: string]: T }>;
    }
    return null;
  }

  private getTerm<T extends IOntologyTerm>(
    ontologyId: Ontologies,
    term: string
  ): Observable<T> {
    const terms = this.getTerms<T>(ontologyId) as Observable<{ [id: string]: T }>;
    return terms.pipe(
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

  getEdamTerm(id: string): Observable<EdamTerm> {
    return this.getTerm<EdamTerm>(Ontologies.EDAM, id);
  }

  getKisaoTerm(id: string): Observable<KisaoTerm> {
    if (id.startsWith('KISAO:')) {
      id = id.replace('KISAO:', 'KISAO_');
    } else if (!id.startsWith('KISAO_')) {
      id = 'KISAO_' + id;
    }
    return this.getTerm<KisaoTerm>(Ontologies.KISAO, id);
  }

  getSboTerm(id: string): Observable<SboTerm> {
    if (!id.startsWith('SBO_')) {
      id = 'SBO_' + id;
    }
    return this.getTerm<SboTerm>(Ontologies.SBO, id);
  }

  getSioTerm(id: string): Observable<SioTerm> {
    if (!id.startsWith('SBO_')) {
      id = 'SBO_' + id;
    }
    return this.getTerm<SioTerm>(Ontologies.SIO, id);
  }

  getSpdxTerm(id: string): Observable<SpdxTerm> {
    return this.getTerm<SpdxTerm>(Ontologies.SPDX, id);
  }
}
