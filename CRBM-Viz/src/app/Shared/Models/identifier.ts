interface IdentifierSerialized {
  namespace: string;
  id: string;
}
export class Identifier {
  constructor(public namespace: string, public id: string) {}

  serialize(): IdentifierSerialized {
    return { namespace: this.namespace, id: this.id };
  }
  getUrl(): string {
    return `https://identifiers.org/${this.namespace}:${this.id}`;
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
