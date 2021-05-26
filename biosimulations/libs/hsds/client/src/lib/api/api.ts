export * from './aCLS.service';
import { ACLSService } from './aCLS.service';
export * from './attribute.service';
import { AttributeService } from './attribute.service';
export * from './dataset.service';
import { DatasetService } from './dataset.service';
export * from './datatype.service';
import { DatatypeService } from './datatype.service';
export * from './domain.service';
import { DomainService } from './domain.service';
export * from './group.service';
import { GroupService } from './group.service';
export * from './link.service';
import { LinkService } from './link.service';
export const APIS = [
  ACLSService,
  AttributeService,
  DatasetService,
  DatatypeService,
  DomainService,
  GroupService,
  LinkService,
];
