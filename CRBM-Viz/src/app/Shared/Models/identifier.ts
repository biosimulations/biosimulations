export class Identifier {
  namespace?: string;
  namespaceName?: string;
  id?: string;
    
  constructor(namespace?: string, namespaceName?: string, id?: string) {
    this.namespace = namespace;
    this.namespaceName = namespaceName;
    this.id = id;
  }

  getUrl(): string {
    return `https://identifiers.org/${ this.namespace }:${ this.id }`;
  }
}
