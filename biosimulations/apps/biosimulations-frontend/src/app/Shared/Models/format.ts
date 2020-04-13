import { FormatDTO } from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class Format implements JsonSerializable<FormatDTO> {
  id: string;
  specUrl: string;
  name: string;
  version: string;
  edamId: string;
  url: string;
  mimetype?: string;
  extension?: string;
  sedUrn?: string;

  constructor(data: FormatDTO) {
    Object.assign(this, data);

    if (!this.url && this.edamId) {
      this.url = this.getEdamUrl();
    }
  }
  serialize(): FormatDTO {
    return {
      id: this.id,
      specUrl: this.specUrl,
      name: this.name,
      version: this.version,
      edamId: this.edamId,
      url: this.url,
      mimetype: this.mimetype,
      extension: this.extension,
      sedUrn: this.sedUrn,
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
