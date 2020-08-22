import { Format as FormatDTO } from '@biosimulations/shared/datamodel';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class Format implements JsonSerializable<FormatDTO> {
  id: string;
  version: string;
  name: string;
  specUrl: string | null;
  edamId: string | null;
  url: string | null;
  mimetype: string | null;
  extension: string | null;
  sedUrn: string | null;

  constructor(data: FormatDTO) {
    this.id = data.id;
    this.specUrl = data.specUrl;
    this.name = data.name;
    this.version = data.version;
    this.edamId = data.edamId;
    this.url = data.url;
    this.mimetype = data.mimetype;
    this.extension = data.extension;
    this.sedUrn = data.sedUrn;
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
