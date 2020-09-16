import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import edamJson from './edam.json';
import kisaoJson from './kisao.json';
import sboJson from './sbo.json';
import spdxJson from './spdx.json';
import { IOntologyTerm, Ontologies } from '@biosimulations/shared/datamodel';
import { Observable, of, throwError } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
const edamTerms = edamJson as {
  [id: string]: { name: string; description: string; url: string };
};
const kisaoTerms = kisaoJson as {
  [id: string]: { name: string; description: string; url: string };
};
const sboTerms = sboJson as {
  [id: string]: { name: string; description: string; url: string };
};
const spdxTerms = spdxJson as { [id: string]: { name: string; url: string } };

class kisaoTerm implements IOntologyTerm {
  namespace!: Ontologies.KISAO;
  id!: string;
  iri!: string;
  url!: string;
  name!: string;
  description!: string;
}
@Injectable({ providedIn: 'root' })
export class OntologyService {
  kisaoTerms: Observable<Map<string, kisaoTerm>>;
  constructor(private http: HttpClient) {
    this.kisaoTerms = this.http
      .get<kisaoTerm[]>('https://ontology.biosimulations.dev/kisao/list')
      .pipe(
        shareReplay(1),
        map((terms) => {
          const termSet: Map<string, kisaoTerm> = new Map();
          terms.forEach((term) => termSet.set(term.id, term));
          return termSet;
        })
      );
  }

  getKisaoTerm(id: string): Observable<kisaoTerm> {
    const term = kisaoTerms[id];

    const ontTerm: kisaoTerm = {
      namespace: Ontologies.KISAO,
      id: id,
      iri: 'http://www.biomodels.net/kisao/KISAO#' + id,
      url: term.url,
      name: term.name,
      description: term.description,
    };
    return this.kisaoTerms.pipe(
      map((value) => {
        const setTerm = value.get(id);
        if (setTerm) {
          return setTerm;
        } else {
          throw 'Term Not Found';
        }
      })
    );
  }
}
