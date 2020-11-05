import { Citation } from '../common/citation';

import { Person } from '../common/person';

import { License, Identifier } from '../..';
import { UserId, BiosimulationsId, DateString } from '../common/alias';

export enum ResourceType {
  project = 'project',
  model = 'model',
  simulation = 'simulation',
  simulationRun = 'SimulatonRun',
  chart = 'chart',
  visualization = 'visualization',
  simulator = 'simulator',
  file = 'file',
  user = 'user',
}

export enum AccessLevel {
  private = 'private',
  public = 'public',
  shared = 'shared',
  protected = 'Password Protected',
}
export const accessLevels = [
  { value: AccessLevel.private, name: 'private' },
  { value: AccessLevel.public, name: 'public' },
  { value: AccessLevel.protected, name: 'Password Protected' },
];

export interface AccessInfo {
  accessLevel: AccessLevel;
  accessToken: string | null;
}

export interface ExternalReferences {
  identifiers: Identifier[];
  citations: Citation[];
}

export interface Described {
  name: string;
  summary: string;
  description: string;
  tags: string[];
}

export interface Provenanced {
  version: number;
  parent: BiosimulationsId;
  children: BiosimulationsId[];
}

interface Identifiable {
  type: ResourceType;
  id: BiosimulationsId;
}

interface Owned {
  owner: UserId;
}
interface AccessControlled extends Owned {
  owner: UserId;
  access: AccessInfo;
}
interface Licensed {
  license: License;
}
interface Authored {
  authors: Person[];
}
interface CrossReferenced {
  references: ExternalReferences;
}
interface Timestamped {
  createdDate: DateString;
  updatedDate: DateString;
  version: number;
}
export type DateDTO = Timestamped;

export interface Resource extends Identifiable {
  type: ResourceType;
  id: BiosimulationsId;
  attributes: any;
  meta: any;
}

// Todo Find better names for these

export interface PrimaryResource {
  type: ResourceType;
  id: BiosimulationsId;
  attributes: PrimaryResourceMetaData;
  relationships: PrimaryResourceRelationships;
}

export interface PrimaryResourceRelationships {
  owner: UserId;
  editors: UserId[];
  viewers: UserId[];
}

export interface PrimaryResourceMetaData
  extends Licensed,
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
