import { Identifier as IdentifierDTO } from '@biosimulations/shared/datamodel';

export class Identifier implements IdentifierDTO {
  namespace: string;
  id: string;
  url: string | null;
  constructor(data: IdentifierDTO) {
    this.namespace = data.namespace;
    this.id = data.id;
    this.url = data.url;
  }

  serialize(): IdentifierDTO {
    return {
      namespace: this.namespace,
      id: this.id,
      url: this.getUrl(),
    };
  }
  getUrl(): string {
    return this.url || `https://identifiers.org/${this.namespace}:${this.id}`;
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
