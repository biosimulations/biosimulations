import { IdentifierDTO } from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class Identifier implements JsonSerializable<IdentifierDTO> {
  namespace: string;
  identifier: string;
  constructor(data: IdentifierDTO) {
    Object.assign(this, data);
  }

  serialize(): IdentifierDTO {
    return { namespace: this.namespace, identifier: this.identifier };
  }
  getUrl(): string {
    return `https://identifiers.org/${this.namespace}:${this.identifier}`;
  }

  getNamespaceName(): string {
    switch (this.namespace) {
      case 'biomodels.db':
        return 'BioModels';
      default:
        return this.namespace;
    }
  }
}
