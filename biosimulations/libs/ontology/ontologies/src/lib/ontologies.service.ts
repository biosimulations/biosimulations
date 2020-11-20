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
  Ontologies,
  OntologyInfo,
  IOntologyTerm,  
} from '@biosimulations/datamodel/common';

@Injectable()
export class OntologiesService {
  getInfo(ontology: Ontologies): OntologyInfo | null {
    switch (ontology) {
      case Ontologies.EDAM: return edamInfo;
      case Ontologies.KISAO: return kisaoInfo;
      case Ontologies.SBO: return sboInfo;
      case Ontologies.SIO: return sioInfo;
      case Ontologies.SPDX: return spdxInfo;
    } 
    return null;
  }

  getTerms(ontology: Ontologies): IOntologyTerm[] | null {
    let termsObj: any = null;
    switch (ontology) {
      case Ontologies.EDAM: termsObj = edamTerms; break;
      case Ontologies.KISAO: termsObj = kisaoTerms; break;
      case Ontologies.SBO: termsObj = sboTerms; break;
      case Ontologies.SIO: termsObj = sioTerms; break;
      case Ontologies.SPDX: termsObj = spdxTerms; break;
    }

    if (termsObj == null) {
      return null;
    }

    const termsArr = [];
    for (const term in termsObj) {
      termsArr.push(termsObj[term]);
    }
    return termsArr;
  }

  getTerm(ontology: Ontologies, term: string): IOntologyTerm | null {
    let termsObj: any = null;
    switch (ontology) {
      case Ontologies.EDAM: termsObj = edamTerms; break;
      case Ontologies.KISAO: termsObj = kisaoTerms; break;
      case Ontologies.SBO: termsObj = sboTerms; break;
      case Ontologies.SIO: termsObj = sioTerms; break;
      case Ontologies.SPDX: termsObj = spdxTerms; break;
    }

    if (termsObj == null) {
      return null;
    }

    return termsObj[term];
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
