import { Injectable } from '@angular/core';
import { Endpoints } from '@biosimulations/config/common';
import { Observable, shareReplay, map, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IOntologyTerm,
  OntologyTermMap,
  Ontologies,
  EdamTerm,
  KisaoTerm,
  SboTerm,
  FunderRegistryTerm,
  LinguistTerm,
  SioTerm,
  SpdxTerm,
  IOntologyId,
} from '@biosimulations/datamodel/common';
import { ConfigService } from '@biosimulations/config/angular';

@Injectable({
  providedIn: 'root',
})
export class OntologyService {
  private endpoints = new Endpoints();

  private fetchedOntologyTerms: {
    [ontologyId: string]: { [termId: string]: Observable<IOntologyTerm> };
  } = {};

  private fetchedOntologies: {
    [ontologyId: string]: Observable<OntologyTermMap<IOntologyTerm>>;
  } = {};

  public constructor(private http: HttpClient, private configService: ConfigService) {
  }

  public getKisaoUrl(id: string): string {
    return (
      'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=' +
      encodeURIComponent('http://www.biomodels.net/kisao/KISAO#' + id)
    );
  }

  private fetchOntologyTerm<T extends IOntologyTerm>(
    ontologyId: Ontologies,
    termId: string,
  ): Observable<T> {
    let ontologyTerms = this.fetchedOntologyTerms[ontologyId];

    if (!ontologyTerms) {
      ontologyTerms = this.fetchedOntologyTerms[ontologyId] = {};
    }

    let term: Observable<IOntologyTerm> | undefined = ontologyTerms[termId];

    if (!term) {
      const endpoint = this.endpoints.getOntologyEndpoint(this.configService.appId, ontologyId, termId);
      term = this.http.get<IOntologyTerm>(endpoint).pipe(
        shareReplay(1),
      );
      ontologyTerms[termId] = term;
    }

    return term as Observable<T>;
  }

  private fetchOntologyTerms<T extends IOntologyTerm>(
    ontologyId: Ontologies,
  ): Observable<OntologyTermMap<T>> {
    let terms = this.fetchedOntologies[ontologyId];
    if (terms) {
      return terms as Observable<OntologyTermMap<T>>;
    }

    const endpoint = this.endpoints.getOntologyEndpoint(this.configService.appId, ontologyId);
    terms = this.http.get<IOntologyTerm[]>(endpoint).pipe(
      shareReplay(1),
      map((terms): OntologyTermMap<IOntologyTerm> => {
        const termSet: OntologyTermMap<IOntologyTerm> = {};
        terms.forEach((term) => {
          termSet[term.id] = term;
        });
        return termSet;
      }),
      shareReplay(1),
    );

    this.fetchedOntologies[ontologyId] = terms;

    return terms as Observable<OntologyTermMap<T>>;
  }

  public getOntologyTerms<T extends IOntologyTerm>(
    ontologyId: Ontologies,
  ): Observable<OntologyTermMap<T>> {
    return this.fetchOntologyTerms(ontologyId);
  }

  private getOntologyTerm<T extends IOntologyTerm>(
    ontologyId: Ontologies,
    termId: string,
  ): Observable<T> {
    return this.fetchOntologyTerm<T>(ontologyId, termId).pipe(
      catchError((terms: OntologyTermMap<T>): Observable<T> => {
        return of({
          namespace: (terms[Object.keys(terms)[0]] as T).namespace,
          id: termId,
          name: termId,
          description: 'Unknown term',
          url: '',
          iri: '',
        } as unknown as T);
      }),
    );
  }

  public getEdamTerm(id: string): Observable<EdamTerm> {
    return this.getOntologyTerm<EdamTerm>(Ontologies.EDAM, id);
  }

  public getFunderRegistryTerm(id: string): Observable<FunderRegistryTerm> {
    return this.getOntologyTerm<FunderRegistryTerm>(Ontologies.FunderRegistry, id);
  }

  public getLinguistTerm(id: string): Observable<LinguistTerm> {
    return this.getOntologyTerm<LinguistTerm>(Ontologies.Linguist, id);
  }

  public getKisaoTerm(id: string): Observable<KisaoTerm> {
    id = id.toUpperCase();
    if (!id.startsWith('KISAO')) {
      id = 'KISAO_' + id;
    }
    id = id.replace(':', '_');
    const match = id.match(/^KISAO_(\d{1,6})$/);
    if (match !== null) {
      id = 'KISAO_' + '0'.repeat(7 - match[1].length) + match[1];
    }
    return this.getOntologyTerm<KisaoTerm>(Ontologies.KISAO, id);
  }

  public getSboTerm(id: string): Observable<SboTerm> {
    id = id.toUpperCase();
    if (!id.startsWith('SBO')) {
      id = 'SBO_' + id;
    }
    id = id.replace(':', '_');
    const match = id.match(/^SBO_(\d{1,6})$/);
    if (match !== null) {
      id = 'SBO_' + '0'.repeat(7 - match[1].length) + match[1];
    }
    return this.getOntologyTerm<SboTerm>(Ontologies.SBO, id);
  }

  public getSioTerm(id: string): Observable<SioTerm> {
    id = id.toUpperCase();
    if (!id.startsWith('SIO')) {
      id = 'SIO_' + id;
    }
    id = id.replace(':', '_');
    const match = id.match(/^SIO_(\d{1,5})$/);
    if (match !== null) {
      id = 'SIO_' + '0'.repeat(6 - match[1].length) + match[1];
    }
    return this.getOntologyTerm<SioTerm>(Ontologies.SIO, id);
  }

  public getSpdxTerm(id: string): Observable<SpdxTerm> {
    return this.getOntologyTerm<SpdxTerm>(Ontologies.SPDX, id);
  }

  public getTerms(ids: IOntologyId[]): Observable<IOntologyTerm[]> {
    const endpoint = this.endpoints.getOntologyTermsEndpoint(this.configService.appId);
    return this.http.post<IOntologyTerm[]>(
      endpoint, 
      { 
        ids: ids,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: {
          fields: ['namespace', 'id', 'name'],
        },
      },
    ).pipe(shareReplay(1));
  }
}
