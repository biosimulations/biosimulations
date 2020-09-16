import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';

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

@Injectable({ providedIn: 'root' })
class OntologyService {
  constructor(private http: HttpClient) {}
}
