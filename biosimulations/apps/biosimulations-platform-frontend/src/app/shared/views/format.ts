import { ViewModel } from './view';
import { Format as IFormat } from '@biosimulations/datamodel/core';
export class Format implements ViewModel, IFormat {
  edamId: string | null;
  specUrl: string | null;
  url: string | null;
  mimetype: string | null;
  extension: string | null;
  sedUrn: string | null;
  constructor(
    public id: string,
    public name: string,
    public version: string,
    edamId?: string | null,
    specUrl?: string | null,
    url?: string | null,
    mimeType?: string | null,
    extension?: string | null,
    sedUrn?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.edamId = edamId ? edamId : null;
    this.specUrl = specUrl ? specUrl : null;
    this.url = url ? url : null;
    this.mimetype = mimeType ? mimeType : null;
    this.extension = extension ? extension : null;
    this.sedUrn = sedUrn ? sedUrn : null;
  }
  toString(): string {
    return this.name + ' ' + this.version;
  }
  icon(): 'format' {
    return 'format';
  }
  link(): string | null {
    return this.url
      ? this.url
      : this.specUrl
      ? this.specUrl
      : this.getUrl(this.id);
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
  private getUrl(id: string) {
    if (id === 'SBML') {
      return 'www.sbml.org';
    }
    return null;
  }
}

function fromDTO(format: IFormat): Format {
  return new Format(
    format.id,
    format.name,
    format.version,
    format.edamId,
    format.specUrl,
    format.url,
    format.mimetype,
    format.extension,
    format.sedUrn,
  );
}
