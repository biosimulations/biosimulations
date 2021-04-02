import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AlgorithmKisaoDescriptionFragment,
  AlgorithmKisaoDescriptionFragmentType,
} from '../../simulation-logs-datamodel';
import {
  IOntologyTerm,
  Ontologies,
  EdamTerm,
  KisaoTerm,
  SboTerm
} from '@biosimulations/datamodel/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';

@Injectable({ providedIn: 'root' })
export class OntologyService {
  edamTerms: Observable<{ [id: string]: EdamTerm }>;
  kisaoTerms: Observable<{ [id: string]: KisaoTerm }>;
  sboTerms: Observable<{ [id: string]: SboTerm }>;

  constructor(private http: HttpClient) {
    this.edamTerms = this.fetchTerms<EdamTerm>(Ontologies.EDAM) as Observable<{
      [id: string]: EdamTerm;
    }>;
    this.edamTerms.subscribe();

    this.kisaoTerms = this.fetchTerms<KisaoTerm>(
      Ontologies.KISAO,
    ) as Observable<{ [id: string]: KisaoTerm }>;
    this.kisaoTerms.subscribe();

    this.sboTerms = this.fetchTerms<SboTerm>(Ontologies.SBO) as Observable<{
      [id: string]: SboTerm;
    }>;
    this.sboTerms.subscribe();
  }

  endpoint = urls.ontologyApi;

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
      case Ontologies.KISAO:
        return this.kisaoTerms as Observable<{ [id: string]: T }>;
      case Ontologies.SBO:
        return this.sboTerms as Observable<{ [id: string]: T }>;
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
      map(
        (terms: { [id: string]: T }): T => {
          const setTerm = terms[term];

          if (setTerm) {
            return setTerm;
          } else {
            throw new Error(
              `Term with id ${term} not found in ontology ${ontologyId}`,
            );
          }
        },
      ),
      catchError(
        (terms: { [id: string]: T }): Observable<T> => {
          return of(({
            namespace: (terms[Object.keys(terms)[0]] as T).namespace,
            id: term,
            name: term,
            description: 'Unknown term',
            url: '',
            iri: '',
          } as unknown) as T);
        },
      ),
    );
  }

  getEdamTerm(id: string): Observable<EdamTerm> {
    return this.getTerm<EdamTerm>(Ontologies.EDAM, id);
  }

  getKisaoTerm(id: string): Observable<KisaoTerm> {
    return this.getTerm<KisaoTerm>(Ontologies.KISAO, id);
  }

  getSboTerm(id: string): Observable<SboTerm> {
    return this.getTerm<SboTerm>(Ontologies.SBO, id);
  }

  formatKisaoDescription(
    value: string | null,
  ): AlgorithmKisaoDescriptionFragment[] | undefined {
    if (!value) {
      return undefined;
    }

    const formattedValue: AlgorithmKisaoDescriptionFragment[] = [];
    let prevEnd = 0;

    const regExp = /\[(https?:\/\/.*?)\]/gi;
    let match;
    while ((match = regExp.exec(value)) !== null) {
      if (match.index > 0) {
        formattedValue.push({
          type: AlgorithmKisaoDescriptionFragmentType.text,
          value: value.substring(prevEnd, match.index),
        });
      }
      prevEnd = match.index + match[0].length;
      formattedValue.push({
        type: AlgorithmKisaoDescriptionFragmentType.href,
        value: match[1],
      });
    }
    if (prevEnd < value?.length) {
      formattedValue.push({
        type: AlgorithmKisaoDescriptionFragmentType.text,
        value: value.substring(prevEnd),
      });
    }
    return formattedValue;
  }
}
