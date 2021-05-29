import { Identifier } from './ontology';

export interface Person {
  firstName: string | null;
  middleName: string | null;
  lastName: string;
  identifiers: Identifier[];
}
