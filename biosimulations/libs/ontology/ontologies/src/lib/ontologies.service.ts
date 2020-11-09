import { Injectable } from '@nestjs/common';
import { sboTerms } from '@biosimulations/ontology/sources';
import { kisaoTerms } from '@biosimulations/ontology/sources';
import { edamTerms } from '@biosimulations/ontology/sources';
import { EDAMTerm, KISAOTerm, SBOTerm } from '@biosimulations/datamodel/common';
@Injectable()
export class OntologiesService {
  getEdam(): EDAMTerm[] {
    const terms = [];
    for (const term in edamTerms) {
      terms.push(edamTerms[term]);
    }
    return terms;
  }

  getKisao(): KISAOTerm[] {
    const terms = [];
    for (const term in kisaoTerms) {
      terms.push(kisaoTerms[term]);
    }
    return terms;
  }

  getSBO(): SBOTerm[] {
    const terms = [];
    for (const term in sboTerms) {
      terms.push(sboTerms[term]);
    }
    return terms;
  }

  getSboTerm(id: string): SBOTerm | null {
    return sboTerms[id];
  }
  getKisaoTerm(id: string): KISAOTerm | null {
    return kisaoTerms[id];
  }
  getEdamTerm(id: string): EDAMTerm | null {
    return edamTerms[id];
  }

  isSboTerm(id: string): boolean {
    return !!this.getSboTerm(id);
  }
  isKisaoTerm(id: string): boolean {
    return !!this.getKisaoTerm(id);
  }
  isEdamTerm(id: string): boolean {
    return !!this.getEdamTerm(id);
  }
}
