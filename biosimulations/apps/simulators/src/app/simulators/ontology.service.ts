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
          terms.forEach((term) => {
            //TODO Move this functionality to the onotology API
            let termUrl =
              'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23' +
              term.id.replace(':', '_');

            term.url = termUrl;
            console.log(term);
            termSet.set(term.id, term);
          });
          return termSet;
        })
      );
  }

  getKisaoTerm(id: string): Observable<kisaoTerm> {
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
