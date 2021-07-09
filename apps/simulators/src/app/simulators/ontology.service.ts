import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  IOntologyTerm,
  Ontologies,
  EdamTerm,
  FunderRegistryTerm,
  LinguistTerm,
  KisaoTerm,
  SboTerm,
  SioTerm,
  SpdxTerm,
} from '@biosimulations/datamodel/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
@Injectable({ providedIn: 'root' })
export class OntologyService {
  edamTerms: Observable<{ [id: string]: EdamTerm }>;
  funderRegistryTerms: Observable<{ [id: string]: FunderRegistryTerm }>;
  linguistTerms: Observable<{ [id: string]: LinguistTerm }>;
  kisaoTerms: Observable<{ [id: string]: KisaoTerm }>;
  sboTerms: Observable<{ [id: string]: SboTerm }>;
  sioTerms: Observable<{ [id: string]: SioTerm }>;
  spdxTerms: Observable<{ [id: string]: SpdxTerm }>;

  constructor(private http: HttpClient) {
    this.edamTerms = this.fetchTerms<EdamTerm>(Ontologies.EDAM) as Observable<{
      [id: string]: EdamTerm;
    }>;
    this.edamTerms.subscribe();

    this.funderRegistryTerms = this.fetchTerms<FunderRegistryTerm>(
      Ontologies.FunderRegistry,
    ) as Observable<{ [id: string]: FunderRegistryTerm }>;
    this.funderRegistryTerms.subscribe();

    this.linguistTerms = this.fetchTerms<LinguistTerm>(
      Ontologies.Linguist,
    ) as Observable<{ [id: string]: LinguistTerm }>;
    this.linguistTerms.subscribe();

    this.kisaoTerms = this.fetchTerms<KisaoTerm>(
      Ontologies.KISAO,
    ) as Observable<{ [id: string]: KisaoTerm }>;
    this.kisaoTerms.subscribe();

    this.sboTerms = this.fetchTerms<SboTerm>(Ontologies.SBO) as Observable<{
      [id: string]: SboTerm;
    }>;
    this.sboTerms.subscribe();

    this.sioTerms = this.fetchTerms<SioTerm>(Ontologies.SIO) as Observable<{
      [id: string]: SioTerm;
    }>;
    this.sioTerms.subscribe();

    this.spdxTerms = this.fetchTerms<SpdxTerm>(Ontologies.SPDX) as Observable<{
      [id: string]: SpdxTerm;
    }>;
    this.spdxTerms.subscribe();
  }

  endpoint = urls.ontologyApi;

  getKisaoUrl(id: string): string {
    return (
      'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=' +
      encodeURIComponent('http://www.biomodels.net/kisao/KISAO#' + id)
    );
  }

  private fetchTerms<T extends IOntologyTerm>(
    ontologyId: Ontologies,
  ): Observable<{ [id: string]: T }> {
    return this.http.get<T[]>(this.endpoint + ontologyId + '/list').pipe(
      shareReplay(1),
      map((terms) => {
        const termSet: { [id: string]: T } = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      }),
    );
  }

  private getTerms<T extends IOntologyTerm>(
    ontologyId: Ontologies,
  ): Observable<{ [id: string]: T }> | null {
    switch (ontologyId) {
      case Ontologies.EDAM:
        return this.edamTerms as Observable<{ [id: string]: T }>;
      case Ontologies.FunderRegistry:
        return this.funderRegistryTerms as Observable<{ [id: string]: T }>;
      case Ontologies.Linguist:
        return this.linguistTerms as Observable<{ [id: string]: T }>;
      case Ontologies.KISAO:
        return this.kisaoTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SBO:
        return this.sboTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SIO:
        return this.sioTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SPDX:
        return this.spdxTerms as Observable<{ [id: string]: T }>;
    }
    return null;
  }

  private getTerm<T extends IOntologyTerm>(
    ontologyId: Ontologies,
    term: string,
  ): Observable<T> {
    const termsObservable = this.getTerms<T>(ontologyId) as Observable<{
      [id: string]: T;
    }>;
    return termsObservable.pipe(
      map((terms: { [id: string]: T }): T => {
        const setTerm = terms[term];

        if (setTerm) {
          return setTerm;
        } else {
          throw new Error(
            `Term with id ${term} not found in ontology ${ontologyId}`,
          );
        }
      }),
      catchError((terms: { [id: string]: T }): Observable<T> => {
        return of({
          namespace: (terms[Object.keys(terms)[0]] as T).namespace,
          id: term,
          name: term,
          description: 'Unknown term',
          url: '',
          iri: '',
        } as unknown as T);
      }),
    );
  }

  getEdamTerm(id: string): Observable<EdamTerm> {
    return this.getTerm<EdamTerm>(Ontologies.EDAM, id);
  }

  getFunderRegistryTerm(id: string): Observable<FunderRegistryTerm> {
    return this.getTerm<FunderRegistryTerm>(Ontologies.FunderRegistry, id);
  }

  getLinguistTerm(id: string): Observable<LinguistTerm> {
    return this.getTerm<LinguistTerm>(Ontologies.Linguist, id);
  }

  getKisaoTerm(id: string): Observable<KisaoTerm> {
    return this.getTerm<KisaoTerm>(Ontologies.KISAO, id);
  }

  getSboTerm(id: string): Observable<SboTerm> {
    return this.getTerm<SboTerm>(Ontologies.SBO, id);
  }

  getSioTerm(id: string): Observable<SioTerm> {
    return this.getTerm<SioTerm>(Ontologies.SIO, id);
  }

  getSpdxTerm(id: string): Observable<SpdxTerm> {
    return this.getTerm<SpdxTerm>(Ontologies.SPDX, id);
  }
}
