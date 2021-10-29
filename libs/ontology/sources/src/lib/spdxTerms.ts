import {
  Ontologies,
  SpdxTerm,
  OntologyInfo,
} from '@biosimulations/datamodel/common';
import isUrl from 'is-url';
import spdxJson from './spdx.json';

function getSpdxTerms(input: any): { [id: string]: SpdxTerm } {
  const terms: { [id: string]: SpdxTerm } = {};
  input.licenses.forEach((license: any): void => {
    const seeAlso = license?.seeAlso?.[0];
    terms[license.licenseId] = {
      id: license.licenseId,
      namespace: Ontologies.SPDX,
      name: license.name,
      iri: null,
      url: `https://spdx.org/licenses/${license.licenseId}.html`,
      moreInfoUrl: seeAlso && isUrl(seeAlso) ? seeAlso : null,
      description: null,
      parents: [],
      children: [],
    };
  });
  return terms;
}

export const spdxTerms = getSpdxTerms(spdxJson);

export const spdxInfo: OntologyInfo = {
  id: Ontologies.SPDX,
  acronym: Ontologies.SPDX,
  name: 'Software Package Data Exchange',
  description:
    'List of commonly found licenses and exceptions used in free and open source and other collaborative software or documentation.',
  bioportalId: null,
  olsId: null,
  version: spdxJson.licenseListVersion,
  source:
    'https://github.com/spdx/license-list-data/blob/master/json/licenses.json',
};
