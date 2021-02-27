import {
  Ontologies,
  SioTerm,
  OntologyInfo,
} from '@biosimulations/datamodel/common';
import isUrl from 'is-url';
import sioJson from './sio.json';

let sioVersion = '';
function getSioTerms(input: any): { [id: string]: SioTerm } {
  const Terms: { [id: string]: SioTerm } = {};

  const jsonParse = input['@graph'];
  jsonParse.forEach((jsonTerm: any) => {
    if (jsonTerm['@id'] === 'http://semanticscience.org/ontology/sio.owl') {
      sioVersion = jsonTerm['owl:versionInfo'];
    } else if (
      jsonTerm['@id'].startsWith('http://semanticscience.org/resource/SIO_')
    ) {
      const termIRI = jsonTerm['@id'];
      const termNameSpace = Ontologies.SIO;
      const termId = jsonTerm['@id'].replace(
        'http://semanticscience.org/resource/',
        '',
      );
      const termDescription = jsonTerm['rdfs:comment'] || null;
      const termName = jsonTerm['rdfs:label'];
      const termUrl = (
        'https://www.ebi.ac.uk/ols/ontologies/sio/terms?iri=' 
        + encodeURIComponent('http://semanticscience.org/resource/' + termId)
      );

      let moreInfoUrl: string | null = null;
      const seeAlso = jsonTerm['http://www.w3.org/2000/01/rdf-schema#seeAlso'];
      if (
        seeAlso &&
        seeAlso?.['@type'] === 'xsd:anyURI' &&
        seeAlso?.['@value'] &&
        isUrl(seeAlso?.['@value'])
      ) {
        moreInfoUrl = seeAlso?.['@value'];
      }

      const term: SioTerm = {
        id: termId,
        name: termName,
        description: termDescription,
        namespace: termNameSpace,
        iri: termIRI,
        url: termUrl,
        moreInfoUrl: moreInfoUrl,
      };

      Terms[termId] = term;
    } else {
      return;
    }
  });

  return Terms;
}

export const sioTerms = getSioTerms(sioJson);

export const sioInfo: OntologyInfo = {
  id: Ontologies.SIO,
  acronym: Ontologies.SIO,
  name: 'Semanticscience Integrated Ontology',
  description:
    'The Semanticscience Integrated Ontology (SIO) provides a simple, integrated ontology of types and relations for rich description of objects, processes and their attributes.',
  bioportalId: 'SIO',
  olsId: 'sio',
  version: sioVersion,
  source:
    'https://raw.githubusercontent.com/MaastrichtU-IDS/semanticscience/master/ontology/sio/release/sio-release.owl',
};
