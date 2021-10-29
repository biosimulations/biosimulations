import {
  Ontologies,
  FunderRegistryTerm,
  OntologyInfo,
} from '@biosimulations/datamodel/common';
import funderRegistryJson from './funderRegistry.json';

function getTerms(input: any): { [id: string]: FunderRegistryTerm } {
  const terms: { [id: string]: FunderRegistryTerm } = {};
  input.forEach((funder: any): void => {
    const id = funder.uri.replace('http://dx.doi.org/10.13039/', '');
    terms[id] = {
      id: id,
      namespace: Ontologies.FunderRegistry,
      name: funder.primary_name_display,
      iri: null,
      url: funder.uri,
      moreInfoUrl: null,
      description: null,
      parents: [],
      children: [],
    };
  });
  return terms;
}

export const funderRegistryTerms = getTerms(funderRegistryJson);

export const funderRegistryInfo: OntologyInfo = {
  id: Ontologies.FunderRegistry,
  acronym: 'Funder Registry',
  name: 'Funder Registry',
  description:
    'The Funder Registry and associated funding metadata allows everyone to have transparency into research funding and its outcomes. It’s an open and unique registry of persistent identifiers for grant-giving organizations around the world.',
  bioportalId: null,
  olsId: null,
  version: null,
  source: 'https://doi.crossref.org/funderNames?mode=list',
};
