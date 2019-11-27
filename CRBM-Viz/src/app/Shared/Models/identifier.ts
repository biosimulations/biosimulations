export class Identifier {
  namespace?: string;
  id?: string;

  constructor(namespace?: string, id?: string) {
    this.namespace = namespace;
    this.id = id;
  }

  getUrl(): string {
    return `https://identifiers.org/${ this.namespace }:${ this.id }`;
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
