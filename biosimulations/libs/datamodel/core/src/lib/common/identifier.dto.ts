import { DTO } from '@biosimulations/datamodel/utils';

// Identifiers.org identifier
export interface IdentifierCore {
  namespace: string;
  identifier: string;
}
export type IdentifierDTO = DTO<IdentifierCore>;
