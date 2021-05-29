export enum License {
  cc0 = 'CC0',
  cc_by = 'CC BY',
  cc_by_sa = 'CC BY-SA',
  cc_by_nc = 'CC BY-NC',
  cc_by_nc_sa = 'CC BY-NC-SA',
  mit = 'MIT',
  other = 'Other',
}

export const licenses = [
  getLicenseInfo(License.cc0),
  getLicenseInfo(License.cc_by),
  getLicenseInfo(License.cc_by_sa),
  getLicenseInfo(License.cc_by_nc),
  getLicenseInfo(License.cc_by_nc_sa),
  getLicenseInfo(License.mit),
  getLicenseInfo(License.other),
];
interface LicenseInfo {
  value: License;
  name: string;
  version: string;
  swoId: number;
  url: string;
}
export function getLicenseInfo(license: License): LicenseInfo {
  switch (license) {
    case License.cc0:
      return {
        value: license,
        name: 'CC0',
        version: '1.0',
        swoId: 1000049,
        url: getSwoUrl(1000049),
      };
    case License.cc_by:
      return {
        value: license,
        name: 'CC BY',
        version: '4.0',
        swoId: 1000065,
        url: getSwoUrl(1000065),
      };
    case License.cc_by_sa:
      return {
        value: license,
        name: 'CC BY-SA',
        version: '4.0',
        swoId: 1000094,
        url: getSwoUrl(1000094),
      };
    case License.cc_by_nc:
      return {
        value: license,
        name: 'CC BY-NC',
        version: '4.0',
        swoId: 1000080,
        url: getSwoUrl(1000080),
      };
    case License.cc_by_nc_sa:
      return {
        value: license,
        name: 'CC BY-NC-SA',
        version: '4.0',
        swoId: 1000090,
        url: getSwoUrl(1000090),
      };
    case License.mit:
      return {
        value: license,
        name: 'MIT',
        version: null,
        swoId: 9000074,
        url: getSwoUrl(9000074),
      };
    case License.other:
      return {
        value: license,
        name: 'Other',
        version: null,
        swoId: null,
        url: null,
      };
  }
}

function getSwoUrl(id: number): string {
  return `https://www.ebi.ac.uk/ols/ontologies/swo/terms?iri=http://www.ebi.ac.uk/swo/license/SWO_${id}`;
}
