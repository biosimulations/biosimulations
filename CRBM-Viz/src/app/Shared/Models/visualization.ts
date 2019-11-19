export class Visualization {
  id?: number;
  name?: string;
  description?: string;
  tags?: string[] = [];
  spec?: object | string;

  constructor(id?: number, name?: string, description?: string, tags?: string[], spec?: object | string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.spec = spec;
  }

  getIcon() {
    return {type: 'fas', icon: 'chart-area'};
  }

  getRoute() {
    return ['/visualize', this.id];
  }
}
