import { ViewModel } from './view';
import { License, LicenseInfo } from '@biosimulations/datamodel/core';
export class LicenseModel implements ViewModel {
  constructor(private license: License) {}
  toString(): string {
    return this.getLicenseInfo(this.license).name;
  }
  icon():
    | 'home'
    | 'file'
    | 'question'
    | 'authors'
    | 'author'
    | 'model'
    | 'taxon'
    | null {
    throw new Error('Method not implemented.');
  }
  link(): string | null {
    return this.getLicenseInfo(this.license).url;
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }

  getLicenseInfo(license: License): LicenseInfo {
    switch (license) {
      case License.cc0:
        return {
          value: license,
          name: 'CC0',
          version: '1.0',
          swoId: 1000049,
          url: this.getSwoUrl(1000049),
        };
      case License.cc_by:
        return {
          value: license,
          name: 'CC BY',
          version: '4.0',
          swoId: 1000065,
          url: this.getSwoUrl(1000065),
        };
      case License.cc_by_sa:
        return {
          value: license,
          name: 'CC BY-SA',
          version: '4.0',
          swoId: 1000094,
          url: this.getSwoUrl(1000094),
        };
      case License.cc_by_nc:
        return {
          value: license,
          name: 'CC BY-NC',
          version: '4.0',
          swoId: 1000080,
          url: this.getSwoUrl(1000080),
        };
      case License.cc_by_nc_sa:
        return {
          value: license,
          name: 'CC BY-NC-SA',
          version: '4.0',
          swoId: 1000090,
          url: this.getSwoUrl(1000090),
        };
      case License.mit:
        return {
          value: license,
          name: 'MIT',
          version: null,
          swoId: 9000074,
          url: this.getSwoUrl(9000074),
        };
      default:
        return {
          value: license,
          name: 'Other',
          version: null,
          swoId: null,
          url: null,
        };
    }
  }

  getSwoUrl(id: number): string {
    return `http://bioportal.bioontology.org/ontologies/SWO?p=classes&conceptid=http://www.ebi.ac.uk/swo/license/SWO_${id}`;
  }
}
