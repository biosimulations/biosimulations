import { Injectable } from '@nestjs/common';
import { 
  edamInfo,
  kisaoInfo,
  sboInfo,
  sioInfo,
  spdxInfo,
  sboTerms,
  kisaoTerms,
  edamTerms,
  sioTerms,
  spdxTerms,
 } from '@biosimulations/ontology/sources';
import { 
  OntologyInfo,
  EdamTerm,
  KisaoTerm,
  SboTerm,
  SioTerm,
  SpdxTerm,
} from '@biosimulations/datamodel/common';

@Injectable()
export class OntologiesService {
  getEdamInfo(): OntologyInfo {
    return edamInfo;
  }

  getKisaoInfo(): OntologyInfo {
    return kisaoInfo;
  }

  getSboInfo(): OntologyInfo {
    return sboInfo;
  }

  getSioInfo(): OntologyInfo {
    return sioInfo;
  }

  getSpdxInfo(): OntologyInfo {
    return spdxInfo;
  }

  getEdam(): EdamTerm[] {
    const terms = [];
    for (const term in edamTerms) {
      terms.push(edamTerms[term]);
    }
    return terms;
  }

  getKisao(): KisaoTerm[] {
    const terms = [];
    for (const term in kisaoTerms) {
      terms.push(kisaoTerms[term]);
    }
    return terms;
  }

  getSbo(): SboTerm[] {
    const terms = [];
    for (const term in sboTerms) {
      terms.push(sboTerms[term]);
    }
    return terms;
  }

  getSio(): SioTerm[] {
    const terms = [];
    for (const term in sioTerms) {
      terms.push(sioTerms[term]);
    }
    return terms;
  }

  getSpdx(): SpdxTerm[] {
    const terms = [];
    for (const term in spdxTerms) {
      terms.push(spdxTerms[term]);
    }
    return terms;
  }

  getSboTerm(id: string): SboTerm | null {
    return sboTerms[id];
  }
  getKisaoTerm(id: string): KisaoTerm | null {
    return kisaoTerms[id];
  }
  getEdamTerm(id: string): EdamTerm | null {
    return edamTerms[id];
  }
  getSioTerm(id: string): SioTerm | null {
    return sioTerms[id];
  }
  getSpdxTerm(id: string): SpdxTerm | null {
    return spdxTerms[id];
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
  isSioTerm(id: string): boolean {
    return !!this.getSioTerm(id);
  }
  isSpdxTerm(id: string): boolean {
    return !!this.getSpdxTerm(id);
  }
  static edamValidator(id: string): boolean {
    return !!edamTerms[id];
  }
  static kisaoValidator(id: string): boolean {
    return !!kisaoTerms[id];
  }
  static sboValidator(id: string): boolean {
    return !!sboTerms[id];
  }
  static sioValidator(id: string): boolean {
    return !!sioTerms[id];
  }
  static spdxValidator(id: string): boolean {
    return !!spdxTerms[id];
  }
}
