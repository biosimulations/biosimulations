import { Ontologies, SpdxTerm, OntologyInfo } from '@biosimulations/datamodel/common';
import spdxJson from './spdx.json';

function getSpdxTerms(input: any): { [id: string]: SpdxTerm } {
    const terms: { [id: string]: SpdxTerm } = {};
    input.licenses.forEach((license: any): void => {
        terms[license.licenseId] = {
            id: license.licenseId,
            namespace: Ontologies.SPDX,
            name: license.name,
            url: license.detailsUrl,
            description: null,
        }
    });
    return terms;
}

export const spdxTerms = getSpdxTerms(spdxJson);

export const spdxInfo: OntologyInfo = {
  'bioportalId': null,
  'olsId': null,
  'version': spdxJson.licenseListVersion,
  'source': 'https://github.com/spdx/license-list-data/blob/master/json/licenses.json',
};