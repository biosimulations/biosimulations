import { JournalReferenceDTO } from '../common/journalreference';

import { PersonDTO } from '../common/person';

import { License, IdentifierDTO } from '../..';
import { UserId, BiosimulationsId, DOI, DateString } from '../common/alias';
import { DTO } from '@biosimulations/datamodel/utils';

export enum ResourceType {
  project = 'project',
  model = 'model',
  simulation = 'simulation',
  simulationRun = 'Simulaton Run',
  chart = 'chart',
  visualization = 'visualization',
  simulator = 'simulator',
  file = 'file',
  user = 'user',
}

export enum AccessLevel {
  private = 'private',
  public = 'public',
  protected = 'Password Protected',
}
export const accessLevels = [
  { value: AccessLevel.private, name: 'private' },
  { value: AccessLevel.public, name: 'public' },
  { value: AccessLevel.protected, name: 'Password Protected' },
];

export interface AccessInfoDTO {
  accessLevel: AccessLevel;
  accessToken?: string;
  editors?: UserId[];
  viewers?: UserId[];
}

export interface ExternalReferencesDTO {
  identifiers: IdentifierDTO[];
  references: JournalReferenceDTO[];
  DOI: DOI;
}

export interface Described {
  image: BiosimulationsId;
  name: string;
  summary: string;
  description: string;
  tags: string[];
}

export type DescriptionDTO = DTO<Described>;

export interface Provenanced {
  version: number;
  parent: BiosimulationsId;
  children: BiosimulationsId[];
}
export type ProvenanceDTO = DTO<Provenanced>;

interface Identifiable {
  type: ResourceType;
  id: BiosimulationsId;
}

interface Owned {
  owner: UserId;
}
interface AccessControlled extends Owned {
  owner: UserId;
  access: AccessInfoDTO;
}
interface Licensed {
  license: License;
}
interface Authored {
  authors: PersonDTO[];
}
interface CrossReferenced {
  references: ExternalReferencesDTO;
}
interface Timestamped {
  createdDate: DateString;
  updatedDate: DateString;
}
export type DateDTO = DTO<Timestamped>;

export interface ResourceDTO extends Identifiable {
  type: ResourceType;
  id: BiosimulationsId;
  attributes: DTO<any>;
  meta: DTO<any>;
}

export interface PrimaryResourceDTO extends ResourceDTO {
  meta: DTO<PrimaryResourceMetaData>;
}
export interface SecondaryResourceDTO extends ResourceDTO {
  meta: DTO<SecondaryResourceMetaData>;
}

// Todo Find better names for these
export interface PrimaryResourceMetaData
  extends Owned,
    Licensed,
    Authored,
    CrossReferenced,
    Described,
    AccessControlled,
    Timestamped,
    Provenanced {}

export interface SecondaryResourceMetaData
  extends Licensed,
    Authored,
    CrossReferenced,
    Described {}
