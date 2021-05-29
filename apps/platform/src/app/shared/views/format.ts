import { ViewModel } from './view';
import { Format as IFormat } from '@biosimulations/datamodel/common';
export class Format extends ViewModel {
  constructor(
    public id: string,
    public name: string,
    public version: string,
    public edamId?: string | null,
    public specUrl?: string | null,
    public url?: string | null,
    public mimeType?: string | null,
    public extension?: string | null,
    public sedUrn?: string | null,
  ) {
    super();
    this.init();
  }
  static fromDTO(format: IFormat): Format {
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
  getTooltip(): string {
    return 'Format';
  }
  toString(): string {
    return this.name + ' ' + this.version;
  }
  getIcon(): 'format' {
    return 'format';
  }
  getLink(): string | null {
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
