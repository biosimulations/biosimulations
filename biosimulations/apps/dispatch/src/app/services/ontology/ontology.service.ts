import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  AlgorithmKisaoDescriptionFragment,
  AlgorithmKisaoDescriptionFragmentType,
} from '../../simulation-logs-datamodel';

import {
  IOntologyTerm,
  Ontologies,
  KisaoTerm,
} from '@biosimulations/datamodel/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
@Injectable({ providedIn: 'root' })
export class OntologyService {
  kisaoTerms: Observable<{ [id: string]: KisaoTerm }>;

  constructor(private http: HttpClient) {
    this.kisaoTerms = this.fetchTerms<KisaoTerm>(Ontologies.KISAO) as Observable<{ [id: string]: KisaoTerm }>;
    this.kisaoTerms.subscribe();
  }

  endpoint = urls.ontologyApi;

  private fetchTerms<T extends IOntologyTerm>(ontologyId: Ontologies): Observable<{ [id: string]: T }> {
    return this.http.get<T[]>(this.endpoint  + ontologyId + '/list').pipe(
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
      case Ontologies.KISAO: return this.kisaoTerms as Observable<{ [id: string]: T }>;
    }
    return null;
  }

  private getTerm<T extends IOntologyTerm>(
    ontologyId: Ontologies,
    term: string
  ): Observable<T> {
    const termsObservable = this.getTerms<T>(ontologyId) as Observable<{ [id: string]: T }>;
    return termsObservable.pipe(
      map((terms: { [id: string]: T }): T => {
        const setTerm = terms[term];

        if (setTerm) {
          return setTerm;
        } else {
          throw new Error(`Term with id ${term} not found in ontology ${ontologyId}`);
        }
      }),
      catchError((terms: { [id: string]: T }): Observable<T> => {
        return of(({
          namespace: (terms[Object.keys(terms)[0]] as T).namespace,
          id: term,
          name: term,
          description: 'Unknown term',
          url: '',
          iri: '',
        } as unknown) as T);
      })
    );
  }

  getKisaoTerm(id: string): Observable<KisaoTerm> {
    return this.getTerm<KisaoTerm>(Ontologies.KISAO, id);
  }

  formatKisaoDescription(value: string | null): AlgorithmKisaoDescriptionFragment[] | undefined {
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
