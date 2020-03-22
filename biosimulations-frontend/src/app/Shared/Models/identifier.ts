export interface IdentifierSerialized {
  namespace: string;
  identifier: string;
}
export class Identifier {
  constructor(public namespace: string, public identifier: string) {}

  serialize(): IdentifierSerialized {
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
