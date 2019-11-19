export class Identifier {
  namespace?: string;
  id?: string;
    
  constructor(namespace?: string, id?: string) {
    this.namespace = namespace;
    this.id = id;
  }
}
