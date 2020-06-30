import { MatTableDataSource } from '@angular/material/table';
import { Subscription, BehaviorSubject } from 'rxjs';
import {
  BiomodelAttributes,
  OntologyTerm,
  Format,
  Taxon,
  UserId,
  Person,
} from '@biosimulations/datamodel/core';
export interface ModelData {
  id: string;
  name: string;
  tags: string[];
  framework: OntologyTerm;
  format: Format;
  authors: Person[];
  owner: UserId;
  created: Date;
  updated: Date;
  taxon: Taxon | null;
}
export class ModelDataSource extends MatTableDataSource<ModelData> {
  constructor() {
    super();
  }
}
