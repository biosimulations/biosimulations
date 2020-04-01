import { ModelFormatDTO } from '@biosimulations/datamodel/core';

export class Format {
  name: string;
  version: string;
  edamId: number;
  url: string;

  constructor(data: ModelFormatDTO) {
    Object.assign(this, data);

    if (!this.url && this.edamId) {
      this.url = this.getEdamUrl();
    }
  }
  serialize(): ModelFormatDTO {
    return {
      name: this.name,
      version: this.version,
      edamId: this.edamId,
      url: this.url,
    };
  }

  getFullName(): string {
    let fullName: string = this.name;
    if (this.version) {
      fullName += ' ' + this.version;
    }
    return fullName;
  }

  getEdamUrl(): string {
    return `http://bioportal.bioontology.org/ontologies/EDAM?p=classes&conceptid=format_${this.edamId}`;
  }
}
