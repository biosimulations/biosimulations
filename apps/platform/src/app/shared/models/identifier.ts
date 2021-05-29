import { Identifier as IdentifierDTO } from '@biosimulations/datamodel/common';

export class Identifier implements IdentifierDTO {
  namespace: string;
  id: string;
  url: string;
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
    return this.url;
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
